const express = require('express');
const controller = require('../controllers/userController');
const router = express.Router();
const auth = require('../middlewares/auth')

router.post('/login', controller.userLogin);
router.post('/change-password', auth, controller.changePassword);
router.put('/change-password-admin/:id', controller.changePasswordAdmin);
router.get('/me', controller.getMe);
router.post('/logout', controller.logout);

module.exports = router;