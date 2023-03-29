const { Router } = require('express');
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
  // обращаемся к сессии
  // теперь в ней хранится true только в случае если мы залогинились в системе
  req.session.isAuthenticated = true;
  res.redirect('/');
});

module.exports = router;
