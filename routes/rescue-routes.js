const express = require('express');
const router = express.Router();
const rescueCenterController = require('../controllers/rescue-controller');
const authMiddleware = require('../middleware/authentication');

router.post('/rescue/register', rescueCenterController.rescueRegister);
router.post('/rescue/login', rescueCenterController.rescueLogin);
router.get('/rescue/:id', rescueCenterController.getUserById);

router.patch('/rescue/:id', authMiddleware, rescueCenterController.updateRescueCenter);

module.exports = router;