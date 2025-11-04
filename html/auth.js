// auth.js
import { auth } from './firebase.js';

// === AUTH STATE LISTENER (RUNS ON EVERY PAGE) ===
auth.onAuthStateChanged(async (user) => {
    const currentPath = window.location.pathname;
    const isIndex = currentPath.includes('index.html');
    const isLogin = currentPath.includes('login.html');
    const isSignup = currentPath.includes('sign-up.html');
    const isDashboard = currentPath.includes('dashboard.html');

    if (user) {
        console.log("User logged in:", user.email);

        // Show logout
        const logoutBtn = document.getElementById('logout');
        if (logoutBtn) logoutBtn.style.display = 'inline-block';

        // Show protected content
        document.querySelectorAll('.protected').forEach(el => el.style.display = 'block');

        // New user on index → show onboarding
        if (isIndex && localStorage.getItem('onboardingSeen') !== 'true') {
            showOnboardingModal();
            return;
        }

        // Redirect from auth pages
        if (isLogin || isSignup) {
            window.location.href = 'dashboard.html';
        }

    } else {
        console.log("No user logged in");

        // Hide logout
        const logoutBtn = document.getElementById('logout');
        if (logoutBtn) logoutBtn.style.display = 'none';

        // PROTECTED PAGES → redirect to login
        if (!isIndex && !isLogin && !isSignup) {
            window.location.href = 'login.html';
        }

        // Index page → show public content
        if (isIndex) {
            document.querySelectorAll('.protected').forEach(el => el.style.display = 'block');
        }
    }
});

// === ONBOARDING MODAL ===
function showOnboardingModal() {
    const modalHTML = `
        <div class="modal fade" id="onboardingModal" tabindex="-1">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content glassy-card">
                    <div class="modal-header border-0">
                        <h5 class="modal-title">Welcome to Dear Diary!</h5>
                    </div>
                    <div class="modal-body text-center">
                        <p class="lead">Quick tour!</p>
                        <button id="finishOnboarding" class="btn btn-pink">Get Started</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal('#onboardingModal');
    modal.show();

    document.getElementById('finishOnboarding').onclick = () => {
        localStorage.setItem('onboardingSeen', 'true');
        modal.hide();
        window.location.href = 'sign-up.html';
    };
}

// === LOGOUT ===
document.getElementById('logout')?.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        localStorage.removeItem('onboardingSeen');
        window.location.href = 'index.html';
    });
});