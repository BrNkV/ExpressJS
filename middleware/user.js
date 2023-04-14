const User = require('../models/user');

module.exports = async function (req, res, next) {
  // проверка наличия юзера в сессии
  // если нет
  if (!req.session.user) {
    return next();
  }
  //если есть
  req.user = await User.findById(req.session.user._id);
  next();
};
