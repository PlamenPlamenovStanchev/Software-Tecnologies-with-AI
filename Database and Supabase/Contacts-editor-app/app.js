// Contact Book Application
let supabaseClient = null;
let allContacts = [];
let currentEditingContactId = null;
let currentDeletingContactId = null;

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
    await initializeApp();
    setupEventListeners();
});

async function initializeApp() {
    console.log('Initializing Contact Book App...');
    
    // Check if Supabase library is loaded
    if (typeof supabase === 'undefined') {
        const errorMsg = 'ERROR: Supabase library not loaded. Check if the CDN script is included in index.html';
        console.error(errorMsg);
        showError(errorMsg);
        return;
    }
    
    console.log('Supabase library loaded successfully');
    
    // Check if config is valid
    if (!checkSupabaseConfig()) {
        const errorMsg = 'ERROR: Invalid Supabase credentials. Please update SUPABASE_URL and SUPABASE_KEY in config.js';
        console.error(errorMsg);
        console.log('Current URL:', SUPABASE_URL);
        console.log('Current KEY:', SUPABASE_KEY ? 'SET (hidden)' : 'NOT SET');
        showError(errorMsg);
        return;
    }
    
    console.log('Supabase config is valid');
    
    supabaseClient = await initSupabaseClient();
    
    if (!supabaseClient) {
        const errorMsg = 'Failed to initialize Supabase client. Check your credentials in config.js';
        console.error(errorMsg);
        showError(errorMsg);
        return;
    }

    console.log('Supabase client initialized successfully');
    await loadContacts();
}

// Setup Event Listeners
function setupEventListeners() {
    // Add Contact Button
    document.getElementById('addContactBtn').addEventListener('click', openAddContactModal);

    // Contact Form
    document.getElementById('contactForm').addEventListener('submit', handleSaveContact);
    document.getElementById('cancelBtn').addEventListener('click', closeContactModal);
    document.getElementById('closeModalBtn').addEventListener('click', closeContactModal);

    // Delete Modal
    document.getElementById('confirmDeleteBtn').addEventListener('click', handleConfirmDelete);
    document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);
    document.getElementById('closeDeleteBtn').addEventListener('click', closeDeleteModal);

    // View Modal
    document.getElementById('closeViewBtn').addEventListener('click', closeViewModal);
    document.getElementById('closeViewModalBtn').addEventListener('click', closeViewModal);
    document.getElementById('editFromViewBtn').addEventListener('click', handleEditFromView);
    document.getElementById('deleteFromViewBtn').addEventListener('click', handleDeleteFromView);

    // Search
    document.getElementById('searchInput').addEventListener('input', handleSearch);

    // Close modals on outside click
    window.addEventListener('click', (event) => {
        const contactModal = document.getElementById('contactModal');
        const deleteModal = document.getElementById('deleteModal');
        const viewModal = document.getElementById('viewModal');

        if (event.target === contactModal) closeContactModal();
        if (event.target === deleteModal) closeDeleteModal();
        if (event.target === viewModal) closeViewModal();
    });
}

// Load Contacts from Supabase
async function loadContacts() {
    if (!supabaseClient) {
        console.error('Supabase client not initialized');
        showError('Database connection not initialized. Please refresh the page.');
        return;
    }
    
    showLoading(true);
    try {
        console.log('Loading contacts from Supabase...');
        const { data, error } = await supabaseClient
            .from('contacts')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            throw error;
        }

        console.log('Successfully loaded', data?.length || 0, 'contacts');
        allContacts = data || [];
        renderContacts(allContacts);
        hideError();
    } catch (error) {
        console.error('Error loading contacts:', error);
        let errorMessage = 'Failed to load contacts: ' + error.message;
        
        // Provide helpful hints for common errors
        if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Network error: Cannot reach Supabase. Check your internet connection.';
        } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
            errorMessage = 'Authentication error: Invalid API key. Check your config.js';
        } else if (error.message.includes('relation') || error.message.includes('does not exist')) {
            errorMessage = 'Database error: "contacts" table does not exist. Run the schema.sql script.';
        }
        
        showError(errorMessage);
        renderContacts([]);
    } finally {
        showLoading(false);
    }
}

