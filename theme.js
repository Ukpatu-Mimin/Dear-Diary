document.addEventListener('DOMContentLoaded', () => {
    const modeToggle = document.getElementById('modeToggle');
    const modeIcon = document.getElementById('modeIcon');
    let isDarkMode = localStorage.getItem('darkMode') === 'true';

    // Apply initial mode
    if (modeToggle) {
        document.body.classList.toggle('dark-mode', isDarkMode);
        modeIcon.textContent = isDarkMode ? '🌙' : '🌞';
    }

    // Toggle mode
    if (modeToggle) {
        modeToggle.addEventListener('click', () => {
            isDarkMode = !isDarkMode;
            document.body.classList.toggle('dark-mode', isDarkMode);
            modeIcon.textContent = isDarkMode ? '🌙' : '🌞';
            localStorage.setItem('darkMode', isDarkMode);
        });
    }
});

