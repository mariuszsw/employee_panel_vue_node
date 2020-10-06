const express = require('express');
const router = express.Router();

const LeavesController = require('../controllers/LeaveController');
const leavesController = new LeavesController();

const isAdmin = require('../middlewares/isAdmin');
const isLoggedIn = require('../middlewares/isLoggedIn');
const leaveValidator = require('../validators/leaveCreate');
const validate = require('../validators/validate');

module.exports = () => {
    router.put('/:id', [isLoggedIn], [leaveValidator, validate], leavesController.update);
    router.post('/', [isLoggedIn], [leaveValidator, validate], (...args) => leavesController.post(...args));
    router.delete('/:id', [isLoggedIn], leavesController.delete);

    return router;
};
