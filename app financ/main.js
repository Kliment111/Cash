// Переводы для трех языков
const translations = {
    ru: {
        appTitle: '💰 Финансовый Трекер',
        monthView: 'По месяцам',
        quarterView: 'По кварталам',
        today: 'Сегодня',
        income: 'Доходы',
        expense: 'Расходы',
        balance: 'Баланс',
        descPlaceholder: 'Описание (например: Зарплата или Покупка продуктов)',
        amountPlaceholder: 'Сумма',
        addIncome: '➕ Доход',
        addExpense: '➖ Расход',
        history: 'История транзакций',
        clearAll: '🗑️ Очистить всё',
        noTransactionsMonth: 'Нет транзакций за этот месяц. Добавьте доход или расход!',
        noTransactionsQuarter: 'Нет транзакций за этот квартал. Добавьте доход или расход!',
        noTransactions: 'Нет транзакций. Добавьте доход или расход!',
        errorDescription: 'Пожалуйста, введите описание!',
        errorAmount: 'Пожалуйста, введите корректную сумму!',
        confirmDelete: 'Вы уверены? Все транзакции будут удалены безвозвратно!',
        noDeleteTransactions: 'Нет транзакций для удаления!',
        Q1: 'I квартал',
        Q2: 'II квартал',
        Q3: 'III квартал',
        Q4: 'IV квартал'
    },
    uk: {
        appTitle: '💰 Фінансовий Трекер',
        monthView: 'По місяцях',
        quarterView: 'По кварталах',
        today: 'Сьогодні',
        income: 'Доходи',
        expense: 'Видатки',
        balance: 'Баланс',
        descPlaceholder: 'Опис (наприклад: Зарплата або Покупка продуктів)',
        amountPlaceholder: 'Сума',
        addIncome: '➕ Дохід',
        addExpense: '➖ Видаток',
        history: 'Історія транзакцій',
        clearAll: '🗑️ Очистити все',
        noTransactionsMonth: 'Немає транзакцій за цей місяць. Додайте дохід або видаток!',
        noTransactionsQuarter: 'Немає транзакцій за цей квартал. Додайте дохід або видаток!',
        noTransactions: 'Немає транзакцій. Додайте дохід або видаток!',
        errorDescription: 'Будь ласка, введіть опис!',
        errorAmount: 'Будь ласка, введіть коректну суму!',
        confirmDelete: 'Ви впевнені? Усі транзакції будуть видалені безповоротно!',
        noDeleteTransactions: 'Немає транзакцій для видалення!',
        Q1: 'I квартал',
        Q2: 'II квартал',
        Q3: 'III квартал',
        Q4: 'IV квартал'
    },
    en: {
        appTitle: '💰 Financial Tracker',
        monthView: 'By Months',
        quarterView: 'By Quarters',
        today: 'Today',
        income: 'Income',
        expense: 'Expenses',
        balance: 'Balance',
        descPlaceholder: 'Description (e.g.: Salary or Groceries)',
        amountPlaceholder: 'Amount',
        addIncome: '➕ Income',
        addExpense: '➖ Expense',
        history: 'Transaction History',
        clearAll: '🗑️ Clear All',
        noTransactionsMonth: 'No transactions this month. Add income or expense!',
        noTransactionsQuarter: 'No transactions this quarter. Add income or expense!',
        noTransactions: 'No transactions. Add income or expense!',
        errorDescription: 'Please enter a description!',
        errorAmount: 'Please enter a valid amount!',
        confirmDelete: 'Are you sure? All transactions will be deleted permanently!',
        noDeleteTransactions: 'No transactions to delete!',
        Q1: 'Q1',
        Q2: 'Q2',
        Q3: 'Q3',
        Q4: 'Q4'
    }
};

// Текущий язык
let currentLanguage = localStorage.getItem('language') || 'ru';

// Функция для получения перевода
function t(key) {
    return translations[currentLanguage]?.[key] || translations['ru'][key];
}

