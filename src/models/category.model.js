const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    comment: '分类名称',
  },
  description: {
    type: DataTypes.TEXT,
    comment: '分类描述',
  },
}, {
  tableName: 'categories',
  timestamps: true,
  underscored: true,
});

module.exports = Category;
