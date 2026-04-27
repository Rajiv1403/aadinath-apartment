import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { DarkModeContext } from '../App';

export default function NoticBoard() {
  const dark = useContext(DarkModeContext);
  const [notices, setNotices] = useState([]);

  const bg = dark ? '#1e2a3a' : 'white';
  const subColor = dark ? '#a0b4c8' : '#666';
  const borderColor = dark ? '#2e3f55' : '#e8e8e8';
  const textColor = dark ? '#e0e0e0' : '#1a1a2e';

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/notices`).then(r => setNotices(r.data));
  }, []);

  return (
    <div style={{ maxWidth: '700px', margin: '36px auto', padding: '0 16px' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📢</div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', background: 'linear-gradient(90deg,#6c63ff,#48cae4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Notice Board</h2>
        <p style={{ color: subColor, marginTop: '8px' }}>Important announcements from management</p>
      </div>

      {notices.length === 0 ? (
        <div style={{ background: bg, borderRadius: '16px', padding: '50px', textAlign: 'center', border: `1px solid ${borderColor}` }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📭</div>
          <p style={{ color: subColor }}>No notices posted yet.</p>
        </div>
      ) : (
        notices.map((n, i) => (
          <div key={n._id} style={{ background: bg, borderRadius: '16px', padding: '22px', marginBottom: '16px', border: `1px solid ${borderColor}`, boxShadow: dark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(108,99,255,0.08)', borderLeft: '4px solid #6c63ff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <h3 style={{ fontWeight: '800', fontSize: '1.05rem', color: textColor }}>{n.title}</h3>
              <span style={{ fontSize: '0.75rem', color: subColor, whiteSpace: 'nowrap', marginLeft: '12px' }}>🕐 {new Date(n.createdAt).toLocaleDateString()}</span>
            </div>
            <p style={{ color: dark ? '#c0d0e0' : '#444', lineHeight: '1.6', fontSize: '0.92rem' }}>{n.message}</p>
          </div>
        ))
      )}
    </div>
  );
}
