const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: '书籍标题',
  },
  author: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '作者',
  },
  isbn: {
    type: DataTypes.STRING(20),
    unique: true,
    comment: 'ISBN号',
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: '价格',
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '库存数量',
  },
  publishedDate: {
    type: DataTypes.DATEONLY,
    comment: '出版日期',
  },
  description: {
    type: DataTypes.TEXT,
    comment: '书籍描述',
  },
  coverImage: {
    type: DataTypes.STRING(255),
    comment: '封面图片URL',
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '分类ID',
  },
}, {
  tableName: 'books',
  timestamps: true,
  underscored: true,
});

module.exports = Book;
