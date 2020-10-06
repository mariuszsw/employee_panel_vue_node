const { body } = require('express-validator');
const { Leave } = require('../models');

const moment = require('moment');

module.exports = [
    body(['start'])
        .trim()
        .not()
        .isEmpty()
        .withMessage('Should not be empty')
        .bail()
        .custom(function isValidDate(value) {
            return moment(value, 'YYYY-MM-DD', true).isValid();
        })
        .withMessage('The date must be valid'),

    body(['end'])
        .trim()
        .not()
        .isEmpty()
        .withMessage('Should not be empty')
        .bail()
        .custom(function isValidDate(value) {
            return moment(value, 'YYYY-MM-DD', true).isValid();
        })
        .withMessage('The date must be valid'),

    body(['approved']).isBoolean().withMessage('Should be Boolean'),

    body(['userId'])
        .trim()
        .not()
        .isEmpty()
        .withMessage('Should not be empty')
        .isNumeric()
        .withMessage('Should be numeric')
        .bail()
        .custom(async (value) => {
            const leave = await Leave.findByPk(value);

            return !!leave;
        })
        .withMessage('User with such ID not exists')
];
