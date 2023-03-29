//будем добавлять разные параметры ко всем ответам нашего сервера

module.exports = function (req, res, next) {
    // будем добавлять собственную переменную значение которой будем получать из req.session.isAuthenticated
  res.locals.isAuth = req.session.isAuthenticated;

  next();
};
