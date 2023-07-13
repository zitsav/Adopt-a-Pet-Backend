const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const authMiddleware = require('../middleware/authentication');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/users/:id', userController.getUserById);

router.patch('/users/:id', authMiddleware, userController.updateUser);

module.exports = router;