// Получаем элементы DOM
const languageSelect = document.getElementById('languageSelect');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const transactionDateInput = document.getElementById('transactionDate');
const incomeBtn = document.getElementById('incomeBtn');
const expenseBtn = document.getElementById('expenseBtn');
const clearBtn = document.getElementById('clearBtn');
const transactionsList = document.getElementById('transactionsList');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpenseEl = document.getElementById('totalExpense');
const totalBalanceEl = document.getElementById('totalBalance');
const monthInput = document.getElementById('monthInput');
const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');
const todayBtn = document.getElementById('todayBtn');
const monthViewBtn = document.getElementById('monthViewBtn');
const quarterViewBtn = document.getElementById('quarterViewBtn');
const monthSelector = document.getElementById('monthSelector');
const quarterSelector = document.getElementById('quarterSelector');
const quarterInput = document.getElementById('quarterInput');
const prevQuarterBtn = document.getElementById('prevQuarterBtn');
const nextQuarterBtn = document.getElementById('nextQuarterBtn');
const todayQuarterBtn = document.getElementById('todayQuarterBtn');

// Инициализируем массив транзакций из localStorage
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Переменные для хранения выбранного периода
let selectedMonth = getCurrentMonth();
let selectedQuarter = getCurrentQuarter();
let viewMode = 'month'; // 'month' или 'quarter'

// Функция получить текущий месяц в формате YYYY-MM
function getCurrentMonth() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
}

// Функция получить текущий квартал в формате YYYY-QX
function getCurrentQuarter() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const quarter = Math.ceil(month / 3);
    return `${year}-Q${quarter}`;
}

// Функция для преобразования месяца в квартал
function monthToQuarter(monthStr) {
    const [year, month] = monthStr.split('-');
    const quarter = Math.ceil(parseInt(month) / 3);
    return `${year}-Q${quarter}`;
}

// Функция для получения предыдущего квартала
function getPreviousQuarter(quarterStr) {
    const [year, quarter] = quarterStr.split('-Q');
    let newQuarter = parseInt(quarter) - 1;
    let newYear = parseInt(year);
    
    if (newQuarter === 0) {
        newQuarter = 4;
        newYear--;
    }
    
    return `${newYear}-Q${newQuarter}`;
}

// Функция для получения следующего квартала
function getNextQuarter(quarterStr) {
    const [year, quarter] = quarterStr.split('-Q');
    let newQuarter = parseInt(quarter) + 1;
    let newYear = parseInt(year);
    
    if (newQuarter === 5) {
        newQuarter = 1;
        newYear++;
    }
    
    return `${newYear}-Q${newQuarter}`;
}

// Функция для получения месяцев квартала
function getMonthsInQuarter(quarterStr) {
    const [year, quarter] = quarterStr.split('-Q');
    const q = parseInt(quarter);
    const startMonth = (q - 1) * 3 + 1;
    const months = [];
    
    for (let i = 0; i < 3; i++) {
        const month = startMonth + i;
        months.push(`${year}-${String(month).padStart(2, '0')}`);
    }
    
    return months;
}

// Функция для получения предыдущего месяца
function getPreviousMonth(monthStr) {
    const [year, month] = monthStr.split('-');
    let newMonth = parseInt(month) - 1;
    let newYear = parseInt(year);
    
    if (newMonth === 0) {
        newMonth = 12;
        newYear--;
    }
    
    return `${newYear}-${String(newMonth).padStart(2, '0')}`;
}

// Функция для получения следующего месяца
function getNextMonth(monthStr) {
    const [year, month] = monthStr.split('-');
    let newMonth = parseInt(month) + 1;
    let newYear = parseInt(year);
    
    if (newMonth === 13) {
        newMonth = 1;
        newYear++;
    }
    
    return `${newYear}-${String(newMonth).padStart(2, '0')}`;
}

// Функция для фильтрации транзакций по месяцу
function getTransactionsByMonth(month) {
    return transactions.filter(t => {
        const transactionDate = new Date(t.fullDate);
        const transactionMonth = transactionDate.getFullYear() + '-' + 
                                String(transactionDate.getMonth() + 1).padStart(2, '0');
        return transactionMonth === month;
    });
}

// Функция для фильтрации транзакций по кварталу
function getTransactionsByQuarter(quarter) {
    const months = getMonthsInQuarter(quarter);
    return transactions.filter(t => {
        const transactionDate = new Date(t.fullDate);
        const transactionMonth = transactionDate.getFullYear() + '-' + 
                                String(transactionDate.getMonth() + 1).padStart(2, '0');
        return months.includes(transactionMonth);
    });
}

// Функция для обновления month input
function updateMonthInput() {
    monthInput.value = selectedMonth;
}

// Функция для обновления quarter input
function updateQuarterInput() {
    quarterInput.value = selectedQuarter;
}

