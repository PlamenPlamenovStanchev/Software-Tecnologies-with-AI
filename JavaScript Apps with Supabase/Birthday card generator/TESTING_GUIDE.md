# Testing Guide - Birthday Card Generator

## 🧪 Manual Testing Checklist

### 1. Initial Page Load
- [ ] Page loads without errors
- [ ] Animated background elements appear
- [ ] Navigation bar is visible
- [ ] Hero section displays correctly
- [ ] "Login to create a birthday card" button is visible
- [ ] Logout button is NOT visible (not logged in)
- [ ] Animations are smooth and continuous
- [ ] Responsive design works on mobile/tablet

### 2. Authentication Modal

#### Opening Modal
- [ ] Clicking login button opens auth modal
- [ ] Modal has two tabs: Login | Register
- [ ] Login tab is selected by default
- [ ] Modal is centered and accessible
- [ ] Close button (X) works correctly
- [ ] Modal closes when clicking outside (optional)

#### Register Tab
- [ ] Can switch to register tab
- [ ] Email input field accepts valid emails
- [ ] Password input field masks characters
- [ ] Confirm password field is visible
- [ ] "Create Account" button is styled correctly
- [ ] Form validation messages appear on errors:
  - [ ] Empty fields error
  - [ ] Passwords don't match error
  - [ ] Password < 6 characters error
  - [ ] Invalid email format error

#### Login Tab
- [ ] Can switch to login tab
- [ ] Email input field accepts emails
- [ ] Password input field masks characters
- [ ] "Login" button is styled correctly
- [ ] Form validation messages appear on errors:
  - [ ] Empty fields error
  - [ ] Invalid credentials error

### 3. Registration Flow

#### Successful Registration
```
1. Click "Login" button on home
2. Switch to "Register" tab
3. Enter: test@example.com
4. Enter password: TestPassword123
5. Confirm password: TestPassword123
6. Click "Create Account"
```

- [ ] Loading spinner appears
- [ ] Success message shown
- [ ] Form clears
- [ ] Switched back to login tab
- [ ] Can login with new credentials
- [ ] User created in Supabase (check dashboard)

#### Failed Registration
- [ ] Error shown for invalid email format
- [ ] Error shown for password mismatch
- [ ] Error shown for short password
- [ ] Error shown for duplicate email

### 4. Login Flow

#### Successful Login
```
1. Click "Login" button on home
2. Enter registered email
3. Enter correct password
4. Click "Login"
```

- [ ] Loading spinner appears
- [ ] Welcome message shown
- [ ] Modal closes
- [ ] Redirected to generate card screen
- [ ] "Logout" button appears in navbar
- [ ] Home screen hidden
- [ ] Generate card screen displayed
- [ ] Navigation shows "Logout" button

#### Failed Login
- [ ] Error shown for non-existent email
- [ ] Error shown for wrong password
- [ ] Modal remains open for retry
- [ ] Form retains email (optional)

### 5. Generate Card Screen

After successful login:
- [ ] Generate card screen displays
- [ ] Screen has proper heading
- [ ] Logout button is visible in navbar
- [ ] Home screen is hidden
- [ ] Animations are paused/removed
- [ ] Card template is clean and accessible

### 6. Logout Flow

#### Logout Process
```
1. Be logged in (on generate screen)
2. Click "Logout" in navbar
3. Confirm logout in dialog
```

- [ ] Confirmation dialog appears
- [ ] Can cancel logout
- [ ] On confirm: Loading spinner appears
- [ ] Session cleared
- [ ] Redirected to home screen
- [ ] "Logout" button disappears
- [ ] Animations resume
- [ ] "Login to create a birthday card" button reappears

### 7. Animated Background

#### Visual Elements
- [ ] 5 balloons visible
  - [ ] Different colors
  - [ ] Different sizes
  - [ ] Floating upward smoothly
  - [ ] Different animation speeds
- [ ] Garlands visible
  - [ ] Emoji icons displayed correctly
  - [ ] Swaying left-right motion
- [ ] Gifts visible
  - [ ] Bouncing motion
  - [ ] Proper size
- [ ] Confetti falling
  - [ ] Various emoji types
  - [ ] Different sizes
  - [ ] Rotation effect
  - [ ] Continuous animation

#### Animation Performance
- [ ] Smooth animation (no jank)
- [ ] Frame rate consistent
- [ ] No memory leaks on long pages
- [ ] Mobile animations optimized

### 8. Responsive Design

#### Desktop (> 1024px)
- [ ] Full layout works
- [ ] All animations visible
- [ ] Text readable
- [ ] Modal centered properly
- [ ] Form inputs full width

#### Tablet (768px - 1024px)
- [ ] Layout adjusts properly
- [ ] Touch-friendly buttons
- [ ] Modal fits screen
- [ ] Text sizes adjusted
- [ ] Animations reduced if needed

#### Mobile (< 768px)
- [ ] Navigation bar responsive
- [ ] Hero section readable
- [ ] Buttons touch-sized (48px+)
- [ ] Modal modal uses full width minus padding
- [ ] Form inputs easily accessible
- [ ] Landscape mode works

#### Small Mobile (< 480px)
- [ ] All content visible
- [ ] No horizontal scroll
- [ ] Modal scrollable if needed
- [ ] Buttons properly spaced

### 9. Browser Compatibility

Test in multiple browsers:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

### 10. Accessibility

- [ ] Tab navigation works
- [ ] Focus indicators visible
- [ ] Keyboard navigation works
- [ ] Error messages announced
- [ ] Color contrast sufficient
- [ ] Font sizes readable

