const taskList = document.querySelector('#taskList');
const habitList = document.querySelector('#habitList');
const historyList = document.querySelector('#historyList');
const taskInput = document.querySelector('#taskInput');
const addTaskBtn = document.querySelector('#addTaskBtn');
const taskSpinner = document.querySelector('#taskSpinner');
const taskAlert = document.querySelector('#taskAlert');

// Debugging: Verify elements exist
console.log('Elements loaded:', {
    taskList: !!taskList,
    habitList: !!habitList,
    historyList: !!historyList,
    taskInput: !!taskInput,
    addTaskBtn: !!addTaskBtn,
    taskSpinner: !!taskSpinner,
    taskAlert: !!taskAlert
});

// Load Tasks from localStorage (current tasks, today only)
const loadTasks = () => {
    taskList.innerHTML = '';
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const today = new Date().toISOString().split('T')[0];
    tasks
        .filter(task => task.createdAt.split('T')[0] === today)
        .forEach(task => {
            const li = document.createElement('li');
            li.className = `list-group-item task-item ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                ${task.text}
            `;
            li.querySelector('input').addEventListener('change', () => {
                task.completed = !task.completed;
                localStorage.setItem('tasks', JSON.stringify(tasks));
                li.classList.toggle('completed');
                console.log('Task toggled:', task.text, 'Completed:', task.completed);
            });
            taskList.appendChild(li);
            li.style.opacity = '0';
            setTimeout(() => {
                li.style.opacity = '1';
            }, 100);
        });
};

// Load Habits (Tasks repeated for 3+ consecutive days)
const loadHabits = () => {
    habitList.innerHTML = '';
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskMap = {};
    tasks.forEach(task => {
        const date = task.createdAt.split('T')[0];
        if (!taskMap[task.text]) taskMap[task.text] = [];
        taskMap[task.text].push(new Date(task.createdAt));
    });

    const habits = [];
    for (const [text, dates] of Object.entries(taskMap)) {
        if (dates.length >= 3) {
            dates.sort((a, b) => a - b);
            let isHabit = true;
            for (let i = 1; i < dates.length; i++) {
                const diffDays = (dates[i] - dates[i-1]) / (1000 * 60 * 60 * 24);
                if (diffDays > 1) {
                    isHabit = false;
                    break;
                }
            }
            if (isHabit) habits.push(text);
        }
    }

    habits.forEach(text => {
        const li = document.createElement('li');
        li.className = 'habit-item';
        li.textContent = text;
        habitList.appendChild(li);
    });
    console.log('Habits loaded:', habits);
};

// Load History (Tasks from previous days)
const loadHistory = () => {
    historyList.innerHTML = '';
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const today = new Date().toISOString().split('T')[0];
    const tasksByDate = {};
    
    tasks
        .filter(task => task.createdAt.split('T')[0] !== today)
        .forEach(task => {
            const date = task.createdAt.split('T')[0];
            if (!tasksByDate[date]) tasksByDate[date] = [];
            tasksByDate[date].push(task);
        });

    const sortedDates = Object.keys(tasksByDate).sort((a, b) => new Date(b) - new Date(a));
    
    if (sortedDates.length === 0) {
        historyList.innerHTML = '<p class="text-center" style="font-family: \'Roboto\', sans-serif; color: #4B0082;">No previous to-do lists found. 🌸</p>';
        return;
    }

    sortedDates.forEach(date => {
        const dateHeader = document.createElement('h6');
        dateHeader.style = "font-family: 'Pacifico', cursive; ";
        dateHeader.textContent = new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        historyList.appendChild(dateHeader);

        const ul = document.createElement('ul');
        ul.className = 'list-group list-group-flush';
        tasksByDate[date].forEach(task => {
            const li = document.createElement('li');
            li.className = `list-group-item task-item ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `<input type="checkbox" ${task.completed ? 'checked' : ''} disabled> ${task.text}`;
            ul.appendChild(li);
        });
        historyList.appendChild(ul);
    });
    console.log('History loaded:', tasksByDate);
};

// Add Task
if (addTaskBtn) {
    addTaskBtn.addEventListener('click', () => {
        console.log('Add task button clicked');
        const text = taskInput.value.trim();
        if (!text) {
            taskAlert.textContent = 'Task cannot be empty';
            taskAlert.classList.remove('d-none');
            console.log('Task empty error');
            return;
        }

        taskSpinner.classList.remove('d-none');
        taskAlert.classList.add('d-none');

        try {
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            tasks.push({
                id: Date.now().toString(),
                text,
                completed: false,
                createdAt: new Date().toISOString()
            });
            localStorage.setItem('tasks', JSON.stringify(tasks));
            taskInput.value = '';
            loadTasks();
            loadHabits();
            console.log('Task added:', text);
        } catch (error) {
            console.error('Add task error:', error);
            taskAlert.textContent = 'Failed to add task';
            taskAlert.classList.remove('d-none');
        } finally {
            taskSpinner.classList.add('d-none');
        }
    });
} else {
    console.error('addTaskBtn not found');
}

// Initial Load
loadTasks();
loadHabits();
loadHistory();