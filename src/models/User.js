const { DataTypes } = require('sequelize');
const crypto = require('crypto');
const { ROLES } = require('../constants/enums');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.STRING(10),
      defaultValue: () => crypto.randomBytes(5).toString('hex'),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(ROLES)),
      defaultValue: ROLES.USER,
    },
  }, {
    timestamps: true,
  });

  return User;
};