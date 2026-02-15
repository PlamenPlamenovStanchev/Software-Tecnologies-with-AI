# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Open the App
- Open `index.html` in your web browser directly, or
- Start a local server and navigate to `http://localhost:8000`

```powershell
# Windows PowerShell - Using Python
python -m http.server 8000

# Or using Node.js with http-server
npx http-server -p 8000
```

### Step 2: Create an Account or Login
1. Click the big button: **"Login to create a birthday card"**
2. Choose to **Register** (create new account) or **Login** (if you already have an account)
3. Enter your email and password
4. For registration, no email confirmation is needed - you can login immediately!

### Step 3: Start Creating
- After login, you'll see the **Generate Card** screen
- The card generation interface is ready for your features!

## 🎨 What's Already Built

✅ **Beautiful Home Page**
- Animated background with floating balloons
- Colorful gradient design
- Swaying garlands and bouncing gifts
- Falling confetti particles

✅ **Authentication System**
- Register with email and password
- Login with credentials
- Logout button in navbar
- Error messages and validation

✅ **Responsive Design**
- Works on desktop, tablet, and mobile
- Beautiful UI with Bootstrap 5
- Modern fonts and icons

✅ **Code Structure**
- `index.html` - Page structure
- `styles.css` - All styling and animations
- `config.js` - Supabase config and utilities
- `auth.js` - Authentication management
- `app.js` - Main application logic

## 🔧 Customize

### Change Colors
Edit the variables at the top of `styles.css`:
```css
:root {
    --primary-color: #6366f1;  /* Change this */
    --secondary-color: #ec4899;
    /* ... more colors ... */
}
```

### Change Text
Edit the text in `index.html`:
- Hero title: Look for `<h1 class="display-2">...`
- Button text: Look for "Login to create a birthday card"

### Add Features
Build the card generation interface in the `#generateScreen` div in `index.html`.

## 📚 File Descriptions

| File | Purpose |
|------|---------|
| `index.html` | HTML structure with modal, screens, and forms |
| `styles.css` | All CSS styling, animations, and responsive design |
| `config.js` | Supabase configuration, loading spinner, error handling |
| `auth.js` | AuthManager class handling login/register/logout |
| `app.js` | BirthdayCardApp class managing UI and screens |
| `package.json` | Project metadata and dependencies |
| `README.md` | Full documentation |
| `.gitignore` | Git ignore rules |

## ✨ Cool Features

### Animated Background
- 5 colored balloons floating upward with different speeds
- Garlands that sway back and forth
- Gifts that bounce up and down
- Confetti particles falling continuously
- All animations loop infinitely

### Auth Modal
- Two tabs: Login and Register
- Smooth transitions between tabs
- Real-time error messages
- Loading spinner during auth

### Security
- Passwords are securely handled by Supabase
- No sensitive data stored in localStorage
- Session managed by Supabase Auth

## 🐛 Quick Troubleshooting

**Animations not working?**
- Check your browser's hardware acceleration is enabled
- Try a different browser
- Check browser console for errors (F12)

**Login not working?**
- Check your internet connection
- Make sure you're using the correct email/password
- Check browser console for error messages

**Page won't load?**
- Make sure you're using a local server (http://) not file://
- Check browser console for CORS or network errors

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🎯 Next Steps

1. Test the authentication system
2. Create sample accounts
3. Customize colors and branding
4. Build the birthday card generation interface
5. Add card preview functionality
6. Implement card download/sharing

## 📞 Need Help?

Check the full `README.md` for detailed information about all features and customization options.

---

**Happy building! 🎉**
