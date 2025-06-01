const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

// Swagger 配置选项
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '图书借阅管理系统 API',
      version: '1.0.0',
      description: '一个基于 Node.js + Express + Sequelize + MySQL 的图书借阅管理系统 API',
      contact: {
        name: '技术支持',
        url: 'https://example.com/support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: '开发环境',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Category: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: '小说' },
            description: { type: 'string', example: '小说类书籍' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Book: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'JavaScript高级程序设计' },
            author: { type: 'string', example: 'Nicholas C. Zakas' },
            isbn: { type: 'string', example: '9787115275790' },
            price: { type: 'number', format: 'float', example: 99.00 },
            quantity: { type: 'integer', example: 10 },
            publishedDate: { type: 'string', format: 'date', example: '2020-01-01' },
            description: { type: 'string', example: 'JavaScript经典教程' },
            coverImage: { type: 'string', example: 'https://example.com/cover.jpg' },
            categoryId: { type: 'integer', example: 1 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        BorrowRecord: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            userId: { type: 'integer', example: 1 },
            bookId: { type: 'integer', example: 1 },
            borrowDate: { type: 'string', format: 'date-time' },
            dueDate: { type: 'string', format: 'date-time' },
            returnDate: { type: 'string', format: 'date-time', nullable: true },
            status: { 
              type: 'string', 
              enum: ['borrowed', 'returned', 'overdue'],
              example: 'borrowed' 
            },
            fine: { type: 'number', format: 'float', example: 0.00 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string', example: '错误信息' },
            errors: { 
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'fieldName' },
                  message: { type: 'string', example: '错误信息' },
                },
              },
            },
          },
        },
      },
    },
  },
  // 指定包含 API 文档的文件夹
  apis: [
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../models/*.js'),
  ],
};

const specs = swaggerJsdoc(options);

// Swagger UI 配置
const swaggerUiOptions = {
  explorer: true,
  customSiteTitle: '图书借阅管理系统 API 文档',
  customCss: '.swagger-ui .topbar { display: none }',
  customfavIcon: 'https://example.com/favicon.ico',
};

module.exports = { specs, swaggerUi, swaggerUiOptions };
