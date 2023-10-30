const keys = require('../keys');

module.exports = function (email) {
  return {
    from: keys.EMAIL_FROM, // sender address
    to: email, // list of receivers
    subject: 'Аккаунт создан', // тема письма
    text: 'Hello world?', // plain text body
    html: `
    <h1>Добро пожаловать в наш магазин</h1>
    <p>Вы успешно создали аккаунт с email - ${email}</p>
    <hr />
    <a href="${keys.BASE_URL}">Магазин курсов</a>
    `, // html body
  };
};
