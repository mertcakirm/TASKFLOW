const { Op } = require("sequelize");

class ProjectService {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  // 1. Tüm projeleri sayfalama (pagination) ve sıralama desteğiyle getir
  async getAllProjects(queryParams = {}) {
    const page = Math.max(1, parseInt(queryParams.page, 10) || 1);
    const limit = Math.max(1, parseInt(queryParams.limit, 10) || 10);
    const offset = (page - 1) * limit;

    const sortBy = queryParams.sortBy || 'createdAt';
    const sortOrder = queryParams.sortOrder && queryParams.sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const where = {};

    if (queryParams.status) {
      where.status = queryParams.status;
    }

    if (queryParams.search) {
      const searchTerm = `%${queryParams.search}%`;
      
      where[Op.or] = [
        { name: { [Op.like]: searchTerm } }, 
        { description: { [Op.like]: searchTerm } }
      ];
    }

    const options = {
      where,
      limit,
      offset,
      order: [[sortBy, sortOrder]]
    };

    const { count, rows } = await this.projectRepository.model.findAndCountAll(options);
    const totalPages = Math.ceil(count / limit) || 1;

    return {
      totalItems: count,
      totalPages: totalPages,
      currentPage: page,
      projects: rows
    };
  }

  // 2. ID'ye göre projeyi sahibiyle (Owner) birlikte getir
  async getProjectById(id) {
    const project = await this.projectRepository.findByIdWithOwner(id);
    if (!project) {
      const error = new Error('Proje bulunamadı.');
      error.statusCode = 404;
      throw error;
    }
    return project;
  }

  // 3. Yeni proje oluştur (ownerId'yi oturum açan kullanıcıdan otomatik ata)
  async createProject(projectData, userId) {
    const dataToCreate = {
      ...projectData,
      ownerId: userId
    };

    return await this.projectRepository.create(dataToCreate);
  }

  // 4. Projeyi güncelle (Sadece proje sahibi güncelleyebilir)
  async updateProject(id, updateData, userId) {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      const error = new Error('Proje bulunamadı.');
      error.statusCode = 404;
      throw error;
    }

    // Yetki kontrolü (Ownership check)
    if (project.ownerId !== userId) {
      const error = new Error('Bu projeyi güncelleme yetkiniz yok.');
      error.statusCode = 403;
      throw error;
    }

    return await this.projectRepository.update(id, updateData);
  }

  // 5. Projeyi sil (Sadece proje sahibi silebilir)
  async deleteProject(id, userId) {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      const error = new Error('Proje bulunamadı.');
      error.statusCode = 404;
      throw error;
    }

    if (project.ownerId !== userId) {
      const error = new Error('Bu projeyi silme yetkiniz yok.');
      error.statusCode = 403;
      throw error;
    }

    return await this.projectRepository.delete(id);
  }

  // 6. Belirli bir kullanıcıya ait projeleri sayfalama ile getir
  async getProjectsByOwner(ownerId, queryParams = {}) {
    const page = parseInt(queryParams.page, 10) || 1;
    const limit = parseInt(queryParams.limit, 10) || 10;
    const offset = (page - 1) * limit;


    const where = { ownerId };

    if (queryParams.status) {
      where.status = queryParams.status;
    }
    
    const options = {
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    };

    const { count, rows } = await this.projectRepository.model.findAndCountAll(options);

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      projects: rows
    };
  }
}

module.exports = ProjectService;