const { Router } = require('express'); //const express.Router = require("express");

// определим модель курса
const Course = require('../models/course');

const router = Router();

// можем вызывать у роутера стандартные методы типа гет пост
// будем переносить логику роутов
// метод get котор выдает нам страницу курсов
// делаем данный метод асинхронным
router.get('/', async (req, res) => {
  // создаем объект курсов, и обращаемся к методу getAll, после чего объект можно передать в страницу
  // const courses = await Course.getAll();

  // если оставляем без параметров то обозначает что забираем абсолютно все курсы из БД
  const courses = await Course.find();

  res.render('courses', {
    title: 'Курсы',
    isCourses: true,
    courses,
  });
});

// метод редактирования курса работает по номеру ID и роуту edit
router.get('/:id/edit', async (req, res) => {
  // проверять будем следующее:
  //  у нас будет некоторый query параметр котор будет отвечать за то что мы можем редактировать курс, иначе редирект на главную стр
  if (!req.query.allow) {
    return res.redirect('/'); //обязательно делаем return для остановки выполнения функции
  }

  // меняем данный метод получения по id
  // const course = await Course.getById(req.params.id);
  // на
  const course = await Course.findById(req.params.id);

  res.render('course-edit', {
    title: `Edit ${course.title}`,
    course,
  });
});

router.post('/edit', async (req, res) => {
  // отдельная переменная для id, сделаем для удобства
  const { id } = req.body;
  delete req.body.id;

  // в объекте req есть все необходимые данные в body которые нам нужно обновить у модели курсов
  // для обновления данных исп метод .update()
  // await Course.update(req.body);
  // await Course.findByIdAndUpdate(req.body.id, req.body);
  await Course.findByIdAndUpdate(id, req.body);
  // далее после того как асинхронная операция будет выполнена, делаем редирект на страницу курсов
  res.redirect('/courses');
});

router.get('/:id', async (req, res) => {
  // используем метод модели возврата объекта по ID, и передаем в него параметр
  // const course = await Course.getById(req.params.id);
  const course = await Course.findById(req.params.id);
  res.render('course', {
    // для того чтобы это было отдельным layout необходимо передать layout (и соотв создать его во views)
    layout: 'empty',
    title: `Course ${course.title}`,
    course,
  });
});

module.exports = router;
