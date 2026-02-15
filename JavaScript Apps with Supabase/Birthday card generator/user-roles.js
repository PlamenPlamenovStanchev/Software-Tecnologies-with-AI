// ============================================
// USER ROLES MODULE
// ============================================
// Helper functions for checking user roles and permissions
// This module wraps Supabase role functions for convenient use in the app

class UserRoleManager {
    constructor() {
        this.userRole = null;
        this.isAdminUser = false;
        this.initialized = false;
        this.onRoleChange = null; // Callback for role changes
    }

    /**
     * Initialize the role manager
     * Should be called after user logs in
     */
    async init() {
        try {
            if (!supabase) {
                console.warn('Supabase not initialized');
                return false;
            }

            const user = authManager.getCurrentUser();
            if (!user) {
                this.userRole = null;
                this.isAdminUser = false;
                this.initialized = true;
                return false;
            }

            await this.fetchUserRole(user.id);
            this.initialized = true;
            return true;
        } catch (error) {
            console.error('Error initializing user role manager:', error);
            return false;
        }
    }

    /**
     * Fetch user role from database
     */
    async fetchUserRole(userId) {
        try {
            const { data, error } = await supabase
                .from('user_roles')
                .select('user_role')
                .eq('user_id', userId)
                .single();

            if (error) {
                // User doesn't have a role yet (normal for new users)
                this.userRole = 'user';
                this.isAdminUser = false;
                this.triggerRoleChangeCallback();
                return;
            }

            this.userRole = data?.user_role || 'user';
            this.isAdminUser = this.userRole === 'admin';
            this.triggerRoleChangeCallback();
        } catch (error) {
            console.error('Error fetching user role:', error);
            this.userRole = 'user';
            this.isAdminUser = false;
            this.triggerRoleChangeCallback();
        }
    }

    /**
     * Get current user role
     */
    getUserRole() {
        return this.userRole || 'user';
    }

    /**
     * Check if current user is admin
     */
    isAdmin() {
        return this.isAdminUser === true;
    }

    /**
     * Trigger role change callback
     */
    triggerRoleChangeCallback() {
        if (this.onRoleChange && typeof this.onRoleChange === 'function') {
            this.onRoleChange(this.userRole, this.isAdminUser);
        }
    }

    /**
     * Check if current user can edit a card
     * Owners and admins can edit
     */
    canEditCard(cardOwnerId) {
        const user = authManager.getCurrentUser();
        if (!user) return false;

        return user.id === cardOwnerId || this.isAdmin();
    }

    /**
     * Check if current user can delete a card
     * Owners and admins can delete
     */
    canDeleteCard(cardOwnerId) {
        return this.canEditCard(cardOwnerId);
    }

    /**
     * Check if current user can manage roles
     * Only admins can manage roles
     */
    canManageRoles() {
        return this.isAdmin();
    }

    /**
     * Call backend is_admin() function to verify admin status
     * Use this for critical operations
     */
    async verifyAdminStatus() {
        try {
            if (!supabase) return false;

            const { data, error } = await supabase.rpc('is_admin');

            if (error) {
                console.error('Error verifying admin status:', error);
                return false;
            }

            return data === true;
        } catch (error) {
            console.error('Error calling is_admin():', error);
            return false;
        }
    }

    /**
     * Call backend is_owner() function to verify card ownership
     * Use this for critical operations
     */
    async verifyCardOwnership(cardId) {
        try {
            if (!supabase) return false;

            const { data, error } = await supabase.rpc('is_owner', { card_id: cardId });

            if (error) {
                console.error('Error verifying card ownership:', error);
                return false;
            }

            return data === true;
        } catch (error) {
            console.error('Error calling is_owner():', error);
            return false;
        }
    }

    /**
     * Refresh user role from database
     */
    async refreshUserRole() {
        const user = authManager.getCurrentUser();
        if (!user) {
            this.userRole = null;
            this.isAdminUser = false;
            return false;
        }

        await this.fetchUserRole(user.id);
        return true;
    }

    /**
     * Get role display name
     */
    getRoleDisplayName(role = null) {
        const roleValue = role || this.userRole || 'user';
        const roleNames = {
            'user': 'Regular User',
            'admin': 'Administrator'
        };
        return roleNames[roleValue] || 'Unknown';
    }
}

// Create global role manager instance
const userRoleManager = new UserRoleManager();

// Auto-initialize when auth state changes
if (typeof authManager !== 'undefined') {
    const originalOnAuthStateChange = authManager.onAuthStateChange;
    authManager.onAuthStateChange = async function(user) {
        if (user) {
            await userRoleManager.init();
        }
        // Call original handler if it exists
        if (originalOnAuthStateChange && typeof originalOnAuthStateChange === 'function') {
            originalOnAuthStateChange.call(this, user);
        }
    };
}
