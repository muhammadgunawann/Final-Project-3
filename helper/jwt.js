const jwt = require("jsonwebtoken");
require("dotenv").config()

const generateToken = (payload) => {
    const token = jwt.sign(payload, process.env.SECRET)

    return token
}

const verfyToken = (token) => {
    const decode = jwt.verify(token, process.env.SECRET);
    
    return decode;
}

module.exports = {
    generateToken,
    verfyToken
}