import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect, createContext } from 'react';
import ResidentForm from './pages/ResidentForm';
import ManagerDashboard from './pages/ManagerDashboard';
import TrackComplaint from './pages/TrackComplaint';
import NoticeBoard from './pages/NoticeBoard';

export const DarkModeContext = createContext(false);

function Navbar({ dark, setDark }) {
  const location = useLocation();
  return (
    <nav style={{ ...styles.nav, background: dark ? 'linear-gradient(90deg,#1a1a2e,#16213e)' : 'linear-gradient(90deg,#6c63ff,#48cae4)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
      <div style={styles.brand}>
        <span style={styles.brandIcon}>🏢</span>
        <span style={styles.brandText}>Aadinath Apartment</span>
      </div>
      <div style={styles.navLinks}>
        <Link to="/" style={{ ...styles.link, background: location.pathname === '/' ? 'rgba(255,255,255,0.25)' : 'transparent' }}>🏠 Report</Link>
        <Link to="/track" style={{ ...styles.link, background: location.pathname === '/track' ? 'rgba(255,255,255,0.25)' : 'transparent' }}>🔍 Track</Link>
        <Link to="/notices" style={{ ...styles.link, background: location.pathname === '/notices' ? 'rgba(255,255,255,0.25)' : 'transparent' }}>📢 Notices</Link>
        <Link to="/manager" style={{ ...styles.link, background: location.pathname === '/manager' ? 'rgba(255,255,255,0.25)' : 'transparent' }}>📊 Manager</Link>
        <button onClick={() => setDark(!dark)} style={styles.toggleBtn}>
          {dark ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
    </nav>
  );
}

export default function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    document.body.className = dark ? 'dark' : 'light';
  }, [dark]);

  useEffect(() => {
    document.body.className = dark ? 'dark' : 'light';
  }, []);

  return (
    <DarkModeContext.Provider value={dark}>
      <BrowserRouter>
        <Navbar dark={dark} setDark={setDark} />
        <Routes>
          <Route path="/" element={<ResidentForm />} />
          <Route path="/track" element={<TrackComplaint />} />
          <Route path="/notices" element={<NoticeBoard />} />
          <Route path="/manager" element={<ManagerDashboard />} />
        </Routes>
      </BrowserRouter>
    </DarkModeContext.Provider>
  );
}

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 28px', color: 'white', position: 'sticky', top: 0, zIndex: 100 },
  brand: { display: 'flex', alignItems: 'center', gap: '10px' },
  brandIcon: { fontSize: '1.8rem' },
  brandText: { fontSize: '1.3rem', fontWeight: '800', letterSpacing: '0.5px' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '8px' },
  link: { color: 'white', textDecoration: 'none', fontWeight: '600', padding: '8px 16px', borderRadius: '25px', fontSize: '0.9rem', transition: 'all 0.2s' },
  toggleBtn: { background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '25px', padding: '8px 16px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }
};
