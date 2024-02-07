const { Router } = require('express'); //const express.Router = require("express");
const { validationResult } = require('express-validator');
const router = Router();
// подк модели сохранения
const Course = require('../models/course');
const auth = require('../middleware/auth');
const { courseValidators } = require('../utils/validators');

// можем вызывать у роутера стандартные методы типа гет пост
// будем переносить логику роутов
router.get('/', auth, (req, res) => {
  res.render('add', {
    title: 'Добавить курс',
    isAdd: true,
  });
});

router.post('/', auth, courseValidators, async (req, res) => {
  // console.log(req.body);
  //получим в консоль { title: '1', price: '2', img: '3' }
  // для того чтобы не хранить тут эти данные, мы напишем модель Course которая их обработает
  //создадим переменную котор будет результатом конструктора new Course
  // const course = new Course(req.body.title, req.body.price, req.body.img);

  // делаем во второй раз, уже с использованием mongo
  // в отличии от прошлого создания мы передаем в него объект конфигурации, с описанием полей указанных в Schema
  /**
   * {
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  img: String,
}
   */

  // проверка ошибок
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('add', {
      title: 'Добавить курс',
      isAdd: true,
      error: errors.array()[0].msg,
      data: {
        title: req.body.title,
        price: req.body.price,
        img: req.body.img, // добавили для отображения данных в форме если ошибка есть
      },
    });
  }

  const course = new Course({
    title: req.body.title,
    price: req.body.price,
    img: req.body.img,
    userId: req.user,
  });

  // обработка потенциальных ошибок
  try {
    // после создания, вызовем у курса метод save()
    // возвращает промис, поэтому мы можем его подождать await
    await course.save();

    // редирект на страницу курсов если отсутствует ошибка
    res.redirect('/courses');
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
