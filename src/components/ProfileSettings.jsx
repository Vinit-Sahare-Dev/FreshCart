import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileSettings.css';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../api/authApi';

function ProfileSettings({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuth();
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [email, setEmail] = useState('N/A');
  const [name, setName] = useState('N/A');
  const [phone, setPhone] = useState('N/A');
  const [city, setCity] = useState('N/A');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.id) {
      setLoading(true);
      
      // First, try to load from local storage
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        try {
          const profileData = JSON.parse(savedProfile);
          if (profileData.id === user.id) {
            setEmail(profileData.email || user.email || 'N/A');
            setName(profileData.name || user.name || 'N/A');
            setPhone(profileData.phone || 'N/A');
            setCity(profileData.city || 'N/A');
            if (profileData.photoURL) {
              setPhotoPreview(profileData.photoURL);
            }
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error('Error loading from local storage:', err);
        }
      }
      
      // If local storage doesn't have it, fetch from API
      Promise.resolve()
        .then(() => {
          try {
            return getUserProfile(user.id);
          } catch {
            return null;
          }
        })
        .then(response => {
          if (response && response.data) {
            setEmail(response.data.email || user.email || 'N/A');
            setName(response.data.name || response.data.fullName || user.name || 'N/A');
            setPhone(response.data.phone || response.data.phoneNumber || 'N/A');
            setCity(response.data.city || 'N/A');
            if (response.data.photoURL) {
              setPhotoPreview(response.data.photoURL);
            }
          } else {
            // Set from user context if API fails
            setEmail(user.email || 'N/A');
            setName(user.name || 'N/A');
            setPhone('N/A');
            setCity('N/A');
          }
        })
        .catch(() => {
          // Fallback to user context data
          setEmail(user.email || 'N/A');
          setName(user.name || 'N/A');
          setPhone('N/A');
          setCity('N/A');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user, isOpen]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        // Here you could also upload photo to backend or storage
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!user || !user.id) return;
    
    // Show saving state
    setSaving(true);
    setSaveMessage('Saving your profile...');
    setMessageType('');
    
    try {
      console.log('Saving profile for user:', user.id);
      const updatedData = {
        fullName: name,  // Changed from 'name' to 'fullName' to match backend UserDto
        email,
        // Note: phone and city are not part of current UserDto, but sending anyway
        phone,
        city,
      };
      console.log('Updated data:', updatedData);
      
      const response = await updateUserProfile(user.id, updatedData);
      console.log('Save response:', response);
      
      // Handle both response.data and direct response structure
      const responseData = response.data || response;
      
      // Save to local storage
      const profileData = {
        id: user.id,
        name: responseData.name || responseData.fullName || name,
        email: responseData.email || email,
        phone: phone,
        city: city,
        photoURL: photoPreview,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem('userProfile', JSON.stringify(profileData));
      console.log('Profile saved to local storage:', profileData);
      
      // Save success message to sessionStorage to show on home page
      sessionStorage.setItem('profileSavedMessage', 'Profile updated successfully!');
      
      // Update auth context with new profile info
      setUser(prevUser => ({
        ...prevUser,
        name: responseData.name || responseData.fullName || name,
        email: responseData.email || email,
      }));
      
      setMessageType('success');
      setSaveMessage('✓ Profile saved successfully!');
      
      // Close modal after 1.5 seconds and redirect
      setTimeout(() => {
        setSaving(false);
        onClose();
        // Redirect to home page
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Error saving profile:', error);
      console.error('Error details:', error.response || error.message);
      
      setMessageType('error');
      setSaveMessage('✗ Failed to save profile. Please try again.');
      
      // Auto-hide error message after 5 seconds
      setTimeout(() => {
        setSaveMessage('');
        setMessageType('');
        setSaving(false);
      }, 5000);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="profile-overlay" onClick={onClose} />
      <div className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-title">
        <header className="profile-header">
          <h2 id="profile-title">Profile Settings</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close profile settings">&times;</button>
        </header>
        <div className="profile-content">
          {loading ? (
            <p>Loading profile...</p>
          ) : (
            <>
              <div className="profile-photo-section">
                <div className="profile-photo-wrapper">
                  <img
                    src={photoPreview || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"><stop offset="0%25" style="stop-color:%23059669;stop-opacity:1" /><stop offset="100%25" style="stop-color:%23047857;stop-opacity:1" /></linearGradient></defs><rect width="200" height="200" fill="url(%23grad)"/><circle cx="100" cy="70" r="40" fill="%23ffffff" opacity="0.9"/><path d="M 50 160 Q 50 125 100 125 Q 150 125 150 160 L 150 200 L 50 200 Z" fill="%23ffffff" opacity="0.85"/></svg>'}
                    alt="Profile"
                    className="profile-photo"
                    onClick={() => fileInputRef.current.click()}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') fileInputRef.current.click(); }}
                  />
                  <div className="photo-overlay">+</div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                  aria-label="Upload profile photo"
                />
                <small>Click photo to upload</small>
              </div>
              <div className="profile-info-section">
                <div className="info-item">
                  <label htmlFor="email"><strong>Email:</strong></label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="N/A"
                  />
                </div>
                <div className="info-item">
                  <label htmlFor="name"><strong>Name:</strong></label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="N/A"
                  />
                </div>
                <div className="info-item">
                  <label htmlFor="phone"><strong>Phone:</strong></label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="N/A"
                  />
                </div>
                <div className="info-item">
                  <label htmlFor="city"><strong>City:</strong></label>
                  <input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="N/A"
                  />
                </div>
              </div>
              {saveMessage && (
                <p className={`save-message ${messageType}`}>
                  {saveMessage}
                </p>
              )}
              <div className="profile-actions">
                <button
                  className="settings-btn save-btn"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
                <button className="logout-btn" onClick={() => { logout(); onClose(); }}>
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default ProfileSettings;
