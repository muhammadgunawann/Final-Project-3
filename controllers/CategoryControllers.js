const {Category} = require("../models");
const {Product} = require("../models")


class CategoryControllers {
    //Create Category
    static createCategory = async (req, res) => {
        const { type } = req.body

        try {
            const category =  await Category.create({
                type,
                sold_product_amount: parseInt(0)
            })

            return res.status(201).json({
                category: category
            })

        } catch (error) {
            if(error.name === "SequelizeValidationError") {
                return res.status(404).json({
                    error: {
                        message: error.errors[0].message 
                    }
                })
            }else {
                return res.status(500).json(error)
            }
        }
    }

    //Get all categories
    static getCategory = async (req, res) => {
       try {
            const categories = await Category.findAll({
                attributes: [["id", "id"], ["type", "type"], ["sold_product_amount", "sold_product_amout"], ["createdAt", "createdAt"], ["updatedAt", "updatedAt"]],
                include: {
                    model: Product
                }
            })

            if(categories.length > 0) {
                return res.status(200).json({
                    categories: categories
                })
            }else {
                return res.status(404).json({
                    error: {
                        message: "Data categories not found"
                    }
                })
            }
           
       } catch (error) {
            return res.status(500).json(error.message)
       }
          
    }

    //Update category
    static updateCategory = async (req, res) => {
        const categoryId = req.params.categoryId;
        const { type } = req.body;

        try {
            await Category.update({type}, {
                where: {
                    id: parseInt(categoryId)
                }
            })

            const category = await Category.findOne({
                where: {
                    id: parseInt(categoryId)
                }
            })
            
            if(category) {
                return res.status(200).json({
                    category: category
                })
            }else {
                return res.status(404).json({
                    error: {
                        message: `Category with id ${categoryId} not found`
                    }
                })
            }
            
        } catch (error) {
            if(error.name === "SequelizeValidationError") {
                return res.status(404).json({
                    error: {
                        message: error.errors[0].message
                    }
                })
            }else {
                return res.status(500).json({
                    message: error
                })
            }
        }
    }

    //Delete category
    static deleteCategory = async (req, res) => {
        const categoryId = req.params.categoryId

        try {
            await Category.destroy({
                where: {
                    id: parseInt(categoryId)
                }
            })

            return res.status(200).json({
                message: "Category has been successfully delete"
            })

        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }
}


module.exports = CategoryControllers