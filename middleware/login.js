const jwt = require('jsonwebtoken');
const User = require("../models/user")
const dotenv = require('dotenv').config();
module.exports = async (req, res, next) => {
    let authorizationHeader = null
    if (req) {
        authorizationHeader = req.headers['authorization'];
    }
    if (authorizationHeader) {
        try {
            authorizationHeader = authorizationHeader.replace('Bearer ', '');
            const decoded = await jwt.verify(authorizationHeader, dotenv.parsed.SECRET_KEY);
            try {
                user = await User.find({ userName: decoded.userName }).populate('userRole').exec();
            } catch (error) {
                throw error;
            }
            if (user) {
                req.user = user[0];
                next();
            }
            else {
                return res.send(401, "Unauthorized");
            }
        } catch (error) {
            return res.status(401).json({
                error: error,
                error_type: 'not_authenticated'
            })
        }
    } else {
        return res.status(500).json({
            error: 'No token provided',
            error_type: 'no_token'
        })
    }
}