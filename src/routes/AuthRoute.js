const authController = require('../controllers/AuthController');
const { authenticateToken } = require('../middlewares/Authentication');
const { validateRequiredFields } = require('../middlewares/validator');
const router = require('express').Router();

router.post('/register', validateRequiredFields(["email", "password", "name"]) , authController.register);
router.post('/login', validateRequiredFields(["email", "password"]) , authController.login);
router.put('/change-password', validateRequiredFields(["oldPassword", "newPassword"]) , authenticateToken, authController.changePassword);

module.exports = router; 