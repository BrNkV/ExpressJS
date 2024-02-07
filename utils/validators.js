const { body } = require('express-validator');
const User = require('../models/user');

// проверка полей регистрации
exports.registerValidators = [
  body('email')
    .isEmail()
    .withMessage('Введите корректный email')
    .custom(async (value, { req }) => {
      // добавлен кастомный валидатор
      // если такой email уже есть в базе то выводим ошибку (нужно импортировать модель пользователя)
      try {
        const user = await User.findOne({ email: value });
        // если пользователь существует то выводим ошибку и останавливаем валидацию
        if (user) {
          return Promise.reject('Такой email уже занят');
        }
      } catch (e) {
        console.log(e);
      }
    })
    // normalizeEmail - исправит кривой емэил
    .normalizeEmail(),
  body('password', 'Пароль должен быть минимум 6 символов')
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric()
    // удалит лишние пробелы из конца и начала строки
    .trim(),
  body('confirm')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Пароли должны совпадать');
      }
      return true;
    })
    .trim(),
  body('name')
    .isLength({ min: 3 })
    .withMessage('Имя должно быть минимум 3 символа')
    .trim(),
];

// валидатор для формы add в курсах
exports.courseValidators = [
  body('title')
    .isLength({ min: 3 })
    .withMessage('Минимальная длина названия 3 символа')
    .trim(),
  body('price').isNumeric().withMessage('Введите корректную цену'),
  body('img', 'Введите корректный URL картинки').isURL(),
];
