const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const authController = new AuthController();
const isLoggedIn = require('../middlewares/isLoggedIn');

module.exports = () => {
    router.get('/me', [isLoggedIn], authController.me);
    router.post('/login', (...args) => authController.login(...args));

    return router;
};
