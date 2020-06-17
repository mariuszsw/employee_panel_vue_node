const jwt = require('jsonwebtoken');
const config = require('../config/index.js');
const HttpStatus = require('http-status-codes');

module.exports = (req, res, next) => {
    let token = req.headers['x-access-token'];

    if (!token) {
        return res.status(HttpStatus.FORBIDDEN).send({
            message: 'No token provided!'
        });
    }

    jwt.verify(token, config.authentication.jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(HttpStatus.UNAUTHORIZED).send({
                message: 'Unauthorized!'
            });
        }
        req.userId = decoded.id;
        next();
    });
};
