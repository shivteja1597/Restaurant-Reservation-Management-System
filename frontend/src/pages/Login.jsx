import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { login, register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Basic email validation regex (strict .com ending)
    const emailRegex = /^[^\s@]+@[^\s@]+\.com$/i;
    if (!emailRegex.test(email)) {
      setErrorMsg('Please enter a valid email address ending in .com');
      return;
    }
    
    // Password length validation
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }
    
    let res;
    if (isRegister) {
      if (!phone) {
        setErrorMsg('Please enter a phone number');
        return;
      }
      res = await register(name, email, phone, password);
    } else {
      res = await login(email, password);
    }

    if (!res.success) {
      setErrorMsg(res.error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%' }}>
      <div className="glass-panel" style={{ padding: '3rem 2rem', width: '100%', maxWidth: '420px', margin: '1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-gold)', color: '#fff', fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '1rem' }}>
            R
          </div>
          <h1 className="serif-heading" style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '1.5rem', lineHeight: '1.2' }}>
            Restaurant Reservation <br/><span style={{ color: 'var(--accent-gold)' }}>Management System</span>
          </h1>
          <h2 className="serif-heading" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            {isRegister ? 'Create an Account' : 'Welcome Back'}
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            {isRegister ? 'Create an account to make reservations' : 'Sign in to manage your reservations'}
          </p>
        </div>
        
        {errorMsg && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center' }}>{errorMsg}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {isRegister && (
            <>
              <input 
                type="text" 
                className="modern-input"
                placeholder="Full Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
              <input 
                type="tel" 
                className="modern-input"
                placeholder="Phone Number" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                required 
              />
            </>
          )}
          <input 
            type="email" 
            className="modern-input"
            placeholder="Email Address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <div style={{ position: 'relative', width: '100%' }}>
            <input 
              type={showPassword ? "text" : "password"} 
              className="modern-input"
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ paddingRight: '3rem' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                fontSize: '0.875rem'
              }}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          
          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
            {isRegister ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <span 
            onClick={() => {
              setIsRegister(!isRegister);
              setEmail('');
              setPassword('');
              setName('');
              setPhone('');
              setErrorMsg('');
            }} 
            style={{ color: 'var(--accent-gold)', cursor: 'pointer', fontWeight: '500' }}
          >
            {isRegister ? 'Login here' : 'Sign up here'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
