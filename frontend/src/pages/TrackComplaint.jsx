import { useState, useContext } from 'react';
import axios from 'axios';
import { DarkModeContext } from '../App';

const STATUS_COLORS = { Pending: '#ff6b6b', 'In Progress': '#ffa94d', Resolved: '#51cf66' };
const STATUS_BG = { Pending: '#ff6b6b22', 'In Progress': '#ffa94d22', Resolved: '#51cf6622' };
const STATUS_ICON = { Pending: '⏳', 'In Progress': '🔄', Resolved: '✅' };
const TYPE_ICONS = { Plumber: '🔧', Carpenter: '🪚', Electrician: '⚡', Painter: '🎨', Cleaner: '🧹', Other: '🔨' };

export default function TrackComplaint() {
  const dark = useContext(DarkModeContext);
  const [phone, setPhone] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const bg = dark ? '#1e2a3a' : 'white';
  const subColor = dark ? '#a0b4c8' : '#666';
  const borderColor = dark ? '#2e3f55' : '#e8e8e8';
  const inputBg = dark ? '#162030' : '#f8f9ff';
  const textColor = dark ? '#e0e0e0' : '#1a1a2e';

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/complaints/track/${phone}`);
    setComplaints(res.data);
    setSearched(true);
    setLoading(false);
  };

  const cardStyle = { background: bg, borderRadius: '16px', boxShadow: dark ? '0 4px 20px rgba(0,0,0,0.35)' : '0 4px 20px rgba(108,99,255,0.08)', border: `1px solid ${borderColor}`, padding: '20px' };

  return (
    <div style={{ maxWidth: '700px', margin: '36px auto', padding: '0 16px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🔍</div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', background: 'linear-gradient(90deg,#6c63ff,#48cae4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Track Your Complaint</h2>
        <p style={{ color: subColor, marginTop: '8px' }}>Enter your phone number to see complaint status</p>
      </div>

      {/* Search Box */}
      <div style={{ ...cardStyle, marginBottom: '24px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="Enter your registered phone number"
            required
            style={{ flex: 1, minWidth: '200px', padding: '12px 16px', border: `1.5px solid ${borderColor}`, borderRadius: '10px', fontSize: '1rem', background: inputBg, color: textColor }}
          />
          <button type="submit" style={{ padding: '12px 28px', background: 'linear-gradient(90deg,#6c63ff,#48cae4)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer' }}>
            {loading ? '⏳' : '🔍 Search'}
          </button>
        </form>
      </div>

      {/* Results */}
      {searched && complaints.length === 0 && (
        <div style={{ ...cardStyle, textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>😕</div>
          <p style={{ color: subColor, fontSize: '1rem' }}>No complaints found for this phone number.</p>
        </div>
      )}

      {complaints.map((c, i) => (
        <div key={c._id} style={{ ...cardStyle, marginBottom: '16px' }}>

          {/* Top Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontWeight: '700', fontSize: '0.9rem', color: textColor }}>{TYPE_ICONS[c.problemType]} {c.problemType}</span>
            <span style={{ padding: '5px 14px', borderRadius: '20px', background: STATUS_BG[c.status], color: STATUS_COLORS[c.status], fontSize: '0.82rem', fontWeight: '700', border: `1px solid ${STATUS_COLORS[c.status]}44` }}>
              {STATUS_ICON[c.status]} {c.status}
            </span>
          </div>

          {/* Progress Bar */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              {['Pending', 'In Progress', 'Resolved'].map((s, idx) => {
                const steps = { Pending: 0, 'In Progress': 1, Resolved: 2 };
                const active = steps[c.status] >= idx;
                return (
                  <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: active ? STATUS_COLORS[s] || '#6c63ff' : dark ? '#2e3f55' : '#e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: '700', color: active ? 'white' : subColor, transition: 'all 0.3s' }}>
                      {active ? '✓' : idx + 1}
                    </div>
                    <span style={{ fontSize: '0.72rem', marginTop: '5px', color: active ? STATUS_COLORS[s] || '#6c63ff' : subColor, fontWeight: active ? '700' : '400' }}>{s}</span>
                  </div>
                );
              })}
            </div>
            {/* Progress Line */}
            <div style={{ height: '4px', background: dark ? '#2e3f55' : '#e8e8e8', borderRadius: '4px', margin: '0 16px', position: 'relative', top: '-36px', zIndex: 0 }}>
              <div style={{ height: '100%', borderRadius: '4px', background: 'linear-gradient(90deg,#6c63ff,#48cae4)', width: c.status === 'Pending' ? '0%' : c.status === 'In Progress' ? '50%' : '100%', transition: 'width 0.5s ease' }} />
            </div>
          </div>

          {/* Details */}
          <div style={{ background: inputBg, borderRadius: '10px', padding: '12px 16px', marginBottom: '10px' }}>
            <div style={{ color: subColor, fontSize: '0.78rem', fontWeight: '600', marginBottom: '4px' }}>📍 ADDRESS</div>
            <div style={{ fontWeight: '700', color: textColor, fontSize: '0.9rem' }}>Wing {c.wing} • Floor {c.floor} • Flat {c.flatNumber}</div>
          </div>

          <p style={{ color: textColor, fontSize: '0.88rem', lineHeight: '1.5', padding: '10px', background: inputBg, borderRadius: '8px', borderLeft: '3px solid #6c63ff', marginBottom: '10px' }}>{c.description}</p>

          {/* Manager Reply */}
          {c.managerReply && (
            <div style={{ background: '#6c63ff22', border: '1px solid #6c63ff44', borderRadius: '8px', padding: '10px 14px', marginBottom: '10px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#6c63ff', marginBottom: '4px' }}>💬 MANAGER REPLY</div>
              <p style={{ color: textColor, fontSize: '0.88rem', margin: 0 }}>{c.managerReply}</p>
            </div>
          )}

          {/* Assigned Worker */}
          {c.assignedWorker && (
            <div style={{ background: '#51cf6622', border: '1px solid #51cf6644', borderRadius: '8px', padding: '10px 14px', marginBottom: '10px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#51cf66', marginBottom: '4px' }}>👷 ASSIGNED WORKER</div>
              <p style={{ color: textColor, fontSize: '0.88rem', margin: 0 }}>{c.assignedWorker} {c.assignedWorkerPhone && `| 📞 ${c.assignedWorkerPhone}`}</p>
            </div>
          )}

          <div style={{ color: subColor, fontSize: '0.76rem' }}>🕐 Submitted: {new Date(c.createdAt).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}
