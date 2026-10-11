const { ROLES } = require('../constants/enums');
const taskController = require('../controllers/TaskController');
const { authenticateToken, requireRole } = require('../middlewares/Authentication');
const { validateRequiredFields } = require('../middlewares/validator');
const router = require('express').Router();

router.get('/get-all', authenticateToken, taskController.getAllTasks);
router.get('/get/:id', authenticateToken, taskController.getTaskById);
router.post('/create', validateRequiredFields(["title", "projectId"]), authenticateToken, requireRole(ROLES.MANAGER), taskController.createTask);
router.put('/update/:id', authenticateToken, requireRole(ROLES.MANAGER, ROLES.USER), taskController.updateTask);
router.delete('/delete/:id', authenticateToken, requireRole(ROLES.MANAGER), taskController.deleteTask);
router.get('/project/:projectId', authenticateToken, taskController.getTasksByProject);

module.exports = router;