// Инициализация Telegram Web Apps
const tg = window.Telegram.WebApp;
tg.ready();

// Получаем данные пользователя
const user = tg.initDataUnsafe.user;
const userId = user ? user.id : null;

// Функция для отправки запроса к боту
function sendRequest(action, data = {}) {
    data.action = action;
    data.user_id = userId;
    tg.sendData(JSON.stringify(data));
}

// Функция для отображения контента
function displayContent(content) {
    document.getElementById('content').innerHTML = content.replace(/\n/g, '<br>');
}

// Обработчики кнопок
function showDishes() {
    sendRequest('dishes');
}

function composeMenu() {
    sendRequest('compose_menu');
}

function showShoppingList() {
    sendRequest('shopping_list');
}

function showSettings() {
    sendRequest('settings');
}

function showStatistics() {
    sendRequest('statistics');
}

function searchRecipes() {
    const keyword = prompt('Введи ключевое слово для поиска рецепта (например, "курица" или "гречка"):');
    if (keyword) {
        sendRequest('search_recipes', { keyword });
    }
}

function exportList() {
    sendRequest('export_list');
}

function showHistory() {
    sendRequest('history');
}

// Обработка ответа от бота
tg.onEvent('web_app_data', (data) => {
    const response = JSON.parse(data);
    if (response.error) {
        displayContent(`Ошибка: ${response.error}`);
    } else {
        displayContent(response.message);
    }
});

// Инициализация приложения
displayContent('Выбери действие из меню выше.');