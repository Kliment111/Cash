// Simple Financial Tracker - Maximum Simplicity

// Global data
let incomes = [];
let expenses = [];
let assets = [];
let liabilities = [];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    updateSummary();
    renderAllSections();
    setTodayDate();
});

// Simple tab switching
function switchToTab(tabName) {
    // Hide all panels
    document.querySelectorAll('.dia-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.dia-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected panel
    const selectedPanel = document.querySelector(`[data-panel="${tabName}"]`);
    if (selectedPanel) {
        selectedPanel.classList.add('active');
    }
    
    // Add active class to clicked tab
    if (event && event.target) {
        event.target.classList.add('active');
    }
}

// Modal functions
function openIncomeModal() {
    document.getElementById('incomeModal').classList.add('show');
}

function closeIncomeModal() {
    document.getElementById('incomeModal').classList.remove('show');
    resetIncomeForm();
}

function openExpenseModal() {
    document.getElementById('expenseModal').classList.add('show');
}

function closeExpenseModal() {
    document.getElementById('expenseModal').classList.remove('show');
    resetExpenseForm();
}

function openAssetModal() {
    document.getElementById('assetModal').classList.add('show');
}

function closeAssetModal() {
    document.getElementById('assetModal').classList.remove('show');
    resetAssetForm();
}

function openLiabilityModal() {
    document.getElementById('liabilityModal').classList.add('show');
}

function closeLiabilityModal() {
    document.getElementById('liabilityModal').classList.remove('show');
    resetLiabilityForm();
}

// Add transactions
function addIncomeTransaction() {
    const type = document.getElementById('incomeType').value;
    const description = document.getElementById('incomeDescription').value;
    const amount = parseFloat(document.getElementById('incomeAmount').value);
    const date = document.getElementById('incomeDate').value;
    
    if (!description || !amount || !date) {
        alert('Заполните все поля');
        return;
    }
    
    const income = {
        id: Date.now(),
        type,
        description,
        amount,
        date
    };
    
    incomes.push(income);
    saveData();
    updateSummary();
    renderIncomeSection();
    closeIncomeModal();
}

function addExpenseTransaction() {
    const type = document.getElementById('expenseType').value;
    const description = document.getElementById('expenseDescription').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const date = document.getElementById('expenseDate').value;
    
    if (!description || !amount || !date) {
        alert('Заполните все поля');
        return;
    }
    
    const expense = {
        id: Date.now(),
        type,
        description,
        amount,
        date
    };
    
    expenses.push(expense);
    saveData();
    updateSummary();
    renderExpenseSection();
    closeExpenseModal();
}

function addAssetTransaction() {
    const name = document.getElementById('assetName').value;
    const amount = parseFloat(document.getElementById('assetAmount').value);
    const rate = parseFloat(document.getElementById('assetRate').value) || 0;
    
    if (!name || !amount) {
        alert('Заполните название и сумму');
        return;
    }
    
    const asset = {
        id: Date.now(),
        name,
        amount,
        rate
    };
    
    assets.push(asset);
    saveData();
    updateSummary();
    renderAssetSection();
    closeAssetModal();
}

function addLiabilityTransaction() {
    const name = document.getElementById('liabilityName').value;
    const amount = parseFloat(document.getElementById('liabilityAmount').value);
    const rate = parseFloat(document.getElementById('liabilityRate').value) || 0;
    
    if (!name || !amount) {
        alert('Заполните название и сумму');
        return;
    }
    
    const liability = {
        id: Date.now(),
        name,
        amount,
        rate
    };
    
    liabilities.push(liability);
    saveData();
    updateSummary();
    renderLiabilitySection();
    closeLiabilityModal();
}

// Delete functions
function deleteIncome(id) {
    if (confirm('Удалить доход?')) {
        incomes = incomes.filter(income => income.id !== id);
        saveData();
        updateSummary();
        renderIncomeSection();
    }
}

function deleteExpense(id) {
    if (confirm('Удалить расход?')) {
        expenses = expenses.filter(expense => expense.id !== id);
        saveData();
        updateSummary();
        renderExpenseSection();
    }
}

function deleteAsset(id) {
    if (confirm('Удалить актив?')) {
        assets = assets.filter(asset => asset.id !== id);
        saveData();
        updateSummary();
        renderAssetSection();
    }
}

function deleteLiability(id) {
    if (confirm('Удалить пассив?')) {
        liabilities = liabilities.filter(liability => liability.id !== id);
        saveData();
        updateSummary();
        renderLiabilitySection();
    }
}

// Render functions
function renderIncomeSection() {
    const container = document.getElementById('incomeList');
    
    if (incomes.length === 0) {
        container.innerHTML = `
            <div class="dia-empty-state">
                <div class="dia-empty-icon">💰</div>
                <div class="dia-empty-text">Нет доходов</div>
                <div class="dia-empty-subtext">Добавьте свой первый доход</div>
            </div>
        `;
        return;
    }
    
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    document.getElementById('totalIncomeAmount').textContent = totalIncome.toFixed(2) + ' $';
    
    container.innerHTML = incomes.map(income => `
        <div class="dia-card">
            <div class="dia-card-header">
                <div class="dia-card-title">${income.description}</div>
                <div class="dia-card-amount">+${income.amount.toFixed(2)} $</div>
            </div>
            <div class="dia-card-date">${income.date}</div>
            <div class="dia-card-actions">
                <button class="dia-card-btn delete" onclick="deleteIncome(${income.id})">Удалить</button>
            </div>
        </div>
    `).join('');
}

function renderExpenseSection() {
    const container = document.getElementById('expenseList');
    
    if (expenses.length === 0) {
        container.innerHTML = `
            <div class="dia-empty-state">
                <div class="dia-empty-icon">💸</div>
                <div class="dia-empty-text">Нет расходов</div>
                <div class="dia-empty-subtext">Добавьте свой первый расход</div>
            </div>
        `;
        return;
    }
    
    const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    document.getElementById('totalExpenseAmount').textContent = totalExpense.toFixed(2) + ' $';
    
    container.innerHTML = expenses.map(expense => `
        <div class="dia-card">
            <div class="dia-card-header">
                <div class="dia-card-title">${expense.description}</div>
                <div class="dia-card-amount">-${expense.amount.toFixed(2)} $</div>
            </div>
            <div class="dia-card-date">${expense.date}</div>
            <div class="dia-card-actions">
                <button class="dia-card-btn delete" onclick="deleteExpense(${expense.id})">Удалить</button>
            </div>
        </div>
    `).join('');
}

function renderAssetSection() {
    const container = document.getElementById('assetsList');
    
    if (assets.length === 0) {
        container.innerHTML = `
            <div class="dia-empty-state">
                <div class="dia-empty-icon">💳</div>
                <div class="dia-empty-text">Нет активов</div>
                <div class="dia-empty-subtext">Добавьте свой первый актив</div>
            </div>
        `;
        return;
    }
    
    const totalAssets = assets.reduce((sum, asset) => sum + asset.amount, 0);
    document.getElementById('totalAssetsAmount').textContent = totalAssets.toFixed(2) + ' $';
    
    container.innerHTML = assets.map(asset => `
        <div class="dia-card">
            <div class="dia-card-header">
                <div class="dia-card-title">${asset.name}</div>
                <div class="dia-card-amount">${asset.amount.toFixed(2)} $</div>
            </div>
            ${asset.rate ? `<div class="dia-card-date">Ставка: ${asset.rate}% годовых</div>` : ''}
            <div class="dia-card-actions">
                <button class="dia-card-btn delete" onclick="deleteAsset(${asset.id})">Удалить</button>
            </div>
        </div>
    `).join('');
}

function renderLiabilitySection() {
    const container = document.getElementById('liabilitiesList');
    
    if (liabilities.length === 0) {
        container.innerHTML = `
            <div class="dia-empty-state">
                <div class="dia-empty-icon">📊</div>
                <div class="dia-empty-text">Нет пассивов</div>
                <div class="dia-empty-subtext">Добавьте свой первый пассив</div>
            </div>
        `;
        return;
    }
    
    const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.amount, 0);
    document.getElementById('totalLiabilitiesAmount').textContent = totalLiabilities.toFixed(2) + ' $';
    
    container.innerHTML = liabilities.map(liability => `
        <div class="dia-card">
            <div class="dia-card-header">
                <div class="dia-card-title">${liability.name}</div>
                <div class="dia-card-amount">${liability.amount.toFixed(2)} $</div>
            </div>
            ${liability.rate ? `<div class="dia-card-date">Ставка: ${liability.rate}% годовых</div>` : ''}
            <div class="dia-card-actions">
                <button class="dia-card-btn delete" onclick="deleteLiability(${liability.id})">Удалить</button>
            </div>
        </div>
    `).join('');
}

