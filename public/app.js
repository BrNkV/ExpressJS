const toCurrency = (price) => {
  return new Intl.NumberFormat('ru-RU', {
    currency: 'rub',
    style: 'currency',
  }).format(price);
};

// будем менять значение цены
document.querySelectorAll('.price').forEach((node) => {
  // форматировать будем с помощью Intl.NumberFormat
  // вынесли в отдельную ф-цию в уроке 18
  // node.textContent = new Intl.NumberFormat('ru-RU', {
  //   currency: 'rub',
  //   style: 'currency',
  // }).format(node.textContent);
  node.textContent = toCurrency(node.textContent);
});

const $card = document.querySelector('#card');

// отслеживание клика по классу js-remove, для получения id
if ($card) {
  $card.addEventListener('click', (event) => {
    if (event.target.classList.contains('js-remove')) {
      // получение нашего id типа aa605795-7b4e-4d33-a8d9-5f22ab31dca2
      const id = event.target.dataset.id;

      // необходимо отправить ajax запрос с клиента на сервер для удаления с базы
      // здесь мы не можем использовать async await т.к. работаем в браузере, воспользуемся промисом
      fetch('/card/remove/' + id, {
        method: 'delete',
      })
        .then((res) => res.json())
        .then((card) => {
          if (card.courses.length) {
            //обновляем таблицу (обратимся и пересчитаем)
            const html = card.courses
              .map((c) => {
                return `
              <tr>
            <td>${c.title}</td>
              <td>${c.count}</td>
              <td>
                <button
                  class='btn btn-small js-remove'
                  data-id='${c.id}'
                >Delete</button>
              </td>
            </tr>
              `;
              })
              .join('');
            $card.querySelector('tbody').innerHTML = html;

            //пересчет цены
            $card.querySelector('.price').textContent = toCurrency(card.price);
          } else {
            // иначе очищаем
            $card.innerHTML = `<p>Card is empty</p>`;
          }
        });
    }
  });
}
