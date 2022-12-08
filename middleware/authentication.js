const { User } = require("../models")
const { verfyToken } = require("../helper/jwt");


const autentication = async (req, res, next) => {
    try {
        const token = req.headers["x-access-token"];
        const userDecode = verfyToken(token);

        const user = await User.findOne({
            where: {
                id: userDecode.id,
                email: userDecode.email,
                role: userDecode.role
            }
        })

        if(!user) {
            return res.status(401).json({
                message: "invalid user id"
            });
        }

        res.dataUser = user;
        next();
    } catch (error) {
        return res.status(401).json(error)
    }
}


module.exports = autentication

