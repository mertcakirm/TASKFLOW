const BaseRepository = require('./BaseRepository');
const { Project, User } = require('../../context/database');

class ProjectRepository extends BaseRepository {
  constructor() {
    super(Project);
  }

  async findByIdWithOwner(id) {
    return await this.model.findByPk(id, {
      include: [{ model: User, as: 'Owner', attributes: ['id', 'name', 'email'] }]
    });
  }

  async findByOwnerId(ownerId) {
    return await this.model.findAll({
      where: { ownerId }
    });
  }
}

module.exports = new ProjectRepository();