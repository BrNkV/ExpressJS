module.exports = function (req, res, next) {
  // проверяем авторизацию, если нет то редирект
  if (!req.session.isAuthenticated) {
    return res.redirect('/auth/login');
  }

  next();
};
