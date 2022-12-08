const { comparePassword } = require("../helper/bcrypt");
const { generateToken, verfyToken } = require("../helper/jwt");
const { User } = require("../models");



class UserControllers {
    //Page Register
    static register = async (req, res) => {
        const {full_name, password, gender, email} = req.body;
        
        try {
            const user = await User.create({
                full_name,
                password,
                gender,
                email,
                balance: parseInt(0),
                role: "customer"
            });

            return res.status(201).json({
                user: {
                    id: user.id,
                    full_name: user.full_name,
                    email: user.email,
                    gender: user.gender,
                    balance: `Rp.${user.balance}`,
                    createdAt: user.createdAt
                }
            })
        } catch (error) {
            if(error.name === "SequelizeValidationError") {
                return res.status(404).json({
                    message: error.errors[0].message
                })
            }else if(error.name === "SequelizeUniqueConstraintError") {
                return res.status(404).json({
                    message: error.errors[0].message
                })
            }else {
                return res.status(500).json(error)                
            }

        }
    }

    //Page Login
    static login = async (req, res) => {
        const {email, password} = req.body;

        try {
            const dataUser = await User.findOne({
                where: {
                    email: email
                }
            });

            if(dataUser) {  
                const isCorrect = comparePassword(password, dataUser.password);

                if(isCorrect) {
                    const token = generateToken({
                        id: dataUser.id,
                        email: dataUser.email,
                        role: dataUser.role
                    });

                    return res.status(200).json({token: token})
                }else {
                    return res.status(400).json({message: "your password is wrong"})
                }
            }else {
                return res.status(400).json({message: your `${req.body.email} not found`})
            }
        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    }

    //Page Update
    static updateUser = async (req, res) => {
        const {full_name, email} = req.body;
        const userId = res.dataUser.id

        try {
            await User.update({full_name, email}, {
                where: {
                    id: parseInt(userId)
                }
            });

            const dataUserUpdate = await User.findOne({
                where: {
                    id: userId
                },
                attributes: {
                    exclude: ["password", "gender", "role", "balance"]
                }
            })

            return res.status(200).json({
                user: dataUserUpdate
            })

        } catch (error) {
            if(error.name === "SequelizeValidationError") {
                return res.status(404).json({
                    message: error.errors[0].message
                })
            }else if(error.name === "SequelizeUniqueConstraintError") {
                return res.status(404).json({
                    message: error.errors[0].message
                })
            }else {
                return res.status(500).json(error)                
            }
        }
    }


    //Page Delete
    static deleteUser = async (req, res) => {
        const userId = res.dataUser.id;

        try {
            await User.destroy({
                where: {
                    id: parseInt(userId)
                }
            });

            return res.status(200).json({
                message: "Your account has been successfully delete"
            })
        } catch (error) {
            return res.status(500).json({
                message: error
            })
        }
    }


    //Page TopUp Balance
    static TopUpBalance = async (req, res) => {
        const topUpbalance = req.body;
        const userId = res.dataUser.id;
       
        try {
            const dataUser = await User.findOne({
                where: {
                    id: userId
                }
            })
            
            const balance = parseInt(topUpbalance.balance) + dataUser.balance;

            await User.update({balance: balance}, {
                where: {
                    id: userId
                }
            })

            return res.status(200).json({
                message: `Your balance has been successfully update to Rp.${balance}`
            })

        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }

}



module.exports = UserControllers;