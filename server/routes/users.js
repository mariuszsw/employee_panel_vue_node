const express = require('express');
const router = express.Router();
const validate = require('../validators/validate');
const userController = require('../controllers/UserController');
const isAdmin = require('../middlewares/isAdmin');
const isUser = require('../middlewares/isUser');
const isLoggedIn = require('../middlewares/isLoggedIn');

module.exports = () => {
    router.get('/', [isLoggedIn, isAdmin], userController.index);
    router.get('/:id', [isLoggedIn, isUser], userController.show);
    router.delete('/:id', [isLoggedIn, isAdmin], userController.delete);

    router.put('/:id', [isLoggedIn], userController.update);

    return router;
};
