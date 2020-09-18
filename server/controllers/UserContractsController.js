const HttpStatus = require('http-status-codes');
const { User, Contract } = require('../models');

class UserContractsController {
    async index(req, res) {
        try {
            const { id } = req.params;

            const user = await User.findByPk(id);

            if (!user) {
                return res.status(HttpStatus.NOT_FOUND).send({
                    message: 'User not exists!'
                });
            }

            const contracts = await Contract.findAll({
                where: {
                    userId: id
                }
            });

            return res.send(contracts);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                error: 'Internal Server Error'
            });
        }
    }
}

module.exports = UserContractsController;
