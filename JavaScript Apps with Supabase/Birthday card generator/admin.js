// ============================================
// ADMIN PANEL MODULE
// ============================================
// Admin functionality for managing cards and users

class AdminPanel {
    constructor() {
        this.currentUser = null;
        this.cards = [];
        this.users = [];
        this.templates = [];
        this.currentEditingCardId = null;
        this.currentEditingUserId = null;
        this.currentEditingTemplateId = null;
        this.templateImageFile = null;
    }

    /**
     * Initialize the admin panel
     */
    async init() {
        try {
            // Check if user is authenticated
            const user = authManager.getCurrentUser();
            if (!user) {
                window.location.href = 'index.html';
                return;
            }

            // Check if user is admin
            await userRoleManager.init();
            if (!userRoleManager.isAdmin()) {
                window.location.href = 'index.html';
                return;
            }

            this.currentUser = user;
            this.setupEventListeners();
            await this.loadCardsData();
            await this.loadUsersData();
        } catch (error) {
            console.error('Error initializing admin panel:', error);
            window.location.href = 'index.html';
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Logout button
        document.getElementById('adminLogoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleLogout();
        });

        // Edit card modal save button
        document.getElementById('saveCardChangesBtn').addEventListener('click', () => {
            this.saveCardChanges();
        });

        // Delete card confirmation button
        document.getElementById('confirmDeleteCardBtn').addEventListener('click', () => {
            this.confirmDeleteCard();
        });

        // Change user role confirmation button
        document.getElementById('confirmChangeRoleBtn').addEventListener('click', () => {
            this.confirmChangeUserRole();
        });

        // Template modal save button
        document.getElementById('saveTemplateBtn').addEventListener('click', () => {
            this.saveTemplate();
        });

        // Delete template confirmation button
        document.getElementById('confirmDeleteTemplateBtn').addEventListener('click', () => {
            this.confirmDeleteTemplate();
        });

        // Template image file input
        document.getElementById('templateImage').addEventListener('change', (e) => {
            this.handleTemplateImageChange(e);
        });

        // Tab change events
        document.getElementById('cardsAdminTab').addEventListener('shown.bs.tab', async () => {
            await this.loadCardsData();
        });

        document.getElementById('usersAdminTab').addEventListener('shown.bs.tab', async () => {
            await this.loadUsersData();
        });

        document.getElementById('templatesAdminTab').addEventListener('shown.bs.tab', async () => {
            await this.loadTemplatesData();
        });
    }

    /**
     * Load and display all cards
     */
    async loadCardsData() {
        try {
            document.getElementById('cardsLoadingState').style.display = 'block';
            document.getElementById('cardsTableContainer').style.display = 'none';
            document.getElementById('cardsEmptyState').style.display = 'none';

            // Fetch all cards with owner email
            const { data, error } = await supabase
                .from('cards')
                .select(`
                    id,
                    person_name,
                    greeting_text,
                    template_id,
                    created_at,
                    user_id,
                    auth.users!inner(email)
                `)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            this.cards = data || [];

            if (this.cards.length === 0) {
                document.getElementById('cardsLoadingState').style.display = 'none';
                document.getElementById('cardsEmptyState').style.display = 'block';
                return;
            }

            this.displayCardsTable();
            document.getElementById('cardsLoadingState').style.display = 'none';
            document.getElementById('cardsTableContainer').style.display = 'block';
        } catch (error) {
            console.error('Error loading cards:', error);
            document.getElementById('cardsLoadingState').style.display = 'none';
            document.getElementById('cardsEmptyState').style.display = 'block';
        }
    }

