const Category = require('./category.model');
const Book = require('./book.model');
const BorrowRecord = require('./borrowRecord.model');
const { sequelize } = require('../config/database');

// 定义模型关联
Category.hasMany(Book, { foreignKey: 'categoryId', as: 'books' });
Book.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

Book.hasMany(BorrowRecord, { foreignKey: 'bookId', as: 'borrowRecords' });
BorrowRecord.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });

// 同步模型到数据库
const syncModels = async () => {
  try {
    // 如果表已存在，则先删除
    // await sequelize.sync({ force: true });
    
    // 如果表不存在则创建
    await sequelize.sync({ alter: true });
    console.log('所有模型已成功同步到数据库');
  } catch (error) {
    console.error('同步模型到数据库时出错:', error);
  }
};

module.exports = {
  sequelize,
  Category,
  Book,
  BorrowRecord,
  syncModels,
};
