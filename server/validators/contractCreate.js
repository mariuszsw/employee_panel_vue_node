const { body } = require('express-validator');

module.exports = [
    body(['startDate'])
        .trim()
        .not()
        .isEmpty()
        .withMessage('Should not be empty')
        .bail()
        .custom(function isValidDate(value) {
            if (!value.match(/^\d{4}-\d{2}-\d{2}$/)) return false;

            const date = new Date(value);
            if (!date.getTime()) return false;
            return date.toISOString().slice(0, 10) === value;
        })
        .withMessage('The date must be valid'),
    body(['duration'])
        .trim()
        .not()
        .isEmpty()
        .withMessage('Should not be empty')
        .isNumeric()
        .withMessage('Should be numeric'),

    body(['leave'])
        .trim()
        .not()
        .isEmpty()
        .withMessage('Should not be empty')
        .isNumeric()
        .withMessage('Should be numeric'),

    body(['userId'])
        .trim()
        .not()
        .isEmpty()
        .withMessage('Should not be empty')
        .isNumeric()
        .withMessage('Should be numeric')
];