    /**
     * Display cards in table
     */
    displayCardsTable() {
        const tbody = document.getElementById('cardsTableBody');
        tbody.innerHTML = '';

        this.cards.forEach(card => {
            const row = document.createElement('tr');
            
            const createdDate = new Date(card.created_at).toLocaleDateString();
            const templateName = this.getTemplateName(card.template_id);
            const ownerEmail = card.auth?.email || 'Unknown';
            
            // Truncate greeting text
            const greetingPreview = card.greeting_text?.substring(0, 50) + (card.greeting_text?.length > 50 ? '...' : '') || 'N/A';

            row.innerHTML = `
                <td>
                    <code style="font-size: 0.85rem;">${card.id.substring(0, 8)}...</code>
                </td>
                <td>
                    <strong>${this.escapeHtml(card.person_name)}</strong>
                </td>
                <td>
                    <small class="text-truncate-2">${this.escapeHtml(greetingPreview)}</small>
                </td>
                <td>
                    <span class="badge bg-info">${templateName}</span>
                </td>
                <td>
                    <small>${this.escapeHtml(ownerEmail)}</small>
                </td>
                <td>
                    <small class="text-muted">${createdDate}</small>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-edit" onclick="adminPanel.editCard('${card.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-delete" onclick="adminPanel.deleteCard('${card.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    /**
     * Open edit card modal
     */
    editCard(cardId) {
        const card = this.cards.find(c => c.id === cardId);
        if (!card) return;

        this.currentEditingCardId = cardId;

        document.getElementById('editPersonName').value = card.person_name || '';
        document.getElementById('editGreetingText').value = card.greeting_text || '';
        document.getElementById('editTemplate').value = this.getTemplateName(card.template_id);
        document.getElementById('editOwnerEmail').value = card.auth?.email || '';

        const modal = new bootstrap.Modal(document.getElementById('editCardModal'));
        modal.show();
    }

    /**
     * Save card changes
     */
    async saveCardChanges() {
        try {
            if (!this.currentEditingCardId) return;

            const newGreetingText = document.getElementById('editGreetingText').value;

            const { error } = await supabase
                .from('cards')
                .update({
                    greeting_text: newGreetingText,
                    updated_at: new Date().toISOString()
                })
                .eq('id', this.currentEditingCardId);

            if (error) {
                throw error;
            }

            // Close modal
            bootstrap.Modal.getInstance(document.getElementById('editCardModal')).hide();

            // Reload cards
            await this.loadCardsData();

            // Show success message
            this.showMessage('Card updated successfully', 'success');
        } catch (error) {
            console.error('Error saving card changes:', error);
            this.showMessage('Error updating card: ' + error.message, 'danger');
        }
    }

    /**
     * Open delete card confirmation modal
     */
    deleteCard(cardId) {
        this.currentEditingCardId = cardId;
        const modal = new bootstrap.Modal(document.getElementById('deleteCardModal'));
        modal.show();
    }

    /**
     * Confirm and execute card deletion
     */
    async confirmDeleteCard() {
        try {
            if (!this.currentEditingCardId) return;

            const { error } = await supabase
                .from('cards')
                .delete()
                .eq('id', this.currentEditingCardId);

            if (error) {
                throw error;
            }

            // Close modal
            bootstrap.Modal.getInstance(document.getElementById('deleteCardModal')).hide();

            // Reload cards
            await this.loadCardsData();

            // Show success message
            this.showMessage('Card deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting card:', error);
            this.showMessage('Error deleting card: ' + error.message, 'danger');
        }
    }

    /**
     * Load and display all users
     */
    async loadUsersData() {
        try {
            document.getElementById('usersLoadingState').style.display = 'block';
            document.getElementById('usersTableContainer').style.display = 'none';
            document.getElementById('usersEmptyState').style.display = 'none';

            // Fetch all users with their roles
            const { data: usersData, error: usersError } = await supabase
                .from('auth.users')
                .select('id, email, created_at');

            if (usersError) {
                throw usersError;
            }

            // Fetch all user roles
            const { data: rolesData, error: rolesError } = await supabase
                .from('user_roles')
                .select('user_id, user_role');

            if (rolesError) {
                throw rolesError;
            }

            // Create role map
            const roleMap = {};
            rolesData.forEach(role => {
                roleMap[role.user_id] = role.user_role;
            });

            // Combine users with roles
            this.users = usersData.map(user => ({
                ...user,
                role: roleMap[user.id] || 'user'
            }));

            if (this.users.length === 0) {
                document.getElementById('usersLoadingState').style.display = 'none';
                document.getElementById('usersEmptyState').style.display = 'block';
                return;
            }

            this.displayUsersTable();
            document.getElementById('usersLoadingState').style.display = 'none';
            document.getElementById('usersTableContainer').style.display = 'block';
        } catch (error) {
            console.error('Error loading users:', error);
            document.getElementById('usersLoadingState').style.display = 'none';
            document.getElementById('usersEmptyState').style.display = 'block';
        }
    }

    /**
     * Display users in table
     */
    displayUsersTable() {
        const tbody = document.getElementById('usersTableBody');
        tbody.innerHTML = '';

        this.users.forEach(user => {
            const row = document.createElement('tr');
            
            const registeredDate = new Date(user.created_at).toLocaleDateString();
            const isAdmin = user.role === 'admin';
            const roleBadgeClass = isAdmin ? 'admin' : 'user';
            const roleText = isAdmin ? 'Admin' : 'User';

            row.innerHTML = `
                <td>
                    <code style="font-size: 0.85rem;">${user.id.substring(0, 8)}...</code>
                </td>
                <td>
                    ${this.escapeHtml(user.email)}
                </td>
                <td>
                    <span class="role-badge ${roleBadgeClass}">${roleText}</span>
                </td>
                <td>
                    <small class="text-muted">${registeredDate}</small>
                </td>
                <td>
                    <div class="table-actions">
                        ${isAdmin ? `
                            <button class="btn btn-sm btn-remove-admin" onclick="adminPanel.changeUserRole('${user.id}', '${this.escapeHtml(user.email)}', 'user')">
                                <i class="fas fa-shield-alt"></i> Remove Admin
                            </button>
                        ` : `
                            <button class="btn btn-sm btn-make-admin" onclick="adminPanel.changeUserRole('${user.id}', '${this.escapeHtml(user.email)}', 'admin')">
                                <i class="fas fa-crown"></i> Make Admin
                            </button>
                        `}
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    /**
     * Open change user role modal
     */
    changeUserRole(userId, userEmail, newRole) {
        this.currentEditingUserId = userId;

        document.getElementById('roleUserEmail').value = userEmail;
        document.getElementById('userRoleSelect').value = newRole;

        const modal = new bootstrap.Modal(document.getElementById('changeUserRoleModal'));
        modal.show();
    }

    /**
     * Confirm and execute user role change
     */
    async confirmChangeUserRole() {
        try {
            if (!this.currentEditingUserId) return;

            const newRole = document.getElementById('userRoleSelect').value;

            // Check if role entry exists
            const { data: existingRole, error: checkError } = await supabase
                .from('user_roles')
                .select('id')
                .eq('user_id', this.currentEditingUserId)
                .single();

            if (checkError && checkError.code !== 'PGRST116') {
                throw checkError;
            }

            if (existingRole) {
                // Update existing role
                const { error: updateError } = await supabase
                    .from('user_roles')
                    .update({
                        user_role: newRole,
                        updated_at: new Date().toISOString()
                    })
                    .eq('user_id', this.currentEditingUserId);

                if (updateError) {
                    throw updateError;
                }
            } else {
                // Create new role entry
                const { error: insertError } = await supabase
                    .from('user_roles')
                    .insert([{
                        user_id: this.currentEditingUserId,
                        user_role: newRole
                    }]);

                if (insertError) {
                    throw insertError;
                }
            }

            // Close modal
            bootstrap.Modal.getInstance(document.getElementById('changeUserRoleModal')).hide();

            // Reload users
            await this.loadUsersData();

            // Show success message
            const roleText = newRole === 'admin' ? 'admin privileges' : 'user privileges';
            this.showMessage(`User role updated successfully (${roleText})`, 'success');
        } catch (error) {
            console.error('Error changing user role:', error);
            this.showMessage('Error updating user role: ' + error.message, 'danger');
        }
    }

    /**
     * Handle logout
     */
    async handleLogout() {
        try {
            await authManager.logout();
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Error logging out:', error);
        }
    }

    /**
     * Get template name from template ID
     */
    getTemplateName(templateId) {
        const templates = {
            'blue-balloons': 'Blue Balloons',
            'kids-cake': 'Kids Cake',
            'colorful-balloons': 'Colorful Balloons',
            'pink-balloons': 'Pink Balloons'
        };
        return templates[templateId] || templateId || 'Default';
    }

    /**
     * Show notification message
     */
    showMessage(message, type = 'info') {
        // Create alert element
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '80px';
        alertDiv.style.right = '20px';
        alertDiv.style.zIndex = '9999';
        alertDiv.style.minWidth = '300px';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(alertDiv);

        // Auto dismiss after 4 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 4000);
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Load and display all card templates
     */
    async loadTemplatesData() {
        try {
            document.getElementById('templatesLoadingState').style.display = 'block';
            document.getElementById('templatesGridContainer').style.display = 'none';
            document.getElementById('templatesEmptyState').style.display = 'none';

            // Fetch all templates
            const { data, error } = await supabase
                .from('card_templates')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            this.templates = data || [];

            if (this.templates.length === 0) {
                document.getElementById('templatesLoadingState').style.display = 'none';
                document.getElementById('templatesEmptyState').style.display = 'block';
                return;
            }

            this.displayTemplatesGrid();
            document.getElementById('templatesLoadingState').style.display = 'none';
            document.getElementById('templatesGridContainer').style.display = 'block';
        } catch (error) {
            console.error('Error loading templates:', error);
            document.getElementById('templatesLoadingState').style.display = 'none';
            document.getElementById('templatesEmptyState').style.display = 'block';
        }
    }

    /**
     * Display templates in grid
     */
    displayTemplatesGrid() {
        const grid = document.getElementById('templatesGrid');
        grid.innerHTML = '';

        this.templates.forEach(template => {
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4';

            const imageUrl = this.getTemplateImageUrl(template.image_path);

            col.innerHTML = `
                <div class="template-card">
                    <img src="${imageUrl}" alt="${this.escapeHtml(template.name)}" class="template-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22300%22%3E%3Crect fill=%22%23f3f4f6%22 width=%22200%22 height=%22300%22/%3E%3C/svg%3E'">
                    <div class="template-info">
                        <div class="template-name">${this.escapeHtml(template.name)}</div>
                        <div class="template-description">${this.escapeHtml(template.description || 'No description')}</div>
                        <div class="template-id">${this.escapeHtml(template.template_id)}</div>
                        <div class="template-actions">
                            <button class="btn btn-sm btn-edit" onclick="adminPanel.editTemplate('${template.id}')">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn btn-sm btn-delete" onclick="adminPanel.deleteTemplate('${template.id}')">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            `;
            grid.appendChild(col);
        });
    }

    /**
     * Open add template modal
     */
    openAddTemplateModal() {
        this.currentEditingTemplateId = null;
        this.templateImageFile = null;

        document.getElementById('templateModalTitle').innerHTML = '<i class="fas fa-plus me-2"></i>Add Card Template';
        document.getElementById('templateForm').reset();
        document.getElementById('templateId').removeAttribute('readonly');
        document.getElementById('imagePreview').style.display = 'none';

        const modal = new bootstrap.Modal(document.getElementById('templateModal'));
        modal.show();
    }

    /**
     * Open edit template modal
     */
    editTemplate(templateId) {
        const template = this.templates.find(t => t.id === templateId);
        if (!template) return;

        this.currentEditingTemplateId = templateId;
        this.templateImageFile = null;

        document.getElementById('templateModalTitle').innerHTML = '<i class="fas fa-edit me-2"></i>Edit Card Template';
        document.getElementById('templateId').value = template.template_id;
        document.getElementById('templateId').setAttribute('readonly', 'readonly');
        document.getElementById('templateName').value = template.name;
        document.getElementById('templateDescription').value = template.description || '';

        // Show image preview
        const imageUrl = this.getTemplateImageUrl(template.image_path);
        document.getElementById('previewImage').src = imageUrl;
        document.getElementById('imagePreview').style.display = 'block';

        // Reset file input but make it optional for edit
        document.getElementById('templateImage').value = '';
        document.getElementById('templateImage').removeAttribute('required');

        const modal = new bootstrap.Modal(document.getElementById('templateModal'));
        modal.show();
    }

    /**
     * Handle template image file selection
     */
    handleTemplateImageChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file is an image
        if (!file.type.startsWith('image/')) {
            this.showMessage('Please select a valid image file', 'danger');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showMessage('File size must be less than 5MB', 'danger');
            return;
        }

        this.templateImageFile = file;

        // Show preview
        const reader = new FileReader();
        reader.onload = (event) => {
            document.getElementById('previewImage').src = event.target.result;
            document.getElementById('imagePreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    /**
     * Save template (add or update)
     */
    async saveTemplate() {
        try {
            const templateId = document.getElementById('templateId').value.trim();
            const templateName = document.getElementById('templateName').value.trim();
            const description = document.getElementById('templateDescription').value.trim();

            if (!templateId || !templateName) {
                this.showMessage('Template ID and Name are required', 'danger');
                return;
            }

            // Validate template ID format
            if (!/^[a-z0-9-]+$/.test(templateId)) {
                this.showMessage('Template ID must contain only lowercase letters, numbers, and hyphens', 'danger');
                return;
            }

            if (this.currentEditingTemplateId) {
                // Update existing template
                await this.updateTemplate(templateId, templateName, description);
            } else {
                // Create new template
                await this.createTemplate(templateId, templateName, description);
            }
        } catch (error) {
            console.error('Error saving template:', error);
            this.showMessage('Error saving template: ' + error.message, 'danger');
        }
    }

    /**
     * Create new template
     */
    async createTemplate(templateId, templateName, description) {
        try {
            if (!this.templateImageFile) {
                this.showMessage('Image is required for new templates', 'danger');
                return;
            }

            // Upload image to storage
            const imagePath = `templates/${templateId}-${Date.now()}`;
            const { error: uploadError } = await supabase
                .storage
                .from('card-templates')
                .upload(imagePath, this.templateImageFile);

            if (uploadError) {
                throw uploadError;
            }

            // Insert template metadata
            const { error: insertError } = await supabase
                .from('card_templates')
                .insert([{
                    template_id: templateId,
                    name: templateName,
                    description: description || null,
                    image_path: imagePath,
                    created_by: this.currentUser.id
                }]);

            if (insertError) {
                throw insertError;
            }

            // Close modal
            bootstrap.Modal.getInstance(document.getElementById('templateModal')).hide();

            // Reload templates
            await this.loadTemplatesData();

            // Show success message
            this.showMessage('Template created successfully', 'success');
        } catch (error) {
            console.error('Error creating template:', error);
            this.showMessage('Error creating template: ' + error.message, 'danger');
        }
    }

    /**
     * Update existing template
     */
    async updateTemplate(templateId, templateName, description) {
        try {
            let imagePath = null;

            // If new image was uploaded, upload it
            if (this.templateImageFile) {
                imagePath = `templates/${templateId}-${Date.now()}`;
                const { error: uploadError } = await supabase
                    .storage
                    .from('card-templates')
                    .upload(imagePath, this.templateImageFile);

                if (uploadError) {
                    throw uploadError;
                }
            }

            // Update template metadata
            const updateData = {
                name: templateName,
                description: description || null,
                updated_at: new Date().toISOString()
            };

            if (imagePath) {
                updateData.image_path = imagePath;
            }

            const { error: updateError } = await supabase
                .from('card_templates')
                .update(updateData)
                .eq('id', this.currentEditingTemplateId);

            if (updateError) {
                throw updateError;
            }

            // Close modal
            bootstrap.Modal.getInstance(document.getElementById('templateModal')).hide();

            // Reload templates
            await this.loadTemplatesData();

            // Show success message
            this.showMessage('Template updated successfully', 'success');
        } catch (error) {
            console.error('Error updating template:', error);
            this.showMessage('Error updating template: ' + error.message, 'danger');
        }
    }

    /**
     * Open delete template confirmation modal
     */
    deleteTemplate(templateId) {
        this.currentEditingTemplateId = templateId;
        const modal = new bootstrap.Modal(document.getElementById('deleteTemplateModal'));
        modal.show();
    }

    /**
     * Confirm and execute template deletion
     */
    async confirmDeleteTemplate() {
        try {
            if (!this.currentEditingTemplateId) return;

            // Get template to delete its image
            const template = this.templates.find(t => t.id === this.currentEditingTemplateId);
            if (template && template.image_path) {
                // Delete image from storage
                await supabase
                    .storage
                    .from('card-templates')
                    .remove([template.image_path]);
            }

            // Delete template record
            const { error } = await supabase
                .from('card_templates')
                .delete()
                .eq('id', this.currentEditingTemplateId);

            if (error) {
                throw error;
            }

            // Close modal
            bootstrap.Modal.getInstance(document.getElementById('deleteTemplateModal')).hide();

            // Reload templates
            await this.loadTemplatesData();

            // Show success message
            this.showMessage('Template deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting template:', error);
            this.showMessage('Error deleting template: ' + error.message, 'danger');
        }
    }

    /**
     * Get template image URL from storage
     */
    getTemplateImageUrl(imagePath) {
        if (!imagePath) return '';
        
        const { data } = supabase
            .storage
            .from('card-templates')
            .getPublicUrl(imagePath);
        
        return data?.publicUrl || '';
    }
}

// Initialize admin panel when DOM is ready
const adminPanel = new AdminPanel();

document.addEventListener('DOMContentLoaded', () => {
    adminPanel.init();
});
