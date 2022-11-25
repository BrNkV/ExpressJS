// модель будет представлена в виде классов
// подключить модель в add.js

const { v4: uuid } = require('uuid');

const fs = require('fs');
const path = require('path');

class Course {
    // инициализируя данный класс, мы будем создавать нужный нам курс
    constructor(title, price, img) {
        this.title = title;
        this.price = price;
        this.img = img;
        // также зададим приватное поле с id
        this.id = uuid();
        // так же подкл библиотеку npm i uuid для генерации id

    }

    // helper функция 
    // будет возвращать результат
    toJSON() {
        return {
            title: this.title,
            price: this.price,
            img: this.img,
            id: this.id
        };
    }

    // метод сохранения данных из конструктора
    // преобразует получ данные в json и сохранит в отдельный файл courses.json
    async save() {
        // сначала мы должны получить все содержимое courses.json

        // получим результат работы метода getAll() 
        // метод возвратит нам промис , можно воспользоваться методом .then, либо сделать метод save - асинхронным и добавить await перед промисом 
        const courses = await Course.getAll();

        // добавим данные в массив курсов 
        courses.push(this.toJSON())
        /* теперь получаем в консоль такую запись при добавлении курса
        Courses [
        {title: 'CourseName',
        price: '14000',
        img: 'fake_url',
        id: 'e71a3287-df4c-45a1-b7a0-9ac2d9dc2dac'}]
        */

    
       // далее исп обновленный список курсов, после добавления в него еще, делаем запись (так же оборачиваем в промис)
        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
                // дата которую мы хотим записать
                JSON.stringify(courses),
                (err) => {
                    // при ошибке вызов reject
                    if (err) reject(err)
                    // иначе вызываем пустой метод resolve
                    else {
                        resolve()
                    }
                }
            )
        })
        // console.log('Courses', courses)
    }

    // статический метод модели для получения всех данных для использования
    static getAll() {
        // оборачиваем все содержимое в промис 

        // примет в себя resolve reject
        return new Promise((resolve, reject) => {
            // сначала прочитаем файл
            fs.readFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
                'utf-8',
                (err, content) => {
                    // для обработки ошибки используем не @throw err;@ а reject(err);
                    if (err) {
                        reject(err);
                    } else {
                        // в случае успеха , получаем весь контент в формате строки
                        resolve(JSON.parse(content))
                    }
                    // если у нас есть контент передаем контент из функции
                    // работаем с коллбэками 
                    // для линейного вызова мы можем обернуть все в промис 
                }
            )
        })
    }
}

module.exports = Course;