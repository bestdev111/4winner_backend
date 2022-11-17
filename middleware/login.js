const jwt = require('jsonwebtoken');
const jwtSecret = 'VerySecretString123$'
const User = require("../models/user")

module.exports = async (req, res, next) => {
    let authorizationHeader = null
    if (req) {
        console.log('req', req.headers['authorization']);
        authorizationHeader = req.headers['authorization'];
    }
    if (authorizationHeader) {
        try {
            const decoded = await jwt.verify(authorizationHeader, jwtSecret);
            console.log('success', decoded);
            const user = await User.findOne({ _id: decoded.userId });
            if (user) {
                if(decoded.userrole === 'admin'){
                    req.user = user;
                    next();
                }
                throw 'permission error';
            } else {
                throw 'No such user';
            }
        } catch (error) {
            res.json({
                error: `You don't have permission`,
                error_type: 'not_authenticated'
            })
        }
    } else {
        console.log('notoken');
        res.json({
            error: 'No token provided',
            error_type: 'no_token'
        })
    }
}