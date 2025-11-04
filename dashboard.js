document.addEventListener("DOMContentLoaded", () => {
    const widgetButtons = document.querySelectorAll(".widget-btn");
    const widgetContent = document.getElementById("widget-content");
    const modeToggle = document.getElementById("modeToggle");
    const modeIcon = document.getElementById("modeIcon");
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const sidebar = document.getElementById("sidebar");
    const closeBtn = document.getElementById("closeBtn");

    // Toggle Hamburger Menu
    hamburgerBtn.addEventListener("click", () => {
        hamburgerBtn.classList.toggle("active");
        sidebar.classList.toggle("active");
        closeBtn.classList.toggle("d-none");
        if (sidebar.classList.contains("active")) {
            sidebar.classList.remove("collapsed");
            closeBtn.classList.add("active");
        } else {
            sidebar.classList.add("collapsed");
            closeBtn.classList.remove("active");
        }
    });

    // Close Sidebar on Click Outside or Close Button
    document.addEventListener("click", (event) => {
        if (
            !sidebar.contains(event.target) &&
            !hamburgerBtn.contains(event.target) &&
            sidebar.classList.contains("active")
        ) {
            hamburgerBtn.classList.remove("active");
            sidebar.classList.remove("active");
            sidebar.classList.add("collapsed");
            closeBtn.classList.remove("active");
            closeBtn.classList.add("d-none");
        }
    });

    closeBtn.addEventListener("click", () => {
        hamburgerBtn.classList.remove("active");
        sidebar.classList.remove("active");
        sidebar.classList.add("collapsed");
        closeBtn.classList.remove("active");
        closeBtn.classList.add("d-none");
    });

    // Mock data
    let journalEntries = JSON.parse(localStorage.getItem("journalEntries")) || [];
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    let goals = JSON.parse(localStorage.getItem("goals")) || [];
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let hydration = parseInt(localStorage.getItem("hydration")) || 0;
    let readingPages = parseInt(localStorage.getItem("readingPages")) || 0;
    let bathCount = parseInt(localStorage.getItem("bathCount")) || 0;

    // Widget Content Functions
    const widgets = {
  "quick-access": () => `
    <div class="quick-access-container">
        <div class="row g-3 g-md-4">
            ${[
                { href: "journal.html", icon: "fa-book", text: "Journal" },
                { href: "todo.html", icon: "fa-tasks", text: "To-Do" },
                { href: "expenses.html", icon: "fa-money-bill-wave", text: "Expenses" },
                { href: "goals.html", icon: "fa-bullseye", text: "Goals" },
                { href: "bucket-list.html", icon: "fa-list-alt", text: "Bucket List" },
                { href: "spend-thrift.html", icon: "fa-piggy-bank", text: "Spend-Thrift" }
            ].map(item => `
                <div class="col-12 col-md-6 col-lg-4 mb-3">
                    <a href="${item.href}" class="quick-access-tile d-block text-center h-100">
                        <div class="card glassy-card h-100 d-flex flex-column align-items-center justify-content-center p-3 shadow-sm">
                            <i class="fas ${item.icon} fa-2x mb-2 "></i>
                            <div class="tile-label">${item.text}</div>
                        </div>
                    </a>
                </div>
            `).join("")}
        </div>
    </div>
`,
        stats: () => {
            const today = new Date().toLocaleDateString();
            const dailyJournal = journalEntries.filter(
                (e) => new Date(e.createdAt).toLocaleDateString() === today
            ).length;
            const dailyExpenses = expenses
                .filter((e) => new Date(e.createdAt).toLocaleDateString() === today)
                .reduce((sum, e) => sum + (e.amount || 0), 0)
                .toFixed(2);
            const dailyGoals = goals.filter(
                (g) =>
                    g.completed && new Date(g.completedAt).toLocaleDateString() === today
            ).length;
            const dailyTasks = tasks.filter(
                (t) =>
                    t.completed && new Date(t.completedAt).toLocaleDateString() === today
            ).length;
            return `
                <div class="row g-1 text-center">
                    <div class="col-6 col-md-3 mb-2">
                        <div class="card glassy-card p-3 stats-card">
                            <i class="fas fa-book fa-2x"></i>
                            <h6>Journal</h6>
                            <span class="badge bg-pink display-6">${dailyJournal}</span>
                        </div>
                    </div>
                    <div class="col-6 col-md-3 mb-2">
                        <div class="card glassy-card p-3 stats-card">
                            <i class="fas fa-money-bill fa-2x"></i>
                            <h6>Expenses</h6>
                            <span class="badge bg-pink display-6">$${dailyExpenses}</span>
                        </div>
                    </div>
                    <div class="col-6 col-md-3 mb-2">
                        <div class="card glassy-card p-3 stats-card">
                            <i class="fas fa-bullseye fa-2x"></i>
                            <h6>Goals</h6>
                            <span class="badge bg-pink display-6">${dailyGoals}</span>
                        </div>
                    </div>
                    <div class="col-6 col-md-3 mb-2">
                        <div class="card glassy-card p-3 stats-card">
                            <i class="fas fa-check fa-2x"></i>
                            <h6>Tasks</h6>
                            <span class="badge bg-pink display-6">${dailyTasks}</span>
                        </div>
                    </div>
                </div>
            `;
        },
        tasks: () => {
            const today = new Date();
            const dailyTasks = tasks
                .filter(
                    (t) =>
                        new Date(t.dueDate).toLocaleDateString() ===
                        today.toLocaleDateString()
                )
                .map((t) => `<li class="task-item">${t.text}</li>`)
                .slice(0, 3);
            const soonGoals = goals
                .filter(
                    (g) =>
                        new Date(g.dueDate) <=
                        new Date(today.setDate(today.getDate() + 7)) && !g.completed
                )
                .map((g) => `<li class="task-item">Goal: ${g.text}</li>`)
                .slice(0, 3 - dailyTasks.length);
            return `
                <ul class="list-unstyled tasks-list">${
                    dailyTasks.length > 0 || soonGoals.length > 0
                        ? dailyTasks.concat(soonGoals).join("")
                        : "<li class='task-item no-tasks'>No tasks today</li>"
                }</ul>
            `;
        },
      bible: async () => {
    const CACHE_KEY = "bibleVerse";
    const CACHE_DURATION = 3 * 60 * 60 * 1000; // 3 hours in ms
    const now = Date.now();

    // Check cache
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
        const { text, reference, timestamp } = JSON.parse(cached);
        if (now - timestamp < CACHE_DURATION) {
            return `
                <p class="bible-text">${text} <em>(${reference})</em></p>
                <a href="https://biblegateway.com/passage/?search=${encodeURIComponent(reference)}&version=NIV" target="_blank" class="btn btn-sm btn-outline-pink mt-2">Read Now</a>
            `;
        }
    }

    // List of powerful verses (fallback if API fails)
    const fallbackVerses = [
        { text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.", reference: "John 3:16" },
        { text: "I can do all this through him who gives me strength.", reference: "Philippians 4:13" },
        { text: "The Lord is my shepherd, I lack nothing.", reference: "Psalm 23:1" },
        { text: "Trust in the Lord with all your heart and lean not on your own understanding.", reference: "Proverbs 3:5" },
        { text: "Be strong and courageous. Do not be afraid... for the Lord your God will be with you wherever you go.", reference: "Joshua 1:9" },
        { text: "And we know that in all things God works for the good of those who love him.", reference: "Romans 8:28" }
    ];

    try {
        // Free API: Random verse from KJV
        const response = await fetch("https://labs.bible.org/api/?passage=random&type=json");
        if (!response.ok) throw new Error("API failed");

        const data = await response.json();
        const verse = data[0];
        const text = verse.text.trim();
        const reference = `${verse.bookname} ${verse.chapter}:${verse.verse}`;

        // Cache it
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            text,
            reference,
            timestamp: now
        }));

        return `
            <p class="bible-text">${text} <em>(${reference})</em></p>
            <a href="https://biblegateway.com/passage/?search=${encodeURIComponent(reference)}&version=KJV" target="_blank" class="btn btn-sm btn-outline-pink mt-2">Read Now</a>
        `;

    } catch (error) {
        console.warn("Bible API failed, using fallback:", error);
        const verse = fallbackVerses[Math.floor(Math.random() * fallbackVerses.length)];
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            text: verse.text,
            reference: verse.reference,
            timestamp: now
        }));
        return `
            <p class="bible-text">${verse.text} <em>(${verse.reference})</em></p>
            <a href="https://biblegateway.com/passage/?search=${encodeURIComponent(verse.reference)}&version=NIV" target="_blank" class="btn btn-sm btn-outline-pink mt-2">Read Now</a>
        `;
    }
},
        calendar: () => {
            const today = new Date();
            const currentMonth = today.getMonth();
            const currentYear = today.getFullYear();
            const monthNames = [
                "January", "February", "March", "April", "May", "June", "July",
                "August", "September", "October", "November", "December"
            ];
            const firstDay = new Date(currentYear, currentMonth, 1);
            const lastDay = new Date(currentYear, currentMonth + 1, 0);
            const daysInMonth = lastDay.getDate();
            const startingDay = firstDay.getDay();
            let calendarHTML = `<h5 class="text-center mb-3">${monthNames[currentMonth]} ${currentYear}</h5><div class="d-flex flex-wrap justify-content-center">`;
            for (let i = 0; i < startingDay; i++)
                calendarHTML += '<div class="calendar-day"></div>';
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(currentYear, currentMonth, day);
                const isPast = date < today && date.toDateString() !== today.toDateString();
                const isToday = date.toDateString() === today.toDateString();
                calendarHTML += `<div class="calendar-day ${isPast ? "past" : ""} ${isToday ? "today" : ""}">${day}</div>`;
            }
            calendarHTML += "</div>";
            return calendarHTML;
        },
    wellness: () => {
    const today = new Date().toLocaleDateString();

    const journalFactor = journalEntries.some(e => 
        new Date(e.createdAt).toLocaleDateString() === today
    ) ? 25 : 0;

    const taskFactor = tasks.filter(t => 
        t.completed && 
        new Date(t.completedAt).toLocaleDateString() === today
    ).length * 10;

    const hydrationFactor = Math.min(hydration, 8) * 3.125;
    const total = Math.min(100, Math.round(journalFactor + taskFactor + hydrationFactor));

    return `
        <div class="wellness-content">
            <h6 class="wellness-title">Wellness Score</h6>
            <div class="progress mb-2" style="height: 20px; border-radius: 10px;">
                <div class="progress-bar bg-pink" style="width: ${total}%; border-radius: 10px;">
                    ${total}%
                </div>
            </div>
            <small class="text-muted">
                Journal: ${journalFactor} | Tasks: ${taskFactor} | Hydration: ${hydrationFactor.toFixed(1)}
            </small>
        </div>
    `;
        },
        tracker: () => `
            <div class="row tracker-row">
                <div class="col-12 col-md-4">
                    <div class="tracker-card">
                        <h6>Hydation Tracker</h6>
                        <div id="hydrationIcons" class="d-flex justify-content-center">${Array(8).fill().map((_, i) => `<div class="water-icon${i < hydration ? " filled" : ""}"></div>`).join("")}</div>
                        <span id="hydrationCount">${hydration}/8</span>
                        <button id="addHydration" class="btn btn-sm btn-pink ms-2">+</button>
                    </div>
                </div>
                <div class="col-12 col-md-4">
    <div class="tracker-card">
        <h6>Reading Tracker</h6>
        <div id="readingIcons" class="d-flex justify-content-center flex-wrap gap-1">
            ${Array(9).fill().map((_, i) => `
                <div class="book-icon${i < readingPages ? ' filled' : ''}" style="width: 15px; height: 15px;"></div>
            `).join("")}
        </div>
        <span id="readingCount">${readingPages}/9</span>
        <button id="addReading" class="btn btn-sm btn-pink ms-2">+</button>
    </div>
</div>
                <div class="col-12 col-md-4">
                    <div class="tracker-card">
                        <h6>Bath Tracker</h6>
                        <div id="bathIcons" class="d-flex justify-content-center">${Array(3).fill().map((_, i) => `<div class="bath-icon${i < bathCount ? " filled" : ""}"></div>`).join("")}</div>
                        <span id="bathCount">${bathCount}/3</span>
                        <button id="addBath" class="btn btn-sm btn-pink ms-2">+</button>
                    </div>
                </div>
            </div>
        `,
        tips: () => {
            const tips = {
                skincare: ["Moisturize daily with a gentle cream", "Try a honey mask for glow!"],
                reading: ["Read 10 pages of a novel", "Explore a new genre today!"],
                academics: ["Review notes for 20 minutes", "Take a short study break"],
                overall: ["Take a 10-minute walk outdoors", "Practice deep breathing", "Stretch your body for 5 minutes", "Drink a glass of water now", "Listen to calming music", "Write down 3 things you’re grateful for", "Try a quick meditation session", "Do a 5-minute dance break", "Read a motivational quote", "Take a short nap if needed", "Organize your workspace", "Call a friend to chat", "Try a new healthy snack", "Do some light yoga poses", "Watch a funny video", "Journal your thoughts for 5 minutes", "Take a break from screens", "Try a quick puzzle game", "Do a random act of kindness", "Practice positive affirmations", "Go outside for fresh air", "Try a new hobby for 10 minutes", "Do a quick stretch routine", "Listen to a podcast episode", "Write a short gratitude letter", "Take a moment to laugh out loud", "Try a new exercise move", "Read a chapter of a book", "Do a quick cleaning task", "Practice mindfulness for 5 minutes", "Try a new recipe to cook", "Take a relaxing bath", "Draw or doodle something fun", "Play with a pet if you have one", "Try a breathing exercise", "Watch a sunrise or sunset", "Do a quick journaling prompt", "Listen to nature sounds", "Try a new stretching pose", "Take a short walk with music", "Write a positive goal for tomorrow", "Do a 5-minute gratitude meditation", "Try a quick art project", "Read an inspiring story", "Practice a new skill for 10 minutes", "Take a moment to smell flowers", "Do a quick workout video", "Listen to an audiobook chapter", "Try a relaxation technique", "Write a kind note to yourself"]
            };
            const categories = Object.keys(tips);
            return `
                <h6 class="tips-title">Self-Care Tips</h6>
                <div id="tipCarousel" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-inner" id="tipCarouselInner" style="text-align: center;">${
                        categories.map((cat, idx) => `
                            <div class="carousel-item ${idx === 0 ? "active" : ""}">
                                <p class="tips-text">${tips[cat][Math.floor(Math.random() * tips[cat].length)]}</p>
                                <small class="tips-category">${cat.charAt(0).toUpperCase() + cat.slice(1)}</small>
                            </div>
                        `).join("")
                    }</div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#tipCarousel" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#tipCarousel" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    </button>
                </div>
            `;
        }
    };

    async function loadWidget(widget) {
        widgetButtons.forEach(btn => btn.classList.remove("active"));
        document.querySelector(`[data-widget="${widget}"]`).classList.add("active");
        widgetContent.innerHTML = '<div class="text-center"><div class="spinner-border text-pink" role="status"><span class="visually-hidden">Loading...</span></div></div>';
        try {
            const content = typeof widgets[widget] === "function" ? await widgets[widget]() : widgets[widget];
            widgetContent.innerHTML = content || '<p class="text-center">Content unavailable</p>';
            if (widget === "tracker") {
                const addHydrationBtn = document.getElementById("addHydration");
                const addReadingBtn = document.getElementById("addReading");
                const addBathBtn = document.getElementById("addBath");
                if (addHydrationBtn) addHydrationBtn.onclick = () => { if (hydration < 8) { hydration++; localStorage.setItem("hydration", hydration); loadWidget(widget); } };
                if (addReadingBtn) addReadingBtn.onclick = () => { if (readingPages < 10) { readingPages++; localStorage.setItem("readingPages", readingPages); loadWidget(widget); } };
                if (addBathBtn) addBathBtn.onclick = () => { if (bathCount < 3) { bathCount++; localStorage.setItem("bathCount", bathCount); loadWidget(widget); } };
            }
        } catch (error) {
            console.error(`Error loading ${widget}:`, error);
            widgetContent.innerHTML = `<p class="text-center">Error loading ${widget}</p>`;
        }
        if (window.innerWidth < 768) {
            hamburgerBtn.classList.remove("active");
            sidebar.classList.remove("active");
            sidebar.classList.add("collapsed");
            closeBtn.classList.remove("active");
            closeBtn.classList.add("d-none");
        }
    }

      // Load default widget AFTER reset
    const defaultWidget = "quick-access";
    loadWidget(defaultWidget);

    // Auto-refresh wellness if it's visible
    const activeWidgetBtn = document.querySelector(".widget-btn.active");
    if (activeWidgetBtn && activeWidgetBtn.getAttribute("data-widget") === "wellness") {
        loadWidget("wellness");
    }
    
    widgetButtons.forEach(button => button.addEventListener("click", () => loadWidget(button.getAttribute("data-widget"))));

    let isDarkMode = localStorage.getItem("darkMode") === "true";
    function applyMode(dark) {
        document.body.classList.toggle("dark-mode", dark);
        modeIcon.textContent = dark ?  "🌙" : "🌞";
        localStorage.setItem("darkMode", dark);
    }
    applyMode(isDarkMode);
    modeToggle.addEventListener("click", () => { isDarkMode = !isDarkMode; applyMode(isDarkMode); });

        // === DAILY RESET & REFRESH ===
    function resetDailyData() {
        const today = new Date().toLocaleDateString();
        const lastReset = localStorage.getItem("lastReset");

        if (lastReset !== today) {
            // Reset tracker values
            localStorage.setItem("hydration", 0);
            localStorage.setItem("readingPages", 0);
            localStorage.setItem("bathCount", 0);

            // Save yesterday's data to history
            const history = JSON.parse(localStorage.getItem("trackerHistory")) || [];
            history.push({
                date: lastReset || today,
                hydration: parseInt(localStorage.getItem("hydration")) || 0,
                readingPages: parseInt(localStorage.getItem("readingPages")) || 0,
                bathCount: parseInt(localStorage.getItem("bathCount")) || 0
            });
            localStorage.setItem("trackerHistory", JSON.stringify(history));
            localStorage.setItem("lastReset", today);

            // Reset live variables
            hydration = 0;
            readingPages = 0;
            bathCount = 0;
        } else {
            // Load current day's values
            hydration = parseInt(localStorage.getItem("hydration")) || 0;
            readingPages = parseInt(localStorage.getItem("readingPages")) || 0;
            bathCount = parseInt(localStorage.getItem("bathCount")) || 0;
        }
    }

    // Run reset on load
    resetDailyData();

    // Re-fetch journal/tasks from localStorage (in case other tabs updated)
    journalEntries = JSON.parse(localStorage.getItem("journalEntries")) || [];
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // === WELLNESS WIDGET (Uses TODAY'S data only) ===
    // (Already correct in your code — just confirming)
    wellness: () => {
        const today = new Date().toLocaleDateString();
        const journalFactor = journalEntries.some(e => new Date(e.createdAt).toLocaleDateString() === today) ? 25 : 0;
        const taskFactor = tasks.filter(t => 
            t.completed && new Date(t.completedAt).toLocaleDateString() === today
        ).length * 10;
        const hydrationFactor = Math.min(hydration, 8) * 3.125;
        const total = Math.min(100, Math.round(journalFactor + taskFactor + hydrationFactor));

        return `
            <div class="wellness-content">
                <h6 class="wellness-title">Wellness Score</h6>
                <div class="progress mb-2" style="height: 20px;">
                    <div class="progress-bar bg-pink" style="width: ${total}%;">${total}%</div>
                </div>
                <small>Journal: ${journalFactor} | Tasks: ${taskFactor} | Hydration: ${hydrationFactor.toFixed(1)}</small>
            </div>
        `;
    };

    // Navbar Collapse on Outside Click
    const navbarCollapse = document.getElementById("navbarNav");
    const navbarToggler = document.querySelector(".navbar-toggler");
    document.addEventListener("click", (e) => {
        if (window.innerWidth < 992) {
            const isClickInsideNavbar = navbarCollapse.contains(e.target) || navbarToggler.contains(e.target);
            if (!isClickInsideNavbar && navbarCollapse.classList.contains("show")) {
                navbarToggler.click();
            }
        }
    });

    // AUTO-CLOSE NAVBAR WHEN LINK OR BUTTON IS CLICKED (MOBILE ONLY)
    document.querySelectorAll('#navbarNav .nav-link, #navbarNav button').forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth < 992) {
                const bsCollapse = bootstrap.Collapse.getInstance(document.getElementById('navbarNav'));
                if (bsCollapse) {
                    bsCollapse.hide();
                } else {
                    document.getElementById('navbarNav').classList.remove('show');
                }
            }
        });
    });
});