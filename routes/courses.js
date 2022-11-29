const { Router } = require("express"); //const express.Router = require("express");

// определим модель курса
const Course = require("../models/course")

const router = Router();

// можем вызывать у роутера стандартные методы типа гет пост
// будем переносить логику роутов
// метод get котор выдает нам страницу курсов
// делаем данный метод асинхронным
router.get('/', async (req, res) => {
    // создаем объект курсов, и обращаемся к методу getAll, после чего объект можно передать в страницу
    const courses = await Course.getAll();

    res.render('courses', {
        title: 'Курсы',
        isCourses: true,
        courses
    })
})

router.get('/:id', async (req, res) => {
    // используем метод модели возврата объекта по ID, и передаем в него параметр
    const course = await Course.getById(req.params.id);
    res.render('course', {
        // для того чтобы это было отдельным layout необходимо передать layout (и соотв создать его во views)
        layout: 'empty',
        title: `Course ${course.title}`,
        course
    })
})

module.exports = router;