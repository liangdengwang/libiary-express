const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrow.controller');

/**
 * @swagger
 * tags:
 *   name: 借阅管理
 *   description: 图书借阅相关接口
 */

/**
 * @swagger
 * /borrow/borrow/{bookId}:
 *   post:
 *     summary: 借阅书籍
 *     tags: [借阅管理]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 书籍ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: 用户ID
 *     responses:
 *       201:
 *         description: 借阅成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/BorrowRecord'
 *       400:
 *         description: 请求参数错误或库存不足
 *       404:
 *         description: 书籍不存在
 */
router.post('/borrow/:bookId', borrowController.borrowBook);

/**
 * @swagger
 * /borrow/return/{recordId}:
 *   post:
 *     summary: 归还书籍
 *     tags: [借阅管理]
 *     parameters:
 *       - in: path
 *         name: recordId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 借阅记录ID
 *     responses:
 *       200:
 *         description: 归还成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/BorrowRecord'
 *       400:
 *         description: 该书籍已经归还
 *       404:
 *         description: 借阅记录不存在
 */
router.post('/return/:recordId', borrowController.returnBook);

/**
 * @swagger
 * /borrow/user/{userId}:
 *   get:
 *     summary: 获取用户的借阅记录
 *     tags: [借阅管理]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 用户ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [borrowed, returned, overdue]
 *         description: 借阅状态
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: 页码，默认为1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: 每页数量，默认为10
 *     responses:
 *       200:
 *         description: 借阅记录列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BorrowRecord'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */
router.get('/user/:userId', borrowController.getUserBorrowRecords);

/**
 * @swagger
 * /borrow:
 *   get:
 *     summary: 获取所有借阅记录（管理员）
 *     tags: [借阅管理]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [borrowed, returned, overdue]
 *         description: 借阅状态
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: 用户ID
 *       - in: query
 *         name: bookId
 *         schema:
 *           type: integer
 *         description: 书籍ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: 页码，默认为1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: 每页数量，默认为10
 *     responses:
 *       200:
 *         description: 借阅记录列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BorrowRecord'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */
router.get('/', borrowController.getAllBorrowRecords);

module.exports = router;
