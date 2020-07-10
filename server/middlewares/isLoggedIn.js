const jwt = require('jsonwebtoken');
const config = require('../config/index.js');
const HttpStatus = require('http-status-codes');
const { User } = require('../models');

module.exports = (req, res, next) => {
    let token = req.headers['x-access-token'];

    if (!token) {
        return res.status(HttpStatus.FORBIDDEN).send({
            message: 'No token provided!'
        });
    }

    jwt.verify(token, config.authentication.jwtSecret, async (err, decoded) => {
        if (err) {
            return res.status(HttpStatus.UNAUTHORIZED).send({
                message: 'Unauthorized!'
            });
        }

        req.loggedUserId = decoded.id;
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(HttpStatus.UNAUTHORIZED).send({
                message: 'Unauthorized!'
            });
        }
        
        req.loggedUser = user;

        next();
    });
};
