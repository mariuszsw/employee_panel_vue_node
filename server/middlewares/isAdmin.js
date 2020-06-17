const HttpStatus = require('http-status-codes');
const { User } = require('../models');

module.exports = async (req, res, next) => {
    const user = await User.findByPk(req.userId);

    if (!user) {
        return res.status(HttpStatus.FORBIDDEN).send({
            message: 'Require Admin Role!'
        });
    }

    const roles = await user.getRoles();
    const isAdmin = roles.find((r) => r.name === 'admin');

    if (isAdmin) {
        return next();
    }

    return res.status(HttpStatus.FORBIDDEN).send({
        message: 'Require Admin Role!'
    });
};
