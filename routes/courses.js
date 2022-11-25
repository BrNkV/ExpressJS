const { Router } = require("express"); //const express.Router = require("express");
const router = Router();

// можем вызывать у роутера стандартные методы типа гет пост
// будем переносить логику роутов
router.get('/', (req, res) => {
    res.render('courses', {
        title: 'Курсы',
        isCourses: true
    })
})

module.exports = router;