// Функция для обновления date input при смене месяца
function updateDateInput() {
    let year, month;
    
    if (viewMode === 'month') {
        [year, month] = selectedMonth.split('-');
    } else {
        // При режиме квартала берем первый месяц квартала
        const months = getMonthsInQuarter(selectedQuarter);
        [year, month] = months[0].split('-');
    }
    
    transactionDateInput.value = `${year}-${month}-01`;
    // Устанавливаем min и max на основе режима
    if (viewMode === 'month') {
        transactionDateInput.min = `${year}-${month}-01`;
        const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
        transactionDateInput.max = `${year}-${month}-${lastDay}`;
    } else {
        // При режиме квартала - от первого дня первого месяца до последнего дня последнего месяца квартала
        const monthsInQuarter = getMonthsInQuarter(selectedQuarter);
        const [startYear, startMonth] = monthsInQuarter[0].split('-');
        const [endYear, endMonth] = monthsInQuarter[2].split('-');
        transactionDateInput.min = `${startYear}-${startMonth}-01`;
        const lastDay = new Date(parseInt(endYear), parseInt(endMonth), 0).getDate();
        transactionDateInput.max = `${endYear}-${endMonth}-${lastDay}`;
    }
}

// Функция для добавления транзакции
function addTransaction(type) {
    let description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    let transactionDateStr = transactionDateInput.value;

    // Если описание пусто, подставляем "Другое" (переводится)
    if (!description) {
        description = 'Другое';
    }

    // Валидация суммы
    if (!amount || amount <= 0) {
        alert(t('errorAmount'));
        amountInput.focus();
        return;
    }

    // Если дата не выбрана, используем сегодняшнюю дату
    if (!transactionDateStr) {
        const today = new Date();
        transactionDateStr = today.toISOString().split('T')[0];
    }

    // Определяем локаль для форматирования даты
    const dateLocale = currentLanguage === 'ru' ? 'ru-RU' : currentLanguage === 'uk' ? 'uk-UA' : 'en-US';

    // Создаём транзакцию
    const transaction = {
        id: Date.now(),
        type: type, // 'income' или 'expense'
        description: description,
        amount: amount,
        date: new Date(transactionDateStr + 'T00:00:00').toLocaleString(dateLocale),
        fullDate: new Date(transactionDateStr + 'T00:00:00').toISOString()
    };

    // Добавляем в массив
    transactions.unshift(transaction);

    // Сохраняем в localStorage
    saveTransactions();

    // Очищаем поля ввода
    descriptionInput.value = '';
    amountInput.value = '';

    // Обновляем интерфейс
    updateUI();
    descriptionInput.focus();
}

// Функция для удаления транзакции
function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveTransactions();
    updateUI();
}

// Функция для сохранения транзакций
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Функция для обновления интерфейса
function updateUI() {
    // Получаем транзакции в зависимости от режима просмотра
    let displayTransactions;
    let emptyMessage;
    
    if (viewMode === 'month') {
        displayTransactions = getTransactionsByMonth(selectedMonth);
        emptyMessage = t('noTransactionsMonth');
    } else {
        displayTransactions = getTransactionsByQuarter(selectedQuarter);
        emptyMessage = t('noTransactionsQuarter');
    }
    
    // Расчёты
    const totalIncome = displayTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = displayTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = totalIncome - totalExpense;

    // Обновляем суммы
    totalIncomeEl.textContent = totalIncome.toFixed(2) + ' ₽';
    totalExpenseEl.textContent = totalExpense.toFixed(2) + ' ₽';
    totalBalanceEl.textContent = balance.toFixed(2) + ' ₽';

    // Обновляем цвет баланса
    if (balance >= 0) {
        totalBalanceEl.style.color = '#27ae60';
    } else {
        totalBalanceEl.style.color = '#e74c3c';
    }

    // Обновляем список транзакций
    if (displayTransactions.length === 0) {
        transactionsList.innerHTML = `<p class="empty-message">${emptyMessage}</p>`;
        return;
    }

    transactionsList.innerHTML = displayTransactions.map(t => `
        <div class="transaction-item ${t.type}">
            <div class="transaction-info">
                <p class="description">${t.description}</p>
                <p class="date">${t.date}</p>
            </div>
            <div class="transaction-amount">
                <span class="amount ${t.type}">${t.type === 'income' ? '+' : '-'} ${t.amount.toFixed(2)} ₽</span>
                <button class="delete-btn" onclick="deleteTransaction(${t.id})">✕</button>
            </div>
        </div>
    `).join('');
}

// Функция для очистки всех данных
function clearAllTransactions() {
    if (transactions.length === 0) {
        alert(t('noDeleteTransactions'));
        return;
    }

    if (confirm(t('confirmDelete'))) {
        transactions = [];
        saveTransactions();
        updateUI();
    }
}

