const express = require('express');
const router = express.Router();
const UserLeavesController = require('../controllers/UserLeavesController');
const userLeavesController = new UserLeavesController();
const LeavesController = require('../controllers/LeaveController');
const leavesController = new LeavesController();

const isAdmin = require('../middlewares/isAdmin');
const isLoggedIn = require('../middlewares/isLoggedIn');

module.exports = () => {
    // router.get('/:id', [isLoggedIn], userLeavesController.index);
    router.get('/users/:id/leaves', [isLoggedIn], userLeavesController.index);

    router.delete('/:id', [isLoggedIn, isAdmin], leavesController.delete);

    router.put('/:id', [isLoggedIn], leavesController.update);

    router.post('/', [isLoggedIn], (...args) => leavesController.post(...args));

    return router;
};
