const TaskRepository = require('../repositories/TaskRepository');
const TaskService = require('../services/TaskService');
const _context = require('../context/context');

class TaskController {

  constructor(taskService) {
    this.taskService = taskService;
  }

  // 1. Tüm görevleri listele (Sayfalama, sıralama ve filtreleme ile)
  async getAllTasks(req, res) {
    try {
      const result = await taskService.getAllTasks(req.query);
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({ 
        success: false,
        message: error.message
      });
    }
  }

  // 2. ID'ye göre görev detayını getir
  async getTaskById(req, res) {
    try {
      const { id } = req.params;
      const task = await taskService.getTaskById(id);
      return res.status(200).json({
        success: true,
        data: task
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // 3. Yeni görev oluştur
  async createTask(req, res) {
    try {
      const userId = req.user.id; // Auth middleware'den gelen kullanıcı ID'si
      const newTask = await taskService.createTask(req.body, userId);
      
      return res.status(201).json({
        success: true,
        message: 'Görev başarıyla oluşturuldu.',
        data: newTask
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // 4. Görevi güncelle
  async updateTask(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const updatedTask = await taskService.updateTask(id, req.body, userId);
      
      return res.status(200).json({
        success: true,
        message: 'Görev başarıyla güncellendi.',
        data: updatedTask
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // 5. Görevi sil
  async deleteTask(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      await taskService.deleteTask(id, userId);
      
      return res.status(200).json({
        success: true,
        message: 'Görev başarıyla silindi.'
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // 6. Belirli bir projeye ait görevleri listele
  async getTasksByProject(req, res) {
    try {
      const { projectId } = req.params;
      const result = await taskService.getTasksByProject(projectId, req.query);
      
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }
}



const taskRepositoryInstance = new TaskRepository(_context);
const taskService = new TaskService(taskRepositoryInstance);

module.exports = new TaskController(taskService);