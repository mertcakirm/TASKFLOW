const { ROLES } = require('../constants/enums');
const userController = require('../controllers/UserController');
const { authenticateToken, requireRole } = require('../middlewares/Authentication');
const router = require('express').Router();

router.put('/change-user-role', authenticateToken, requireRole(ROLES.MANAGER), userController.changeRole);
router.delete('/delete-user/:userId', authenticateToken, requireRole(ROLES.MANAGER), userController.deleteUser);

module.exports = router;