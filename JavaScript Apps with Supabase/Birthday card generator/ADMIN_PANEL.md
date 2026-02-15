# Admin Panel Documentation

## Overview

The Admin Panel is a comprehensive management interface for administrators to manage all cards and users in the Birthday Card Generator application. It's built with separate, modular files for easy maintenance and scaling.

## Features

### 1. **Admin Authorization**
- Admin Panel (`admin.html`) is protected - only accessible to authenticated admin users
- Automatic redirection to home page if non-admin users try to access
- Admin button with badge appears in the navbar header for admin users only

### 2. **Cards Admin Tab**
Manage all birthday cards created by any user.

#### Features:
- **View All Cards**: Displays a table with all cards in the system
- **Card Information**:
  - Card ID (shortened)
  - Person Name
  - Greeting Text (preview, truncated)
  - Template Name
  - Owner Email
  - Creation Date

- **Actions**:
  - **[Edit]** - Opens edit modal to modify greeting text
  - **[Delete]** - Opens confirmation modal before deletion

#### Edit Card Modal
- Displays all card information (read-only fields: person name, template, owner)
- Allows admins to edit the greeting text
- Changes are saved to the database with updated timestamp

#### Delete Card Modal
- Confirmation dialog before deletion
- Prevents accidental deletion with clear warning
- Permanently removes card from database

### 3. **User Admin Tab**
Manage all user accounts and their roles.

#### Features:
- **View All Users**: Displays a table with all registered users
- **User Information**:
  - User ID (shortened)
  - Email Address
  - Current Role (badge: User or Admin)
  - Registration Date

- **Actions**:
  - **[Make Admin]** - Promote regular user to admin (green button)
  - **[Remove Admin]** - Demote admin user to regular user (orange button)

#### Change User Role Modal
- Displays user email (read-only)
- Role selection dropdown (User or Admin)
- Confirmation button to apply changes
- Automatically creates user_roles entry if doesn't exist

### 4. **Navigation & Controls**
- **Back to App Button**: Navigate back to main card generator
- **Logout Button**: Sign out from admin panel
- **Tab Navigation**: Switch between Cards Admin and User Admin tabs
- **Loading States**: Spinners displayed while loading data
- **Empty States**: Friendly messages when no data exists

## File Structure

```
admin.html          - Main admin panel page (HTML structure)
admin.css           - Styling for admin panel interface
admin.js            - AdminPanel class with all functionality
```

### File Dependencies
```
index.html
├── bootstrap.min.css
├── font-awesome icons
├── styles.css (main styles)
├── config.js (Supabase credentials)
├── auth.js (AuthManager)
├── user-roles.js (UserRoleManager)
└── app.js (BirthdayCardApp)

admin.html
├── bootstrap.min.css
├── font-awesome icons
├── styles.css (main styles)
├── admin.css (admin-specific styles)
├── config.js (Supabase credentials)
├── auth.js (AuthManager)
├── user-roles.js (UserRoleManager)
└── admin.js (AdminPanel)
```

## Database Operations

### Cards Operations
- **Read**: `SELECT * FROM cards` (all cards, includes user email via join)
- **Update**: `UPDATE cards SET greeting_text = ? WHERE id = ?`
- **Delete**: `DELETE FROM cards WHERE id = ?`

### User Operations
- **Read**: 
  - `SELECT * FROM auth.users`
  - `SELECT user_id, user_role FROM user_roles`
- **Update/Create**: 
  - `UPDATE user_roles SET user_role = ? WHERE user_id = ?`
  - `INSERT INTO user_roles (user_id, user_role) VALUES (?, ?)`

## Security Implementation

### Row-Level Security (RLS)
- All database operations use admin-verified functions
- Only authenticated admins can perform admin operations
- RLS policies prevent unauthorized access

### Frontend Protection
- Admin panel checks `userRoleManager.isAdmin()` before rendering
- Non-admin users redirected to home page immediately
- Logout button available on admin panel

### Data Validation
- HTML escaping prevents XSS attacks
- Email addresses validated by authentication system
- User input sanitization in edit/delete confirmations

## User Interface Features

### Responsive Design
- **Desktop**: Full-width tables with all information visible
- **Tablet**: Adjusted spacing and font sizes
- **Mobile**: Stacked action buttons, responsive tables

### Visual Feedback
- **Loading States**: Spinner animations while fetching data
- **Success Messages**: Green toast notifications for operations
- **Error Messages**: Red toast notifications for failures
- **Confirmation Dialogs**: Clear warnings before destructive actions

### Accessibility
- Semantic HTML structure
- ARIA labels on buttons
- Keyboard-navigable modals
- Screen reader friendly text

## Role Management

### Admin Role Capabilities
- View all cards in the system
- Edit card greeting text
- Delete cards (permanent)
- View all users
- Promote users to admin
- Demote admins to regular users
- Access to admin panel

