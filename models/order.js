const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
  // передаем те поля которые будут присутствовать у каждого из заказов
  // какие курсы куплены + дата заказа
  // какой пользователь сделал заказ

  // массив курсов
  courses: [
    {
      course: {
        type: Object,
        required: true,
      },
      count: {
        type: Number,
        required: true,
      },
    },
  ],

  // пользователь совершивший заказ
  user: {
    name: String,
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },

  // дата заказа
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('Order', orderSchema);
