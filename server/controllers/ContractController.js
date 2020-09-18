const HttpStatus = require('http-status-codes');
const { Contract } = require('../models');

class ContractController {
    async post(req, res) {
        const contract = await Contract.create({
            ...req.body
        });

        return res.status(HttpStatus.CREATED).send(contract);
    }

    async update(req, res) {
        const isAdmin = await req.loggedUser.isAdmin();
        const { id } = req.params;
        try {
            const contract = await Contract.findByPk(id);

            if (!contract) {
                return res.sendStatus(HttpStatus.NOT_FOUND);
            }

            if (!isAdmin && contract.userId !== req.loggedUser.id) {
                return res.sendStatus(HttpStatus.FORBIDDEN);
            }

            const contractUpdated = await contract.update(req.body);

            return res.send(contractUpdated);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                error: 'Internal Server Error'
            });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            await Contract.destroy({
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
}

module.exports = ContractController;
