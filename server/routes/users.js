const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const userController = new UserController();

const UserContractsController = require('../controllers/UserContractsController');
const userContractsController = new UserContractsController();

const isAdmin = require('../middlewares/isAdmin');
const isUser = require('../middlewares/isUser');
const isLoggedIn = require('../middlewares/isLoggedIn');
const userCreateValidator = require('../validators/userCreate');
const validate = require('../validators/validate');

module.exports = () => {
    router.get('/', [isLoggedIn, isAdmin], userController.index);
    router.get('/:id', [isLoggedIn, isUser], userController.show);
    router.delete('/:id', [isLoggedIn, isAdmin], userController.delete);

    router.put('/:id', [isLoggedIn], userController.update);

    router.get('/:id/contracts', [isLoggedIn], userContractsController.index);

    router.post('/', [userCreateValidator, validate], [isLoggedIn, isAdmin], (...args) =>
        userController.create(...args)
    );

    return router;
};
