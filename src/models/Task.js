const { DataTypes } = require('sequelize');
const crypto = require('crypto');
const { TASK_PRIORITIES, TASK_STATUSES } = require('../constants/enums');

module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    id: {
      type: DataTypes.STRING(10),
      defaultValue: () => crypto.randomBytes(5).toString('hex'),
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(TASK_STATUSES)),
      defaultValue: TASK_STATUSES.PENDING,
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM(...Object.values(TASK_PRIORITIES)),
      defaultValue: TASK_PRIORITIES.MEDIUM,
      allowNull: false,
    },
    projectId: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    assigneeId: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
  }, {
    timestamps: true,
  });

  return Task;
};