const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BorrowRecord = sequelize.define('BorrowRecord', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '用户ID',
  },
  bookId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '书籍ID',
  },
  borrowDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: '借出日期',
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: '应还日期',
  },
  returnDate: {
    type: DataTypes.DATE,
    comment: '实际归还日期',
  },
  status: {
    type: DataTypes.ENUM('borrowed', 'returned', 'overdue'),
    defaultValue: 'borrowed',
    comment: '借阅状态：借出/已归还/逾期',
  },
  fine: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    comment: '罚款金额',
  },
}, {
  tableName: 'borrow_records',
  timestamps: true,
  underscored: true,
});

module.exports = BorrowRecord;
