// описание модели user в mongoose

const { Schema, model } = require('mongoose');

// Schema пользователя
// Создается новый экземпляр схемы для пользователя
const userSchema = new Schema({
  email: { type: String, required: true }, // Добавляется свойство тип String, указывается, что оно обязательно.  // Добавляется свойство password, тип String, указывается, что оно обязательно.
  name: { type: String, required: true },
  // password: { type: String, required: true }
  cart: {
    items: [
      {
        count: { type: Number, required: true, default: 1 },
        courseId: {
          type: Schema.Types.ObjectId,
          // референс - связка с таблицей курсов
          //должно совпадать с моделью курсов  model('Course', course);
          ref: 'Course',
          required: true,
        },
      },
    ],
  },
});

// регистрируем модель 'User' с 'userSchema'
module.exports = model('User', userSchema);

// const User = mongoose.model('User', userSchema);
// module.exports = User;
