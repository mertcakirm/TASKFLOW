const { DataTypes } = require('sequelize');
const crypto = require('crypto');
const { PROJECT_STATUSES } = require('../constants/enums');

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    id: {
      type: DataTypes.STRING(10),
      defaultValue: () => crypto.randomBytes(5).toString('hex'),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(PROJECT_STATUSES)),
      defaultValue: PROJECT_STATUSES.ACTIVE,
    },
    ownerId: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
  }, {
    timestamps: true,
  });

  return Project;
};