// ============================================
// CARD GENERATION MODULE
// ============================================

class CardGenerator {
    constructor() {
        this.currentStep = 1;
        this.maxSteps = 4;
        this.currentCardId = null;
        this.cardData = {
            name: '',
            greetingText: 'Happy birthday, {name}!',
            selectedTemplate: null,
            templatePath: null,
            sharingCode: null
        };
        // Templates are now loaded from Supabase via cardTemplatesManager
        this.templates = [];
    }

    /**
     * Initialize card generator
     */
    async init() {
        this.setupEventListeners();
        await this.loadCardTemplates();
        await this.loadUserCards();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Wizard navigation
        document.getElementById('prevBtn').addEventListener('click', () => this.previousStep());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextStep());

        // Step tabs
        document.querySelectorAll('.wizard-step').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const step = parseInt(e.currentTarget.dataset.step);
                if (this.canNavigateToStep(step)) {
                    this.goToStep(step);
                }
            });
        });

        // Step 1: Name input
        document.getElementById('birthdayName').addEventListener('input', (e) => {
            this.cardData.name = e.target.value.trim();
            this.updatePreview();
        });

        // Step 2: Greeting text
        document.getElementById('greetingText').addEventListener('input', (e) => {
            this.cardData.greetingText = e.target.value.trim();
            this.updatePreview();
        });

        // Reset greeting button
        document.getElementById('resetGreetingBtn').addEventListener('click', () => {
            this.resetGreetingText();
        });

        // Download button
        document.getElementById('downloadCardBtn').addEventListener('click', () => {
            this.downloadCard();
        });

        // Share button
        document.getElementById('shareCardBtn').addEventListener('click', () => {
            this.showShareModal();
        });

        // Copy to clipboard button
        document.getElementById('copyToClipboardBtn').addEventListener('click', () => {
            this.copyShareUrlToClipboard();
        });

        // Mobile share button
        document.getElementById('mobileShareBtn').addEventListener('click', () => {
            this.mobileShare();
        });

        // Save button
        document.getElementById('saveCardBtn').addEventListener('click', () => {
            this.saveCard();
        });

        // Delete button
        document.getElementById('deleteCardBtn').addEventListener('click', () => {
            if (this.currentCardId) {
                this.deleteCardWithConfirm(this.currentCardId);
            }
        });
    }

    /**
     * Load card templates into the UI
     */
    /**
     * Load card templates from Supabase Storage
     */
    async loadCardTemplates() {
        try {
            // Wait for cardTemplatesManager to be initialized
            if (!cardTemplatesManager.initialized) {
                await cardTemplatesManager.init();
            }

            const container = document.getElementById('cardTemplatesContainer');
            
            if (!container) {
                console.warn('Card templates container not found');
                return;
            }

            container.innerHTML = '';

            // Get all available templates
            const allTemplates = cardTemplatesManager.getAll();

            if (allTemplates.length === 0) {
                container.innerHTML = '<div class="col-12 text-center text-muted"><p>No templates available. Please check back later.</p></div>';
                return;
            }

            // Render each template
            allTemplates.forEach(template => {
                const col = document.createElement('div');
                col.className = 'col-md-6 col-lg-3';

                const templateCard = document.createElement('div');
                templateCard.className = 'card-template';
                templateCard.dataset.templateId = template.template_id;

                // Get image URL from storage
                const imageUrl = cardTemplatesManager.getImageUrl(template);

                templateCard.innerHTML = `
                    <img src="${imageUrl}" alt="${this.escapeHtml(template.name)}" class="card-template-img" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22300%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22200%22 height=%22300%22/%3E%3C/svg%3E'">
                    <div class="card-template-label">${this.escapeHtml(template.name)}</div>
                `;

                templateCard.addEventListener('click', () => {
                    this.selectTemplate(template.template_id, imageUrl);
                });

                col.appendChild(templateCard);
                container.appendChild(col);
            });

            this.templates = allTemplates;
        } catch (error) {
            console.error('Error loading card templates:', error);
            const container = document.getElementById('cardTemplatesContainer');
            if (container) {
                container.innerHTML = '<div class="col-12 text-center text-danger"><p>Error loading templates. Please refresh the page.</p></div>';
            }
        }
    }

    /**
     * Select a card template
     */
    selectTemplate(templateId, templatePath) {
        // Remove previous selection
        document.querySelectorAll('.card-template').forEach(el => {
            el.classList.remove('selected');
        });

        // Add selection to clicked template
        document.querySelector(`[data-template-id="${templateId}"]`).classList.add('selected');

        // Update card data
        this.cardData.selectedTemplate = templateId;
        this.cardData.templatePath = templatePath;

        this.updatePreview();
    }

    /**
     * Reset greeting text to default
     */
    resetGreetingText() {
        const defaultGreeting = 'Happy birthday, {name}!';
        document.getElementById('greetingText').value = defaultGreeting;
        this.cardData.greetingText = defaultGreeting;
        this.updatePreview();
    }

    /**
     * Update preview card
     */
    updatePreview() {
        const previewText = document.getElementById('previewCardText');
        const previewImage = document.getElementById('previewCardImage');

        // Update text with name substitution
        let displayText = this.cardData.greetingText.replace('{name}', this.cardData.name || '[Name]');
        previewText.textContent = displayText;

        // Update image
        if (this.cardData.templatePath) {
            previewImage.src = this.cardData.templatePath;
        }
    }

    /**
     * Validate current step
     */
    validateStep(step) {
        const errors = [];

        switch (step) {
            case 1:
                const nameInput = document.getElementById('birthdayName');
                if (!nameInput.value.trim()) {
                    errors.push('Please enter the birthday person\'s name');
                }
                break;

            case 2:
                const greetingInput = document.getElementById('greetingText');
                if (!greetingInput.value.trim()) {
                    errors.push('Please enter greeting text');
                }
                break;

            case 3:
                if (!this.cardData.selectedTemplate) {
                    errors.push('Please select a card template');
                }
                break;
        }

        if (errors.length > 0) {
            const stepNumber = step;
            const errorId = `step${stepNumber}Error`;
            const errorElement = document.getElementById(errorId);
            if (errorElement) {
                errorElement.textContent = errors.join(', ');
                errorElement.classList.remove('d-none');
            }
            return false;
        }

        // Clear errors
        for (let i = 1; i <= 4; i++) {
            const errorElement = document.getElementById(`step${i}Error`);
            if (errorElement) {
                errorElement.classList.add('d-none');
            }
        }

        return true;
    }

    /**
     * Check if can navigate to specific step
     */
    canNavigateToStep(step) {
        // Validate all steps up to the target step
        for (let i = 1; i < step; i++) {
            if (!this.validateStep(i)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Go to specific step
     */
    goToStep(step) {
        if (step < 1 || step > this.maxSteps) return;
        if (!this.canNavigateToStep(step)) return;

        this.currentStep = step;
        this.updateWizardUI();
    }

    /**
     * Go to next step
     */
    nextStep() {
        if (this.currentStep < this.maxSteps) {
            if (this.validateStep(this.currentStep)) {
                this.currentStep++;
                this.updateWizardUI();
            }
        }
    }

    /**
     * Go to previous step
     */
    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateWizardUI();
        }
    }

    /**
     * Update wizard UI based on current step
     */
    updateWizardUI() {
        // Update tab navigation
        document.querySelectorAll('.wizard-step').forEach((tab, index) => {
            const stepNum = index + 1;
            if (stepNum === this.currentStep) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Update content tabs
        document.querySelectorAll('.tab-pane').forEach((pane, index) => {
            const stepNum = index + 1;
            if (stepNum === this.currentStep) {
                pane.classList.add('show', 'active');
            } else {
                pane.classList.remove('show', 'active');
            }
        });

        // Update navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const deleteBtn = document.getElementById('deleteCardBtn');

        if (this.currentStep === 1) {
            prevBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'block';
        }

        if (this.currentStep === this.maxSteps) {
            nextBtn.innerHTML = '<i class="fas fa-check me-2"></i>Finished';
            nextBtn.disabled = true;
            // Show delete button only if editing an existing card
            if (this.currentCardId) {
                deleteBtn.style.display = 'block';
                // Show share button only if card has been saved
                document.getElementById('shareCardBtn').style.display = 'block';
            } else {
                deleteBtn.style.display = 'none';
                document.getElementById('shareCardBtn').style.display = 'none';
            }
        } else {
            nextBtn.innerHTML = '<i class="fas fa-arrow-right me-2"></i>Next';
            nextBtn.disabled = false;
            deleteBtn.style.display = 'none';
            document.getElementById('shareCardBtn').style.display = 'none';
        }

        // Scroll to top
        document.querySelector('.card-wizard').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /**
     * Download card as image
     */
    downloadCard() {
        // Use html2canvas to capture the preview
        const previewContainer = document.querySelector('.card-preview-container');
        
        if (!previewContainer) {
            showToast('Cannot download card', 'danger');
            return;
        }

        showLoading();

        // Check if html2canvas is available
        if (typeof html2canvas !== 'undefined') {
            html2canvas(previewContainer, {
                backgroundColor: null,
                scale: 2,
                logging: false,
                useCORS: true,
                allowTaint: true
            }).then(canvas => {
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = `birthday-card-${this.cardData.name || 'card'}-${Date.now()}.png`;
                link.click();
                hideLoading();
                showToast('Card downloaded successfully!', 'success');
            }).catch(error => {
                hideLoading();
                console.error('Error generating image:', error);
                showToast('Error downloading card. Please try again.', 'danger');
            });
        } else {
            hideLoading();
            showToast('Download feature requires html2canvas library. Please refresh the page.', 'warning');
        }
    }

    /**
     * Get card data
     */
    getCardData() {
        return this.cardData;
    }

    /**
     * Load user's cards from database
     */
    async loadUserCards() {
        try {
            const user = authManager.getCurrentUser();
            if (!user || !supabase) return;

            const { data, error } = await supabase
                .from('cards')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error loading cards:', error);
                return;
            }

            this.displayCardsList(data || []);
        } catch (error) {
            console.error('Load cards error:', error);
        }
    }

    /**
     * Display cards list in sidebar
     */
    displayCardsList(cards) {
        const container = document.getElementById('cardsList');
        
        if (!container) return;

        if (cards.length === 0) {
            container.innerHTML = `
                <div class="text-center p-4 text-muted">
                    <p><i class="fas fa-inbox me-2"></i>No cards yet</p>
                    <small>Create your first card to see it here</small>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <button type="button" class="card-new-btn" id="newCardBtn">
                <i class="fas fa-plus me-2"></i>New Card
            </button>
        `;

        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card-item';
            cardElement.dataset.cardId = card.id;

            const createdDate = new Date(card.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });

            cardElement.innerHTML = `
                <div class="card-item-info" data-card-id="${card.id}">
                    <div class="card-item-name">${card.person_name}</div>
                    <div class="card-item-date">${createdDate}</div>
                </div>
                <button type="button" class="card-item-delete" data-card-id="${card.id}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;

            // Click on card info to load card
            cardElement.querySelector('.card-item-info').addEventListener('click', () => {
                this.loadCard(card.id);
            });

            // Click on delete button
            cardElement.querySelector('.card-item-delete').addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteCardWithConfirm(card.id);
            });

            container.appendChild(cardElement);
        });

        // Add event listener for new card button
        const newCardBtn = document.getElementById('newCardBtn');
        if (newCardBtn) {
            newCardBtn.addEventListener('click', () => this.resetWizard());
        }
    }

    /**
     * Load card from database and populate wizard
     */
    async loadCard(cardId) {
        try {
            const { data, error } = await supabase
                .from('cards')
                .select('*')
                .eq('id', cardId)
                .single();

            if (error) {
                showToast('Error loading card', 'danger');
                console.error('Error loading card:', error);
                return;
            }

            // Store card ID for updates
            this.currentCardId = cardId;

            // Populate card data
            this.cardData = {
                name: data.person_name,
                greetingText: data.greeting_text,
                selectedTemplate: data.template_id,
                templatePath: this.templates.find(t => t.id === data.template_id)?.path || null,
                sharingCode: data.sharing_code
            };

            // Update form fields
            document.getElementById('birthdayName').value = data.person_name;
            document.getElementById('greetingText').value = data.greeting_text;

            // Select template
            const template = this.templates.find(t => t.id === data.template_id);
            if (template) {
                this.selectTemplate(template.id, template.path);
            }

            // Navigate to preview step
            this.goToStep(4);
            this.updatePreview();

            // Highlight active card in sidebar
            document.querySelectorAll('.card-item').forEach(el => {
                el.classList.remove('active');
            });
            document.querySelector(`[data-card-id="${cardId}"] .card-item-info`)?.closest('.card-item')?.classList.add('active');

            showToast('Card loaded successfully', 'success');
        } catch (error) {
            showToast('Error loading card', 'danger');
            console.error('Load card error:', error);
        }
    }

    /**
     * Save card to database
     */
    async saveCard() {
        try {
            const user = authManager.getCurrentUser();
            if (!user || !supabase) {
                showToast('User not authenticated', 'danger');
                return null;
            }

            // Validate card data
            if (!this.cardData.name || !this.cardData.greetingText || !this.cardData.selectedTemplate) {
                showToast('Please complete all wizard steps before saving', 'danger');
                return null;
            }

            showLoading();

            if (this.currentCardId) {
                // Update existing card
                const { data, error } = await supabase
                    .from('cards')
                    .update({
                        person_name: this.cardData.name,
                        greeting_text: this.cardData.greetingText,
                        template_id: this.cardData.selectedTemplate,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', this.currentCardId)
                    .select();

                if (error) {
                    console.error('Error updating card:', error);
                    showToast('Error updating card', 'danger');
                    hideLoading();
                    return null;
                }

                showToast('Card updated successfully!', 'success');
            } else {
                // Generate sharing code for new card
                const sharingCode = this.generateSharingCode();
                this.cardData.sharingCode = sharingCode;

                // Insert new card
                const { data, error } = await supabase
                    .from('cards')
                    .insert([{
                        user_id: user.id,
                        person_name: this.cardData.name,
                        greeting_text: this.cardData.greetingText,
                        template_id: this.cardData.selectedTemplate,
                        sharing_code: sharingCode,
                        created_at: new Date().toISOString()
                    }])
                    .select();

                if (error) {
                    console.error('Error saving card:', error);
                    showToast('Error saving card', 'danger');
                    hideLoading();
                    return null;
                }

                // Store the new card ID
                if (data && data[0]) {
                    this.currentCardId = data[0].id;
                    this.cardData.sharingCode = data[0].sharing_code;
                }

                showToast('Card saved successfully!', 'success');
            }

            hideLoading();
            // Reload cards list to show updated/new card
            await this.loadUserCards();
            return true;
        } catch (error) {
            hideLoading();
            showToast('Error saving card', 'danger');
            console.error('Save card error:', error);
            return null;
        }
    }

    /**
     * Delete card with confirmation
     */
    async deleteCardWithConfirm(cardId) {
        if (confirm('Are you sure you want to delete this card? This action cannot be undone.')) {
            await this.deleteCard(cardId);
        }
    }

    /**
     * Delete card from database
     */
    async deleteCard(cardId) {
        try {
            if (!supabase) {
                showToast('Not connected to database', 'danger');
                return false;
            }

            showLoading();

            const { error } = await supabase
                .from('cards')
                .delete()
                .eq('id', cardId);

            if (error) {
                console.error('Error deleting card:', error);
                showToast('Error deleting card', 'danger');
                hideLoading();
                return false;
            }

            showToast('Card deleted successfully', 'success');

            // If deleted card was the current one, reset wizard
            if (this.currentCardId === cardId) {
                this.resetWizard();
            }

            // Reload cards list
            await this.loadUserCards();
            hideLoading();
            return true;
        } catch (error) {
            hideLoading();
            showToast('Error deleting card', 'danger');
            console.error('Delete card error:', error);
            return false;
        }
    }

    /**
     * Reset wizard for new card
     */
    resetWizard() {
        this.currentCardId = null;
        this.cardData = {
            name: '',
            greetingText: 'Happy birthday, {name}!',
            selectedTemplate: null,
            templatePath: null,
            sharingCode: null
        };

        // Reset form fields
        document.getElementById('birthdayName').value = '';
        document.getElementById('greetingText').value = 'Happy birthday, {name}!';
        
        // Deselect all templates
        document.querySelectorAll('.card-template').forEach(el => {
            el.classList.remove('selected');
        });

        // Deselect all cards in sidebar
        document.querySelectorAll('.card-item').forEach(el => {
            el.classList.remove('active');
        });

        // Go to first step
        this.goToStep(1);
        this.updatePreview();
        showToast('New card form ready', 'info');
    }

    /**
     * Generate a random 5-character sharing code
     */
    generateSharingCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 5; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    /**
     * Show share modal with sharing code and link
     */
    showShareModal() {
        if (!this.currentCardId) {
            showToast('Please save the card first to enable sharing', 'warning');
            return;
        }

        // Use existing sharing code or generate new one
        let sharingCode = this.cardData.sharingCode;
        if (!sharingCode) {
            sharingCode = this.generateSharingCode();
            this.cardData.sharingCode = sharingCode;
        }

        // Generate share URL
        const shareUrl = `${window.location.origin}/view-card.html?code=${sharingCode}`;

        // Update modal with share information
        document.getElementById('shareCardUrl').value = shareUrl;
        document.getElementById('sharingCodeDisplay').textContent = sharingCode;

        // Check if mobile share API is available
        if (navigator.share) {
            document.getElementById('mobileShareBtn').style.display = 'block';
        } else {
            document.getElementById('mobileShareBtn').style.display = 'none';
        }

        // Show modal
        const shareModal = new bootstrap.Modal(document.getElementById('shareCardModal'));
        shareModal.show();
    }

    /**
     * Copy share URL to clipboard
     */
    async copyShareUrlToClipboard() {
        const shareUrl = document.getElementById('shareCardUrl').value;
        
        try {
            if (navigator.clipboard && window.isSecureContext) {
                // Use modern Clipboard API
                await navigator.clipboard.writeText(shareUrl);
                showToast('Share link copied to clipboard!', 'success');
                
                // Visual feedback on button
                const btn = document.getElementById('copyToClipboardBtn');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check me-2"></i>Copied!';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                }, 2000);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = shareUrl;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showToast('Share link copied to clipboard!', 'success');
            }
        } catch (error) {
            console.error('Copy to clipboard error:', error);
            showToast('Failed to copy link. Please try again.', 'danger');
        }
    }

    /**
     * Mobile share using native share API
     */
    async mobileShare() {
        const shareUrl = document.getElementById('shareCardUrl').value;
        const sharingCode = document.getElementById('sharingCodeDisplay').textContent;

        if (!navigator.share) {
            showToast('Share API not available on your device', 'warning');
            return;
        }

        try {
            await navigator.share({
                title: `Birthday Card for ${this.cardData.name}`,
                text: `Check out this beautiful birthday card!`,
                url: shareUrl
            });
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Share API error:', error);
                showToast('Error sharing card', 'danger');
            }
        }
    }

    /**
     * Update wizard UI to show/hide share button
     */
    updateShareButtonVisibility() {
        const shareBtn = document.getElementById('shareCardBtn');
        if (this.currentCardId && this.currentStep === this.maxSteps) {
            shareBtn.style.display = 'block';
        } else {
            shareBtn.style.display = 'none';
        }
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
}

// Create global card generator instance
const cardGenerator = new CardGenerator();
