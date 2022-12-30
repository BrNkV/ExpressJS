// создадим модель записи корзины с добавленными курсами

// для считывания путей воспользуемся так:
const path = require('path');
const fs = require('fs');

//путь указывается от абсолютного пути (нет необходимости выходить на уровень выше)
const p = path.join(path.dirname(require.main.filename), 'data', 'card.json');

class Card {
  // получаем объект курса
  static async add(course) {
    // получим всю корзину и просмотреть ее
    const card = await Card.fetch();
    // сделаем возможным добавление одинаковых курсов в корзину (увеличивать кол-во)
    // сделаем проверку есть ли в корзине такой же курс котор мы хотим добавить, и если есть увеличиваем кол-во, если нет - добавим
    const idx = card.courses.findIndex((c) => c.id === course.id); // не факт что id определится
    const candidate = card.courses[idx]; // сделаем проверку

    if (candidate) {
      // курс уже есть
      // увеличиваем count
      candidate.count++;
      // заменяем объект
      card.courses[idx] = candidate;
    } else {
      // нужно добавить курс
      // добавим объекту курс count
      course.count = 1; // будет по умолчанию 1
      card.courses.push(course); //добавим курс
    }

    // необходимо указать у карточки итоговую стоимость добавленного в корзину
    card.price += +course.price;

    //теперь у нас сформирован объект card, и его необходимо обратно записать в JSON файл
    return new Promise((resolve, reject) => {
      // делаем запись
      fs.writeFile(p, JSON.stringify(card), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // удаляет по id
  static async remove(id) {
    // обратимся к модели карт и получим ее данные с БД
    const card = await this.fetch();

    //  определяем что делаем с id - если под ним 1 курс нужно удалить полностью, если больше 1го то необходимо уменьшить кол-во и пересчитать цену
    const idx = card.courses.findIndex((c) => c.id === id);
    const course = card.courses[idx];

    if (course.count === 1) {
      //TODO
      //FIXME
      //удалить
      // если course.id  не равняется тому id который мы сюда передавали то тогда мы кладем его в результирующий массив, если равняется то пропускаем
      //такая логика позволит нам удалить нужный элемент
      card.courses.filter((c) => c.id !== id);
    } else {
      //уменьшить кол-во
      //обращ к курсу по индексу и кол-во уменьшаем
      card.courses[idx].count--;
    }

    //пересчет цены
    // обращ к цене в карточке и уменьшаем стоимость на цену курса
    card.price -= course.price;

    //перезапись всего полученного в корзину (копир логику)
    //теперь у нас сформирован объект card, и его необходимо обратно записать в JSON файл
    return new Promise((resolve, reject) => {
      // делаем запись
      fs.writeFile(p, JSON.stringify(card), (err) => {
        if (err) {
          reject(err);
        } else {
          //важно передать card т.к. в роутах мы ее получаем и ее нужно передать
          resolve(card);
        }
      });
    });
  }

  static async fetch() {
    // функционал - считать файл, обернуть в промис, отдать наружу
    // возвращаем новый промис принимающий в себя коллбэк
    // обращ к модулю ФС и вызываем метод readFile, указываем в нем р - путь , формат и получаем коллбэк
    // если ошибка выкидываем ее, если ок то парсим контент
    return new Promise((resolve, reject) => {
      fs.readFile(p, 'utf-8', (err, content) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(content));
        }
      });
    });
  }
}

module.exports = Card;
