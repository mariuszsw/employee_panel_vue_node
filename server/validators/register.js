const { body } = require('express-validator');
const { User } = require('../models');

module.exports = [
    body(['email'])
        .trim()
        .not()
        .isEmpty()
        .withMessage('Should not be empty')
        .bail()
        .isEmail()
        .withMessage('Email address is not valid!')
        .bail()
        .custom(async (email, { req }) => {
            const user = await User.findOne({
                where: {
                    email
                }
            });

            if (user) {
                return Promise.reject('Email address already exists!');
            }
        }),

    body(['password'])
        .trim()
        .not()
        .isEmpty()
        .withMessage('Should not be empty')
        .bail()
        .isLength({ min: 6, max: 32 })
        .withMessage('Password must be 6-32 characters in length')
];
