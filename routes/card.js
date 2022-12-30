//получим объект роутера
const { Router } = require('express');
//создадим роутер
const router = Router();
// подключим модель корзины и курсов
const Card = require('../models/card');
const Course = require('../models/course');

//добавим пост запрос
// метод /add мы принимаем в объекте req.body.id
router.post('/add', async (req, res) => {
  // для начала необходимо получить объект req.body.id
  const course = await Course.getById(req.body.id);
  // теперь необходимо обратиться к модели корзины и вызвать метод add в который передадим курс
  await Card.add(course);
  //   далее редирект на страницу корзины
  res.redirect('/card');
});

// обработчик метода delete
router.delete('/remove/:id', async (req, res) => {
  // получение карты
  const card = await Card.remove(req.params.id);
  // отправка карты со статусом 200
  res.status(200).json(card);
});

// добавим обработчик метода get
router.get('/', async (req, res) => {
  // получаем объект Card
  const card = await Card.fetch();
  // вызываем рендер
  res.render('card', {
    title: 'Cart',
    isCard: true,
    courses: card.courses,
    price: card.price,
  });
});

module.exports = router;
