const keys = require('../keys');

module.exports = function (email, token) {
  return {
    from: keys.EMAIL_FROM, // sender address
    to: email, // list of receivers
    subject: 'Восстановление доступа', // тема письма
    text: 'Hello world?', // plain text body
    html: `
        <h1>Вы забыли пароль?</h1>
        <p>Если нет, то проигнорируйте данное письмо</p>
        <p>Иначе нажмите на ссылку ниже:</p>
        <p><a href="${keys.BASE_URL}/auth/password/${token}">Восстановить доступ</a></p>
        <hr />
        <a href="${keys.BASE_URL}">Магазин курсов</a>
        `, // html body
  };
};
