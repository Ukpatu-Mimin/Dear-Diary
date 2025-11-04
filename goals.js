const shortTermGoals = document.querySelector('#shortTermGoals');
const longTermGoals = document.querySelector('#longTermGoals');
const goalInput = document.querySelector('#goalInput');
const addGoalBtn = document.querySelector('#addGoalBtn');
const goalSpinner = document.querySelector('#goalSpinner');
const goalAlert = document.querySelector('#goalAlert');
const shortTermRadio = document.querySelector('#shortTerm');
const longTermRadio = document.querySelector('#longTerm');

// Debugging: Verify elements exist
console.log('Elements loaded:', {
    shortTermGoals: !!shortTermGoals,
    longTermGoals: !!longTermGoals,
    goalInput: !!goalInput,
    addGoalBtn: !!addGoalBtn,
    goalSpinner: !!goalSpinner,
    goalAlert: !!goalAlert,
    shortTermRadio: !!shortTermRadio,
    longTermRadio: !!longTermRadio
});

// Load Goals from localStorage
const loadGoals = () => {
    if (!shortTermGoals || !longTermGoals) {
        console.error('Goal lists not found');
        return;
    }
    shortTermGoals.innerHTML = '';
    longTermGoals.innerHTML = '';
    let goals = [];
    try {
        goals = JSON.parse(localStorage.getItem('goals') || '[]');
        if (!Array.isArray(goals)) {
            console.warn('Invalid goals data, resetting to []');
            goals = [];
            localStorage.setItem('goals', JSON.stringify(goals));
        }
    } catch (error) {
        console.error('Error parsing goals from localStorage:', error);
        localStorage.setItem('goals', JSON.stringify([]));
        goals = [];
    }

    const shortTerm = goals.filter(goal => goal.type === 'short');
    const longTerm = goals.filter(goal => goal.type === 'long');

    shortTerm.forEach(goal => {
        const li = document.createElement('li');
        li.className = `list-group-item goal-item ${goal.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" ${goal.completed ? 'checked' : ''}>
            ${goal.text}
        `;
        li.querySelector('input').addEventListener('change', () => {
            goal.completed = !goal.completed;
            localStorage.setItem('goals', JSON.stringify(goals));
            li.classList.toggle('completed');
            console.log('Goal toggled:', goal.text, 'Completed:', goal.completed);
        });
        shortTermGoals.appendChild(li);
        li.style.opacity = '0';
        setTimeout(() => {
            li.style.opacity = '1';
        }, 100);
    });

    longTerm.forEach(goal => {
        const li = document.createElement('li');
        li.className = `list-group-item goal-item ${goal.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" ${goal.completed ? 'checked' : ''}>
            ${goal.text}
        `;
        li.querySelector('input').addEventListener('change', () => {
            goal.completed = !goal.completed;
            localStorage.setItem('goals', JSON.stringify(goals));
            li.classList.toggle('completed');
            console.log('Goal toggled:', goal.text, 'Completed:', goal.completed);
        });
        longTermGoals.appendChild(li);
        li.style.opacity = '0';
        setTimeout(() => {
            li.style.opacity = '1';
        }, 100);
    });
    console.log('Goals loaded:', { shortTerm: shortTerm.length, longTerm: longTerm.length });
};

// Add Goal
if (addGoalBtn) {
    addGoalBtn.addEventListener('click', () => {
        console.log('Add goal button clicked');
        if (!goalInput || !shortTermRadio || !longTermRadio) {
            console.error('Form elements missing');
            goalAlert.textContent = 'Form elements not found';
            goalAlert.classList.remove('d-none');
            goalSpinner.classList.add('d-none');
            return;
        }

        const text = goalInput.value.trim();
        const type = shortTermRadio.checked ? 'short' : 'long';
        if (!text) {
            goalAlert.textContent = 'Goal cannot be empty';
            goalAlert.classList.remove('d-none');
            console.log('Goal empty error');
            goalSpinner.classList.add('d-none');
            return;
        }

        goalSpinner.classList.remove('d-none');
        goalAlert.classList.add('d-none');

        try {
            const goals = JSON.parse(localStorage.getItem('goals') || '[]');
            if (!Array.isArray(goals)) {
                console.warn('Invalid goals data, resetting to []');
                localStorage.setItem('goals', JSON.stringify([]));
            }
            goals.push({
                id: Date.now().toString(),
                text,
                type,
                completed: false,
                createdAt: new Date().toISOString()
            });
            localStorage.setItem('goals', JSON.stringify(goals));
            goalInput.value = '';
            shortTermRadio.checked = true; // Reset to short-term
            loadGoals();
            console.log('Goal added:', { text, type });
        } catch (error) {
            console.error('Add goal error:', error);
            goalAlert.textContent = 'Failed to add goal: ' + error.message;
            goalAlert.classList.remove('d-none');
        } finally {
            goalSpinner.classList.add('d-none');
        }
    });
} else {
    console.error('addGoalBtn not found');
}

// Initial Load
loadGoals();