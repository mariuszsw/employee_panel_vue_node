const express = require('express');
const router = express.Router();
const ContractController = require('../controllers/ContractController');
const contractController = new ContractController();
const isAdmin = require('../middlewares/isAdmin');
const isUser = require('../middlewares/isUser');
const isLoggedIn = require('../middlewares/isLoggedIn');

module.exports = () => {
    router.delete('/:id', [isLoggedIn, isAdmin], contractController.delete);

    router.put('/:id', [isLoggedIn], contractController.update);

    router.post('/', [isLoggedIn], (...args) => contractController.post(...args));

    return router;
};
