// будем менять значение цены
document.querySelectorAll('.price').forEach(node => {
    // форматировать будем с помощью Intl.NumberFormat
    node.textContent = new Intl.NumberFormat('ru-RU', {
        currency: 'rub',
        style: 'currency'
    }).format(node.textContent)
})