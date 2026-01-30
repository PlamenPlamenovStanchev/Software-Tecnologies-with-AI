# Dog Haven - Multi-Page App

## Project Overview
Dog Haven is a modern, responsive multi-page web application built with Vite, Bootstrap 5, and vanilla JavaScript. The app demonstrates client-side routing, component-based architecture, and CRUD operations.

## Tech Stack
- **Build Tool**: Vite
- **UI Framework**: Bootstrap 5
- **Routing**: Custom client-side router (no hashes, clean URLs)
- **State Management**: Simple JavaScript module (store.js)
- **Styling**: Bootstrap + Custom CSS

## Project Structure

```
Multi-Page-App/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Header/           # Navigation header
│   │   │   ├── header.html   # HTML template
│   │   │   ├── header.js     # Component logic
│   │   │   └── header.css    # Component styles
│   │   └── Footer/           # Footer component
│   │       ├── footer.html
│   │       ├── footer.js
│   │       └── footer.css
│   ├── pages/                # Page components
│   │   ├── home.js           # Home page
│   │   ├── dogs.js           # Dogs listing with modal details
│   │   ├── about.js          # About page
│   │   ├── contact.js        # Contact form page
│   │   └── admin.js          # Admin dashboard with CRUD
│   ├── main.js               # App entry point, route registration
│   ├── router.js             # Client-side router (no hashes)
│   ├── store.js              # Dog data store & operations
│   └── styles.css            # Global styles
├── index.html                # Main HTML file
├── vite.config.js            # Vite configuration
└── package.json              # Project dependencies
```

## Key Components

### 1. **Header Component** (`src/components/Header/`)
- Sticky navigation bar with Bootstrap navbar
- Active link highlighting based on current URL
- Links to all pages with clean URLs (e.g., `/dogs`, `/admin`)
- Responsive mobile menu

### 2. **Footer Component** (`src/components/Footer/`)
- Static footer with branding
- Sticks to bottom of page using flexbox layout

### 3. **Pages**

#### Home Page (`src/pages/home.js`)
- Landing page with features overview
- Call-to-action buttons
- Hero section with image

#### Dogs Page (`src/pages/dogs.js`)
- Grid of dog cards (3 columns on desktop)
- Click cards to view detailed information in modal
- Bootstrap modal for dog details
- Uses data from `store.js`

#### About Page (`src/pages/about.js`)
- Company mission and values
- Technology stack badges
- Information cards

#### Contact Page (`src/pages/contact.js`)
- Contact form (name, email, subject, message)
- Contact information cards
- Form submission handler

#### Admin Page (`src/pages/admin.js`)
- **Table View**: All dogs with sortable columns
- **Add Dog**: Open modal form for new entries
- **Edit Dog**: Select dog, pre-fill form, update data
- **Delete Dog**: Confirmation dialog before deletion
- **Image Preview**: URL validation with preview
- All changes update the in-memory store

### 4. **Router** (`src/router.js`)
- Custom client-side router without URL hashes
- Clean URLs: `/`, `/dogs`, `/about`, `/contact`, `/admin`
- Handles browser back/forward buttons
- Intercepts internal link clicks
- Dynamic page rendering

### 5. **Store** (`src/store.js`)
- In-memory dog database
- Functions:
  - `getAllDogs()` - Get all dogs
  - `getDogById(id)` - Get single dog
  - `addDog(dog)` - Add new dog
  - `updateDog(id, updates)` - Update dog info
  - `deleteDog(id)` - Delete dog (with confirmation)

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Key Features

✅ **Multi-page navigation** without page reloads  
✅ **Clean URLs** without hashes  
✅ **Component-based architecture** with separate HTML, CSS, JS  
✅ **Bootstrap 5 styling** for responsive design  
✅ **Modal dialogs** for dog details and confirmations  
✅ **CRUD operations** on admin page  
✅ **Form validation** on contact and admin forms  
✅ **Image preview** in admin form  
✅ **Browser history** support (back/forward buttons)  
✅ **Mobile responsive** design  

## Adding New Pages

1. Create new file in `src/pages/pagename.js`
2. Export component with `render()` and optional `init()` methods
3. Import in `src/main.js`
4. Register route: `registerRoute('/path', PageComponent)`
5. Add link in header component

Example:
```javascript
export const NewPage = {
  render(container) {
    container.innerHTML = `<div>Page content</div>`;
  },
  init() {
    // Setup event listeners here
  }
};
```

## Customization Tips

- **Colors**: Modify CSS variables in `src/styles.css`
- **Dog Data**: Edit initial data in `src/store.js`
- **Bootstrap Theme**: Use Bootstrap utility classes
- **Styling**: Add component-specific CSS in component folders
- **Routing**: Modify routes in `src/main.js`

## Browser Support
Modern browsers with ES6 support (Chrome, Firefox, Safari, Edge)
