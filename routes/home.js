const { Router } = require('express'); //const express.Router = require("express");
const router = Router();

// можем вызывать у роутера стандартные методы типа гет пост
// будем переносить логику роутов с главной страницы
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Главная страница',
    isHome: true,
  });
});

// делаем обязательно экспорт модуля
module.exports = router;
