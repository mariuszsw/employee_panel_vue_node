const HttpStatus = require('http-status-codes');
const { Contract } = require('../models');

class UserContractsController {
    async index(req, res) {
        try {
            const { id } = req.params;

            let contracts = await Contract.findAll({
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
