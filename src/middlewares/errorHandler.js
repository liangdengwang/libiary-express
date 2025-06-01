const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // 处理 Sequelize 验证错误
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors.map(error => ({
      field: error.path,
      message: error.message,
    }));
    
    return res.status(400).json({
      message: '验证失败',
      errors,
    });
  }
  
  // 处理 JSON 解析错误
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      message: '无效的 JSON 数据',
    });
  }
  
  // 默认错误处理
  res.status(500).json({
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'production' ? {} : err.message,
  });
};

module.exports = errorHandler;
