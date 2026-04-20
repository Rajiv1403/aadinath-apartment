import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { DarkModeContext } from '../App';

const STATUS_COLORS = { Pending: '#ff6b6b', 'In Progress': '#ffa94d', Resolved: '#51cf66' };
const STATUS_BG = { Pending: '#ff6b6b22', 'In Progress': '#ffa94d22', Resolved: '#51cf6622' };
const TYPE_ICONS = { Plumber: '🔧', Carpenter: '🪚', Electrician: '⚡', Painter: '🎨', Cleaner: '🧹', Other: '🔨' };
const TYPE_COLORS = { Plumber: '#4cc9f0', Carpenter: '#f77f00', Electrician: '#f9c74f', Painter: '#90be6d', Cleaner: '#43aa8b', Other: '#9b5de5' };

export default function ManagerDashboard() {
  const dark = useContext(DarkModeContext);
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  const bg = dark ? '#1e2a3a' : 'white';
  const textColor = dark ? '#e0e0e0' : '#1a1a2e';
  const subColor = dark ? '#a0b4c8' : '#666';
  const borderColor = dark ? '#2e3f55' : '#e8e8e8';
  const inputBg = dark ? '#162030' : '#f8f9ff';

  const fetchComplaints = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/complaints`);
    setComplaints(res.data);
  };

  useEffect(() => { fetchComplaints(); }, []);

  const updateStatus = async (id, status) => {
    await axios.patch(`${import.meta.env.VITE_API_URL}/api/complaints/${id}`, { status });
    fetchComplaints();
  };

  const deleteComplaint = async (id) => {
    if (window.confirm('Delete this complaint?')) {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/complaints/${id}`);
      fetchComplaints();
    }
  };

  const filtered = complaints.filter(c =>
    (filter === 'All' || c.status === filter) &&
    (typeFilter === 'All' || c.problemType === typeFilter)
  );

  const counts = { All: complaints.length, Pending: 0, 'In Progress': 0, Resolved: 0 };
  complaints.forEach(c => counts[c.status]++);

  const cardStyle = { background: bg, borderRadius: '16px', boxShadow: dark ? '0 4px 20px rgba(0,0,0,0.35)' : '0 4px 20px rgba(108,99,255,0.08)', border: `1px solid ${borderColor}` };

  return (
    <div style={{ maxWidth: '1150px', margin: '30px auto', padding: '0 16px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', background: 'linear-gradient(90deg,#6c63ff,#48cae4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>📊 Manager Dashboard</h2>
        <p style={{ color: subColor, marginTop: '6px' }}>Manage and resolve all apartment complaints</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { key: 'All', icon: '📋', color: '#6c63ff' },
          { key: 'Pending', icon: '⏳', color: '#ff6b6b' },
          { key: 'In Progress', icon: '🔄', color: '#ffa94d' },
          { key: 'Resolved', icon: '✅', color: '#51cf66' }
        ].map(({ key, icon, color }) => (
          <div key={key} style={{ ...cardStyle, flex: 1, minWidth: '130px', padding: '20px 16px', textAlign: 'center', borderTop: `4px solid ${color}`, cursor: 'pointer' }} onClick={() => setFilter(key)}>
            <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>{icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color }}>{counts[key]}</div>
            <div style={{ color: subColor, fontSize: '0.82rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{key}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ ...cardStyle, padding: '16px 20px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: '700', fontSize: '0.85rem', color: subColor, textTransform: 'uppercase' }}>Status:</span>
          {['All', 'Pending', 'In Progress', 'Resolved'].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: '6px 14px', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem', background: filter === s ? 'linear-gradient(90deg,#6c63ff,#48cae4)' : dark ? '#162030' : '#f0f2f5', color: filter === s ? 'white' : subColor, transition: 'all 0.2s' }}>{s}</button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: '700', fontSize: '0.85rem', color: subColor, textTransform: 'uppercase' }}>Type:</span>
          {['All', 'Plumber', 'Carpenter', 'Electrician', 'Painter', 'Cleaner', 'Other'].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)} style={{ padding: '6px 14px', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem', background: typeFilter === t ? TYPE_COLORS[t] || '#6c63ff' : dark ? '#162030' : '#f0f2f5', color: typeFilter === t ? 'white' : subColor, transition: 'all 0.2s' }}>{t}</button>
          ))}
        </div>
      </div>

      {/* Complaints Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: subColor }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔍</div>
          <p style={{ fontSize: '1.1rem' }}>No complaints found.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '20px' }}>
          {filtered.map(c => (
            <div key={c._id} style={{ ...cardStyle, padding: '20px', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = dark ? '0 8px 30px rgba(0,0,0,0.5)' : '0 8px 30px rgba(108,99,255,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = dark ? '0 4px 20px rgba(0,0,0,0.35)' : '0 4px 20px rgba(108,99,255,0.08)'; }}>

              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: `${TYPE_COLORS[c.problemType]}22`, padding: '6px 12px', borderRadius: '20px', border: `1px solid ${TYPE_COLORS[c.problemType]}44` }}>
                  <span style={{ fontSize: '1.1rem' }}>{TYPE_ICONS[c.problemType]}</span>
                  <span style={{ fontWeight: '700', fontSize: '0.85rem', color: TYPE_COLORS[c.problemType] }}>{c.problemType}</span>
                </div>
                <span style={{ padding: '5px 12px', borderRadius: '20px', background: STATUS_BG[c.status], color: STATUS_COLORS[c.status], fontSize: '0.78rem', fontWeight: '700', border: `1px solid ${STATUS_COLORS[c.status]}44` }}>{c.status}</span>
              </div>

              {/* Address */}
              <div style={{ background: dark ? '#162030' : '#f8f9ff', borderRadius: '10px', padding: '10px 14px', marginBottom: '12px' }}>
                <div style={{ color: subColor, fontSize: '0.82rem', fontWeight: '600', marginBottom: '4px' }}>📍 ADDRESS</div>
                <div style={{ fontWeight: '700', color: textColor }}>Wing {c.wing} • Floor {c.floor} • Flat {c.flatNumber}</div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '10px', fontSize: '0.88rem', color: subColor }}>
                <span>👤 {c.residentName}</span>
                <span>📞 {c.phone}</span>
              </div>

              <p style={{ color: textColor, fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '12px', padding: '10px', background: dark ? '#162030' : '#f8f9ff', borderRadius: '8px', borderLeft: `3px solid #6c63ff` }}>{c.description}</p>

              {c.image && (
                <img src={`${import.meta.env.VITE_API_URL}/uploads/${c.image}`} alt="problem"
                  style={{ width: '100%', maxHeight: '170px', objectFit: 'cover', borderRadius: '10px', cursor: 'pointer', marginBottom: '10px', border: `1px solid ${borderColor}` }}
                  onClick={() => setSelectedImage(`${import.meta.env.VITE_API_URL}/uploads/${c.image}`)} />
              )}

              <div style={{ color: subColor, fontSize: '0.76rem', marginBottom: '14px' }}>🕐 {new Date(c.createdAt).toLocaleString()}</div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <select value={c.status} onChange={e => updateStatus(c._id, e.target.value)}
                  style={{ flex: 1, padding: '9px 12px', borderRadius: '10px', border: `1.5px solid ${borderColor}`, background: inputBg, color: textColor, fontWeight: '600', fontSize: '0.88rem', cursor: 'pointer' }}>
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
                <button onClick={() => deleteComplaint(c._id)}
                  style={{ padding: '9px 14px', background: '#ff6b6b22', color: '#ff6b6b', border: '1.5px solid #ff6b6b44', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem' }}>
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, cursor: 'pointer' }}
          onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="full" style={{ maxWidth: '92%', maxHeight: '90vh', borderRadius: '14px', boxShadow: '0 8px 40px rgba(0,0,0,0.6)' }} />
          <span style={{ position: 'absolute', top: '20px', right: '28px', color: 'white', fontSize: '2rem', cursor: 'pointer' }}>✕</span>
        </div>
      )}
    </div>
  );
}
