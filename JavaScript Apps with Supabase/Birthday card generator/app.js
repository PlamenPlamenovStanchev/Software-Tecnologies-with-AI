// ============================================
// BIRTHDAY CARD GENERATOR APP
// ============================================

class BirthdayCardApp {
    constructor() {
        this.isAuthenticated = false;
        this.currentScreen = 'home'; // 'home' or 'generate'
        this.animatedElements = [];
    }

    /**
     * Initialize the app
     */
    init() {
        this.setupEventListeners();
        this.createAnimatedBackground();
        this.setupAuthStateChangeCallback();
        this.setupRoleChangeCallback();
    }

    /**
     * Setup role change callback
     */
    setupRoleChangeCallback() {
        if (userRoleManager) {
            userRoleManager.onRoleChange = (role, isAdmin) => {
                // Update navbar when role changes
                this.updateNavbar(authManager.getCurrentUser());
            };
        }
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Login button on home screen
        document.getElementById('loginBtn').addEventListener('click', () => {
            this.showAuthModal();
        });

        // Logout button in navbar
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleLogout();
        });

        // Login form submission
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Register form submission
        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        // Modal hidden event
        document.getElementById('authModal').addEventListener('hidden.bs.modal', () => {
            this.clearAuthForms();
        });
    }

    /**
     * Setup auth state change callback
     */
    setupAuthStateChangeCallback() {
        authManager.onAuthStateChange = (user) => {
            if (user) {
                this.onUserLoggedIn(user);
            } else {
                this.onUserLoggedOut();
            }
        };
    }

    /**
     * Handle login form submission
     */
    async handleLogin() {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            showError('Please fill in all fields', 'loginError');
            return;
        }

        const user = await authManager.login(email, password);
        if (user) {
            // Close modal after successful login
            const authModal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
            if (authModal) {
                authModal.hide();
            }
        }
    }

    /**
     * Handle register form submission
     */
    async handleRegister() {
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;

        if (!email || !password || !confirmPassword) {
            showError('Please fill in all fields', 'registerError');
            return;
        }

        if (password !== confirmPassword) {
            showError('Passwords do not match', 'registerError');
            return;
        }

        if (password.length < 6) {
            showError('Password must be at least 6 characters long', 'registerError');
            return;
        }

        const user = await authManager.register(email, password);
        // If registration successful, user will be prompted to login
    }

    /**
     * Handle logout
     */
    async handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            await authManager.logout();
        }
    }

    /**
     * Called when user logs in
     */
    onUserLoggedIn(user) {
        console.log('User logged in:', user.email);
        this.isAuthenticated = true;

        // Update UI
        this.updateNavbar(user);
        this.showGenerateScreen();
    }

    /**
     * Called when user logs out
     */
    onUserLoggedOut() {
        console.log('User logged out');
        this.isAuthenticated = false;

        // Update UI
        this.updateNavbar(null);
        this.showHomeScreen();
    }

    /**
     * Update navbar based on auth state
     */
    updateNavbar(user) {
        const logoutBtn = document.getElementById('logoutBtn');
        const adminBtnContainer = document.getElementById('adminBtnContainer');
        
        if (user) {
            logoutBtn.style.display = 'inline-block';
            
            // Check if user is admin and show admin button
            if (userRoleManager && userRoleManager.isAdminUser) {
                adminBtnContainer.style.display = 'inline-block';
            } else {
                adminBtnContainer.style.display = 'none';
            }
        } else {
            logoutBtn.style.display = 'none';
            adminBtnContainer.style.display = 'none';
        }
    }

    /**
     * Show auth modal
     */
    showAuthModal() {
        const authModal = new bootstrap.Modal(document.getElementById('authModal'));
        authModal.show();
    }

    /**
     * Clear auth forms
     */
    clearAuthForms() {
        document.getElementById('loginForm').reset();
        document.getElementById('registerForm').reset();
        clearError('loginError');
        clearError('registerError');
    }

    /**
     * Show home screen
     */
    showHomeScreen() {
        this.currentScreen = 'home';
        
        const homeScreen = document.getElementById('homeScreen');
        const generateScreen = document.getElementById('generateScreen');

        homeScreen.style.display = 'block';
        generateScreen.style.display = 'none';
        
        // Ensure animated background is active
        this.createAnimatedBackground();
    }

    /**
     * Show generate card screen
     */
    async showGenerateScreen() {
        this.currentScreen = 'generate';
        
        const homeScreen = document.getElementById('homeScreen');
        const generateScreen = document.getElementById('generateScreen');

        homeScreen.style.display = 'none';
        generateScreen.style.display = 'block';

        // Initialize card generator if not already initialized
        if (cardGenerator && !cardGenerator.initialized) {
            await cardGenerator.init();
            cardGenerator.initialized = true;
        }
    }

    /**
     * Create animated background with balloons, garlands, gifts, etc.
     */
    createAnimatedBackground() {
        const background = document.getElementById('animatedBg');
        
        // Clear existing elements
        background.innerHTML = '';

        // Create balloons
        for (let i = 1; i <= 5; i++) {
            const balloon = document.createElement('div');
            balloon.className = `balloon balloon-${i}`;
            background.appendChild(balloon);
        }

        // Create garlands
        const garlandEmojis = ['🎉', '🎊', '🎈'];
        for (let i = 1; i <= 3; i++) {
            const garland = document.createElement('div');
            garland.className = `garland garland-${i}`;
            garland.textContent = garlandEmojis[(i - 1) % garlandEmojis.length];
            background.appendChild(garland);
        }

        // Create gifts
        for (let i = 1; i <= 2; i++) {
            const gift = document.createElement('div');
            gift.className = `gift gift-${i}`;
            gift.textContent = '🎁';
            background.appendChild(gift);
        }

        // Create confetti particles
        this.createConfetti(background);
    }

    /**
     * Create confetti particles for animation
     */
    createConfetti(container) {
        const confettiCount = 15; // Reduced for better performance
        const confettiItems = ['🎉', '🎊', '🎈', '⭐', '✨', '🎁'];

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.textContent = confettiItems[Math.floor(Math.random() * confettiItems.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.opacity = Math.random() * 0.5 + 0.3;
            confetti.style.fontSize = (Math.random() * 20 + 10) + 'px';
            confetti.style.animationDuration = (Math.random() * 10 + 15) + 's';
            confetti.style.animationDelay = (Math.random() * 5) + 's';
            confetti.style.top = -100 + 'px';

            container.appendChild(confetti);
        }
    }
}

// ============================================
// APP INITIALIZATION
// ============================================

let app;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the app
    app = new BirthdayCardApp();
    app.init();

    // Check if user is already logged in
    const user = authManager.getCurrentUser();
    if (user) {
        app.onUserLoggedIn(user);
    } else {
        app.showHomeScreen();
    }
});

// ============================================
// WINDOW RESIZE HANDLER
// ============================================

window.addEventListener('resize', debounce(() => {
    // Recreate animations on resize if needed
    if (app && app.currentScreen === 'home') {
        app.createAnimatedBackground();
    }
}, 500));

// ============================================
// HANDLE PAGE VISIBILITY
// ============================================

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Page is visible again - check session
        authManager.init();
    }
});
