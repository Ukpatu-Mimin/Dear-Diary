const expenseList = document.querySelector('#expenseList');
const historyList = document.querySelector('#historyList');
const descriptionInput = document.querySelector('#descriptionInput');
const amountInput = document.querySelector('#amountInput');
const budgetInput = document.querySelector('#budgetInput');
const addExpenseBtn = document.querySelector('#addExpenseBtn');
const expenseSpinner = document.querySelector('#expenseSpinner');
const expenseAlert = document.querySelector('#expenseAlert');
const totalExpense = document.querySelector('#totalExpense');
const spendingChecker = document.querySelector('#spendingChecker');
const expenseChartCanvas = document.getElementById('expenseChart');
const expenseChartCtx = expenseChartCanvas.getContext('2d');

// Debugging: Verify elements exist
console.log('Elements loaded:', {
    expenseList: !!expenseList,
    historyList: !!historyList,
    descriptionInput: !!descriptionInput,
    amountInput: !!amountInput,
    budgetInput: !!budgetInput,
    addExpenseBtn: !!addExpenseBtn,
    expenseSpinner: !!expenseSpinner,
    expenseAlert: !!expenseAlert,
    totalExpense: !!totalExpense,
    spendingChecker: !!spendingChecker,
    expenseChartCtx: !!expenseChartCtx
});

// Chart instance to allow destruction
let expenseChart = null;

// Load Expenses from localStorage (today's expenses)
const loadExpenses = () => {
    expenseList.innerHTML = '';
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    const today = new Date().toISOString().split('T')[0];
    let total = 0;
    expenses
        .filter(expense => expense.createdAt.split('T')[0] === today)
        .forEach(expense => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.innerHTML = `${expense.description} - ₦${expense.amount}`;
            expenseList.appendChild(li);
            total += expense.amount;
            li.style.opacity = '0';
            setTimeout(() => {
                li.style.opacity = '1';
            }, 100);
        });
    totalExpense.textContent = `Total Spent Today: ₦${total.toFixed(2)}`;
    updateSpendingChecker(total);
    updateChart();
};

// Update Spending Checker
const updateSpendingChecker = (total) => {
    const budget = parseFloat(localStorage.getItem('dailyBudget')) || 0;
    if (budget === 0) {
        spendingChecker.textContent = 'Set your daily budget to track spending/saving.';
        spendingChecker.style.color = '#4B0082';
        return;
    }
    const savings = budget - total;
    spendingChecker.textContent = savings >= 0 ? `You're saving ₦${savings.toFixed(2)}! Keep it up 💖` : `You're overspending by ₦${Math.abs(savings).toFixed(2)}! Watch out 🌸`;
    spendingChecker.style.color = savings >= 0 ? '#DDA0DD' : '#C71585';
};

// Update Chart (Expense rates per day)
const updateChart = () => {
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    const expensesByDate = {};
    expenses.forEach(expense => {
        const date = expense.createdAt.split('T')[0];
        if (!expensesByDate[date]) expensesByDate[date] = 0;
        expensesByDate[date] += expense.amount;
    });

    const sortedDates = Object.keys(expensesByDate).sort();
    const labels = sortedDates.map(date => new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
    const data = sortedDates.map(date => expensesByDate[date]);

    // Destroy existing chart to prevent overlap
    if (expenseChart) {
        expenseChart.destroy();
    }

    expenseChart = new Chart(expenseChartCtx, {
        type: 'bar', // Changed to bar chart for better UI
        data: {
            labels,
            datasets: [{
                label: 'Expenses (Naira)',
                data,
                backgroundColor: '#ff5b8f', // Softer magenta
                borderColor: '#C71585', // Richer purple
                borderWidth: 1,
                borderRadius: 5, // Rounded bars
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        font: {
                            family: "'Roboto', sans-serif",
                            size: 14
                        },
                        color: '#4B0082'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount (Naira)',
                        color: '#4B0082',
                        font: {
                            family: "'Roboto', sans-serif",
                            size: 14
                        }
                    },
                    grid: {
                        color: 'rgba(221, 160, 221, 0.2)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date',
                        color: '#4B0082',
                        font: {
                            family: "'Roboto', sans-serif",
                            size: 14
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
    console.log('Chart updated:', { labels, data });
};

// Load History (Expenses from previous days)
const loadHistory = () => {
    historyList.innerHTML = '';
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    const today = new Date().toISOString().split('T')[0];
    const expensesByDate = {};
    
    expenses
        .filter(expense => expense.createdAt.split('T')[0] !== today)
        .forEach(expense => {
            const date = expense.createdAt.split('T')[0];
            if (!expensesByDate[date]) expensesByDate[date] = [];
            expensesByDate[date].push(expense);
        });

    const sortedDates = Object.keys(expensesByDate).sort((a, b) => new Date(b) - new Date(a));
    
    if (sortedDates.length === 0) {
        historyList.innerHTML = '<p class="text-center" style="font-family: \'Roboto\', sans-serif; color: #ff5b8f;">No previous expenses found. 🌸</p>';
        return;
    }

    sortedDates.forEach(date => {
        const dateHeader = document.createElement('h6');
        dateHeader.style = "font-family: 'Pacifico', cursive; color: #DDA0DD;";
        dateHeader.textContent = new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        historyList.appendChild(dateHeader);

        const ul = document.createElement('ul');
        ul.className = 'list-group list-group-flush';
        expensesByDate[date].forEach(expense => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.innerHTML = `${expense.description} - ₦${expense.amount.toFixed(2)}`;
            ul.appendChild(li);
        });
        historyList.appendChild(ul);
    });
    console.log('History loaded:', expensesByDate);
};

// Set Budget
budgetInput.addEventListener('change', () => {
    const budget = parseFloat(budgetInput.value);
    if (isNaN(budget) || budget < 0) {
        expenseAlert.textContent = 'Please enter a valid budget';
        expenseAlert.classList.remove('d-none');
        return;
    }
    localStorage.setItem('dailyBudget', budget);
    loadExpenses();
    console.log('Budget set:', budget);
});

// Add Expense
if (addExpenseBtn) {
    addExpenseBtn.addEventListener('click', () => {
        console.log('Add expense button clicked');
        const description = descriptionInput.value.trim();
        const amount = parseFloat(amountInput.value);
        if (!description || isNaN(amount) || amount <= 0) {
            expenseAlert.textContent = 'Please enter a valid description and amount';
            expenseAlert.classList.remove('d-none');
            console.log('Invalid input');
            return;
        }

        expenseSpinner.classList.remove('d-none');
        expenseAlert.classList.add('d-none');

        try {
            const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
            expenses.push({
                id: Date.now().toString(),
                description,
                amount,
                createdAt: new Date().toISOString()
            });
            localStorage.setItem('expenses', JSON.stringify(expenses));
            descriptionInput.value = '';
            amountInput.value = '';
            loadExpenses();
            loadHistory();
            console.log('Expense added:', { description, amount });
        } catch (error) {
            console.error('Add expense error:', error);
            expenseAlert.textContent = 'Failed to add expense';
            expenseAlert.classList.remove('d-none');
        } finally {
            expenseSpinner.classList.add('d-none');
        }
    });
} else {
    console.error('addExpenseBtn not found');
}

// Initial Load
loadExpenses();
loadHistory();

// Load budget from localStorage
budgetInput.value = localStorage.getItem('dailyBudget') || '';