document.addEventListener('DOMContentLoaded', () => {
    console.log('Bucket List page loaded');
    const bucketListInput = document.getElementById('bucketListInput');
    const addBucketListBtn = document.getElementById('addBucketListBtn');
    const bucketList = document.getElementById('bucketList');
    const bucketListSpinner = document.getElementById('bucketListSpinner');
    const bucketListAlert = document.getElementById('bucketListAlert');
    const historyModal = document.getElementById('historyModal');
    const historyList = document.getElementById('historyList');

    // Load bucket list items from localStorage
    let bucketListItems = JSON.parse(localStorage.getItem('bucketList')) || [];

    // Function to generate unique ID
    const generateId = () => Math.random().toString(36).substr(2, 9);

    // Function to save bucket list to localStorage
    const saveBucketList = () => {
        localStorage.setItem('bucketList', JSON.stringify(bucketListItems));
    };

    // Function to render bucket list items
    const renderBucketList = () => {
        bucketList.innerHTML = '';
        bucketListItems.forEach(item => {
            const li = document.createElement('li');
            li.className = `list-group-item bucket-list-item ${item.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <input type="checkbox" ${item.completed ? 'checked' : ''} data-id="${item.id}">
                <span>${item.text}</span>
            `;
            bucketList.appendChild(li);
        });
    };

    // Function to show alert
    const showAlert = (message) => {
        bucketListAlert.textContent = message;
        bucketListAlert.classList.remove('d-none');
        setTimeout(() => bucketListAlert.classList.add('d-none'), 3000);
    };

    // Function to save current bucket list to history
    const saveToHistory = () => {
        const today = new Date().toISOString().split('T')[0];
        const history = JSON.parse(localStorage.getItem('bucketListHistory')) || {};
        if (bucketListItems.length > 0) {
            history[today] = [...bucketListItems];
            localStorage.setItem('bucketListHistory', JSON.stringify(history));
        }
    };

    // Function to render history in modal
    const renderHistory = () => {
        const history = JSON.parse(localStorage.getItem('bucketListHistory')) || {};
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
                li.className = `list-group-item bucket-list-item ${item.completed ? 'completed' : ''}`;
                li.innerHTML = `<span>${item.text}</span>`;
                ul.appendChild(li);
            });
            dateDiv.appendChild(ul);
            historyList.appendChild(dateDiv);
        });
    };

    // Add bucket list item
    addBucketListBtn.addEventListener('click', () => {
        const text = bucketListInput.value.trim();
        if (!text) {
            showAlert('Please enter a bucket list item.');
            return;
        }
        bucketListSpinner.classList.remove('d-none');
        setTimeout(() => {
            bucketListItems.push({
                id: generateId(),
                text,
                completed: false,
                createdAt: new Date().toISOString()
            });
            saveBucketList();
            renderBucketList();
            bucketListInput.value = '';
            bucketListSpinner.classList.add('d-none');
            console.log('Bucket list item added:', text);
        }, 500);
    });

    // Toggle bucket list item completion
    bucketList.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            const id = e.target.dataset.id;
            bucketListItems = bucketListItems.map(item =>
                item.id === id ? { ...item, completed: e.target.checked } : item
            );
            saveBucketList();
            renderBucketList();
            console.log('Bucket list item toggled:', id);
        }
    });

    // Save to history when modal is opened
    historyModal.addEventListener('show.bs.modal', () => {
        saveToHistory();
        renderHistory();
    });

    // Initial render
    console.log('Initial bucket list:', bucketListItems);
    renderBucketList();
});