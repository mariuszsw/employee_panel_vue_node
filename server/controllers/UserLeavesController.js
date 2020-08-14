const HttpStatus = require('http-status-codes');
const { Leave } = require('../models');

class UserLeaveController {
    async index(req, res) {
        try {
            const { id } = req.params;

            let leaves = await Leave.findAll({
                where: {
                    userId: id
                }
            });
            return res.send(leaves);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                error: 'Internal Server Error'
            });
        }
    }
}

module.exports = UserLeaveController;
