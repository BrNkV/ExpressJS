const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');

const mongoose = require('mongoose');
require('dotenv').config();

// делаем импорт всех роутов
const homeRoutes = require('./routes/home');
const cardRoutes = require('./routes/card');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');

const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

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

// теперь используем роуты так
app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);

const PORT = process.env.PORT || 3000;

// сделана для возможности внутри вызывать await для комфортной работы с промисами
async function start() {
  try {
    const url = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASS}@cluster0.qkcf3nf.mongodb.net/?retryWrites=true&w=majority`;
    // подключаемся к бд
    await mongoose.set('strictQuery', true);
    await mongoose.connect(url);

    // после подключения можем уже запустить наше приложение
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
