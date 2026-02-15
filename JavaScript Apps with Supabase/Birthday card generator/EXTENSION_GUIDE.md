# Extension Guide - Helpful Code Snippets

This file contains code snippets to help you extend the Birthday Card Generator with new features.

## 🎨 Adding a New Screen

### 1. Add HTML container to `index.html`:
```html
<!-- New Feature Screen -->
<div id="featureScreen" class="screen-container" style="display: none;">
    <div class="container mt-5 pt-5">
        <h2>Your Feature Here</h2>
        <!-- Add your content -->
    </div>
</div>
```

### 2. Add screen switching method in `app.js`:
```javascript
/**
 * Show feature screen
 */
showFeatureScreen() {
    this.currentScreen = 'feature';
    
    const homeScreen = document.getElementById('homeScreen');
    const generateScreen = document.getElementById('generateScreen');
    const featureScreen = document.getElementById('featureScreen');

    homeScreen.style.display = 'none';
    generateScreen.style.display = 'none';
    featureScreen.style.display = 'block';
}
```

### 3. Add navigation in navbar:
```html
<!-- In navbar collapse section, add: -->
<li class="nav-item">
    <a class="nav-link" href="#" id="featureLink">Feature</a>
</li>
```

### 4. Add click handler in `app.js`:
```javascript
document.getElementById('featureLink').addEventListener('click', (e) => {
    e.preventDefault();
    if (this.isAuthenticated) {
        this.showFeatureScreen();
    }
});
```

## 💾 Saving User Data to Supabase

### 1. Create table in Supabase dashboard, then add method to `auth.js`:
```javascript
/**
 * Save user profile
 */
async saveUserProfile(userId, profileData) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                ...profileData,
                updated_at: new Date()
            });

        if (error) {
            console.error('Error saving profile:', error);
            return null;
        }
        return data;
    } catch (error) {
        console.error('Save profile error:', error);
        return null;
    }
}
```

### 2. Use in `app.js`:
```javascript
async saveUserSettings(settings) {
    const userId = authManager.getUserId();
    const result = await authManager.saveUserProfile(userId, settings);
    if (result) {
        showToast('Settings saved!', 'success');
    }
}
```

## 📝 Adding Form Validation

### Add to `config.js`:
```javascript
/**
 * Validate email format
 */
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Validate password strength
 */
function validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 number
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
}

/**
 * Validate form field
 */
function validateField(fieldId, validator, errorMessage) {
    const field = document.getElementById(fieldId);
    const value = field.value.trim();
    
    if (!validator(value)) {
        field.classList.add('is-invalid');
        showError(errorMessage);
        return false;
    }
    
    field.classList.remove('is-invalid');
    return true;
}
```

## 🎨 Adding Custom Animations

### Add to `styles.css`:
```css
/* New animation */
@keyframes slideInLeft {
    from {
        opacity: 0;
        transform: translateX(-100px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

/* Apply animation */
.animated-element {
    animation: slideInLeft 0.6s ease-out;
}
```

## 📤 Uploading Files to Supabase Storage

### Add to `auth.js`:
```javascript
/**
 * Upload file to Supabase storage
 */
async uploadFile(bucket, filePath, file) {
    try {
        const { data, error } = await supabase
            .storage
            .from(bucket)
            .upload(filePath, file);

        if (error) {
            console.error('Upload error:', error);
            return null;
        }
        return data;
    } catch (error) {
        console.error('File upload error:', error);
        return null;
    }
}

/**
 * Get public URL for uploaded file
 */
getFileURL(bucket, filePath) {
    const { data } = supabase
        .storage
        .from(bucket)
        .getPublicUrl(filePath);
    return data.publicUrl;
}
```

### Use in HTML form:
```html
<form id="uploadForm">
    <input type="file" id="fileInput" accept="image/*">
    <button type="submit">Upload</button>
</form>
```

### Handle in `app.js`:
```javascript
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const file = document.getElementById('fileInput').files[0];
    if (!file) {
        showError('Please select a file');
        return;
    }
    
    showLoading();
    const fileName = `${Date.now()}-${file.name}`;
    const result = await authManager.uploadFile('images', fileName, file);
    hideLoading();
    
    if (result) {
        const publicUrl = authManager.getFileURL('images', fileName);
        showToast('File uploaded successfully!', 'success');
        console.log('Public URL:', publicUrl);
    }
});
```

## 🔔 Real-time Data Subscription

### Add to `auth.js`:
```javascript
/**
 * Subscribe to real-time updates
 */
subscribeToCards(userId, callback) {
    const subscription = supabase
        .from(`cards:user_id=eq.${userId}`)
        .on('*', payload => {
            callback(payload);
        })
        .subscribe();

    return subscription;
}

/**
 * Unsubscribe from updates
 */
unsubscribeFromCards(subscription) {
    supabase.removeSubscription(subscription);
}
```

