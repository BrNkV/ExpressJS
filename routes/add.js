const { Router } = require('express'); //const express.Router = require("express");
const router = Router();
// подк модели сохранения
const Course = require('../models/course');

// можем вызывать у роутера стандартные методы типа гет пост
// будем переносить логику роутов
router.get('/', (req, res) => {
  res.render('add', {
    title: 'Добавить курс',
    isAdd: true,
  });
});

router.post('/', async (req, res) => {
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
  const course = new Course({
    title: req.body.title,
    price: req.body.price,
    img: req.body.img,
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
