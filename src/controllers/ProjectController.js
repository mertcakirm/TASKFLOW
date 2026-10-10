const ProjectService = require('../services/ProjectService');
const _context = require('../context/context');
const ProjectRepository = require('../repositories/projectRepository');

class ProjectController {
  
  // 1. Tüm projeleri listele
  async getAllProjects(req, res) {
    try {
      const result = await projectService.getAllProjects(req.query);
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

  // 2. ID'ye göre proje getir (Owner bilgisiyle)
  async getProjectById(req, res) {
    try {
      const { id } = req.params;
      const project = await projectService.getProjectById(id);
      return res.status(200).json({
        success: true,
        data: project
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // 3. Yeni proje oluştur
  async createProject(req, res) {
    try {
      // Not: req.user, auth/JWT middleware tarafından eklenmiş olmalıdır
      const userId = req.user.id; 
      const newProject = await projectService.createProject(req.body, userId);
      
      return res.status(201).json({
        success: true,
        message: 'Proje başarıyla oluşturuldu.',
        data: newProject
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // 4. Projeyi güncelle (Sadece proje sahibi)
  async updateProject(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const updatedProject = await projectService.updateProject(id, req.body, userId);
      
      return res.status(200).json({
        success: true,
        message: 'Proje başarıyla güncellendi.',
        data: updatedProject
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // 5. Projeyi sil (Sadece proje sahibi)
  async deleteProject(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      await projectService.deleteProject(id, userId);
      
      return res.status(200).json({
        success: true,
        message: 'Proje başarıyla silindi.'
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // 6. Belirli bir kullanıcıya ait projeleri getir
  async getProjectsByOwner(req, res) {
    try {
      // Eğer parametrede ownerId verilmişse onu, verilmemişse giriş yapan kullanıcının ID'sini al
      const ownerId = req.params.ownerId || req.user.id;
      const result = await projectService.getProjectsByOwner(ownerId, req.query);
      
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

const projectRepository = new ProjectRepository(_context);
const projectService = new ProjectService(projectRepository);

module.exports = new ProjectController();