// Local Storage Management
const STORAGE_KEY = 'passworthy_recent_passwords';
const MAX_RECENT_PASSWORDS = 5;

// Get recent passwords from local storage
function getRecentPasswords() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

// Save password to local storage
function savePassword(password) {
    let recent = getRecentPasswords();
    
    // Add new password to the beginning
    recent.unshift({
        password: password,
        timestamp: new Date().toISOString()
    });
    
    // Keep only the most recent passwords
    recent = recent.slice(0, MAX_RECENT_PASSWORDS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
    updateRecentPasswordsList();
}

// Update the recent passwords list display
function updateRecentPasswordsList() {
    const recentList = document.getElementById('recentList');
    if (!recentList) return;
    
    const recent = getRecentPasswords();
    
    if (recent.length === 0) {
        recentList.innerHTML = '<li class="empty-state">No passwords generated yet</li>';
        return;
    }
    
    recentList.innerHTML = recent.map(item => {
        const date = new Date(item.timestamp);
        const timeStr = date.toLocaleTimeString();
        return `
            <li>
                <span>${item.password}</span>
                <small style="color: var(--text-secondary); font-size: 0.8rem;">${timeStr}</small>
            </li>
        `;
    }).join('');
}

// Password Generator Functions
function generatePassword(length, options) {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let characters = '';
    let password = '';
    
    // Build character set based on options
    if (options.uppercase) characters += uppercase;
    if (options.lowercase) characters += lowercase;
    if (options.numbers) characters += numbers;
    if (options.symbols) characters += symbols;
    
    // If no options selected, use all
    if (characters === '') {
        characters = uppercase + lowercase + numbers + symbols;
    }
    
    // Generate random password
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }
    
    return password;
}

// Password Strength Checker
function checkPasswordStrength(password) {
    if (!password) {
        return { strength: 'none', score: 0, feedback: [] };
    }
    
    let score = 0;
    const feedback = [];
    
    // Length check
    if (password.length >= 12) {
        score += 2;
    } else if (password.length >= 8) {
        score += 1;
    } else {
        feedback.push('Password is too short. Use at least 12 characters.');
    }
    
    // Character variety checks
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);
    
    if (hasUppercase) score += 1;
    else feedback.push('Add uppercase letters (A-Z).');
    
    if (hasLowercase) score += 1;
    else feedback.push('Add lowercase letters (a-z).');
    
    if (hasNumbers) score += 1;
    else feedback.push('Add numbers (0-9).');
    
    if (hasSymbols) score += 1;
    else feedback.push('Add special symbols (!@#$%^&*).');
    
    // Check for common patterns
    if (/(.)\1{2,}/.test(password)) {
        score -= 1;
        feedback.push('Avoid repeating characters.');
    }
    
    if (/^[0-9]+$/.test(password)) {
        score -= 2;
        feedback.push('Don\'t use only numbers.');
    }
    
    if (/^[a-zA-Z]+$/.test(password)) {
        score -= 1;
        feedback.push('Mix letters with numbers and symbols.');
    }
    
    // Sequential patterns
    if (/(?:abc|bcd|cde|def|123|234|345|456|567|678|789)/i.test(password)) {
        score -= 1;
        feedback.push('Avoid sequential patterns.');
    }
    
    // Determine strength level
    let strength;
    if (score >= 6) {
        strength = 'strong';
    } else if (score >= 3) {
        strength = 'good';
    } else {
        strength = 'weak';
    }
    
    return { strength, score, feedback };
}

// Home Page - Password Generator
if (document.getElementById('generateBtn')) {
    const lengthSlider = document.getElementById('passwordLength');
    const lengthValue = document.getElementById('lengthValue');
    const generateBtn = document.getElementById('generateBtn');
    const passwordOutput = document.getElementById('passwordOutput');
    const copyBtn = document.getElementById('copyBtn');
    
    // Update length display
    lengthSlider.addEventListener('input', (e) => {
        lengthValue.textContent = e.target.value;
    });
    
    // Generate password
    generateBtn.addEventListener('click', () => {
        const length = parseInt(lengthSlider.value);
        const options = {
            uppercase: document.getElementById('includeUppercase').checked,
            lowercase: document.getElementById('includeLowercase').checked,
            numbers: document.getElementById('includeNumbers').checked,
            symbols: document.getElementById('includeSymbols').checked
        };
        
        const password = generatePassword(length, options);
        passwordOutput.value = password;
        
        // Save to local storage
        savePassword(password);
        
        // Add visual feedback
        generateBtn.textContent = '✓ Generated!';
        setTimeout(() => {
            generateBtn.textContent = 'Generate Password';
        }, 1500);
    });
    
    // Copy to clipboard
    copyBtn.addEventListener('click', async () => {
        const password = passwordOutput.value;
        if (!password) return;
        
        try {
            await navigator.clipboard.writeText(password);
            copyBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            `;
            setTimeout(() => {
                copyBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                `;
            }, 1500);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    });
    
    // Load recent passwords on page load
    updateRecentPasswordsList();
}

// Password Test Page
if (document.getElementById('testPassword')) {
    const testPassword = document.getElementById('testPassword');
    const strengthResult = document.getElementById('strengthResult');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    const strengthDetails = document.getElementById('strengthDetails');
    const feedbackSection = document.getElementById('feedbackSection');
    const toggleVisibility = document.getElementById('toggleVisibility');
    
    // Toggle password visibility
    toggleVisibility.addEventListener('click', () => {
        const type = testPassword.type === 'password' ? 'text' : 'password';
        testPassword.type = type;
        
        if (type === 'text') {
            toggleVisibility.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
            `;
        } else {
            toggleVisibility.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            `;
        }
    });
    
    // Test password strength
    testPassword.addEventListener('input', (e) => {
        const password = e.target.value;
        
        if (!password) {
            strengthResult.classList.add('hidden');
            feedbackSection.innerHTML = '';
            return;
        }
        
        const result = checkPasswordStrength(password);
        
        // Show results
        strengthResult.classList.remove('hidden');
        
        // Update strength bar
        strengthBar.className = 'strength-fill ' + result.strength;
        
        // Update strength text
        strengthText.className = 'strength-text ' + result.strength;
        strengthText.textContent = result.strength.charAt(0).toUpperCase() + result.strength.slice(1);
        
        // Update details
        const strengthMessages = {
            weak: 'This password is vulnerable to attacks.',
            good: 'This password is decent but could be stronger.',
            strong: 'This password is very secure!'
        };
        strengthDetails.textContent = strengthMessages[result.strength] || '';
        
        // Show feedback
        if (result.feedback.length > 0) {
            feedbackSection.innerHTML = `
                <h4>Suggestions to improve:</h4>
                <ul>
                    ${result.feedback.map(f => `<li>${f}</li>`).join('')}
                </ul>
            `;
        } else {
            feedbackSection.innerHTML = `
                <h4 style="color: var(--success-color);">✓ Excellent password!</h4>
                <p style="color: var(--text-secondary);">Your password meets all security criteria.</p>
            `;
        }
    });
}
