import { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import CustomerDashboard from './CustomerDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = ({ isAdmin }) => {
  const { user, logout, updateProfile } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  // Extract Initials for Avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) return (names[0][0] + names[1][0]).toUpperCase();
    return names[0][0].toUpperCase();
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    if (phone) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phone)) {
        setMsg('Phone number must be exactly 10 digits');
        return;
      }
    }

    const data = { name, email, phone, password: password || undefined };
    const res = await updateProfile(data);
    if (res.success) {
      setMsg('Profile updated successfully!');
      setTimeout(() => {
        setShowProfileModal(false);
        setMsg('');
      }, 1500);
    } else {
      setMsg(res.error || 'Failed to update profile');
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem', padding: '1rem 2rem', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '1.5rem' }}>
            R
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h1 className="serif-heading" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0, lineHeight: '1.2' }}>
              Restaurant Reservation <br /><span style={{ color: 'var(--accent-gold)' }}>Management System</span>
            </h1>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.1rem' }}>
              {isAdmin ? 'Admin Portal' : 'Customer Portal'}
            </span>
          </div>
        </div>

        {/* User Profile Area */}
        <div ref={dropdownRef} style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ display: 'block', color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '0.875rem' }}>{user?.name}</span>
            <span style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'capitalize' }}>{user?.role}</span>
          </div>
          
          {/* Avatar Button */}
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            style={{ 
              width: '45px', height: '45px', borderRadius: '50%', background: 'var(--surface-light)', 
              border: '2px solid var(--accent-gold)', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', color: 'var(--accent-gold)', fontWeight: 'bold', fontSize: '1.25rem',
              cursor: 'pointer', transition: 'all 0.2s', padding: 0
            }}
          >
            {getInitials(user?.name)}
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="glass-panel" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', width: '200px', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '0.5rem' }}>
              {!isAdmin && (
                <>
                  <button 
                    onClick={() => { setShowProfileModal(true); setShowDropdown(false); }}
                    style={{ padding: '0.75rem 1rem', background: 'transparent', border: 'none', color: 'var(--text-primary)', textAlign: 'left', cursor: 'pointer', borderRadius: '8px' }}
                    onMouseOver={(e) => e.target.style.background = 'var(--surface-light)'}
                    onMouseOut={(e) => e.target.style.background = 'transparent'}
                  >
                    Edit Profile
                  </button>
                  <div style={{ height: '1px', background: 'var(--border-light)', margin: '0.25rem 0' }} />
                </>
              )}
              <button 
                onClick={logout}
                style={{ padding: '0.75rem 1rem', background: 'transparent', border: 'none', color: '#f87171', textAlign: 'left', cursor: 'pointer', borderRadius: '8px' }}
                onMouseOver={(e) => e.target.style.background = 'var(--surface-light)'}
                onMouseOut={(e) => e.target.style.background = 'transparent'}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
      
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {isAdmin ? <AdminDashboard /> : <CustomerDashboard />}
      </main>

      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>Edit Profile</h2>
              <button onClick={() => setShowProfileModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>

            {msg && (
              <div style={{ padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', background: msg.includes('success') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: msg.includes('success') ? '#4ade80' : '#f87171', border: `1px solid ${msg.includes('success') ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`, fontSize: '0.875rem' }}>
                {msg}
              </div>
            )}

            <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Full Name</label>
                <input type="text" className="modern-input" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Email Address</label>
                <input type="email" className="modern-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Phone Number</label>
                <input type="tel" className="modern-input" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>New Password <span style={{fontSize: '0.75rem', opacity: 0.7}}>(Leave blank to keep current)</span></label>
                <input type="password" className="modern-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowProfileModal(false)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