// Render Contacts to UI
function renderContacts(contacts) {
    const contactsList = document.getElementById('contactsList');
    const emptyState = document.getElementById('emptyState');

    if (contacts.length === 0) {
        contactsList.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    contactsList.innerHTML = contacts.map(contact => `
        <div class="contact-card">
            <div class="contact-card-header">
                <h3 class="contact-name">${escapeHtml(contact.name)}</h3>
                <div class="contact-card-actions">
                    <button class="btn-icon" onclick="openEditContactModal(${contact.id})" title="Edit">✏️</button>
                    <button class="btn-icon" onclick="openDeleteModal(${contact.id}, '${escapeHtml(contact.name)}')" title="Delete">🗑️</button>
                </div>
            </div>
            <div class="contact-info">
                <div class="contact-info-item">
                    <span class="contact-info-label">Phone:</span>
                    <a href="tel:${escapeHtml(contact.phone)}">${escapeHtml(contact.phone)}</a>
                </div>
                <div class="contact-info-item">
                    <span class="contact-info-label">Email:</span>
                    <a href="mailto:${escapeHtml(contact.email)}">${escapeHtml(contact.email)}</a>
                </div>
                ${contact.town ? `
                <div class="contact-town">${escapeHtml(contact.town)}</div>
                ` : ''}
            </div>
            <button 
                style="width: 100%; margin-top: 12px; padding: 8px;" 
                class="btn btn-secondary btn-small" 
                onclick="openViewModal(${contact.id})">
                View Details
            </button>
        </div>
    `).join('');
}

// Open Add Contact Modal
function openAddContactModal() {
    currentEditingContactId = null;
    document.getElementById('modalTitle').textContent = 'Add New Contact';
    document.getElementById('contactForm').reset();
    document.getElementById('contactModal').classList.add('show');
}

// Open Edit Contact Modal
async function openEditContactModal(contactId) {
    currentEditingContactId = contactId;
    const contact = allContacts.find(c => c.id === contactId);
    
    if (!contact) return;

    document.getElementById('modalTitle').textContent = 'Edit Contact';
    document.getElementById('contactName').value = contact.name;
    document.getElementById('contactPhone').value = contact.phone;
    document.getElementById('contactEmail').value = contact.email;
    document.getElementById('contactTown').value = contact.town || '';
    document.getElementById('contactComments').value = contact.comments || '';
    
    document.getElementById('contactModal').classList.add('show');
}

// Close Contact Modal
function closeContactModal() {
    document.getElementById('contactModal').classList.remove('show');
    document.getElementById('contactForm').reset();
    currentEditingContactId = null;
}

// Handle Save Contact
async function handleSaveContact(event) {
    event.preventDefault();

    const contactData = {
        name: document.getElementById('contactName').value.trim(),
        phone: document.getElementById('contactPhone').value.trim(),
        email: document.getElementById('contactEmail').value.trim(),
        town: document.getElementById('contactTown').value.trim(),
        comments: document.getElementById('contactComments').value.trim()
    };

    // Validation
    if (!contactData.name || !contactData.phone || !contactData.email) {
        showError('Name, Phone, and Email are required fields');
        return;
    }

    showLoading(true);
    try {
        if (currentEditingContactId) {
            // Update existing contact
            const { error } = await supabaseClient
                .from('contacts')
                .update(contactData)
                .eq('id', currentEditingContactId);

            if (error) throw error;
            showError('Contact updated successfully!', 'success');
        } else {
            // Create new contact
            const { error } = await supabaseClient
                .from('contacts')
                .insert([contactData]);

            if (error) throw error;
            showError('Contact created successfully!', 'success');
        }

        closeContactModal();
        await loadContacts();
    } catch (error) {
        console.error('Error saving contact:', error);
        showError('Failed to save contact: ' + error.message);
    } finally {
        showLoading(false);
    }
}

// Open View Modal
async function openViewModal(contactId) {
    const contact = allContacts.find(c => c.id === contactId);
    if (!contact) return;

    currentEditingContactId = contactId;
    const detailsHtml = `
        <div class="detail-row">
            <span class="detail-label">Name:</span>
            <span class="detail-value">${escapeHtml(contact.name)}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Phone:</span>
            <span class="detail-value"><a href="tel:${escapeHtml(contact.phone)}">${escapeHtml(contact.phone)}</a></span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Email:</span>
            <span class="detail-value"><a href="mailto:${escapeHtml(contact.email)}">${escapeHtml(contact.email)}</a></span>
        </div>
        ${contact.town ? `
        <div class="detail-row">
            <span class="detail-label">Town:</span>
            <span class="detail-value">${escapeHtml(contact.town)}</span>
        </div>
        ` : ''}
        ${contact.comments ? `
        <div class="detail-row">
            <span class="detail-label">Comments:</span>
            <span class="detail-value">${escapeHtml(contact.comments).replace(/\n/g, '<br>')}</span>
        </div>
        ` : ''}
    `;

    document.getElementById('contactDetails').innerHTML = detailsHtml;
    document.getElementById('viewModal').classList.add('show');
}

// Close View Modal
function closeViewModal() {
    document.getElementById('viewModal').classList.remove('show');
    currentEditingContactId = null;
}

// Edit from View Modal
function handleEditFromView() {
    closeViewModal();
    openEditContactModal(currentEditingContactId);
}

// Delete from View Modal
function handleDeleteFromView() {
    const contact = allContacts.find(c => c.id === currentEditingContactId);
    if (contact) {
        closeViewModal();
        openDeleteModal(currentEditingContactId, contact.name);
    }
}

// Open Delete Confirmation Modal
function openDeleteModal(contactId, contactName) {
    currentDeletingContactId = contactId;
    document.getElementById('deleteMessage').textContent = 
        `Are you sure you want to delete "${contactName}"? This action cannot be undone.`;
    document.getElementById('deleteModal').classList.add('show');
}

// Close Delete Modal
function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('show');
    currentDeletingContactId = null;
}

