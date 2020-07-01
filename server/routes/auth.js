const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const registerValidator = require('../validators/register');
const validate = require('../validators/validate');
const authController = new AuthController();
const isAdmin = require('../middlewares/isAdmin');
const isLoggedIn = require('../middlewares/isLoggedIn');

module.exports = () => {
    router.get('/me', [isLoggedIn], authController.me);
    router.post('/login', (...args) => authController.login(...args));
    router.post('/register', [registerValidator, validate], (...args) =>
        authController.register(...args)
    );

    return router;
};
