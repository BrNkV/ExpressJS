const { Router } = require('express');
const Order = require('../models/order');
const auth = require('../middleware/auth');
const router = Router();

// производим рендер страницы
router.get('/', auth, async (req, res) => {
  try {
    // необходимо получить весь список заказов котор относятся к данному пользователю по id
    const orders = await Order.find({
      'user.userId': req.user._id,
    }).populate(['user.userId']);

    res.render('orders', {
      isOrder: true,
      title: 'Orders',
      // сформируем заказы для передачи на фронтенд, тут же их будем трансформировать
      orders: orders.map((o) => {
        return {
          // разворачиваем каждый заказ
          ...o._doc,
          // считаем цену всего заказ через reduce
          price: o.courses.reduce((total, c) => {
            return (total += c.count * c.course.price);
          }, 0),
        };
      }),
    });
  } catch (e) {
    console.log(e);
  }
});

// после совершения заказа получаем - редирект
router.post('/', auth, async (req, res) => {
  try {
    //для начала заказа необходимо получить все что есть в корзине
    const user = await req.user.populate(['cart.items.courseId']); // получаем наполненный объект с курсами

    // получаем читаемый формат курсов
    const courses = user.cart.items.map((i) => ({
      count: i.count,
      course: { ...i.courseId._doc },
    }));

    // объект заказа
    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },
      courses: courses,
    });

    // ожидаем создание заказа
    await order.save();
    // очищаем корзину после заказа
    await req.user.clearCart(); // метод создадим в моделях

    res.redirect('/orders');
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
