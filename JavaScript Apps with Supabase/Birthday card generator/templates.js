// ============================================
// CARD TEMPLATES MODULE
// ============================================
// Helper functions for loading and managing card templates

class CardTemplatesManager {
    constructor() {
        this.templates = [];
        this.initialized = false;
    }

    /**
     * Initialize templates manager
     * Load all available templates from database
     */
    async init() {
        try {
            if (!supabase) {
                console.warn('Supabase not initialized');
                return false;
            }

            await this.loadTemplates();
            this.initialized = true;
            return true;
        } catch (error) {
            console.error('Error initializing templates manager:', error);
            return false;
        }
    }

    /**
     * Load all card templates from database
     */
    async loadTemplates() {
        try {
            const { data, error } = await supabase
                .from('card_templates')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) {
                throw error;
            }

            this.templates = data || [];
        } catch (error) {
            console.error('Error loading templates:', error);
            this.templates = [];
        }
    }

    /**
     * Get all available templates
     */
    getAll() {
        return this.templates;
    }

    /**
     * Get template by ID
     */
    getById(templateId) {
        return this.templates.find(t => t.id === templateId);
    }

    /**
     * Get template by template_id (the identifier used in cards)
     */
    getByTemplateId(templateId) {
        return this.templates.find(t => t.template_id === templateId);
    }

    /**
     * Get template image URL
     */
    getImageUrl(template) {
        if (!template || !template.image_path) return '';
        
        const { data } = supabase
            .storage
            .from('card-templates')
            .getPublicUrl(template.image_path);
        
        return data?.publicUrl || '';
    }

    /**
     * Refresh templates from server
     */
    async refresh() {
        return this.loadTemplates();
    }
}

// Create global templates manager instance
const cardTemplatesManager = new CardTemplatesManager();

// Auto-initialize when page loads (after Supabase is ready)
if (typeof supabase !== 'undefined') {
    document.addEventListener('DOMContentLoaded', async () => {
        await cardTemplatesManager.init();
    });
}
