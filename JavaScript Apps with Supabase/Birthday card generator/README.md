# Birthday Card Generator

A beautiful, modern web application for creating personalized birthday cards with Supabase authentication.

## 🎉 Features

- **Modern, Beautiful UI**: Built with Bootstrap 5, custom CSS, and animated elements
- **Supabase Authentication**: Secure register/login/logout functionality
- **Animated Background**: Creative animated digital art with floating balloons, garlands, gifts, and confetti
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Two-Tab Auth Modal**: Intuitive register and login interface in a single modal
- **No Email Confirmation**: Email confirmation disabled for streamlined registration

## 📁 Project Structure

```
Birthday card generator/
├── index.html          # Main HTML file with modal and screen containers
├── styles.css          # Beautiful styling and animations
├── config.js           # Supabase configuration and utility functions
├── auth.js             # Authentication manager and Supabase integration
├── app.js              # Main app logic and UI management
├── .vscode/
│   └── mcp.json        # VS Code MCP configuration
└── README.md           # This file
```

## 🛠️ Setup Instructions

### 1. Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Supabase account and project

### 2. Supabase Configuration

This project is already configured to use the following Supabase project:
- **URL**: `https://ozakofbkmeibnyohyoar.supabase.co`
- **Key**: Already included in `config.js`

### 3. Running the Application

1. Open `index.html` in your web browser
2. Or use a local web server:
   ```powershell
   # Using Python 3
   python -m http.server 8000
   
   # Or using Node.js with http-server
   npx http-server
   ```

3. Navigate to `http://localhost:8000`

## 🎨 Features Overview

### Home Screen
- Beautiful animated background with moving elements
- Floating balloons with gradient colors
- Swaying garlands and bouncing gifts
- Falling confetti particles
- Large call-to-action button: "Login to create a birthday card"

### Authentication Modal
- Two tabs: **Login** | **Register**
- Email and password input fields
- Password confirmation for registration
- Real-time error messages
- Smooth tab transitions

### Generate Card Screen
- Displayed after user login
- Ready for future birthday card generation features
- Clean, modern card interface

## 🔐 Authentication Features

### Register
1. Click "Login to create a birthday card" on home screen
2. Go to the "Register" tab
3. Enter email and password
4. Confirm password
5. Click "Create Account"
6. Account created (no email confirmation required)

### Login
1. Click "Login to create a birthday card" on home screen
2. Stay on the "Login" tab
3. Enter email and password
4. Click "Login"
5. Get redirected to the Generate Card screen

### Logout
1. Click "Logout" in the top-right navbar (visible when logged in)
2. Confirm logout
3. Return to home screen

## 🎨 Customization

### Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #6366f1;      /* Indigo */
    --secondary-color: #ec4899;    /* Pink */
    --success-color: #10b981;      /* Green */
    --danger-color: #ef4444;       /* Red */
    --dark-color: #1f2937;
    --light-color: #f9fafb;
}
```

### Fonts
- **Hero Title**: Playfair Display (serif)
- **Body Text**: Fredoka (sans-serif)
- **Icons**: Font Awesome 6.4.0

### Animations
Adjust animation properties in `styles.css`:
- Balloon float duration: `20s`
- Confetti fall duration: `15s`
- Garland sway duration: `3s`
- Gift bounce duration: `4s`

## 📱 Responsive Breakpoints

- **Desktop**: Full experience with all animations
- **Tablet** (≤768px): Adjusted font sizes and animations
- **Mobile** (≤480px): Optimized for small screens

## 🚀 Future Features

- Birthday card customization (text, images, designs)
- Multiple card templates
- Download/share cards
- Email card delivery
- User profile management
- Save favorite cards

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Bootstrap 5.3.0
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts
- **Backend**: Supabase (PostgreSQL + Auth)
- **Authentication**: Supabase Auth with Email/Password

## 📝 Notes

- Email confirmation is disabled in Supabase for this project
- The app uses localStorage for session management
- All authentication is handled securely by Supabase
- The app is fully responsive and works on all modern browsers

## 🐛 Troubleshooting

### Authentication not working
- Check that your internet connection is active
- Verify Supabase is accessible
- Check browser console for error messages

### Animations not smooth
- Ensure your browser supports CSS animations
- Try closing other browser tabs to free up resources
- Check browser hardware acceleration settings

### Layout issues on mobile
- Make sure viewport meta tag is present in `index.html`
- Test with device developer tools
- Clear browser cache and reload

## 📞 Support

For issues with Supabase, visit: https://supabase.com/docs

## 📄 License

This project is open source and available for personal and commercial use.

---

**Happy card creating! 🎉🎂🎈**
