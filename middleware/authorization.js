const { verfyToken } = require("../helper/jwt");
const { User } = require("../models");
const { TransactionHistory } = require("../models")

const authorization = async (req, res, next) => {
    const token = req.headers["x-access-token"];
    const userDecode = verfyToken(token);
    const transactionId = req.params.transactionId;
    
    try {
        const user = await User.findOne({
            where: {
                id: userDecode.id
            }
        })

        if(transactionId) {

            const transactionHistory = await TransactionHistory.findOne({
                where: {
                    id: parseInt(transactionId)
                }
            })

            if(user.role === "admin" || transactionHistory.UserId === user.id) {
                next()
            }else {
                return res.status(401).json({
                    error: {
                        message: "Those who can access this are 'admins' and 'users' who have transaction data"
                    }
                })
            }

        }else {

            if(user.role === "admin") {
                next()
            }else {
                return res.status(401).json({
                    error: {
                        message: "Your access is denied, you must be admin to access"
                    }
                })
            }
        }
        

    } catch (error) {
        return res.status(500).json(error)
    }


}



module.exports = authorization;