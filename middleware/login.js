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
            const decoded = await jwt.verify(authorizationHeader, dotenv.parsed.SECRET_KEY);
            const user = await User.findOne({ _id: decoded.userId });
            if (user) {
                req.user = user;
                next();
            }
            else {
                return res.send(401, "Unauthorized");
            }
        } catch (error) {
            return res.status(401).json({
                error: `You don't have permission`,
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