const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');

/**
 * @swagger
 * tags:
 *   name: 书籍管理
 *   description: 图书管理相关接口
 */

/**
 * @swagger
 * /books:
 *   post:
 *     summary: 创建书籍
 *     tags: [书籍管理]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - price
 *               - categoryId
 *             properties:
 *               title:
 *                 type: string
 *                 description: 书籍标题
 *               author:
 *                 type: string
 *                 description: 作者
 *               isbn:
 *                 type: string
 *                 description: ISBN号
 *               price:
 *                 type: number
 *                 format: float
 *                 description: 价格
 *               quantity:
 *                 type: integer
 *                 description: 库存数量
 *               publishedDate:
 *                 type: string
 *                 format: date
 *                 description: 出版日期
 *               description:
 *                 type: string
 *                 description: 书籍描述
 *               coverImage:
 *                 type: string
 *                 description: 封面图片URL
 *               categoryId:
 *                 type: integer
 *                 description: 分类ID
 *     responses:
 *       201:
 *         description: 书籍创建成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       400:
 *         description: 请求参数错误
 */
router.post('/', bookController.createBook);

/**
 * @swagger
 * /books:
 *   get:
 *     summary: 获取所有书籍（支持分页、搜索、排序）
 *     tags: [书籍管理]
 *     parameters:
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
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: 排序字段，默认为createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: 排序顺序，默认为DESC
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 搜索关键词（标题、作者、ISBN）
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           format: float
 *         description: 最低价格
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           format: float
 *         description: 最高价格
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: 分类ID
 *     responses:
 *       200:
 *         description: 书籍列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
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
router.get('/', bookController.getAllBooks);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: 获取单个书籍
 *     tags: [书籍管理]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 书籍ID
 *     responses:
 *       200:
 *         description: 书籍详情
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       404:
 *         description: 书籍不存在
 */
router.get('/:id', bookController.getBookById);

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: 更新书籍
 *     tags: [书籍管理]
 *     parameters:
 *       - in: path
 *         name: id
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
 *             properties:
 *               title:
 *                 type: string
 *                 description: 书籍标题
 *               author:
 *                 type: string
 *                 description: 作者
 *               isbn:
 *                 type: string
 *                 description: ISBN号
 *               price:
 *                 type: number
 *                 format: float
 *                 description: 价格
 *               quantity:
 *                 type: integer
 *                 description: 库存数量
 *               publishedDate:
 *                 type: string
 *                 format: date
 *                 description: 出版日期
 *               description:
 *                 type: string
 *                 description: 书籍描述
 *               coverImage:
 *                 type: string
 *                 description: 封面图片URL
 *               categoryId:
 *                 type: integer
 *                 description: 分类ID
 *     responses:
 *       200:
 *         description: 书籍更新成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       400:
 *         description: 请求参数错误
 *       404:
 *         description: 书籍不存在
 */
router.put('/:id', bookController.updateBook);

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: 删除书籍
 *     tags: [书籍管理]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 书籍ID
 *     responses:
 *       200:
 *         description: 书籍删除成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: 该书籍有未归还的借阅记录，无法删除
 *       404:
 *         description: 书籍不存在
 */
router.delete('/:id', bookController.deleteBook);

/**
 * @swagger
 * /books/category/{categoryId}:
 *   get:
 *     summary: 获取分类下的所有书籍
 *     tags: [书籍管理]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 分类ID
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
 *         description: 分类下的书籍列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
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
 *       404:
 *         description: 分类不存在
 */
router.get('/category/:categoryId', bookController.getBooksByCategory);

module.exports = router;
