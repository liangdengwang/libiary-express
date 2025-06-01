const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const { testConnection } = require('./config/database');
const { syncModels } = require('./models');
const { specs, swaggerUi, swaggerUiOptions } = require('./config/swagger');

// 创建 Express 应用
const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static(path.join(__dirname, '../public')));

// 测试数据库连接
const initializeApp = async () => {
  try {
    await testConnection();
    console.log('数据库连接成功');
    
    // 同步模型到数据库
    await syncModels();
    console.log('数据库模型同步完成');
    
    // API 路由
    app.use('/api', routes);
    
    // Swagger 文档
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerUiOptions));
    
    // 错误处理中间件
    app.use(errorHandler);
    
    // 首页路由
    app.get('/', (req, res) => {
      res.send(`
        <h1>欢迎使用图书借阅管理系统 API</h1>
        <p>API 文档: <a href="/api-docs">/api-docs</a></p>
        <p>API 基础路径: <code>/api</code></p>
      `);
    });
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`服务器运行在 http://localhost:${PORT}`);
      console.log(`API 文档: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('应用启动失败:', error);
    process.exit(1);
  }
};

// 启动应用
initializeApp();

module.exports = app;
