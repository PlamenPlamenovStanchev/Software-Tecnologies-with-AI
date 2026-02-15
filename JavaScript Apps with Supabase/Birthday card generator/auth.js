// ============================================
// AUTHENTICATION MODULE
// ============================================

class AuthManager {
    constructor() {
        this.user = null;
        this.session = null;
        this.isInitialized = false;
    }

    /**
     * Initialize authentication
     */
    async init() {
        try {
            // Check if there's an existing session
            const { data, error } = await supabase.auth.getSession();
            
            if (error) {
                console.error('Error checking session:', error);
                return;
            }

            const session = data?.session;
            if (session) {
                this.session = session;
                this.user = session.user;
                this.onAuthStateChange(this.user);
            }

            // Listen for auth state changes
            this.setupAuthListener();
            this.isInitialized = true;
        } catch (error) {
            console.error('Error initializing auth:', error);
        }
    }

    /**
     * Setup auth state change listener
     */
    setupAuthListener() {
        supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                this.session = session;
                this.user = session.user;
                this.onAuthStateChange(this.user);
            } else {
                this.session = null;
                this.user = null;
                this.onAuthStateChange(null);
            }
        });
    }

    /**
     * Register user with email and password
     */
    async register(email, password) {
        try {
            showLoading();
            clearError('registerError');

            // Validate passwords match
            const confirmPassword = document.getElementById('registerConfirmPassword').value;
            if (password !== confirmPassword) {
                showError('Passwords do not match', 'registerError');
                hideLoading();
                return null;
            }

            // Validate password strength
            if (password.length < 6) {
                showError('Password must be at least 6 characters long', 'registerError');
                hideLoading();
                return null;
            }

            // Sign up with Supabase Auth
            const { data, error } = await supabase.auth.signUp({
                email: email.trim(),
                password: password,
                options: {
                    emailRedirectTo: `${window.location.origin}`,
                    // Email confirmation is disabled in Supabase for this project
                }
            });

            if (error) {
                showError(error.message, 'registerError');
                console.error('Registration error:', error);
                return null;
            }

            if (data && data.user) {
                showToast('Account created successfully! Please login.', 'success');
                // Clear form
                document.getElementById('registerForm').reset();
                // Switch to login tab
                document.getElementById('loginTab').click();
                return data.user;
            }

        } catch (error) {
            showError('An unexpected error occurred during registration', 'registerError');
            console.error('Register error:', error);
            return null;
        } finally {
            hideLoading();
        }
    }

    /**
     * Login user with email and password
     */
    async login(email, password) {
        try {
            showLoading();
            clearError('loginError');

            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password
            });

            if (error) {
                showError(error.message, 'loginError');
                console.error('Login error:', error);
                return null;
            }

            if (data && data.user) {
                this.user = data.user;
                this.session = data.session;
                showToast(`Welcome, ${data.user.email}!`, 'success');
                // Clear form
                document.getElementById('loginForm').reset();
                return data.user;
            }

        } catch (error) {
            showError('An unexpected error occurred during login', 'loginError');
            console.error('Login error:', error);
            return null;
        } finally {
            hideLoading();
        }
    }

    /**
     * Logout user
     */
    async logout() {
        try {
            showLoading();

            const { error } = await supabase.auth.signOut();

            if (error) {
                console.error('Logout error:', error);
                showToast('Error logging out', 'danger');
                return false;
            }

            this.user = null;
            this.session = null;
            showToast('Logged out successfully', 'success');
            return true;

        } catch (error) {
            console.error('Logout error:', error);
            showToast('Error logging out', 'danger');
            return false;
        } finally {
            hideLoading();
        }
    }

    /**
     * Handle auth state change
     * This method is called when authentication state changes
     */
    onAuthStateChange(user) {
        // This will be overridden by the app.js file
        if (user) {
            console.log('User logged in:', user.email);
        } else {
            console.log('User logged out');
        }
    }

    /**
     * Get current user
     */
    getCurrentUser() {
        return this.user;
    }

    /**
     * Get current session
     */
    getCurrentSession() {
        return this.session;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return this.user !== null;
    }

    /**
     * Get user email
     */
    getUserEmail() {
        return this.user?.email || null;
    }

    /**
     * Get user ID
     */
    getUserId() {
        return this.user?.id || null;
    }
}

// Create global auth manager instance
const authManager = new AuthManager();

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    authManager.init();
});
