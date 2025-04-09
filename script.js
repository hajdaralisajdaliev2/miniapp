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

// Форма для составления меню
function showComposeMenuForm() {
    const form = `
        <h2>Составление меню</h2>
        <form id="composeMenuForm">
            <label>Рост (см, 50-250):</label><br>
            <input type="number" id="height" min="50" max="250" required><br>
            <label>Вес (кг, 30-300):</label><br>
            <input type="number" id="weight" min="30" max="300" required><br>
            <label>Возраст (10-120):</label><br>
            <input type="number" id="age" min="10" max="120" required><br>
            <label>Уровень активности:</label><br>
            <select id="activity" required>
                <option value="Низкий">Низкий</option>
                <option value="Средний">Средний</option>
                <option value="Высокий">Высокий</option>
            </select><br>
            <label>Цель:</label><br>
            <select id="goal" required onchange="toggleGoalLevel()">
                <option value="Массонабор">Массонабор</option>
                <option value="Похудение">Похудение</option>
                <option value="Поддержание">Поддержание</option>
            </select><br>
            <div id="goalLevelDiv">
                <label>Уровень цели:</label><br>
                <select id="goalLevel" required>
                    <option value="Лёгкий">Лёгкий</option>
                    <option value="Средний">Средний</option>
                    <option value="Тяжёлый">Тяжёлый</option>
                </select><br>
            </div>
            <label>Тип питания:</label><br>
            <select id="dietType" required>
                <option value="С мясом">С мясом</option>
                <option value="С рыбой">С рыбой</option>
                <option value="Вегетарианское">Вегетарианское</option>
                <option value="Сбалансированное">Сбалансированное</option>
            </select><br>
            <label>Период:</label><br>
            <select id="period" required>
                <option value="День">День</option>
                <option value="Неделя">Неделя</option>
                <option value="Месяц">Месяц</option>
            </select><br>
            <button type="submit">Составить меню</button>
        </form>
    `;
    displayContent(form);

    // Обработчик отправки формы
    document.getElementById('composeMenuForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const height = document.getElementById('height').value;
        const weight = document.getElementById('weight').value;
        const age = document.getElementById('age').value;
        const activity = document.getElementById('activity').value;
        const goal = document.getElementById('goal').value;
        const goalLevel = goal === "Поддержание" ? "Нет" : document.getElementById('goalLevel').value;
        const dietType = document.getElementById('dietType').value;
        const period = document.getElementById('period').value;

        sendRequest('compose_menu', {
            height,
            weight,
            age,
            activity,
            goal,
            goal_level: goalLevel,
            diet_type: dietType,
            period
        });
    });

    toggleGoalLevel();
}

// Показ/скрытие уровня цели
function toggleGoalLevel() {
    const goal = document.getElementById('goal').value;
    const goalLevelDiv = document.getElementById('goalLevelDiv');
    if (goal === "Поддержание") {
        goalLevelDiv.style.display = 'none';
        document.getElementById('goalLevel').removeAttribute('required');
    } else {
        goalLevelDiv.style.display = 'block';
        document.getElementById('goalLevel').setAttribute('required', 'required');
    }
}

// Обработчики кнопок
function showDishes() {
    sendRequest('dishes');
}

function composeMenu() {
    showComposeMenuForm();
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
