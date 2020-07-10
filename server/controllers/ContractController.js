const HttpStatus = require('http-status-codes');
const { User, Contract, Leave } = require('../models');
const isUser = require('../middlewares/isUser');
const isAdmin = require('../middlewares/isAdmin');

class ContractController {
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

            const updatedContract = await Contract.update(req.body, {
                where: {
                    id
                }
            });

            return res.send(updatedContract);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                error: 'Internal Server Error'
            });
        }
    }

    async post(req, res) {
        const contract = await Contract.create({
            ...req.body,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return res.send(contract);
    }
}

module.exports = ContractController;
