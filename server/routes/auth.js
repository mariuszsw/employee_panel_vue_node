const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const authController = new AuthController();
const isLoggedIn = require('../middlewares/isLoggedIn');
const loginValidator = require('../validators/login');
const validate = require('../validators/validate');

module.exports = () => {
    router.get('/me', [isLoggedIn], authController.me);
    router.post('/login', [loginValidator, validate], (...args) => authController.login(...args));

    return router;
};
