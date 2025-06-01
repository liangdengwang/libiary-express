const express = require('express');
const router = express.Router();

// 导入路由
const categoryRoutes = require('./category.routes');
const bookRoutes = require('./book.routes');
const borrowRoutes = require('./borrow.routes');

// 使用路由
router.use('/categories', categoryRoutes);
router.use('/books', bookRoutes);
router.use('/borrow', borrowRoutes);

// 健康检查路由
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 处理
router.use('*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

module.exports = router;
