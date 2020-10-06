const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const userController = new UserController();

const UserLeavesController = require('../controllers/UserLeavesController');
const userLeavesController = new UserLeavesController();

const UserContractsController = require('../controllers/UserContractsController');
const userContractsController = new UserContractsController();

const isAdmin = require('../middlewares/isAdmin');
const isLoggedIn = require('../middlewares/isLoggedIn');
const adminMiddleware = [isLoggedIn, isAdmin];
const userValidator = require('../validators/userCreate');
const leaveValidator = require('../validators/leaveCreate');
const validate = require('../validators/validate');

module.exports = () => {
    router.get('/:id/leaves', [isLoggedIn], userLeavesController.index);

    router.get('/', adminMiddleware, userController.index);
    router.get('/:id', adminMiddleware, userController.show);
    router.delete('/:id', adminMiddleware, userController.delete);
    router.put('/:id', adminMiddleware, [userValidator, validate], userController.update);

    router.get('/:id/contracts', [isLoggedIn], userContractsController.index);

    router.post('/', adminMiddleware, [userValidator, validate], (...args) => userController.create(...args));

    return router;
};
