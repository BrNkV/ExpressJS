const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')

// делаем импорт всех роутов
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');


const app = express()

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static('public'));

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
app.use(express.urlencoded({ extended: true }))

// теперь используем роуты так
app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})