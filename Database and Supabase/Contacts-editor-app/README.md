# Contact Book App

A modern, responsive contact management application built with HTML, CSS, and JavaScript, with Supabase backend for data persistence.

## Features

✨ **Core Functionality:**
- 📋 View all contacts in a beautiful card-based layout
- 🔍 Search contacts by name, phone, email, town, or comments
- ➕ Add new contacts with validation
- ✏️ Edit existing contact information
- 🗑️ Delete contacts with confirmation dialog
- 📱 View detailed contact information in a modal

✨ **Contact Fields:**
- Name (required)
- Phone (required)
- Email (required)
- Town (optional)
- Comments (optional)

✨ **User Experience:**
- Responsive design for mobile, tablet, and desktop
- Loading indicators for async operations
- Error messages with clear feedback
- Success notifications
- Modal dialogs for all operations
- Real-time search filtering

## Prerequisites

1. **Supabase Account** - Create a free account at [supabase.com](https://supabase.com)
2. **Supabase Database Table** - Must have a `contacts` table with the following columns:
   - `id` (auto-increment, primary key)
   - `name` (text)
   - `phone` (text)
   - `email` (text)
   - `town` (text, nullable)
   - `comments` (text, nullable)

## Setup Instructions

### Step 1: Create Supabase Table

1. Log in to your Supabase project
2. Create a new table called `contacts` with these columns:
   ```
   - id: bigint (auto-increment, primary key)
   - name: text (not null)
   - phone: text (not null)
   - email: text (not null)
   - town: text (nullable)
   - comments: text (nullable)
   - created_at: timestamp (auto-generated, optional)
   - updated_at: timestamp (auto-generated, optional)
   ```

### Step 2: Get Supabase Credentials

1. Go to **Settings → API** in your Supabase project
2. Copy your **Project URL**
3. Copy your **Anon/Public Key** (under "anon public")

### Step 3: Configure the App

1. Open `config.js`
2. Replace the placeholder values:
   ```javascript
   const SUPABASE_URL = 'https://your-project.supabase.co';
   const SUPABASE_KEY = 'your-anon-key';
   ```

### Step 4: Run the App

1. Open `index.html` in your web browser
2. Or serve it with a local server (recommended):
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```
3. Navigate to `http://localhost:8000` (or your server address)

## File Structure

```
Contacts-editor-app/
├── index.html          # Main HTML structure
├── styles.css          # Styling and responsive design
├── app.js              # Main application logic
├── config.js           # Supabase configuration
└── README.md           # This file
```

## How to Use

### Adding a Contact
1. Click the **"+ Add Contact"** button
2. Fill in the required fields (Name, Phone, Email)
3. Optionally add Town and Comments
4. Click **"Save Contact"**

### Viewing a Contact
- Click **"View Details"** on any contact card to see full information

### Editing a Contact
1. Click the **✏️ Edit button** on a contact card, or
2. View the contact and click **"Edit"**
3. Modify the information
4. Click **"Save Contact"**

### Deleting a Contact
1. Click the **🗑️ Delete button** on a contact card, or
2. View the contact and click **"Delete"**
3. Confirm the deletion in the confirmation dialog

### Searching Contacts
- Use the search bar at the top to filter contacts
- Search works across all fields (name, phone, email, town, comments)
- Results update in real-time as you type

## Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Supabase (PostgreSQL)
- **Client Library:** Supabase JavaScript SDK
- **Styling:** Custom CSS with modern gradients and animations
- **Responsive Design:** CSS Grid and Flexbox

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Security Notes

⚠️ **Important:** The Anon/Public key is meant to be public in browser applications. Supabase handles security through:
- Row Level Security (RLS) policies (optional, can be configured)
- API key restrictions
- Environment-based configurations

For production apps, consider:
1. Enabling Row Level Security in Supabase
2. Adding user authentication
3. Restricting API key permissions to specific operations

## Customization

### Change Colors
Edit the CSS variables in `styles.css`:
```css
/* Primary color: #667eea */
/* Secondary color: #764ba2 */
/* Danger color: #e74c3c */
```

### Change Gradient Background
Modify the `background` property in the `body` rule in `styles.css`

### Adjust Card Layout
Change the `grid-template-columns` value in `.contacts-list` class

## Troubleshooting

### "Failed to initialize Supabase"
- Check that `config.js` has correct credentials
- Ensure the Supabase project URL is correct
- Verify the API key is valid

### Contacts not loading
- Check browser console for error messages
- Verify the `contacts` table exists in your Supabase database
- Ensure API key has read permissions

### Cannot save/delete contacts
- Check that all required fields are filled
- Verify table columns match the expected schema
- Check Supabase API key has write permissions

## License

This project is open source and available for personal and educational use.

## Support

For issues or questions:
1. Check the browser console for error messages (F12)
2. Verify Supabase credentials in `config.js`
3. Review the [Supabase documentation](https://supabase.com/docs)

---

**Happy contact managing! 📇**
