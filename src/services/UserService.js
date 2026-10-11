const { ROLES } = require("../constants/enums");

class UserService {

  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async changeRole(managerId ,userId, newRole) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      const error = new Error('Kullanıcı bulunamadı.');
      error.statusCode = 404;
      throw error;
    }

    if (user.role === newRole) {
      const error = new Error('Kullanıcının rolü zaten bu değerle aynı.');
      error.statusCode = 400;
      throw error;
    }

    if(managerId === userId) {
      const error = new Error('Kendi rolünüzü değiştiremezsiniz.');
      error.statusCode = 403;
      throw error;
    }

    if(newRole !== ROLES.MANAGER && newRole !== ROLES.USER) {
        const error = new Error('Bu rol sistemde mevcut değil.');
        error.statusCode = 400;
        throw error;
    }

    return await this.userRepository.changeRole(userId, newRole);
  }

  async deleteUser(managerId, userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      const error = new Error('Kullanıcı bulunamadı.');
      error.statusCode = 404;
      throw error;
    }

    if(managerId === userId) {
      const error = new Error('Kendi hesabınızı silemezsiniz.');
      error.statusCode = 403;
      throw error;
    }

    return await this.userRepository.delete(userId);
  }

}

module.exports = UserService;