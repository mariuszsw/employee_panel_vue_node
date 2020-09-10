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
    router.get('/:id', [isLoggedIn, isAdmin], userController.show);
    router.delete('/:id', [isLoggedIn, isAdmin], userController.delete);

    router.put('/:id', [isLoggedIn, isAdmin], [userCreateValidator, validate], userController.update);

    router.get('/:id/contracts', [isLoggedIn], userContractsController.index);

    router.post('/', [isLoggedIn, isAdmin], [userCreateValidator, validate], (...args) =>
        userController.create(...args)
    );

    return router;
};
