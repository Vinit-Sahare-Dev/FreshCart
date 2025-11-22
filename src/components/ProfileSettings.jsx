import React, { useState, useRef, useEffect } from 'react';
import './ProfileSettings.css';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../api/authApi';

function ProfileSettings({ isOpen, onClose }) {
  const { user, setUser, logout } = useAuth();
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [email, setEmail] = useState('N/A');
  const [name, setName] = useState('N/A');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.id) {
      setLoading(true);
      getUserProfile(user.id)
        .then(response => {
          setEmail(response.data.email || 'N/A');
          setName(response.data.name || response.data.fullName || 'N/A');
          if (response.data.photoURL) {
            setPhotoPreview(response.data.photoURL);
          }
        })
        .catch(() => {
          setSaveMessage('Failed to load profile data.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user]);

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
    setSaving(true);
    setSaveMessage('');
    try {
      const updatedData = {
        name,
        email,
      };
      const response = await updateUserProfile(user.id, updatedData);
      setSaveMessage('Profile saved successfully.');
      // Update auth context with new profile info
      setUser(prevUser => ({
        ...prevUser,
        name: response.data.name || response.data.fullName,
        email: response.data.email,
      }));
    } catch (error) {
      setSaveMessage('Failed to save profile. Please try again.');
    }
    setSaving(false);
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
                <img
                  src={photoPreview || 'https://via.placeholder.com/120?text=No+Photo'}
                  alt="Profile"
                  className="profile-photo"
                  onClick={() => fileInputRef.current.click()}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') fileInputRef.current.click(); }}
                />
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
                <label htmlFor="email"><strong>Email:</strong></label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="N/A"
                />
                <label htmlFor="name"><strong>Name:</strong></label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="N/A"
                />
              </div>
              <div className="profile-actions">
                <button className="logout-btn" onClick={() => { logout(); onClose(); }}>
                  Logout
                </button>
                <button className="settings-btn" onClick={() => alert('Change Password clicked')}>
                  Change Password
                </button>
                <button className="settings-btn" onClick={() => alert('Notification Settings clicked')}>
                  Notification Settings
                </button>
                <button className="settings-btn" onClick={() => alert('Privacy Settings clicked')}>
                  Privacy Settings
                </button>
                <button
                  className="settings-btn"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
              {saveMessage && <p className="save-message">{saveMessage}</p>}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default ProfileSettings;