function renderAllSections() {
    renderIncomeSection();
    renderExpenseSection();
    renderAssetSection();
    renderLiabilitySection();
}

// Update summary
function updateSummary() {
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalAssets = assets.reduce((sum, asset) => sum + asset.amount, 0);
    const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.amount, 0);
    const balance = totalIncome - totalExpense;
    
    document.getElementById('summaryIncome').textContent = totalIncome.toFixed(2) + ' $';
    document.getElementById('summaryExpense').textContent = totalExpense.toFixed(2) + ' $';
    document.getElementById('summaryBalance').textContent = balance.toFixed(2) + ' $';
}

// Reset forms
function resetIncomeForm() {
    document.getElementById('incomeType').value = 'other';
    document.getElementById('incomeDescription').value = '';
    document.getElementById('incomeAmount').value = '';
    document.getElementById('incomeDate').value = '';
}

function resetExpenseForm() {
    document.getElementById('expenseType').value = 'food';
    document.getElementById('expenseDescription').value = '';
    document.getElementById('expenseAmount').value = '';
    document.getElementById('expenseDate').value = '';
}

function resetAssetForm() {
    document.getElementById('assetName').value = '';
    document.getElementById('assetAmount').value = '';
    document.getElementById('assetRate').value = '';
}

function resetLiabilityForm() {
    document.getElementById('liabilityName').value = '';
    document.getElementById('liabilityAmount').value = '';
    document.getElementById('liabilityRate').value = '';
}

// Set today's date
function setTodayDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('incomeDate').value = today;
    document.getElementById('expenseDate').value = today;
}

// Data persistence
function saveData() {
    const data = {
        incomes,
        expenses,
        assets,
        liabilities
    };
    localStorage.setItem('financialTracker', JSON.stringify(data));
}

function loadData() {
    const savedData = localStorage.getItem('financialTracker');
    if (savedData) {
        const data = JSON.parse(savedData);
        incomes = data.incomes || [];
        expenses = data.expenses || [];
        assets = data.assets || [];
        liabilities = data.liabilities || [];
    }
}

// Close modals when clicking outside
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
    }
});

// Settings modal
function openSettingsModal() {
    alert('Настройки в разработке');
}

function closeSettingsModal() {
    // Settings modal not implemented yet
}

// Calendar
function openCalendar() {
    alert('Календарь в разработке');
}
