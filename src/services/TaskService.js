const { Op } = require('sequelize');
const { Project, User } = require('../context/context');

class TaskService {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }


  async getAllTasks(queryParams = {}) {
    const page = Math.max(1, parseInt(queryParams.page, 10) || 1);
    const limit = Math.max(1, parseInt(queryParams.limit, 10) || 10);
    const offset = (page - 1) * limit;

    const sortBy = queryParams.sortBy || 'createdAt';
    const sortOrder = queryParams.sortOrder && queryParams.sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const where = {};

    // Durum filtresi
    if (queryParams.status) {
      where.status = queryParams.status;
    }
    
    // Öncelik filtresi
    if (queryParams.priority) {
      where.priority = queryParams.priority;
    }

    // Kişiye (Assignee) göre filtreleme 
    if (queryParams.assigneeId) {
      where.assigneeId = queryParams.assigneeId;
    }

    // Arama filtresi 
    if (queryParams.search) {
      const searchTerm = `%${queryParams.search}%`;
      
      where[Op.or] = [
        { title: { [Op.like]: searchTerm } },
        { description: { [Op.like]: searchTerm } }
      ];
    }

    const options = {
      where,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      include: [
        { model: Project, as: 'Project', attributes: ['id', 'name'] },
        { model: User, as: 'Assignee', attributes: ['id', 'name', 'email'] }
      ]
    };

    const { count, rows } = await this.taskRepository.findAndCountAll(options);

    const totalPages = Math.ceil(count / limit) || 1;

    return {
      data: rows,
      pagination: {
        totalItems: count,
        itemCount: rows.length,
        itemsPerPage: limit,
        totalPages: totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  }

  // 2. ID'ye göre görevi proje ve atanan kişi (Assignee) bilgileriyle getir
  async getTaskById(id) {
    const task = await this.taskRepository.findById(id, {
      include: [
        { model: Project, as: 'Project', attributes: ['id', 'name', 'ownerId'] },
        { model: User, as: 'Assignee', attributes: ['id', 'name', 'email'] }
      ]
    });

    if (!task) {
      const error = new Error('Görev bulunamadı.');
      error.statusCode = 404;
      throw error;
    }
    return task;
  }

  // 3. Yeni görev oluştur (İş kuralı: Proje var olmalı ve ekleyen kişi proje sahibi olmalı)
  async createTask(taskData, userId) {
    const { projectId } = taskData;

    // Bağlı olduğu projenin varlığını kontrol et
    const project = await Project.findByPk(projectId);
    if (!project) {
      const error = new Error('Görevin ekleneceği proje bulunamadı.');
      error.statusCode = 404;
      throw error;
    }

    // Yetki kontrolü: Sadece proje sahibi bu projeye görev ekleyebilir
    if (project.ownerId !== userId) {
      const error = new Error('Bu projeye görev ekleme yetkiniz yok.');
      error.statusCode = 403;
      throw error;
    }

    return await this.taskRepository.create(taskData);
  }

  // 4. Görevi güncelle (İş kuralı: Proje sahibi veya göreve atanmış kişi güncelleyebilir)
  async updateTask(id, updateData, userId) {
    const task = await this.getTaskById(id);

    const project = task.Project;
    const isOwner = project.ownerId === userId;
    const isAssignee = task.assigneeId === userId;

    if (!isOwner && !isAssignee) {
      const error = new Error('Bu görevi güncelleme yetkiniz yok.');
      error.statusCode = 403;
      throw error;
    }

    return await this.taskRepository.update(id, updateData);
  }

  // 5. Görevi sil (Sadece proje sahibi silebilir)
  async deleteTask(id, userId) {
    const task = await this.getTaskById(id);

    const project = task.Project;
    if (project.ownerId !== userId) {
      const error = new Error('Bu görevi silme yetkiniz yok.');
      error.statusCode = 403;
      throw error;
    }

    return await this.taskRepository.delete(id);
  }

  // 6. Belirli bir projeye ait görevleri sayfalama ile listele
  async getTasksByProject(projectId, queryParams = {}) {
    const project = await Project.findByPk(projectId);
    if (!project) {
      const error = new Error('Proje bulunamadı.');
      error.statusCode = 404;
      throw error;
    }

    const page = Math.max(1, parseInt(queryParams.page, 10) || 1);
    const limit = Math.max(1, parseInt(queryParams.limit, 10) || 10);
    const offset = (page - 1) * limit;

    const where = { projectId };

    if (queryParams.status) {
      where.status = queryParams.status;
    }

    const options = {
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'Assignee', attributes: ['id', 'name', 'email'] }
      ]
    };

    const { count, rows } = await this.taskRepository.model.findAndCountAll(options);
    const totalPages = Math.ceil(count / limit) || 1;

    return {
      totalItems: count,
      totalPages: totalPages,
      currentPage: page,
      tasks: rows
    };
  }
}

module.exports = TaskService;