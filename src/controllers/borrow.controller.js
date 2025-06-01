const { BorrowRecord, Book } = require('../models');
const { Op } = require('sequelize');

// 计算应还日期（借出日期 + 30天）
const calculateDueDate = () => {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30);
  return dueDate;
};

const borrowController = {
  // 借阅书籍
  async borrowBook(req, res) {
    try {
      const { bookId } = req.params;
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ message: '用户ID不能为空' });
      }

      // 查找书籍
      const book = await Book.findByPk(bookId);
      if (!book) {
        return res.status(404).json({ message: '书籍不存在' });
      }

      // 检查库存
      if (book.quantity <= 0) {
        return res.status(400).json({ message: '该书籍库存不足' });
      }

      // 检查用户是否已经借阅了该书且未归还
      const existingBorrow = await BorrowRecord.findOne({
        where: {
          userId,
          bookId,
          status: 'borrowed',
        },
      });

      if (existingBorrow) {
        return res.status(400).json({ message: '您已经借阅了该书且尚未归还' });
      }

      // 开始事务
      const transaction = await Book.sequelize.transaction();

      try {
        // 减少库存
        book.quantity -= 1;
        await book.save({ transaction });

        // 创建借阅记录
        const borrowRecord = await BorrowRecord.create(
          {
            userId,
            bookId,
            borrowDate: new Date(),
            dueDate: calculateDueDate(),
            status: 'borrowed',
          },
          { transaction }
        );

        // 提交事务
        await transaction.commit();

        res.status(201).json({
          message: '借阅成功',
          data: borrowRecord,
        });
      } catch (error) {
        // 回滚事务
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      res.status(500).json({ message: '借阅失败', error: error.message });
    }
  },

  // 归还书籍
  async returnBook(req, res) {
    try {
      const { recordId } = req.params;

      // 查找借阅记录
      const borrowRecord = await BorrowRecord.findByPk(recordId, {
        include: [
          {
            model: Book,
            as: 'book',
          },
        ],
      });

      if (!borrowRecord) {
        return res.status(404).json({ message: '借阅记录不存在' });
      }

      if (borrowRecord.status === 'returned') {
        return res.status(400).json({ message: '该书籍已经归还' });
      }

      // 开始事务
      const transaction = await Book.sequelize.transaction();

      try {
        // 增加库存
        const book = borrowRecord.book;
        book.quantity += 1;
        await book.save({ transaction });

        // 更新借阅记录
        borrowRecord.returnDate = new Date();
        borrowRecord.status = 'returned';
        
        // 检查是否逾期
        if (borrowRecord.returnDate > borrowRecord.dueDate) {
          // 计算逾期天数
          const overdueDays = Math.ceil(
            (borrowRecord.returnDate - borrowRecord.dueDate) / (1000 * 60 * 60 * 24)
          );
          // 计算罚款（假设每天罚款1元）
          borrowRecord.fine = overdueDays * 1;
        }

        await borrowRecord.save({ transaction });

        // 提交事务
        await transaction.commit();

        res.json({
          message: '归还成功',
          data: borrowRecord,
        });
      } catch (error) {
        // 回滚事务
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      res.status(500).json({ message: '归还失败', error: error.message });
    }
  },

  // 获取用户的借阅记录
  async getUserBorrowRecords(req, res) {
    try {
      const { userId } = req.params;
      const { status, page = 1, pageSize = 10 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(pageSize);
      const limit = parseInt(pageSize);

      const where = { userId };
      
      // 根据状态筛选
      if (status) {
        where.status = status;
      }

      const { count, rows: records } = await BorrowRecord.findAndCountAll({
        where,
        include: [
          {
            model: Book,
            as: 'book',
            attributes: ['id', 'title', 'author', 'isbn', 'coverImage'],
            include: [
              {
                model: Category,
                as: 'category',
                attributes: ['id', 'name'],
              },
            ],
          },
        ],
        order: [['borrowDate', 'DESC']],
        offset,
        limit,
      });

      res.json({
        data: records,
        pagination: {
          total: count,
          page: parseInt(page),
          pageSize: limit,
          totalPages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      res.status(500).json({ message: '获取借阅记录失败', error: error.message });
    }
  },

  // 获取所有借阅记录（管理员）
  async getAllBorrowRecords(req, res) {
    try {
      const { status, userId, bookId, page = 1, pageSize = 10 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(pageSize);
      const limit = parseInt(pageSize);

      const where = {};
      
      // 根据状态筛选
      if (status) {
        where.status = status;
      }
      
      // 根据用户ID筛选
      if (userId) {
        where.userId = userId;
      }
      
      // 根据书籍ID筛选
      if (bookId) {
        where.bookId = bookId;
      }

      const { count, rows: records } = await BorrowRecord.findAndCountAll({
        where,
        include: [
          {
            model: Book,
            as: 'book',
            attributes: ['id', 'title', 'author', 'isbn'],
          },
        ],
        order: [['borrowDate', 'DESC']],
        offset,
        limit,
      });

      res.json({
        data: records,
        pagination: {
          total: count,
          page: parseInt(page),
          pageSize: limit,
          totalPages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      res.status(500).json({ message: '获取借阅记录失败', error: error.message });
    }
  },
};

module.exports = borrowController;
