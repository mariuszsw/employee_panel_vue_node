const express = require('express');
const router = express.Router();
const ContractController = require('../controllers/ContractController');
const contractController = new ContractController();
const isAdmin = require('../middlewares/isAdmin');
const isUser = require('../middlewares/isUser');
const isLoggedIn = require('../middlewares/isLoggedIn');
const adminMiddleware = [isLoggedIn, isAdmin];

const contractValidator = require('../validators/contractCreate');
const validate = require('../validators/validate');

module.exports = () => {
    router.delete('/:id', adminMiddleware, contractController.delete);

    router.put('/:id', adminMiddleware, [contractValidator, validate], contractController.update);

    router.post('/', adminMiddleware, [contractValidator, validate], (...args) => contractController.post(...args));

    return router;
};