### Use in `app.js`:
```javascript
let cardSubscription;

function startListeningToCards() {
    const userId = authManager.getUserId();
    cardSubscription = authManager.subscribeToCards(userId, (payload) => {
        console.log('Card update:', payload);
        // Update UI with new data
    });
}

function stopListeningToCards() {
    if (cardSubscription) {
        authManager.unsubscribeFromCards(cardSubscription);
    }
}
```

## 🎨 Adding Bootstrap Modal Dynamically

### Add to `app.js`:
```javascript
/**
 * Show confirmation modal
 */
showConfirmationModal(title, message, onConfirm, onCancel) {
    const modalHTML = `
        <div class="modal fade" id="confirmModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${message}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="confirmBtn">Confirm</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
    
    document.getElementById('confirmBtn').addEventListener('click', () => {
        modal.hide();
        onConfirm();
        document.getElementById('confirmModal').remove();
    });
    
    document.getElementById('confirmModal').addEventListener('hidden.bs.modal', () => {
        if (onCancel) onCancel();
        document.getElementById('confirmModal').remove();
    });
    
    modal.show();
}
```

### Use it:
```javascript
showConfirmationModal(
    'Delete Card',
    'Are you sure you want to delete this card?',
    () => {
        console.log('Card deleted');
        // Delete logic here
    },
    () => {
        console.log('Deletion cancelled');
    }
);
```

## 🔄 Pagination for Data Lists

### Add to `config.js`:
```javascript
/**
 * Pagination helper
 */
class Paginator {
    constructor(items, itemsPerPage = 10) {
        this.items = items;
        this.itemsPerPage = itemsPerPage;
        this.currentPage = 1;
    }

    get totalPages() {
        return Math.ceil(this.items.length / this.itemsPerPage);
    }

    getCurrentPage() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.items.slice(start, end);
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            return true;
        }
        return false;
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            return true;
        }
        return false;
    }

    goToPage(page) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            return true;
        }
        return false;
    }
}
```

### Use it:
```javascript
const items = [...]; // Your items array
const paginator = new Paginator(items, 5); // 5 items per page

const firstPageItems = paginator.getCurrentPage();
paginator.nextPage();
const secondPageItems = paginator.getCurrentPage();
```

## 🎯 Search and Filter

### Add to `config.js`:
```javascript
/**
 * Search items
 */
function searchItems(items, query, searchFields) {
    const lowerQuery = query.toLowerCase();
    
    return items.filter(item => {
        return searchFields.some(field => {
            const value = item[field];
            return value && value.toString().toLowerCase().includes(lowerQuery);
        });
    });
}

/**
 * Filter items by criteria
 */
function filterItems(items, criteria) {
    return items.filter(item => {
        return Object.keys(criteria).every(key => {
            return item[key] === criteria[key];
        });
    });
}
```

### Use it:
```javascript
const cards = [...]; // Your cards array

// Search
const results = searchItems(cards, 'birthday', ['title', 'message']);

// Filter
const filteredCards = filterItems(cards, { status: 'completed', category: 'birthday' });

// Combine
const combinedResults = filterItems(
    searchItems(cards, 'happy', ['title']),
    { category: 'birthday' }
);
```

## 📊 Working with Dates

### Add to `config.js`:
```javascript
/**
 * Format date for display
 */
function formatDate(date, format = 'MMM DD, YYYY') {
    const d = new Date(date);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return format
        .replace('YYYY', d.getFullYear())
        .replace('MM', String(d.getMonth() + 1).padStart(2, '0'))
        .replace('MMM', months[d.getMonth()])
        .replace('DD', String(d.getDate()).padStart(2, '0'))
        .replace('HH', String(d.getHours()).padStart(2, '0'))
        .replace('mm', String(d.getMinutes()).padStart(2, '0'));
}

/**
 * Get time ago (e.g., "2 hours ago")
 */
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return Math.floor(seconds) + ' seconds ago';
}
```

## 🚨 Error Tracking

### Add to `app.js`:
```javascript
/**
 * Log error to console and optionally to server
 */
function logError(error, context = {}) {
    const errorData = {
        message: error.message,
        stack: error.stack,
        context: context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    };
    
    console.error('Error logged:', errorData);
    
    // Optional: Send to error tracking service
    // await sendToErrorTracker(errorData);
}

/**
 * Global error handler
 */
window.addEventListener('error', (event) => {
    logError(event.error, {
        filename: event.filename,
        lineno: event.lineno
    });
});

/**
 * Unhandled promise rejection handler
 */
window.addEventListener('unhandledrejection', (event) => {
    logError(event.reason, {
        type: 'Unhandled Promise Rejection'
    });
});
```

---

## 🎯 Quick Reference

| Task | File | Method/Function |
|------|------|-----------------|
| Save user data | auth.js | `saveUserProfile()` |
| Upload file | auth.js | `uploadFile()` |
| Subscribe to updates | auth.js | `subscribeToCards()` |
| Validate email | config.js | `validateEmail()` |
| Format date | config.js | `formatDate()` |
| Search items | config.js | `searchItems()` |
| Show loading | config.js | `showLoading()` |
| Show error | config.js | `showError()` |
| Show toast | config.js | `showToast()` |

---

**Happy extending! 🚀**
