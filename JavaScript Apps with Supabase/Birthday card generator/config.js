// ============================================
// SUPABASE CONFIGURATION
// ============================================

// Supabase client is initialized in index.html before this script loads

// ============================================
// APP CONFIGURATION
// ============================================

const APP_CONFIG = {
    // Animation settings
    balloonCount: 5,
    confettiParticles: 50,
    animationDuration: 20, // seconds

    // UI settings
    modalAnimationDuration: 300, // ms
    transitionDuration: 300, // ms

    // Auth settings
    sessionCheckInterval: 5000, // ms (check session every 5 seconds)
    sessionTimeoutWarning: 3600000, // 1 hour (warn when close to expiration)

    // Local storage keys
    storageKeys: {
        userSession: 'bday_card_session',
        userPreferences: 'bday_card_preferences',
        authToken: 'bday_card_auth_token'
    }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Show loading spinner
 */
function showLoading() {
    document.getElementById('loadingSpinner').style.display = 'flex';
}

/**
 * Hide loading spinner
 */
function hideLoading() {
    document.getElementById('loadingSpinner').style.display = 'none';
}

/**
 * Show error message
 */
function showError(message, elementId = 'loginError') {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('d-none');
        // Auto-hide error after 5 seconds
        setTimeout(() => {
            errorElement.classList.add('d-none');
        }, 5000);
    }
}

/**
 * Clear error message
 */
function clearError(elementId = 'loginError') {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.classList.add('d-none');
    }
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    const toastHTML = `
        <div class="alert alert-${type} position-fixed bottom-0 end-0 m-3" role="alert" style="z-index: 10000;">
            ${message}
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', toastHTML);
    
    // Auto-remove toast after 3 seconds
    const toast = document.body.lastElementChild;
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

/**
 * Debounce function
 */
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

/**
 * Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}
