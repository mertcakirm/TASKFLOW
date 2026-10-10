require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false
  }
);

const _context = {};

_context.User = require('../models/User')(sequelize, DataTypes);
_context.Project = require('../models/Project')(sequelize, DataTypes);
_context.Task = require('../models/Task')(sequelize, DataTypes);

const { User, Project, Task } = _context;

// --- İLİŞKİLER ---

// 1. Kullanıcı - Proje Sahibi İlişkisi
User.hasMany(Project, { foreignKey: 'ownerId', as: 'OwnedProjects' });
Project.belongsTo(User, { foreignKey: 'ownerId', as: 'Owner' });

// 2. Proje - Görev İlişkisi
Project.hasMany(Task, { foreignKey: 'projectId', onDelete: 'CASCADE', as: 'Tasks' });
Task.belongsTo(Project, { foreignKey: 'projectId', as: 'Project' });

// 3. Kullanıcı - Görev Atama İlişkisi
User.hasMany(Task, { foreignKey: 'assigneeId', as: 'AssignedTasks' });
Task.belongsTo(User, { foreignKey: 'assigneeId', as: 'Assignee' });

_context.sequelize = sequelize;
_context.Sequelize = Sequelize;

module.exports = _context;