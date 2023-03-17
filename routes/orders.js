const { Router } = require('express');
const Order = require('../models/order');
const router = Router();

// производим рендер страницы
router.get('/', async (req, res) => {
  res.render('orders', {
    isOrder: true,
    title: 'Orders',
  });
});

// после совершения заказа получаем - редирект
router.post('/', async (req, res) => {
  res.redirect('/orders');
});

module.exports = router;
