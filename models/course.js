const { Schema, model } = require('mongoose');

// создадим схему с базовыми полями (поле id генерится самостоятельно)
const course = new Schema({
  // описание полей курса и их обозначения (можно делать описание в виде объекта)
  title: {
    // тип
    type: String,
    // обязательно к внесению
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  img: String,
  // у каждого курса есть userId (id создателя этого курса, а у каждого пользователя есть cart c сылкой на courseId (связка в БД))
  userId: {
    type: Schema.Types.ObjectId,
    // напоминание ref должна совпадать с названием модели
    ref:'User',
  },
});

//экспорт модели
module.exports = model('Course', course);