// Функция для переключения режима просмотра
function switchViewMode(newMode) {
    viewMode = newMode;
    
    if (newMode === 'month') {
        monthViewBtn.classList.add('active');
        quarterViewBtn.classList.remove('active');
        monthSelector.style.display = 'flex';
        quarterSelector.style.display = 'none';
        updateMonthInput();
        updateDateInput();
    } else {
        monthViewBtn.classList.remove('active');
        quarterViewBtn.classList.add('active');
        monthSelector.style.display = 'none';
        quarterSelector.style.display = 'flex';
        // Обновляем квартал на основе текущего месяца
        selectedQuarter = monthToQuarter(selectedMonth);
        updateQuarterInput();
        updateDateInput();
    }
    
    updateUI();
}

// Обработчики событий
incomeBtn.addEventListener('click', () => addTransaction('income'));
expenseBtn.addEventListener('click', () => addTransaction('expense'));
clearBtn.addEventListener('click', clearAllTransactions);

// Обработчики переключения режимов
monthViewBtn.addEventListener('click', () => switchViewMode('month'));
quarterViewBtn.addEventListener('click', () => switchViewMode('quarter'));

// Обработчики событий для навигации по месяцам
prevMonthBtn.addEventListener('click', () => {
    selectedMonth = getPreviousMonth(selectedMonth);
    updateMonthInput();
    updateDateInput();
    updateUI();
});

nextMonthBtn.addEventListener('click', () => {
    selectedMonth = getNextMonth(selectedMonth);
    updateMonthInput();
    updateDateInput();
    updateUI();
});

todayBtn.addEventListener('click', () => {
    selectedMonth = getCurrentMonth();
    updateMonthInput();
    updateDateInput();
    updateUI();
});

monthInput.addEventListener('change', (e) => {
    if (e.target.value) {
        selectedMonth = e.target.value;
        updateDateInput();
        updateUI();
    }
});

// Обработчики событий для навигации по кварталам
prevQuarterBtn.addEventListener('click', () => {
    selectedQuarter = getPreviousQuarter(selectedQuarter);
    updateQuarterInput();
    updateDateInput();
    updateUI();
});

nextQuarterBtn.addEventListener('click', () => {
    selectedQuarter = getNextQuarter(selectedQuarter);
    updateQuarterInput();
    updateDateInput();
    updateUI();
});

todayQuarterBtn.addEventListener('click', () => {
    selectedQuarter = getCurrentQuarter();
    updateQuarterInput();
    updateDateInput();
    updateUI();
});

quarterInput.addEventListener('change', (e) => {
    if (e.target.value) {
        selectedQuarter = e.target.value;
        // Обновляем selectedMonth на первый месяц квартала для синхронизации
        const months = getMonthsInQuarter(selectedQuarter);
        selectedMonth = months[0];
        updateDateInput();
        updateUI();
    }
});

// Добавляем возможность добавления по Enter
amountInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTransaction('income');
    }
});

descriptionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        amountInput.focus();
    }
});

// Обработчик смены языка
languageSelect.addEventListener('change', (e) => {
    currentLanguage = e.target.value;
    localStorage.setItem('language', currentLanguage);
    updateLanguage();
});

// Функция для обновления всех текстов на странице
function updateLanguage() {
    // Обновляем элементы с data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (el.hasAttribute('data-placeholder')) {
            el.placeholder = t(key);
        } else {
            el.textContent = t(key);
        }
    });

    // Обновляем опции квартала
    updateQuarterOptions();

    // Обновляем UI
    updateUI();
}

// Функция для обновления опций квартала
function updateQuarterOptions() {
    const year = new Date().getFullYear();
    const options = [
        `${year}-Q1|${year} - ${t('Q1')}`,
        `${year}-Q2|${year} - ${t('Q2')}`,
        `${year}-Q3|${year} - ${t('Q3')}`,
        `${year}-Q4|${year} - ${t('Q4')}`
    ];

    quarterInput.innerHTML = options.map(opt => {
        const [value, label] = opt.split('|');
        return `<option value="${value}">${label}</option>`;
    }).join('');

    // Восстанавливаем выбранное значение
    quarterInput.value = selectedQuarter;
}

// Инициализация при загрузке страницы
languageSelect.value = currentLanguage;
updateMonthInput();
updateDateInput();
updateLanguage();
descriptionInput.focus();
