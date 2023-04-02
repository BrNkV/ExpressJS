const { Router } = require('express');
const User = require('../models/user');
const router = Router();

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Auth',
    isLogin: true,
  });
});

router.get('/logout', async (req, res) => {
  // очистка определенной сессии и редирект на стр логина

  // очистка 1
  // req.session.isAuthenticated = false

  // очистка 2 - более правильно / destroy - очистит данные /передается коллбэк котор вызовется после полной очистки данных
  req.session.destroy(() => {
    res.redirect('/auth/login#login');
  });
});

router.post('/login', async (req, res) => {
  // временно добавляем ожидание определенного пользователя
  const user = await User.findById('63fa078b651b8d302d12236c');
  // в сессии будем добавлять нужного нам пользователя (есть вероятность что рендер произойдет раньше, и тогда будут ошибки)
  req.session.user = user;
  // для решения проблемы использовать будем метод экспресса save()

  // обращаемся к сессии
  // теперь в ней хранится true только в случае если мы залогинились в системе
  req.session.isAuthenticated = true;

  req.session.save((err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

module.exports = router;
