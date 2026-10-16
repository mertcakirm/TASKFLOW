const UserRepository = require("../repositories/UserRepository");
const UserService = require("../services/UserService");
const _context = require('../context/context');

class UserController {
    
    async changeRole(req, res) {
        try {
            const managerId = req.user.id;
            const { userId, newRole } = req.body;
            
            const updatedUser = await userService.changeRole(managerId, userId, newRole);

            return res.status(200).json({
                success: true,
                message: 'Kullanıcının rolü başarıyla değiştirildi.',
                data: updatedUser
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message
            });
        }
    }

    async deleteUser(req, res) {
        try {
            const managerId = req.user.id;
            const { userId } = req.params;

            await userService.deleteUser(managerId, userId);

            return res.status(200).json({
                success: true,
                message: 'Kullanıcı başarıyla silindi.'
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message
            });
        }
    }
}


const userRepository = new UserRepository(_context);
const userService = new UserService(userRepository);

module.exports = new UserController(userService);