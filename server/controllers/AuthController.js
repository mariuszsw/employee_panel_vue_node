const { User } = require('../models');
const jwt = require('jsonwebtoken');
const config = require('../config');
const HttpStatus = require('http-status-codes');

class AuthController {
    jwtRegUser(user) {
        const ONE_WEEK = 60 * 60 * 24 * 7;
        return jwt.sign(user, config.authentication.jwtSecret, {
            expiresIn: ONE_WEEK
        });
    }

    async register(req, res) {
        const user = await User.create({
            ...req.body,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return res.send({
            user,
            token: this.jwtRegUser(user.toJSON())
        });
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({
                where: {
                    email
                }
            });
            const isPasswordValid = await user.comparePassword(password);

            if (isPasswordValid) {
                return res.status(HttpStatus.OK).json({
                    message: 'User login'
                });
            }

            return res.status(HttpStatus.UNAUTHORIZED).json({
                message: "Password didn't match"
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                error: 'Error'
            });
        }
    }
}

module.exports = AuthController;
