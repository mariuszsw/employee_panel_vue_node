const { User, Role } = require('../models');
const jwt = require('jsonwebtoken');
const config = require('../config');
const HttpStatus = require('http-status-codes');
const { Op } = require('sequelize');

class AuthController {
    jwtRegUser(user) {
        return jwt.sign({ id: user.id }, config.authentication.jwtSecret, {
            expiresIn: '10h'
        });
    }

    async register(req, res) {
        const { roles } = req.body;
        const user = await User.create({
            ...req.body,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        if (roles && roles.length) {
            const userRoles = await Role.findAll({
                where: {
                    name: {
                        [Op.or]: roles
                    }
                }
            });
            await user.setRoles(userRoles);

            return res.send({
                message: 'User was registered successfully!',
                user,
                token: this.jwtRegUser(user.toJSON())
            });
        } else {
            const adminRole = await Role.findOne({ admin: 'admin' });
            await user.addRole(adminRole);

            return res.send({
                message: 'User was registered successfully!',
                user,
                token: this.jwtRegUser(user.toJSON())
            });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({
                attributes: ['id', 'email', 'password'],
                where: {
                    email
                }
            });

            if (!user) {
                return status(HttpStatus.UNAUTHORIZED).send({
                    message: 'Email or password incorrect!'
                });
            }

            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return res.status(HttpStatus.UNAUTHORIZED).send({
                    message: 'Email or password incorrect!'
                });
            }

            const loggedUser = await User.findOne({
                where: {
                    email
                },
                include: [
                    {
                        association: 'roles',
                        attributes: ['id', 'name'],
                        through: {
                            attributes: []
                        }
                    }
                ]
            });

            return res.status(HttpStatus.OK).send({
                user: loggedUser,
                token: this.jwtRegUser(user.toJSON())
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                error: 'Error'
            });
        }
    }

    async me(req, res) {
        const loggedUser = await User.findByPk(req.userId);

        return res.send(loggedUser);
    }
}

module.exports = AuthController;
