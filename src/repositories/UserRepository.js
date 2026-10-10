const { User } = require('../context/context');
const BaseRepository = require('./baseRepository');

class UserRepository extends BaseRepository {
  constructor(model) {
    super(User);
  }

  async findByEmail(email, options = {}) {
    return await this.model.findOne({ where: { email }, ...options });
  }

  async changePassword(userId, newPassword) {
    const [affectedRows] = await this.model.update(
      { password: newPassword },
      { where: { id: userId } }
    );

    return affectedRows > 0;
  }
}

module.exports = UserRepository;