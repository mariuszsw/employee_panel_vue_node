const HttpStatus = require('http-status-codes');
const { User, Role } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

class UserController {
    async index(req, res) {
        try {
            const users = await User.findAll();

            return res.send(users);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                error: 'Internal Server Error'
            });
        }
    }

    async show(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id);

            if (!user) {
                return res.sendStatus(HttpStatus.NOT_FOUND);
            }

            return res.send(user);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                error: 'Internal Server Error'
            });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            await User.destroy({
                where: {
                    id
                }
            });

            return res.sendStatus(HttpStatus.NO_CONTENT);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                error: 'Internal Server Error'
            });
        }
    }

    async update(req, res) {
        const user = await User.findByPk(req.loggedUserId);

        if (!user) {
            return res.status(HttpStatus.NOT_FOUND).send({
                message: 'Require User Role!'
            });
        }

        const isAdmin = await user.isAdmin();

        try {
            if (!isAdmin) {
                if (req.loggedUserId !== parseInt(req.params.id)) {
                    return res.sendStatus(HttpStatus.FORBIDDEN);
                }
            }
            req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8));

            const updateUser = await User.update(req.body, {
                where: {
                    id: req.params.id
                }
            });
            return res.send(updateUser);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                error: 'Internal Server Error'
            });
        }
    }

    async create(req, res) {
        const { roles, email } = req.body;

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
        } else {
            const adminRole = await Role.findOne({ admin: Role.ADMIN });
            await user.addRole(adminRole);
        }

        return res.status(HttpStatus.CREATED).send(user);
    }
}
module.exports = UserController;
