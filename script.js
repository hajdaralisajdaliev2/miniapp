// Инициализация Telegram Web Apps
const tg = window.Telegram.WebApp;
tg.ready();

// Проверка загрузки Telegram Web App API
if (!window.Telegram || !window.Telegram.WebApp) {
    console.error("Telegram Web App API не загружен");
} else {
    console.log("Telegram Web App API успешно загружен");
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

        displayContent(`Рост: ${height} см<br>Вес: ${weight} кг<br>Возраст: ${age}<br>Активность: ${activity}<br>Цель: ${goal}<br>Уровень цели: ${goalLevel}<br>Тип питания: ${dietType}<br>Период: ${period}`);
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
    displayContent('<div class="placeholder">Placeholder</div><p>Здесь будут отображаться блюда.</p>');
}

function composeMenu() {
    showComposeMenuForm();
}

function showShoppingList() {
    displayContent('<div class="placeholder">Placeholder</div><p>Здесь будет отображаться список покупок.</p>');
}

function showSettings() {
    displayContent('<div class="placeholder">Placeholder</div><p>Здесь будут отображаться настройки.</p>');
}

function showStatistics() {
    displayContent('<div class="placeholder">Placeholder</div><p>Здесь будет отображаться статистика.</p>');
}

function searchRecipes() {
    const keyword = prompt('Введи ключевое слово для поиска рецепта (например, "курица" или "гречка"):');
    if (keyword) {
        displayContent(`<div class="placeholder">Placeholder</div><p>Поиск рецептов по ключевому слову: ${keyword}</p>`);
    }
}

function exportList() {
    displayContent('<div class="placeholder">Placeholder</div><p>Экспорт списка покупок...</p>');
}

function showHistory() {
    displayContent('<div class="placeholder">Placeholder</div><p>Здесь будет отображаться история.</p>');
}

// Инициализация приложения
displayContent('<div class="placeholder">Placeholder</div><p>Выбери действие из меню ниже.</p>');
