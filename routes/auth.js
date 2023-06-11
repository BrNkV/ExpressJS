const { Router } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = Router();
const flash = require('connect-flash');

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Auth',
    isLogin: true,
    loginError: req.flash('loginError'),
    registerError: req.flash('registerError'),
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
      // передаем пароль и пароль котор сохранен в БД
      const areSame = await bcrypt.compare(password, candidate.password);

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
        //ошибка если пароль не совпал
        req.flash('loginError', 'Wrong password');

        res.redirect('/auth/login#login');
      }
    } else {
      //ошибка если пользователь не найден
      req.flash('loginError', 'User is not found');

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

    // если есть то редирект
    if (candidate) {
      //передаем ключ сообщения 'error', и сообщение 'text'
      req.flash('registerError', 'User with this email already exists');
      res.redirect('/auth/login#register');
    } else {
      //шифрование пароля
      // передаем пароль и рандомную строку для усложнения шифрования(чем больше тем лучше и тем дольше... оптимально 10-12)
      // возвращает промис (нужен await)
      const hashPassword = await bcrypt.hash(password, 10);
      // иначе создаем такого пользователя
      const user = new User({
        email,
        name,
        password: hashPassword,
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
