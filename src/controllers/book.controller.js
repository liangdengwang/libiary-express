const { Book, Category } = require('../models');
const { Op } = require('sequelize');

const bookController = {
  // 创建书籍
  async createBook(req, res) {
    try {
      const {
        title,
        author,
        isbn,
        price,
        quantity,
        publishedDate,
        description,
        coverImage,
        categoryId,
      } = req.body;

      // 验证必填字段
      if (!title || !author || !price || !categoryId) {
        return res.status(400).json({ message: '缺少必填字段' });
      }

      // 检查分类是否存在
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ message: '分类不存在' });
      }

      const book = await Book.create({
        title,
        author,
        isbn,
        price,
        quantity: quantity || 0,
        publishedDate,
        description,
        coverImage,
        categoryId,
      });

      res.status(201).json({ message: '书籍创建成功', data: book });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: 'ISBN已存在' });
      }
      res.status(500).json({ message: '创建书籍失败', error: error.message });
    }
  },

  // 获取所有书籍（支持分页、搜索、排序）
  async getAllBooks(req, res) {
    try {
      const {
        page = 1,
        pageSize = 10,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
        search = '',
        minPrice,
        maxPrice,
        categoryId,
      } = req.query;

      const offset = (parseInt(page) - 1) * parseInt(pageSize);
      const limit = parseInt(pageSize);

      // 构建查询条件
      const where = {};
      
      // 搜索条件
      if (search) {
        where[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { author: { [Op.like]: `%${search}%` } },
          { isbn: { [Op.like]: `%${search}%` } },
        ];
      }

      // 价格范围
      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
        if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
      }

      // 分类筛选
      if (categoryId) {
        where.categoryId = categoryId;
      }

      const { count, rows: books } = await Book.findAndCountAll({
        where,
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name'],
          },
        ],
        order: [[sortBy, sortOrder]],
        offset,
        limit,
      });

      res.json({
        data: books,
        pagination: {
          total: count,
          page: parseInt(page),
          pageSize: limit,
          totalPages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      res.status(500).json({ message: '获取书籍列表失败', error: error.message });
    }
  },

  // 获取单个书籍
  async getBookById(req, res) {
    try {
      const { id } = req.params;
      const book = await Book.findByPk(id, {
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name'],
          },
        ],
      });

      if (!book) {
        return res.status(404).json({ message: '书籍不存在' });
      }

      res.json({ data: book });
    } catch (error) {
      res.status(500).json({ message: '获取书籍失败', error: error.message });
    }
  },

  // 更新书籍
  async updateBook(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const book = await Book.findByPk(id);
      if (!book) {
        return res.status(404).json({ message: '书籍不存在' });
      }

      // 如果更新了分类，检查新分类是否存在
      if (updates.categoryId) {
        const category = await Category.findByPk(updates.categoryId);
        if (!category) {
          return res.status(404).json({ message: '分类不存在' });
        }
      }

      // 更新书籍信息
      Object.assign(book, updates);
      await book.save();

      res.json({ message: '书籍更新成功', data: book });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: 'ISBN已存在' });
      }
      res.status(500).json({ message: '更新书籍失败', error: error.message });
    }
  },

  // 删除书籍
  async deleteBook(req, res) {
    try {
      const { id } = req.params;

      const book = await Book.findByPk(id);
      if (!book) {
        return res.status(404).json({ message: '书籍不存在' });
      }

      // 检查是否有未归还的借阅记录
      const borrowCount = await book.countBorrowRecords({
        where: { status: 'borrowed' },
      });

      if (borrowCount > 0) {
        return res.status(400).json({ message: '该书籍有未归还的借阅记录，无法删除' });
      }

      await book.destroy();
      res.json({ message: '书籍删除成功' });
    } catch (error) {
      res.status(500).json({ message: '删除书籍失败', error: error.message });
    }
  },

  // 通过分类获取书籍
  async getBooksByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const { page = 1, pageSize = 10 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(pageSize);
      const limit = parseInt(pageSize);

      // 检查分类是否存在
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ message: '分类不存在' });
      }

      const { count, rows: books } = await Book.findAndCountAll({
        where: { categoryId },
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name'],
          },
        ],
        order: [['createdAt', 'DESC']],
        offset,
        limit,
      });

      res.json({
        data: books,
        pagination: {
          total: count,
          page: parseInt(page),
          pageSize: limit,
          totalPages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      res.status(500).json({ message: '获取分类书籍失败', error: error.message });
    }
  },
};

module.exports = bookController;
