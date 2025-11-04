document.addEventListener('DOMContentLoaded', () => {
    console.log('Spend-Thrift page loaded');
    const spendThriftInput = document.getElementById('spendThriftInput');
    const addSpendThriftBtn = document.getElementById('addSpendThriftBtn');
    const spendThriftList = document.getElementById('spendThriftList');
    const spendThriftSpinner = document.getElementById('spendThriftSpinner');
    const spendThriftAlert = document.getElementById('spendThriftAlert');
    const historyModal = document.getElementById('historyModal');
    const historyList = document.getElementById('historyList');

    // Load spend-thrift items from localStorage
    let spendThriftItems = JSON.parse(localStorage.getItem('spendThrift')) || [];

    // Function to generate unique ID
    const generateId = () => Math.random().toString(36).substr(2, 9);

    // Function to save spend-thrift items to localStorage
    const saveSpendThrift = () => {
        localStorage.setItem('spendThrift', JSON.stringify(spendThriftItems));
    };

    // Function to render spend-thrift items
    const renderSpendThrift = () => {
        spendThriftList.innerHTML = '';
        spendThriftItems.forEach(item => {
            const li = document.createElement('li');
            li.className = `list-group-item spend-thrift-item ${item.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <input type="checkbox" ${item.completed ? 'checked' : ''} data-id="${item.id}">
                <span>${item.text}</span>
            `;
            spendThriftList.appendChild(li);
        });
    };

    // Function to show alert
    const showAlert = (message) => {
        spendThriftAlert.textContent = message;
        spendThriftAlert.classList.remove('d-none');
        setTimeout(() => spendThriftAlert.classList.add('d-none'), 3000);
    };

    // Function to save current spend-thrift list to history
    const saveToHistory = () => {
        const today = new Date().toISOString().split('T')[0];
        const history = JSON.parse(localStorage.getItem('spendThriftHistory')) || {};
        if (spendThriftItems.length > 0) {
            history[today] = [...spendThriftItems];
            localStorage.setItem('spendThriftHistory', JSON.stringify(history));
        }
    };

    // Function to render history in modal
    const renderHistory = () => {
        const history = JSON.parse(localStorage.getItem('spendThriftHistory')) || {};
        historyList.innerHTML = '';
        Object.keys(history).sort().reverse().forEach(date => {
            const items = history[date];
            const dateDiv = document.createElement('div');
            dateDiv.className = 'mb-3';
            dateDiv.innerHTML = `<h6 style="font-family: 'Pacifico', cursive; color: #FFB6C1;">${date}</h6>`;
            const ul = document.createElement('ul');
            ul.className = 'list-group';
            items.forEach(item => {
                const li = document.createElement('li');
                li.className = `list-group-item spend-thrift-item ${item.completed ? 'completed' : ''}`;
                li.innerHTML = `<span>${item.text}</span>`;
                ul.appendChild(li);
            });
            dateDiv.appendChild(ul);
            historyList.appendChild(dateDiv);
        });
    };

    // Add spend-thrift item
    addSpendThriftBtn.addEventListener('click', () => {
        const text = spendThriftInput.value.trim();
        if (!text) {
            showAlert('Please enter a spending/saving goal.');
            return;
        }
        spendThriftSpinner.classList.remove('d-none');
        setTimeout(() => {
            spendThriftItems.push({
                id: generateId(),
                text,
                completed: false,
                createdAt: new Date().toISOString()
            });
            saveSpendThrift();
            renderSpendThrift();
            spendThriftInput.value = '';
            spendThriftSpinner.classList.add('d-none');
            console.log('Spend-thrift item added:', text);
        }, 500);
    });

    // Toggle spend-thrift item completion
    spendThriftList.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            const id = e.target.dataset.id;
            spendThriftItems = spendThriftItems.map(item =>
                item.id === id ? { ...item, completed: e.target.checked } : item
            );
            saveSpendThrift();
            renderSpendThrift();
            console.log('Spend-thrift item toggled:', id);
        }
    });

    // Save to history when modal is opened
    historyModal.addEventListener('show.bs.modal', () => {
        saveToHistory();
        renderHistory();
    });

    // Initial render
    console.log('Initial spend-thrift list:', spendThriftItems);
    renderSpendThrift();
});