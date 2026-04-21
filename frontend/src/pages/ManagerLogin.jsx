import { useState, useContext } from 'react';
import axios from 'axios';
import { DarkModeContext } from '../App';

export default function ManagerLogin({ onLogin }) {
  const dark = useContext(DarkModeContext);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/manager/login`, { phone, password });
      if (res.data.success) {
        localStorage.setItem('managerAuth', res.data.token);
        onLogin();
      }
    } catch (err) {
      setError('Invalid phone number or password');
    }
    setLoading(false);
  };

  const card = { background: dark ? '#1e2a3a' : 'white', color: dark ? '#e0e0e0' : '#1a1a2e', borderRadius: '16px', boxShadow: dark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(108,99,255,0.15)', padding: '40px', maxWidth: '420px', width: '100%' };
  const inputStyle = { padding: '12px 16px', border: `1.5px solid ${dark ? '#2e3f55' : '#e0e0e0'}`, borderRadius: '10px', fontSize: '1rem', width: '100%', background: dark ? '#162030' : '#f8f9ff', color: dark ? '#e0e0e0' : '#1a1a2e', marginBottom: '16px' };
  const btnStyle = { width: '100%', padding: '14px', background: 'linear-gradient(90deg,#6c63ff,#48cae4)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', letterSpacing: '0.5px' };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '20px' }}>
      <div style={card}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔐</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', background: 'linear-gradient(90deg,#6c63ff,#48cae4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>Manager Login</h2>
          <p style={{ color: dark ? '#a0b4c8' : '#666', fontSize: '0.9rem' }}>Enter your credentials to access dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'block', fontWeight: '700', fontSize: '0.85rem', color: dark ? '#a0b4c8' : '#555', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter manager phone"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: '700', fontSize: '0.85rem', color: dark ? '#a0b4c8' : '#555', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              style={inputStyle}
            />
          </div>

          {error && <p style={{ color: '#ff6b6b', textAlign: 'center', marginBottom: '16px', fontSize: '0.9rem', fontWeight: '600' }}>{error}</p>}

          <button type="submit" style={{ ...btnStyle, opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? '⏳ Logging in...' : '🚀 Login'}
          </button>
        </form>

        <div style={{ marginTop: '24px', padding: '16px', background: dark ? '#162030' : '#f8f9ff', borderRadius: '10px', border: `1px solid ${dark ? '#2e3f55' : '#e8e8e8'}` }}>
          <p style={{ fontSize: '0.8rem', color: dark ? '#a0b4c8' : '#666', textAlign: 'center', margin: 0 }}>
            🔒 Secure access for authorized managers only
          </p>
        </div>
      </div>
    </div>
  );
}
