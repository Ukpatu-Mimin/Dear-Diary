document.addEventListener('DOMContentLoaded', () => {
    console.log('Journal page loaded');
    const journalTitle = document.getElementById('journalTitle');
    const journalTextArea = document.getElementById('journalTextArea');
    const addJournalBtn = document.getElementById('addJournalBtn');
    const pastEntries = document.getElementById('pastEntries');
    const journalSpinner = document.getElementById('journalSpinner');
    const journalAlert = document.getElementById('journalAlert');

    // Load journal entries from localStorage
    let journalEntriesData = JSON.parse(localStorage.getItem('journalEntries')) || [];

    // Function to generate unique ID
    const generateId = () => Math.random().toString(36).substr(2, 9);

    // Function to save journal entries to localStorage
    const saveJournalEntries = () => {
        localStorage.setItem('journalEntries', JSON.stringify(journalEntriesData));
    };

    // Function to render past entries
    const renderPastEntries = () => {
        pastEntries.innerHTML = '';
        journalEntriesData.forEach(entry => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-outline-primary past-entry-btn mb-2 w-100 text-start';
            const words = entry.text.trim().split(/\s+/);
            const preview = words.slice(0, 5).join(' ') + (words.length > 5 ? '...' : '');
            btn.innerHTML = `
                <strong>${entry.title}</strong><br>${preview}
                <small class="text-muted d-block">Added: ${new Date(entry.createdAt).toLocaleString('en-US', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })}</small>
            `;
            btn.addEventListener('click', () => {
                const fullText = prompt('Full Entry:', entry.text);
                if (fullText !== null) {
                    entry.text = fullText.trim();
                    saveJournalEntries();
                    renderPastEntries();
                }
            });
            pastEntries.appendChild(btn);
        });
    };

    // Function to show alert
    const showAlert = (message) => {
        journalAlert.textContent = message;
        journalAlert.classList.remove('d-none');
        setTimeout(() => journalAlert.classList.add('d-none'), 3000);
    };

    // Add journal entry
    addJournalBtn.addEventListener('click', () => {
        const title = journalTitle.value.trim();
        const text = journalTextArea.value.trim();
        if (!title || !text) {
            showAlert('Please enter both a title and your thoughts.');
            return;
        }
        journalSpinner.classList.remove('d-none');
        setTimeout(() => {
            journalEntriesData.push({
                id: generateId(),
                title,
                text,
                createdAt: new Date().toISOString()
            });
            saveJournalEntries();
            renderPastEntries();
            journalTitle.value = '';
            journalTextArea.value = '';
            journalSpinner.classList.add('d-none');
            console.log('Journal entry added:', title);
        }, 500);
    });

    // Initial render
    console.log('Initial journal entries:', journalEntriesData);
    renderPastEntries();
});