// Handle Confirm Delete
async function handleConfirmDelete() {
    if (!currentDeletingContactId) return;

    showLoading(true);
    try {
        const { error } = await supabaseClient
            .from('contacts')
            .delete()
            .eq('id', currentDeletingContactId);

        if (error) throw error;

        closeDeleteModal();
        showError('Contact deleted successfully!', 'success');
        await loadContacts();
    } catch (error) {
        console.error('Error deleting contact:', error);
        showError('Failed to delete contact: ' + error.message);
    } finally {
        showLoading(false);
    }
}

// Search Contacts
function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (!searchTerm) {
        renderContacts(allContacts);
        return;
    }

    const filtered = allContacts.filter(contact => 
        contact.name.toLowerCase().includes(searchTerm) ||
        contact.phone.toLowerCase().includes(searchTerm) ||
        contact.email.toLowerCase().includes(searchTerm) ||
        (contact.town && contact.town.toLowerCase().includes(searchTerm)) ||
        (contact.comments && contact.comments.toLowerCase().includes(searchTerm))
    );

    renderContacts(filtered);
}

// Utility Functions

function showLoading(show) {
    document.getElementById('loadingIndicator').style.display = show ? 'flex' : 'none';
}

function showError(message, type = 'error') {
    const errorElement = document.getElementById('errorMessage');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    if (type === 'success') {
        errorElement.style.background = '#d4edda';
        errorElement.style.borderColor = '#c3e6cb';
        errorElement.style.color = '#155724';
    } else {
        errorElement.style.background = '#f8d7da';
        errorElement.style.borderColor = '#f5c6cb';
        errorElement.style.color = '#721c24';
    }

    // Auto-hide success messages after 3 seconds
    if (type === 'success') {
        setTimeout(() => hideError(), 3000);
    }
}

function hideError() {
    document.getElementById('errorMessage').style.display = 'none';
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
