const { Router } = require('express'); //const express.Router = require("express");

// определим модель курса
const Course = require('../models/course');

const auth = require('../middleware/auth');
const { courseValidators } = require('../utils/validators');
const { validationResult } = require('express-validator');
const router = Router();

// вынесем проверку пользователя в отдельную ф-цию
function isOwner(course, req) {
  // если юзер который редактирует курс не равен юзеру который залогинился
  // то запрет на редактирование
  return course.userId.toString() === req.user._id.toString();
}

// можем вызывать у роутера стандартные методы типа гет пост
// будем переносить логику роутов
// метод get котор выдает нам страницу курсов
// делаем данный метод асинхронным
router.get('/', async (req, res) => {
  try {
    // создаем объект курсов, и обращаемся к методу getAll, после чего объект можно передать в страницу
    // const courses = await Course.getAll();

    // если оставляем без параметров то обозначает что забираем абсолютно все курсы из БД
    // const courses = await Course.find();
    // console.log(courses);
    // необходимо указать какое поле будем популэйтить, а так же какие поля достать, и в select выбрать какие внутри поля будем фильтровать и получать только необходимые
    const courses = await Course.find()
      .populate('userId', 'email name')
      .select('price title img');
    console.log(courses);

    res.render('courses', {
      title: 'Курсы',
      isCourses: true,
      userId: req.user ? req.user._id.toString() : null, // если есть юзер то выводим его id, если нет то null
      courses,
    });
  } catch (e) {
    console.log(e);
  }
});

// метод редактирования курса работает по номеру ID и роуту edit
router.get('/:id/edit', auth, async (req, res) => {
  // проверять будем следующее:
  //  у нас будет некоторый query параметр котор будет отвечать за то что мы можем редактировать курс, иначе редирект на главную стр
  if (!req.query.allow) {
    return res.redirect('/'); //обязательно делаем return для остановки выполнения функции
  }

  try {
    // меняем данный метод получения по id
    // const course = await Course.getById(req.params.id);
    // на
    const course = await Course.findById(req.params.id);

    if (!isOwner(course, req)) {
      // если юзер который редактирует курс не равен юзеру который залогинился
      // то запрет на редактирование
      return res.redirect('/courses');
    }

    res.render('course-edit', {
      title: `Edit ${course.title}`,
      course,
    });
  } catch (e) {
    console.log(e);
  }
});

router.post('/edit', auth, courseValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).redirect(`/courses/${req.body.id}/edit?allow=true`);
  }

  try {
    // отдельная переменная для id, сделаем для удобства
    const { id } = req.body;
    delete req.body.id;

    //получим доступ к курсу по id
    const course = await Course.findById(id);
    if (!isOwner(course, req)) {
      return res.redirect('/courses');
    }

    // в объекте req есть все необходимые данные в body которые нам нужно обновить у модели курсов
    // для обновления данных исп метод .update()
    // await Course.update(req.body);
    // await Course.findByIdAndUpdate(req.body.id, req.body);
    // await Course.findByIdAndUpdate(id, req.body);
    // далее после того как асинхронная операция будет выполнена, делаем редирект на страницу курсов

    Object.assign(course, req.body);
    await course.save(); // для того чтобы обновленные данные сохранились в БД нужно использовать метод саве
    res.redirect('/courses');
  } catch (e) {
    console.log(e);
  }
});

// обработчик метода прилетающего с клиента post - remove
router.post('/remove', auth, async (req, res) => {
  // логика удаления курса, обратимся к модели Курса и вызовем метод удаления
  try {
    // принимает в себя условия какой курс требуется удалить
    await Course.deleteOne({
      _id: req.body.id,
      userId: req.user._id, // проверка на то что удалять может только определенный юзер
    });
    res.redirect('/courses');
  } catch (error) {
    console.log(error);
  }
});

router.get('/:id', async (req, res) => {
  try {
    // используем метод модели возврата объекта по ID, и передаем в него параметр
    // const course = await Course.getById(req.params.id);
    const course = await Course.findById(req.params.id);
    res.render('course', {
      // для того чтобы это было отдельным layout необходимо передать layout (и соотв создать его во views)
      layout: 'empty',
      title: `Course ${course.title}`,
      course,
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
