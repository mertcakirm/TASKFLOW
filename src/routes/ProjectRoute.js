const { ROLES } = require('../constants/enums');
const projectController = require('../controllers/ProjectController');
const { authenticateToken, requireRole } = require('../middlewares/Authentication');
const { validateRequiredFields } = require('../middlewares/validator');
const router = require('express').Router();

router.get('/get-all', authenticateToken, projectController.getAllProjects);
router.get('/get/:id', authenticateToken, projectController.getProjectById);
router.post('/create', validateRequiredFields(["name"]), authenticateToken, requireRole(ROLES.MANAGER), projectController.createProject);
router.put('/update/:id', authenticateToken, requireRole(ROLES.MANAGER), projectController.updateProject);
router.delete('/delete/:id', authenticateToken,requireRole(ROLES.MANAGER) , projectController.deleteProject);  
router.get('/owner/:ownerId', authenticateToken, projectController.getProjectsByOwner);

module.exports = router; 