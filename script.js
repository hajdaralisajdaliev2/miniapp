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
    weightHistory: [70], // Пример данных для графика
    dailyCalories: 0,
    dailyMacros: { protein: 0, fat: 0, carbs: 0 },
    menu: []
};

// Список блюд и рецептов
const dishes = [
    { name: "Овсянка с ягодами", mealType: "Завтрак", calories: 300, protein: 10, fat: 5, carbs: 50, allergens: ["Молоко"], recipe: "Свари овсянку на воде, добавь ягоды." },
    { name: "Куриный суп", mealType: "Обед", calories: 400, protein: 20, fat: 10, carbs: 40, allergens: [], recipe: "Нарежь овощи, свари бульон, добавь курицу." },
    { name: "Салат с тунцом", mealType: "Ужин", calories: 250, protein: 15, fat: 8, carbs: 20, allergens: ["Рыба"], recipe: "Смешай листья салата, тунец, оливковое масло." },
    { name: "Гречка с овощами", mealType: "Обед", calories: 350, protein: 12, fat: 6, carbs: 60, allergens: [], recipe: "Свари гречку, добавь тушёные овощи." },
    { name: "Йогурт с орехами", mealType: "Завтрак", calories: 280, protein: 8, fat: 12, carbs: 30, allergens: ["Молоко", "Орехи"], recipe: "Смешай йогурт с орехами." }
];

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
    generateMenu();
    displayMenu();
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

function markMealCompleted(button, dish) {
    button.disabled = true;
    button.textContent = 'Съедено';
    addPoints(10);
    // Обновляем статистику
    const currentCalories = parseInt(document.getElementById('calories').textContent.split(' / ')[0]) + dish.calories;
    const currentProtein = parseInt(document.getElementById('macros').textContent.match(/Б: (\d+)/)[1]) + dish.protein;
    const currentFat = parseInt(document.getElementById('macros').textContent.match(/Ж: (\d+)/)[1]) + dish.fat;
    const currentCarbs = parseInt(document.getElementById('macros').textContent.match(/У: (\d+)/)[1]) + dish.carbs;
    document.getElementById('calories').textContent = `${currentCalories} / ${userData.dailyCalories} ккал`;
    document.getElementById('macros').textContent = `Б: ${currentProtein}г Ж: ${currentFat}г У: ${currentCarbs}г`;
}

// Расчёт калорий (формула Миффлина-Сан Жеора)
function calculateCalories() {
    const weight = parseFloat(userData.weight);
    const height = parseFloat(userData.height);
    const age = 30; // Пример возраста, можно добавить в onboarding
    const bmr = 10 * weight + 6.25 * height - 5 * age + 5; // Для мужчин
    let activityLevel = 1.2; // Низкий уровень активности
    if (userData.goal === "Массонабор") activityLevel = 1.5; // Увеличиваем калории для массонабора
    if (userData.goal === "Похудение") activityLevel = 1.0; // Уменьшаем калории для похудения
    userData.dailyCalories = Math.round(bmr * activityLevel);
    userData.dailyMacros = {
        protein: Math.round(userData.dailyCalories * 0.3 / 4), // 30% калорий от белков
        fat: Math.round(userData.dailyCalories * 0.3 / 9),     // 30% калорий от жиров
        carbs: Math.round(userData.dailyCalories * 0.4 / 4)    // 40% калорий от углеводов
    };
    document.getElementById('calories').textContent = `0 / ${userData.dailyCalories} ккал`;
    document.getElementById('macros').textContent = `Б: ${userData.dailyMacros.protein}г Ж: ${userData.dailyMacros.fat}г У: ${userData.dailyMacros.carbs}г`;
}

// Генерация меню
function generateMenu() {
    userData.menu = [];
    const mealTypes = ["Завтрак", "Обед", "Ужин"];
    let totalCalories = 0;

    mealTypes.forEach(mealType => {
        // Фильтруем блюда по типу приёма пищи и аллергиям
        let availableDishes = dishes.filter(dish => 
            dish.mealType === mealType && 
            !dish.allergens.some(allergen => userData.allergies.includes(allergen))
        );

        // Если есть подходящие блюда, выбираем одно случайное
        if (availableDishes.length > 0) {
            const dish = availableDishes[Math.floor(Math.random() * availableDishes.length)];
            userData.menu.push(dish);
            totalCalories += dish.calories;
        }
    });

    // Проверяем, чтобы общее количество калорий соответствовало цели
    if (userData.goal === "Похудение" && totalCalories > userData.dailyCalories * 0.9) {
        // Если калорий слишком много, пересобираем меню
        generateMenu();
    } else if (userData.goal === "Массонабор" && totalCalories < userData.dailyCalories * 0.9) {
        // Если калорий слишком мало, добавляем перекус
        let snacks = dishes.filter(dish => 
            !dish.allergens.some(allergen => userData.allergies.includes(allergen))
        );
        if (snacks.length > 0) {
            const snack = snacks[Math.floor(Math.random() * snacks.length)];
            userData.menu.push({ ...snack, mealType: "Перекус" });
        }
    }
}

// Отображение меню
function displayMenu() {
    const mealList = document.querySelector('.meal-list');
    mealList.innerHTML = '';
    userData.menu.forEach(dish => {
        const mealCard = document.createElement('div');
        mealCard.className = 'meal-card';
        mealCard.innerHTML = `
            <div class="placeholder">Placeholder</div>
            <p>${dish.mealType}: ${dish.name}</p>
            <button onclick="markMealCompleted(this, ${JSON.stringify(dish).replace(/"/g, '&quot;')})">Съел</button>
        `;
        mealList.appendChild(mealCard);
    });
}

// Рецепты
function showRecipeDetails() {
    const recipeList = userData.menu.map(dish => `
        <div class="recipe-card">
            <div class="placeholder">Placeholder (видео)</div>
            <h3>${dish.name}</h3>
            <p>${dish.recipe}</p>
        </div>
    `).join('');
    document.getElementById('recipes').innerHTML = `
        <h2>Рецепты</h2>
        ${recipeList}
        <button onclick="showTab('recipes')">Назад</button>
    `;
}

function addRecipe() {
    const recipeName = prompt('Название рецепта:');
    const recipeSteps = prompt('Шаги приготовления (разделяй переносом строки):');
    const mealType = prompt('Тип приёма пищи (Завтрак, Обед, Ужин, Перекус):');
    if (recipeName && recipeSteps && mealType) {
        dishes.push({
            name: recipeName,
            mealType: mealType,
            calories: 300, // Пример, можно добавить ввод калорий
            protein: 10,
            fat: 5,
            carbs: 40,
            allergens: [],
            recipe: recipeSteps
        });
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
    generateMenu();
    displayMenu();
    showTab('today');
}
