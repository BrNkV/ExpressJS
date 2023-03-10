//получим объект роутера
const { Router } = require('express');
//создадим роутер
const router = Router();
// подключим модель корзины и курсов
// const Card = require('../models/card'); - модель удалена
const Course = require('../models/course');

// хэлпер маппер
function mapCartItems(cart) {
  // возвращаем объект
  return cart.items.map((c) => ({
    ...c.courseId._doc,
    count: c.count,
  }));
}

// хэлпер расчет цены
function computePrice(courses) {
  return courses.reduce((total, course) => {
    return (total += course.price * course.count);
  }, 0);
}

//добавим пост запрос
// метод /add мы принимаем в объекте req.body.id
router.post('/add', async (req, res) => {
  // для начала необходимо получить объект req.body.id
  // const course = await Course.getById(req.body.id);
  const course = await Course.findById(req.body.id);
  // теперь необходимо обратиться к модели корзины и вызвать метод add в который передадим курс
  // await Card.add(course); - удаляем / будем работать с пользователем

  //вызываем новый метод добавления в корзину
  await req.user.addToCart(course);

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
  /* старая версия
  получаем объект Card
  const card = await Card.fetch();
  вызываем рендер
  res.render('card', {
    title: 'Cart',
    isCard: true,
    courses: card.courses,
    price: card.price,
  });
  res.json({test: true}); //временно
  */

  // для начала необходимо создать переменную user
  // задача получить корзину (на данный момент проще получить ее из пользователя)
  // так же необходимо за популэйтить данные содержимое всего курса
  const user = await req.user.populate(['cart.items.courseId']);
  // console.log(user.cart.items);

  // маппинг курсов
  const courses = mapCartItems(user.cart);

  res.render('card', {
    title: 'Cart',
    isCard: true,
    // передаем на фронт уже готовый массив курсов
    courses: courses,
    price: computePrice(courses),
  });
});

module.exports = router;
