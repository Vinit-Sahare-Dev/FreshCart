# Todo for Profile Button and Profile Settings Feature

- [ ] Create src/components/ProfileSettings.jsx component:
  - Display user profile photo, email/name
  - Implement photo upload/change functionality
  - Show placeholders for other profile settings
  - Include a logout button calling logout from AuthContext
  - Style with ProfileSettings.css as modal or dropdown panel

- [ ] Create src/components/ProfileSettings.css
  - Styling consistent with Navbar.css color scheme
  - Modal/dark overlay with smooth transitions
  - Responsive and accessible design

- [ ] Modify src/components/Navbar.jsx
  - Remove current email and logout button UI
  - Add "Profile" button which toggles ProfileSettings visibility
  - Pass user info and logout function as props to ProfileSettings
  - Ensure smooth UI transition between states

- [ ] Test feature end-to-end for style, responsiveness, and functionality

- [ ] Cleanup and document code
