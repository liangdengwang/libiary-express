const { Category } = require('../models');

const categoryController = {
  // 创建分类
  async createCategory(req, res) {
    try {
      const { name, description } = req.body;
      
      if (!name) {
        return res.status(400).json({ message: '分类名称不能为空' });
      }
      
      const category = await Category.create({ name, description });
      res.status(201).json({ message: '分类创建成功', data: category });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: '分类名称已存在' });
      }
      res.status(500).json({ message: '服务器错误', error: error.message });
    }
  },

  // 获取所有分类
  async getAllCategories(req, res) {
    try {
      const categories = await Category.findAll({
        order: [['createdAt', 'DESC']],
      });
      res.json({ data: categories });
    } catch (error) {
      res.status(500).json({ message: '获取分类列表失败', error: error.message });
    }
  },

  // 获取单个分类
  async getCategoryById(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id);
      
      if (!category) {
        return res.status(404).json({ message: '分类不存在' });
      }
      
      res.json({ data: category });
    } catch (error) {
      res.status(500).json({ message: '获取分类失败', error: error.message });
    }
  },

  // 更新分类
  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      
      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({ message: '分类不存在' });
      }
      
      category.name = name || category.name;
      category.description = description !== undefined ? description : category.description;
      
      await category.save();
      
      res.json({ message: '分类更新成功', data: category });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: '分类名称已存在' });
      }
      res.status(500).json({ message: '更新分类失败', error: error.message });
    }
  },

  // 删除分类
  async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      
      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({ message: '分类不存在' });
      }
      
      // 检查分类下是否有书籍
      const bookCount = await category.countBooks();
      if (bookCount > 0) {
        return res.status(400).json({ message: '该分类下有书籍，无法删除' });
      }
      
      await category.destroy();
      res.json({ message: '分类删除成功' });
    } catch (error) {
      res.status(500).json({ message: '删除分类失败', error: error.message });
    }
  },
};

module.exports = categoryController;
