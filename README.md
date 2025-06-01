# 图书借阅管理系统 API

基于 Node.js + Express + Sequelize + MySQL 的图书借阅管理系统 API

![Node.js](https://img.shields.io/badge/Node.js-v16+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18.2-000000?logo=express&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-6.37.1-52B0E7?logo=sequelize&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 项目简介

这是一个基于 Node.js + Express + Sequelize + MySQL 的图书借阅管理系统 API 服务端。提供了完整的图书管理、分类管理、借阅管理等功能。

## 功能特性

- **图书管理**：添加、删除、修改、查询图书信息
- **分类管理**：图书分类的增删改查
- **借阅管理**：借书、还书、借阅记录查询
- **搜索功能**：支持按书名、作者、ISBN等条件搜索
- **分页查询**：所有列表接口支持分页
- **RESTful API**：符合 RESTful 设计规范
- **Swagger 文档**：完整的 API 文档支持

## 技术栈

- **后端**：Node.js, Express
- **数据库**：MySQL
- **ORM**：Sequelize
- **API 文档**：Swagger UI
- **包管理**：pnpm

## 快速开始

### 环境要求

- Node.js 16+
- MySQL 8.0+
- pnpm (推荐) 或 npm/yarn

### 安装依赖

```bash
# 使用 pnpm
pnpm install

# 或者使用 npm
npm install

# 或者使用 yarn
yarn install
```

### 配置环境变量

复制 `.env.example` 文件并重命名为 `.env`，然后修改数据库配置：

```env
# 数据库配置
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=library_db
DB_PORT=3306

# 应用配置
PORT=3000
NODE_ENV=development
```

### 初始化数据库

1. 创建数据库：

```sql
CREATE DATABASE IF NOT EXISTS library_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 运行数据库迁移：

```bash
# 同步数据库模型
npx sequelize-cli db:migrate

# 或者运行应用自动同步
npm run dev
```

### 启动应用

```bash
# 开发模式（使用 nodemon 自动重启）
npm run dev

# 生产模式
npm start
```

应用启动后，访问以下地址：

- API 文档：http://localhost:3000/api-docs
- API 基础路径：http://localhost:3000/api

## API 文档

项目集成了 Swagger UI，启动应用后访问 `/api-docs` 可以查看完整的 API 文档。

## 项目结构

```
src/
├── config/               # 配置文件
│   ├── database.js       # 数据库配置
│   └── swagger.js        # Swagger 配置
├── controllers/          # 控制器
│   ├── book.controller.js
│   ├── borrow.controller.js
│   └── category.controller.js
├── middlewares/          # 中间件
│   └── errorHandler.js   # 错误处理中间件
├── models/               # 数据模型
│   ├── book.model.js
│   ├── borrowRecord.model.js
│   ├── category.model.js
│   └── index.js          # 模型关联
├── routes/               # 路由
│   ├── book.routes.js
│   ├── borrow.routes.js
│   ├── category.routes.js
│   └── index.js
├── utils/                # 工具函数
└── app.js                # 应用入口文件
```

## 示例请求

### 创建分类

```http
POST /api/categories
Content-Type: application/json

{
  "name": "小说",
  "description": "小说类书籍"
}
```

### 创建图书

```http
POST /api/books
Content-Type: application/json

{
  "title": "JavaScript高级程序设计",
  "author": "Nicholas C. Zakas",
  "isbn": "9787115275790",
  "price": 99.00,
  "quantity": 10,
  "publishedDate": "2020-01-01",
  "description": "JavaScript经典教程",
  "categoryId": 1
}
```

### 借阅图书

```http
POST /api/borrow/borrow/1
Content-Type: application/json

{
  "userId": 1
}
```

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

本项目采用 [MIT](LICENSE) 许可证。

## 作者

- [liangdengwang](https://github.com/liangdengwang)

## 致谢

- 感谢所有为这个项目做出贡献的人。