### 11. Error Handling

#### Network Errors
- [ ] Handles offline gracefully
- [ ] Shows meaningful error messages
- [ ] User can retry

#### Input Validation
- [ ] Email validation works
- [ ] Password requirements enforced
- [ ] Error messages clear and helpful

#### Session Management
- [ ] Session persists on page refresh
- [ ] Session timeout handled
- [ ] Logout clears session properly

### 12. Performance

- [ ] Page loads in < 2 seconds
- [ ] Animations are smooth
- [ ] No console errors
- [ ] No memory leaks
- [ ] Supabase calls complete quickly

## 📝 Browser Console Testing

### Open DevTools (F12) and check:
```javascript
// Check if Supabase is initialized
console.log(supabase);

// Check auth state
console.log(authManager.getCurrentUser());

// Check app state
console.log(app.isAuthenticated);
console.log(app.currentScreen);

// Test showLoading
showLoading();
// ... should see spinner overlay

// Hide it
hideLoading();

// Test showToast
showToast('Test message', 'success');

// Test showError
showError('Test error message');
```

## 🔍 Supabase Testing

### Check User Created
1. Go to Supabase dashboard
2. Navigate to Authentication > Users
3. Verify registered user appears
4. Check email address
5. Verify no email confirmation sent (if configured)

### Check Session
```javascript
// In browser console
const session = await supabase.auth.getSession();
console.log(session);
```

## 🎨 Visual Testing Checklist

### Colors
- [ ] Gradient background displays correctly
- [ ] Button colors are distinct
- [ ] Text colors readable
- [ ] Hover states visible

### Typography
- [ ] Hero title is prominent
- [ ] Body text is readable
- [ ] Form labels clear
- [ ] Error messages visible

### Spacing
- [ ] No overlapping elements
- [ ] Proper padding around content
- [ ] Buttons have adequate spacing
- [ ] Form fields properly aligned

### Icons
- [ ] Font Awesome icons display
- [ ] Icon sizes appropriate
- [ ] Icons colored correctly
- [ ] Icons align with text

## 🧩 Component Testing

### Navigation Bar
- [ ] Logo/brand visible
- [ ] Navbar styled correctly
- [ ] Responsive menu works
- [ ] Logout button appears/disappears

### Home Screen
- [ ] Hero title prominent
- [ ] Subtitle readable
- [ ] CTA button visible
- [ ] Background animations working

### Auth Modal
- [ ] Modal styling correct
- [ ] Tabs functional
- [ ] Form inputs responsive
- [ ] Buttons styled correctly

### Generate Screen
- [ ] Heading displays
- [ ] Card container visible
- [ ] Proper spacing
- [ ] Ready for content

## 🚀 Performance Testing

### Page Load Metrics
```javascript
// In browser console
console.log(performance.getEntriesByType('navigation')[0]);

// Measure time to interactive
console.log(performance.timing.loadEventEnd - performance.timing.navigationStart);
```

### Animation Performance
- [ ] 60 FPS animations
- [ ] No dropped frames
- [ ] Smooth transitions
- [ ] No lag on interactions

### Memory Usage
- [ ] No memory leaks
- [ ] Consistent memory over time
- [ ] Animations don't increase memory

## 📋 Test Scenarios

### Scenario 1: New User Flow
```
1. Load page
2. Click login
3. Click register
4. Create account
5. Login with new account
6. Logout
✓ Expected: All features work smoothly
```

### Scenario 2: Returning User
```
1. Load page
2. Refresh page (session should persist)
3. Should still be logged in
4. Logout
✓ Expected: Session restored, logout works
```

### Scenario 3: Session Timeout
```
1. Login
2. Close browser
3. Clear cookies/storage
4. Reopen page
✓ Expected: Returned to login state
```

### Scenario 4: Mobile Experience
```
1. Open on mobile device
2. Test all features
3. Test orientation change
4. Test with keyboard open
✓ Expected: Works smoothly on mobile
```

### Scenario 5: Error Recovery
```
1. Try to register with invalid email
2. Try to login with wrong password
3. Try offline (disconnect internet)
✓ Expected: Helpful error messages, can recover
```

## 🐛 Known Issues & Troubleshooting

| Issue | Solution |
|-------|----------|
| Modal not opening | Check bootstrap.Modal initialization, ensure modal ID matches |
| Animations not smooth | Check GPU acceleration, reduce animation count |
| Login not working | Check Supabase keys, verify internet connection |
| Form validation not showing | Check form element IDs match in HTML |
| Responsive design broken | Clear browser cache, check CSS media queries |

## ✅ Sign-Off Checklist

Before deployment, verify:
- [ ] All tests pass
- [ ] No console errors
- [ ] Responsive on all devices
- [ ] Authentication works
- [ ] Animations smooth
- [ ] Performance acceptable
- [ ] No sensitive data exposed
- [ ] Documentation updated
- [ ] Code commented
- [ ] Ready for production

## 📊 Test Report Template

```
TEST REPORT - Birthday Card Generator
=====================================

Date: [Date]
Tester: [Name]
Environment: [Browser/Device]

RESULTS:
--------
✓ Functionality: PASS/FAIL
✓ Responsive: PASS/FAIL
✓ Performance: PASS/FAIL
✓ Accessibility: PASS/FAIL

ISSUES FOUND:
-----------
[List any issues]

RECOMMENDATIONS:
---------------
[Suggestions for improvement]

SIGN-OFF:
--------
[Tester signature]
```

---

**Happy testing! 🧪**
