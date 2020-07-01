const HttpStatus = require('http-status-codes');
const { User } = require('../models');

module.exports = async (req, res, next) => {
    const user = await User.findByPk(req.loggedUserId);

    if (!user) {
        return res.status(HttpStatus.FORBIDDEN).send({
            message: 'Require User Role!'
        });
    }

    const isUser = await user.isUser();

    if (isUser) {
        return next();
    }

    return res.status(HttpStatus.FORBIDDEN).send({
        message: 'Require User Role!'
    });
};