### User Role Limitations
- Can only view/edit their own cards
- Cannot access admin panel
- No user management capabilities
- Cannot see other users' cards

## Notifications & Feedback

### Toast Messages
- **Success**: "Card updated successfully"
- **Success**: "Card deleted successfully"
- **Success**: "User role updated successfully (admin privileges)"
- **Error**: "Error updating card: [error message]"
- **Error**: "Error deleting card: [error message]"
- **Error**: "Error updating user role: [error message]"

Auto-dismiss after 4 seconds with manual close option.

## Best Practices

### For Admins
1. ✅ Always confirm before deleting cards
2. ✅ Check user email before changing roles
3. ✅ Use "Back to App" to return to main functionality
4. ✅ Regularly audit user roles for security
5. ✅ Use logout after admin tasks complete

### For Developers
1. ✅ Always verify admin status before showing admin panel
2. ✅ Escape HTML to prevent XSS
3. ✅ Handle database errors gracefully
4. ✅ Provide user feedback for all operations
5. ✅ Test with non-admin users to ensure redirection works

## Future Enhancement Ideas

1. **Bulk Operations**
   - Select multiple cards/users for batch operations
   - Bulk delete with confirmation
   - Bulk role changes

2. **Advanced Filtering**
   - Filter cards by date range
   - Filter users by role
   - Search by email or card name

3. **Analytics Dashboard**
   - Total cards created
   - Users per role
   - Card creation trends
   - User activity timeline

4. **Audit Logging**
   - Track all admin actions
   - Log timestamp, admin user, action taken
   - Audit history for compliance

5. **User Details Panel**
   - View individual user profile
   - See user's cards
   - Card statistics per user

6. **Card Moderation**
   - Flag inappropriate cards
   - Moderation queue
   - Admin approval workflow

## Testing

### Manual Testing Checklist
- [ ] Admin can access admin panel
- [ ] Non-admin redirected to home
- [ ] Cards table loads and displays all cards
- [ ] Edit card modal opens with correct data
- [ ] Greeting text can be edited
- [ ] Changes saved to database
- [ ] Delete confirmation shows
- [ ] Card deleted from database
- [ ] Users table loads with all users
- [ ] Make Admin button works
- [ ] Remove Admin button works
- [ ] Role changes reflected in table
- [ ] Logout button works
- [ ] Back to App button works
- [ ] Responsive on mobile/tablet

## Troubleshooting

### Admin Button Not Showing
1. Verify user is actually an admin in the database
2. Check `userRoleManager.isAdminUser` in console
3. Verify user_roles table has correct entry
4. Try refreshing the page

### Cannot Access Admin Panel
1. Ensure you're logged in
2. Check if you have admin role: `SELECT user_role FROM user_roles WHERE user_id = '[your_id]'`
3. If not admin, contact another admin to promote you
4. Try logging out and back in

### Data Not Loading
1. Check browser console for errors
2. Verify Supabase credentials in config.js
3. Check if user has permission to read cards/user_roles tables
4. Try refreshing the page
5. Check network tab in developer tools

### Delete/Edit Not Working
1. Verify admin status in database
2. Check if card/user still exists
3. Check for database connection errors in console
4. Try the operation again

## API Reference

### AdminPanel Class

#### Constructor
```javascript
new AdminPanel()
```

#### Methods

**init()**
- Initializes the admin panel
- Checks authentication and admin status
- Loads initial data
- Returns: Promise<void>

**loadCardsData()**
- Fetches all cards from database
- Displays loading state
- Populates table on success
- Returns: Promise<void>

**loadUsersData()**
- Fetches all users and their roles
- Displays loading state
- Populates table on success
- Returns: Promise<void>

**editCard(cardId)**
- Opens edit modal for card
- Parameters: cardId (string)
- Returns: void

**saveCardChanges()**
- Saves edited greeting text
- Updates database
- Reloads cards
- Shows feedback message
- Returns: Promise<void>

**deleteCard(cardId)**
- Opens delete confirmation modal
- Parameters: cardId (string)
- Returns: void

**confirmDeleteCard()**
- Executes card deletion
- Updates database
- Reloads cards
- Shows feedback message
- Returns: Promise<void>

**changeUserRole(userId, userEmail, newRole)**
- Opens role change modal
- Parameters: userId, userEmail, newRole
- Returns: void

**confirmChangeUserRole()**
- Executes role change
- Updates or creates user_roles entry
- Reloads users
- Shows feedback message
- Returns: Promise<void>

**handleLogout()**
- Logs out admin user
- Redirects to home page
- Returns: Promise<void>

## License & Attribution

Admin Panel developed as part of the Birthday Card Generator application.

---

**Last Updated**: February 15, 2026
**Version**: 1.0.0
