// Инициализация Telegram Web Apps
const tg = window.Telegram.WebApp;
tg.ready();

// Проверка загрузки Telegram Web App API
if (!window.Telegram || !window.Telegram.WebApp) {
    console.error("Telegram Web App API не загружен");
} else {
    console.log("Telegram Web App API успешно загружен");
}

// Глобальные переменные
let userData = {
    height: 0,
    weight: 0,
    goal: '',
    allergies: [],
    points: 0,
    achievements: [],
    water: 0,
    steps: 0,
    weightHistory: [70] // Пример данных для графика
};

// Onboarding
const onboarding = document.getElementById('onboarding');
const mainApp = document.getElementById('main-app');
const onboardingForm = document.getElementById('onboarding-form');

// Сбросим localStorage для теста
// localStorage.removeItem('onboardingCompleted');

if (!localStorage.getItem('onboardingCompleted')) {
    onboarding.classList.remove('hidden');
} else {
    mainApp.classList.remove('hidden');
}

onboardingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    userData.height = document.getElementById('height').value;
    userData.weight = document.getElementById('weight').value;
    userData.goal = document.getElementById('goal').value;
    userData.allergies = Array.from(document.querySelectorAll('input[name="allergy"]:checked')).map(input => input.value);

    // Переход к следующему слайду
    showSlide(3);
});

function showSlide(slideNumber) {
    document.querySelectorAll('.onboarding-slide').forEach(slide => slide.classList.remove('active'));
    document.querySelectorAll('.onboarding-dots .dot').forEach(dot => dot.classList.remove('active'));
    document.querySelector(`.onboarding-slide[data-slide="${slideNumber}"]`).classList.add('active');
    document.querySelector(`.onboarding-dots .dot[data-dot="${slideNumber}"]`).classList.add('active');
}

function completeOnboarding() {
    localStorage.setItem('onboardingCompleted', 'true');
    onboarding.classList.add('hidden');
    mainApp.classList.remove('hidden');
    calculateCalories();
}

// Переключение тем
function toggleTheme() {
    const body = document.body;
    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        document.getElementById('theme-toggle-btn').textContent = '🌙';
    } else {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        document.getElementById('theme-toggle-btn').textContent = '☀️';
    }
}

// Переключение вкладок
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.bottom-nav button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`.tabs button[onclick="showTab('${tabId}')"]`).classList.add('active');
    document.querySelector(`.bottom-nav button[onclick="showTab('${tabId}')"]`).classList.add('active');
}

// Геймификация
function addPoints(points) {
    userData.points += points;
    document.getElementById('user-points').textContent = userData.points;
    checkAchievements();
}

function checkAchievements() {
    if (userData.points >= 50 && !userData.achievements.includes('50_points')) {
        userData.achievements.push('50_points');
        tg.showAlert('Достижение разблокировано: 50 баллов!');
    }
    if (userData.water >= 2 && !userData.achievements.includes('water_goal')) {
        userData.achievements.push('water_goal');
        tg.showAlert('Достижение разблокировано: Цель по воде выполнена!');
    }
    document.getElementById('user-achievements').textContent = `${userData.achievements.length}/5`;
}

function markMealCompleted(button) {
    button.disabled = true;
    button.textContent = 'Съедено';
    addPoints(10);
}

// Расчёт калорий (формула Миффлина-Сан Жеора)
function calculateCalories() {
    const weight = parseFloat(userData.weight);
    const height = parseFloat(userData.height);
    const age = 30; // Пример возраста, можно добавить в onboarding
    const bmr = 10 * weight + 6.25 * height - 5 * age + 5; // Для мужчин
    const dailyCalories = bmr * 1.2; // Уровень активности: низкий
    document.getElementById('calories').textContent = `0 / ${Math.round(dailyCalories)} ккал`;
    document.getElementById('macros').textContent = `Б: ${Math.round(dailyCalories * 0.3 / 4)}г Ж: ${Math.round(dailyCalories * 0.3 / 9)}г У: ${Math.round(dailyCalories * 0.4 / 4)}г`;
}

// Рецепты
function showRecipeDetails() {
    document.getElementById('recipes').innerHTML = `
        <h2>Куриный суп</h2>
        <div class="placeholder">Placeholder (видео)</div>
        <p>Шаг 1: Нарежь овощи.<br>Шаг 2: Свари бульон.<br>Шаг 3: Добавь курицу.</p>
        <button onclick="showTab('recipes')">Назад</button>
    `;
}

function addRecipe() {
    const recipeName = prompt('Название рецепта:');
    const recipeSteps = prompt('Шаги приготовления (разделяй переносом строки):');
    if (recipeName && recipeSteps) {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        recipeCard.innerHTML = `
            <div class="placeholder">Placeholder</div>
            <h3>${recipeName}</h3>
            <p>${recipeSteps.replace(/\n/g, '<br>')}</p>
            <button onclick="showRecipeDetails()">Подробнее</button>
        `;
        document.getElementById('recipes').prepend(recipeCard);
    }
}

// Прогресс
function addWater() {
    userData.water += 0.25; // 250 мл за стакан
    document.getElementById('water').textContent = `${userData.water} / 2 л`;
    checkAchievements();
}

// График веса
const ctx = document.getElementById('weight-chart').getContext('2d');
new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['День 1', 'День 2', 'День 3'],
        datasets: [{
            label: 'Вес (кг)',
            data: userData.weightHistory,
            borderColor: '#007aff',
            fill: false
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: false
            }
        }
    }
});

// Инициализация
if (localStorage.getItem('onboardingCompleted')) {
    calculateCalories();
    showTab('today');
}
