const { verfyToken } = require("../helper/jwt");
const { TransactionHistory } = require("../models");
const { Product } = require("../models")
const { User } = require("../models")
const { Category } = require("../models")


class TransactionHistoryControllers {

    //Create Transaction
    static createTransaction = async (req, res) => {
        const { productId, quantity} = req.body;
        const userId = res.dataUser.id;
        
        try {
            
            const product = await Product.findOne({
                where: {
                    id: productId
                }
            })
            
            const dataUser = await User.findOne({
                where: {
                    id: userId
                }
            })

            const category = await Category.findOne({
                where: {
                    id: product.CategoryId
                }
            })


            if(product) {

                if(product.stock >= quantity && product.stock > 5) {

                    const resultPrice = quantity * product.price;

                    if(dataUser.balance >= resultPrice) {

                        const transaction = await TransactionHistory.create({
                            total_price: resultPrice,
                            quantity: parseInt(quantity),
                            ProductId: parseInt(productId),
                            UserId: dataUser.id
            
                        })

                        const buyBalance = dataUser.balance - resultPrice;
                        const soldStock = product.stock - transaction.quantity;
                        const soldProductAmount = category.sold_product_amount + transaction.quantity;

                        await User.update({balance: buyBalance}, {
                            where: {
                                id: dataUser.id
                            }
                        })

                        await Product.update({stock: soldStock}, {
                            where: {
                                id: transaction.ProductId
                            }
                        })

                        await Category.update({sold_product_amount: soldProductAmount}, {
                            where: {
                                id: product.CategoryId
                            }
                        })
                        
            
                        return res.status(201).json({
                            message: "You have successfully purchase the product",
                            transactionBill: {
                                total_price: transaction.total_price,
                                quantity: transaction.quantity,
                                product_name: product.title
            
                            }
                        })

                    }else {
                        return res.status(200).json({
                            message: "your balance is not enough to buy this product"
                        })
                    }

                }else {
                    return res.status(404).json({
                        error: {
                            message: "the quantity you input exceeds the stock in the product"
                        }
                    })    
                }
    
                

            }else {
                return res.status(404).json({
                    error: {
                        message: "the product you entered is not available"
                    }
                })
            }

           
        } catch (error) {
            if(error.name === "SequelizeValidationError") {
                return res.status(404).json({
                    message: error.errors[0].message
                })
            }else if(error.name === "SequelizeDatabaseError") {
                return res.status(404).json({
                    message: error.parent.message
                })
            }else {
                console.info(error);                
            }
        }
    }

    //get transactionUser
    static getTransactionUser = async (req, res) => {
        const userId = res.dataUser.id;

        try {
            const transactions = await TransactionHistory.findAll({
                where: {
                    UserId: userId,
                    
                },include: {
                    model: Product,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    }
                }
            })


            return res.status(200).json({
                transactionHistories: transactions
            })
        } catch (error) {
            return res.status(404).json({
                error: {
                    message: error.message
                }
            })
        }
    }

    //Get transaction admin
    static getAllTransactionAdmin = async (req, res) => {
        
        try {
            const transactionAdmin = await TransactionHistory.findAll({
                attributes: {
                    exclude: ["id"]
                },
                include: [
                    {
                        model: Product,
                        attributes: {
                            exclude: ["createdAt", "updatedAt"]
                        }
                    },
                    {
                        model: User,
                        attributes: {
                            exclude: ["createdAt", "updatedAt", "password", "full_name"]
                        }
                    }
                ]
            })

            return res.json({
                transactionHistories: transactionAdmin
            })
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    //get transaction histories Users
    static getTransactionsByUser = async (req, res) => {
        const transactionId = req.params.transactionId;

        try {
            const transaction = await TransactionHistory.findOne({
                where: {
                    id: transactionId
                },
                attributes: {
                    exclude: ["id"]
                },
                include: {
                    model: Product,
                    attributes: {
                        exclude:  ["createdAt", "updatedAt"]
                    }
                }
            })

            if(transaction) {
                return res.status(200).json(transaction)
            }else {
                return res.status(404).json({
                    error: {
                        message: "the id you are looking for is not available"
                    }
                })
            }
            
        } catch (error) {
            return res.status(500).json({
                error: {
                    message: error.message
                }
            })
        }
    } 
}




module.exports = TransactionHistoryControllers;