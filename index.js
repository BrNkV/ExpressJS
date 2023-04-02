const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const {
  allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');

const mongoose = require('mongoose');
require('dotenv').config();
const session = require('express-session');

// делаем импорт всех роутов
const homeRoutes = require('./routes/home');
const cardRoutes = require('./routes/card');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');

const User = require('./models/user');
const varMiddleware = require('./middleware/variables');

const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

// //напишем свой middleware (если не вызвать next не произойдет вызовов последующих мидлваров)
// app.use(async (req, res, next) => {
//   // добавим функционал, чтобы для объекта req всегда присутствовал пользователь
//   try {
//     const user = await User.findById('63fa078b651b8d302d12236c');
//     req.user = user;
//     next();
//   } catch (error) {
//     console.log(error);
//   }
// });



// исправляем 'public' для корректности
// app.use(express.static('public');
app.use(express.static(path.join(__dirname, 'public')));

// роут переехал в home.js
// app.get('/', (req, res) => {
//   res.render('index', {
//     title: 'Главная страница',
//     isHome: true
//   })
// })

// роут переехал в add.js
// app.get('/add', (req, res) => {
//   res.render('add', {
//     title: 'Добавить курс',
//     isAdd: true
//   })
// })

// роут переехал в courses.js
// app.get('/courses', (req, res) => {
//   res.render('courses', {
//     title: 'Курсы',
//     isCourses: true
//   })
// })

// для декодировки POST запроса на /add добавим мидлвар
app.use(express.urlencoded({ extended: true }));

// мидлвар сессий
app.use(
  session({
    //строка на основе которой сессия будет шифроваться
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
  }),
);

// доп мидлвар для сессии
app.use(varMiddleware);

// теперь используем роуты так
// регистрация роутов
app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;

// сделана для возможности внутри вызывать await для комфортной работы с промисами
async function start() {
  try {
    // const url = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASS}@cluster0.qkcf3nf.mongodb.net/?retryWrites=true&w=majority`;
    const url = 'mongodb://localhost:27017/shop';
    // подключаемся к бд
    await mongoose.set('strictQuery', true);
    //подключение по полученному url
    await mongoose.connect(url);

    /* временный функционал больше не нужен
    //после коннекта можем проверить если ли у нас хоть один пользователь в системе
    //в случае если его нет, то будем создавать нового
    //обратимся к модели User и воспользуемся методом findOne()
    // если хотя бы один пользователь есть то нам что-то вернется (т.к. это промис можно применить await)
    const candidate = await User.findOne();
    // если ничего нет в кандидате - создаем нового пользователя
    if (!candidate) {
      const user = new User({
        email: 'igor@mail.ru',
        name: 'Igor',
        cart: { items: [] },
      });
      // пока переменная создана только локально, далее нам необходимо ее сохранить
      await user.save();
    }
*/
    // после подключения можем уже запустить наше приложение
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
