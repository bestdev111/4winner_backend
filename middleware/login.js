const jwt = require('jsonwebtoken');
const jwtSecret = 'VerySecretString123$'
const User = require("../models/user")

module.exports = async (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];

    // console.log('authorizationHeader', req.headers);
    // let token;
    // if (authorizationHeader)
    //     token = authorizationHeader.split(' ')[1];

    if (authorizationHeader) {
        try {
            const decoded = await jwt.verify(authorizationHeader, jwtSecret);
            console.log('success', decoded);
            const user = await User.findOne({ _id: decoded.userId });
            if (user) {
                if(decoded.userrole_id == 1){
                    req.user = user;
                    next();
                }
                throw 'permission error';
            } else {
                throw 'No such user';
            }
        } catch (error) {
            res.status(401).json({
                error: `You don't have permission`,
                error_type: 'not_authenticated'
            })
        }
    } else {
        res.status(403).json({
            error: 'No token provided',
            error_type: 'no_token'
        })
    }
}