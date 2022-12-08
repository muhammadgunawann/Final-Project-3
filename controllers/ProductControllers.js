const { Product } = require("../models");



class ProductControllers {

    //Create product
    static createProduct = async (req, res) => {
        const {title, price, stock, CategoryId} = req.body;

        try {
            const products = await Product.create({
                title,
                price: parseInt(price),
                stock: parseInt(stock),
                CategoryId: parseInt(CategoryId)
            })

            return res.status(201).json({
                product: products
            })
            
        } catch (error) {
            if(error.name === "SequelizeValidationError") {
                return res.status(404).json({
                    message: error.errors[0].message
                })
            }else if(error.name === "SequelizeForeignKeyConstraintError") {
                return res.status(404).json({
                    error: {
                        message: error.parent.detail
                    }
                })
            }else {
                return res.status(500).json(error)                
            }
        }
    }

    //Get all products
    static getAllProducts = async (req, res) => {
        try {
            const products = await Product.findAll({
                attributes: [["title", "title"], ["price", "price"], ["stock", "stock"], ["CategoryId", "CategoryId"], ["createdAt", "createdAt"], ["updatedAt", "updateAt"]]
            })

            if(products.length > 0) {
                return res.status(200).json({
                    products: products
                })
            }else {
                return res.status(200).json({
                   error: {
                    message: "Data product not found",
                   }
                })
            }
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }

    //Update all attributes product
    static updateAllAttributes = async (req, res) => {
        const productId = req.params.productId;
        const {title, price, stock} = req.body;

        try {
            await Product.update({title, price, stock}, {
                where: {
                    id: parseInt(productId)
                }
            })

            const product = await Product.findOne({
                where: {
                    id: parseInt(productId)
                }
            })

            return res.status(200).json({
                product: product
            })
        } catch (error) {
            if(error.name === "SequelizeValidationError") {
                return res.status(404).json({
                    message: error.errors[0].message
                })
            }else {
                return res.status(500).json(error)                
            }
        }
    }

    //Update one attribut product
    static updateOneAttribut = async (req, res) => {
        const productId = req.params.productId;
        const { CategoryId } = req.body;

        try {
            await Product.update({CategoryId}, {
                where: {
                    id: parseInt(productId)
                }
            })

            const product = await Product.findOne({
                where: {
                    id: parseInt(productId)
                }
            })


            return res.status(200).json({
                product: product
            })
        } catch (error) {
            if(error.name === "SequelizeForeignKeyConstraintError") {
                return res.status(404).json({
                    message: error.parent.detail
                })
            }else{
                return res.status(500).json(error)
            }
        }
    }

    //Delete product
    static deleteProduct = async (req, res) => {
        const productId = req.params.productId;

        try {
            const deleteProduct = await Product.destroy({
                where: {
                    id: parseInt(productId)
                }
            });

            if(deleteProduct === 0) {
                return res.status(404).json({
                    error: {
                        message: "Id you want to delete is not in the product table"
                    }
                })
            }else{
                return res.status(200).json({
                    message: "Product has been successfully delete"
                })
            }

            
        } catch (error) {
            return res.status(404).json(error)
        }
    }
}






module.exports = ProductControllers;