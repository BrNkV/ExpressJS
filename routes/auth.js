const { Router } = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const User = require('../models/user');
const router = Router();
const flash = require('connect-flash');
const keys = require('../keys');
const regEmail = require('../emails/registration');
const resetEmail = require('../emails/reset');
const { registerValidators } = require('../utils/validators');

const transporter = nodemailer.createTransport({
  host: 'smtp.msndr.net',
  port: 25,
  secure: false,
  auth: {
    user: keys.NOTISEND_LOG,
    pass: keys.NOTISEND_PASS,
  },
});

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
router.post('/register', registerValidators, async (req, res) => {
  try {
    // создание пользователя на основе данных переданных из формы
    const { email, password, /*confirm больше не нужен*/ name } = req.body;

    // проверяем есть ли пользователь с таким email - если да - ошибка
    // const candidate = await User.findOne({ email }); - больше не нужен т.к. добавлен отдельный валидатор

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //передаем ключ сообщения 'error', и сообщение 'text'
      req.flash('registerError', errors.array()[0].msg);
      // если есть ошибки то редирект на стр регистрации
      return res.status(422).redirect('/auth/login#register');
    }

    // если есть то редирект
    // if (candidate) { - так же убираем данную проверку из-за отдельного валидатора
    //   //передаем ключ сообщения 'error', и сообщение 'text'
    //   req.flash('registerError', 'User with this email already exists');
    //   res.redirect('/auth/login#register');
    // } else {
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
      // отправка письма пользователю о регистрации
      await transporter.sendMail(regEmail(email));
    // }
  } catch (e) {
    console.log(e);
  }
});

// get роут на страницу reset
router.get('/reset', (req, res) => {
  res.render('auth/reset', {
    title: 'Reset password',
    error: req.flash('error'),
  });
});

// get роут на страницу password восстановление пароля (так же добавим параметров для повышения безопасности)
router.get('/password/:token', async (req, res) => {
  if (!req.params.token) {
    return res.redirect('/auth/login');
  }
  try {
    // ищем пользователя по токену и времени жизни токена
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExp: { $gt: Date.now() }, // если токен истек то вернет null
    });

    if (!user) {
      return res.redirect('/auth/login');
    } else {
      res.render('auth/password', {
        title: 'Recovery password',
        error: req.flash('error'),
        userId: user._id.toString(),
        token: req.params.token,
      });
    }
  } catch (e) {
    console.log(e);
  }
});

// post роут на страницу reset
router.post('/reset', (req, res) => {
  try {
    //генерируем рандомный ключ с помощью crypto
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash('error', 'Something went wrong, try again');
        return res.redirect('/auth/reset');
      }

      const token = buffer.toString('hex');
      const candidate = await User.findOne({ email: req.body.email });

      // если пользователь найден то отправим письмо с токеном для сброса пароля
      if (candidate) {
        //необходимо в базу поместить 2 значения - токен и время жизни токена
        candidate.resetToken = token;
        candidate.resetTokenExp = Date.now() + 60 * 60 * 1000; // 1 час
        await candidate.save(); // дожидаемся сохранения
        // отправка письма
        await transporter.sendMail(resetEmail(candidate.email, token));
        res.redirect('/auth/login'); // редирект на стр логина и очистка формы для сброса пароля
      } else {
        req.flash('error', 'Email not found');
        res.redirect('/auth/reset');
      }
    });
  } catch (e) {
    console.log(e);
  }
});

router.post('/password', async (req, res) => {
  try {
    //обрабатываем новую форму с паролем
    //сначала проверяем пользователя на наличие всех необходимых данных, токены и userId
    const user = await User.findOne({
      _id: req.body.userId,
      resetToken: req.body.token,
      resetTokenExp: { $gt: Date.now() },
    });

    //если все совпало - создадим новый пароль и сохраним иначе редирект на стр авторизации
    if (user) {
      //шифруем новый пароль
      user.password = await bcrypt.hash(req.body.password, 10);
      //очищаем токены
      user.resetToken = undefined;
      user.resetTokenExp = undefined;
      await user.save();
      res.redirect('/auth/login'); // редирект на стр логина и очистка формы для сброса пароля
    } else {
      req.flash('Login error', 'Token is died');
      res.redirect('/auth/login');
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
