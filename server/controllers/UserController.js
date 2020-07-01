const HttpStatus = require('http-status-codes');
const { User } = require('../models');
const isUser = require('../middlewares/isUser');
const isAdmin = require('../middlewares/isAdmin');

module.exports = {
    async index(req, res) {
        try {
            const users = await User.findAll();

            return res.send(users);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                error: 'Internal Server Error'
            });
        }
    },

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
    },

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
    },

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
};
