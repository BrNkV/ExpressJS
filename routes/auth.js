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
  try {
    // получим email и password
    const { email, password } = req.body;

    // проверяем наличие пользователя
    // ищем пользователя с таким email
    const candidate = await User.findOne({ email });
    // если пользователя нашло (работаем с ним) иначе редирект
    if (candidate) {
      // проверка пароля на совпадение
      // временная проверка
      const areSame = password === candidate.password;

      // если пароль совпал редирект на стр пользователя иначе ошибка и редирект на стр логина
      if (areSame) {
        // в сессии будем добавлять нужного нам пользователя (есть вероятность что рендер произойдет раньше, и тогда будут ошибки)
        req.session.user = candidate;
        // для решения проблемы использовать будем метод экспресса save()

        // обращаемся к сессии
        // теперь в ней хранится true только в случае если мы залогинились в системе
        req.session.isAuthenticated = true;

        req.session.save((err) => {
          if (err) throw err;
          res.redirect('/');
        });
      } else {
        res.redirect('/auth/login#login');
      }
    } else {
      res.redirect('/auth/login#login');
    }
  } catch (e) {
    console.log(e);
  }
});

// роут регистрации пользователя
router.post('/register', async (req, res) => {
  try {
    // создание пользователя на основе данных переданных из формы
    const { email, password, repeat, name } = req.body;

    // проверяем есть ли пользователь с таким email - если да - ошибка
    const candidate = await User.findOne({ email });

    // если есть то редирект (далее добавим вывод ошибки)
    if (candidate) {
      res.redirect('/auth/login#register');
    } else {
      // иначе создаем такого пользователя
      const user = new User({
        email,
        name,
        password,
        cart: { items: [] },
      });
      // ждем сохранение пользователя
      await user.save();
      // после сохранения редирект
      res.redirect('/auth/login#login');
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
