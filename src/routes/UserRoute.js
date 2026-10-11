const { ROLES } = require('../constants/enums');
const userController = require('../controllers/UserController');
const { authenticateToken, requireRole } = require('../middlewares/Authentication');
const { validateRequiredFields } = require('../middlewares/validator');
const router = require('express').Router();

router.put('/change-user-role', authenticateToken, requireRole(ROLES.MANAGER), validateRequiredFields(['userId', 'newRole']), userController.changeRole);
router.delete('/delete-user/:userId', authenticateToken, requireRole(ROLES.MANAGER), userController.deleteUser);

module.exports = router;