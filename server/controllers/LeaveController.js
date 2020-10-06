const HttpStatus = require('http-status-codes');
const { Contract, Leave } = require('../models');
const moment = require('moment');

class LeaveController {
    async post(req, res) {
        let { end, start, userId } = req.body;
        const { approved } = req.body;

        const isAdmin = await req.loggedUser.isAdmin();

        if (approved && !isAdmin) {
            return res.status(HttpStatus.FORBIDDEN).send({
                message: 'Only admin can approve leaves'
            });
        }

        const contract = await Contract.findOne({
            where: {
                userId: userId
            }
        });
        const dayOff = await Leave.findOne({
            where: {
                userId: req.body.userId
            },
            order: [['updatedAt', 'DESC']]
        });

        const endDate = moment(end);
        const startDate = moment(start);

        if (!dayOff) {
            req.body.leaveDays = Math.floor(
                (contract.leave / 12) * contract.duration - endDate.diff(startDate, 'days')
            );
        } else {
            req.body.leaveDays = dayOff.leaveDays - endDate.diff(startDate, 'days');
        }

        const leave = await Leave.create({
            ...req.body,
            approved: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return res.status(HttpStatus.CREATED).send(leave);
    }

    async update(req, res) {
        const { userId } = req.body;

        try {
            const dayOff = await Leave.findOne({
                where: {
                    userId
                },
                order: [['updatedAt', 'DESC']]
            });

            const end = moment(req.body.end);
            const start = moment(req.body.start);

            if (dayOff.approved === req.body.approved) {
                req.body.leaveDays =
                    dayOff.leaveDays -
                    (end.diff(start, 'days') - moment(dayOff.end).diff(moment(dayOff.start), 'days'));
            }

            const { id } = req.params;

            const data = await dayOff.update(req.body, {
                where: {
                    id
                }
            });

            if (!data) {
                return res.sendStatus(HttpStatus.NOT_FOUND);
            }

            return res.send(data);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                error: 'Internal Server Error'
            });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            await Leave.destroy({
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

module.exports = LeaveController;
