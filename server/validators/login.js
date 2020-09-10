const { body } = require('express-validator');
const { User } = require('../models');

module.exports = [
    body(['email'])
        .trim()
        .not()
        .isEmpty()
        .withMessage('Should not be empty')
        .isEmail()
        .withMessage('Email address is not valid!'),

    body(['password'])
        .trim()
        .not()
        .isEmpty()
        .withMessage('Should not be empty')
        .isLength({ min: 6, max: 32 })
        .withMessage('Password must be 6-32 characters in length')
];
