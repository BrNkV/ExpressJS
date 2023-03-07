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

// можем определить метод для вынесения логики (обязательное использование слова function т.к. работает с this)
userSchema.methods.addToCart = function (course) {
  // логика добавления курса в корзину
  // в случае если курс уже в корзине, то необходимо увеличивать кол-во (поле count)
  // чтобы не мутировать массив обратимся к нему через this и склонируем при помощи concat или спред оператором
  const clonedItems = [...this.cart.items]; //copy
  // найдем в массиве данный курс который нам необходим
  const idx = clonedItems.findIndex((c) => {
    // Для сравнивания необходим перевод объекта в строку т.к. тип Schema.Types.ObjectId
    // сравниваем с переданным курсом
    return c.courseId.toString() === course._id.toString();
  });
  // если курс нашелся увеличим кол-во, если курса нет, добавим в корзину
  // в корзине уже есть такой курс, увеличим кол-во
  if (idx >= 0) {
    clonedItems[idx].count = clonedItems[idx].count + 1;
  } // нет в корзине
  else {
    clonedItems.push({
      courseId: course._id,
      count: 1,
    });
  }

  // написано для понятности в подробном виде
  // this.cart = {items: clonedItems}
  const newCart = { items: clonedItems };
  this.cart = newCart;

  // необходимо вернуть метод сохранения
  return this.save();
};

// регистрируем модель 'User' с 'userSchema'
module.exports = model('User', userSchema);

// const User = mongoose.model('User', userSchema);
// module.exports = User;
