import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { DarkModeContext } from '../App';
import ManagerLogin from './ManagerLogin';

const STATUS_COLORS = { Pending: '#ff6b6b', 'In Progress': '#ffa94d', Resolved: '#51cf66' };
const STATUS_BG = { Pending: '#ff6b6b22', 'In Progress': '#ffa94d22', Resolved: '#51cf6622' };
const TYPE_ICONS = { Plumber: '🔧', Carpenter: '🪚', Electrician: '⚡', Painter: '🎨', Cleaner: '🧹', Other: '🔨' };
const TYPE_COLORS = { Plumber: '#4cc9f0', Carpenter: '#f77f00', Electrician: '#f9c74f', Painter: '#90be6d', Cleaner: '#43aa8b', Other: '#9b5de5' };
const PRIORITY_COLORS = { Urgent: '#ff6b6b', Normal: '#ffa94d', Low: '#51cf66' };
const PRIORITY_ICONS = { Urgent: '🔴', Normal: '🟡', Low: '🟢' };

export default function ManagerDashboard() {
  const dark = useContext(DarkModeContext);
  const [auth, setAuth] = useState(!!localStorage.getItem('managerAuth'));
  const [complaints, setComplaints] = useState([]);
  const [notices, setNotices] = useState([]);
  const [filter, setFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState('complaints');
  const [noticeForm, setNoticeForm] = useState({ title: '', message: '' });
  const [expandedCard, setExpandedCard] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [workerForm, setWorkerForm] = useState({});

  const bg = dark ? '#1e2a3a' : 'white';
  const textColor = dark ? '#e0e0e0' : '#1a1a2e';
  const subColor = dark ? '#a0b4c8' : '#666';
  const borderColor = dark ? '#2e3f55' : '#e8e8e8';
  const inputBg = dark ? '#162030' : '#f8f9ff';

  const fetchComplaints = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/complaints`);
    setComplaints(res.data);
  };

  const fetchNotices = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notices`);
    setNotices(res.data);
  };

  useEffect(() => { if (auth) { fetchComplaints(); fetchNotices(); } }, [auth]);

  if (!auth) return <ManagerLogin onLogin={() => setAuth(true)} />;

  const updateComplaint = async (id, data) => {
    await axios.patch(`${import.meta.env.VITE_API_URL}/api/complaints/${id}`, data);
    fetchComplaints();
  };

  const deleteComplaint = async (id) => {
    if (window.confirm('Delete this complaint?')) {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/complaints/${id}`);
      fetchComplaints();
    }
  };

  const postNotice = async (e) => {
    e.preventDefault();
    await axios.post(`${import.meta.env.VITE_API_URL}/api/notices`, noticeForm);
    setNoticeForm({ title: '', message: '' });
    fetchNotices();
  };

  const deleteNotice = async (id) => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/notices/${id}`);
    fetchNotices();
  };

  const filtered = complaints.filter(c =>
    (filter === 'All' || c.status === filter) &&
    (typeFilter === 'All' || c.problemType === typeFilter) &&
    (priorityFilter === 'All' || c.priority === priorityFilter)
  );

  const counts = { All: complaints.length, Pending: 0, 'In Progress': 0, Resolved: 0 };
  complaints.forEach(c => counts[c.status]++);

  // Analytics
  const typeCount = {};
  complaints.forEach(c => { typeCount[c.problemType] = (typeCount[c.problemType] || 0) + 1; });
  const mostCommon = Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0];

  const cardStyle = { background: bg, borderRadius: '16px', boxShadow: dark ? '0 4px 20px rgba(0,0,0,0.35)' : '0 4px 20px rgba(108,99,255,0.08)', border: `1px solid ${borderColor}` };
  const inputStyle = { padding: '10px 14px', border: `1.5px solid ${borderColor}`, borderRadius: '10px', fontSize: '0.9rem', background: inputBg, color: textColor, width: '100%' };
  const btnGrad = { background: 'linear-gradient(90deg,#6c63ff,#48cae4)', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 18px', fontWeight: '700', cursor: 'pointer', fontSize: '0.88rem' };

  return (
    <div style={{ maxWidth: '1150px', margin: '30px auto', padding: '0 16px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', background: 'linear-gradient(90deg,#6c63ff,#48cae4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>📊 Manager Dashboard</h2>
        <button onClick={() => { localStorage.removeItem('managerAuth'); setAuth(false); }} style={{ marginTop: '10px', padding: '7px 18px', background: '#ff6b6b22', color: '#ff6b6b', border: '1.5px solid #ff6b6b44', borderRadius: '20px', cursor: 'pointer', fontWeight: '700', fontSize: '0.82rem' }}>🚪 Logout</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[{ key: 'All', icon: '📋', color: '#6c63ff' }, { key: 'Pending', icon: '⏳', color: '#ff6b6b' }, { key: 'In Progress', icon: '🔄', color: '#ffa94d' }, { key: 'Resolved', icon: '✅', color: '#51cf66' }].map(({ key, icon, color }) => (
          <div key={key} style={{ ...cardStyle, flex: 1, minWidth: '120px', padding: '18px 12px', textAlign: 'center', borderTop: `4px solid ${color}`, cursor: 'pointer' }} onClick={() => { setFilter(key); setActiveTab('complaints'); }}>
            <div style={{ fontSize: '1.6rem' }}>{icon}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color }}>{counts[key]}</div>
            <div style={{ color: subColor, fontSize: '0.78rem', fontWeight: '600', textTransform: 'uppercase' }}>{key}</div>
          </div>
        ))}
        {mostCommon && (
          <div style={{ ...cardStyle, flex: 1, minWidth: '120px', padding: '18px 12px', textAlign: 'center', borderTop: '4px solid #9b5de5' }}>
            <div style={{ fontSize: '1.6rem' }}>{TYPE_ICONS[mostCommon[0]]}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#9b5de5' }}>{mostCommon[1]}</div>
            <div style={{ color: subColor, fontSize: '0.78rem', fontWeight: '600', textTransform: 'uppercase' }}>Top: {mostCommon[0]}</div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[{ id: 'complaints', label: '📋 Complaints' }, { id: 'analytics', label: '📈 Analytics' }, { id: 'notices', label: '📢 Notices' }].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: '10px 22px', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem', background: activeTab === t.id ? 'linear-gradient(90deg,#6c63ff,#48cae4)' : dark ? '#1e2a3a' : 'white', color: activeTab === t.id ? 'white' : subColor, boxShadow: activeTab === t.id ? '0 4px 12px rgba(108,99,255,0.3)' : 'none' }}>{t.label}</button>
        ))}
      </div>

      {/* COMPLAINTS TAB */}
      {activeTab === 'complaints' && (
        <>
          {/* Filters */}
          <div style={{ ...cardStyle, padding: '14px 18px', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: '700', fontSize: '0.8rem', color: subColor }}>STATUS:</span>
              {['All', 'Pending', 'In Progress', 'Resolved'].map(s => (
                <button key={s} onClick={() => setFilter(s)} style={{ padding: '5px 12px', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', fontSize: '0.78rem', background: filter === s ? 'linear-gradient(90deg,#6c63ff,#48cae4)' : dark ? '#162030' : '#f0f2f5', color: filter === s ? 'white' : subColor }}>{s}</button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: '700', fontSize: '0.8rem', color: subColor }}>PRIORITY:</span>
              {['All', 'Urgent', 'Normal', 'Low'].map(p => (
                <button key={p} onClick={() => setPriorityFilter(p)} style={{ padding: '5px 12px', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', fontSize: '0.78rem', background: priorityFilter === p ? PRIORITY_COLORS[p] || '#6c63ff' : dark ? '#162030' : '#f0f2f5', color: priorityFilter === p ? 'white' : subColor }}>{p}</button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: '700', fontSize: '0.8rem', color: subColor }}>TYPE:</span>
              {['All', 'Plumber', 'Carpenter', 'Electrician', 'Painter', 'Cleaner', 'Other'].map(t => (
                <button key={t} onClick={() => setTypeFilter(t)} style={{ padding: '5px 12px', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', fontSize: '0.78rem', background: typeFilter === t ? TYPE_COLORS[t] || '#6c63ff' : dark ? '#162030' : '#f0f2f5', color: typeFilter === t ? 'white' : subColor }}>{t}</button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: subColor }}>
              <div style={{ fontSize: '3rem' }}>🔍</div>
              <p>No complaints found.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
              {filtered.map(c => (
                <div key={c._id} style={{ ...cardStyle, padding: '20px', transition: 'transform 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>

                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ background: `${TYPE_COLORS[c.problemType]}22`, padding: '5px 10px', borderRadius: '20px', fontWeight: '700', fontSize: '0.82rem', color: TYPE_COLORS[c.problemType] }}>{TYPE_ICONS[c.problemType]} {c.problemType}</span>
                      <span style={{ fontSize: '0.8rem' }}>{PRIORITY_ICONS[c.priority || 'Normal']} {c.priority || 'Normal'}</span>
                    </div>
                    <span style={{ padding: '4px 10px', borderRadius: '20px', background: STATUS_BG[c.status], color: STATUS_COLORS[c.status], fontSize: '0.76rem', fontWeight: '700' }}>{c.status}</span>
                  </div>

                  {/* Address */}
                  <div style={{ background: inputBg, borderRadius: '8px', padding: '8px 12px', marginBottom: '10px' }}>
                    <div style={{ color: subColor, fontSize: '0.75rem', fontWeight: '600' }}>📍 Wing {c.wing} • Floor {c.floor} • Flat {c.flatNumber}</div>
                    <div style={{ fontWeight: '700', color: textColor, fontSize: '0.88rem' }}>👤 {c.residentName} | 📞 {c.phone}</div>
                  </div>

                  <p style={{ color: textColor, fontSize: '0.88rem', lineHeight: '1.5', padding: '8px 12px', background: inputBg, borderRadius: '8px', borderLeft: '3px solid #6c63ff', marginBottom: '10px' }}>{c.description}</p>

                  {c.image && <img src={`${import.meta.env.VITE_API_URL}/uploads/${c.image}`} alt="problem" style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer', marginBottom: '10px' }} onClick={() => setSelectedImage(`${import.meta.env.VITE_API_URL}/uploads/${c.image}`)} />}

                  {/* Manager Reply */}
                  {c.managerReply && (
                    <div style={{ background: '#6c63ff22', border: '1px solid #6c63ff44', borderRadius: '8px', padding: '8px 12px', marginBottom: '10px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#6c63ff', marginBottom: '4px' }}>💬 MANAGER REPLY</div>
                      <p style={{ color: textColor, fontSize: '0.85rem', margin: 0 }}>{c.managerReply}</p>
                    </div>
                  )}

                  {/* Assigned Worker */}
                  {c.assignedWorker && (
                    <div style={{ background: '#51cf6622', border: '1px solid #51cf6644', borderRadius: '8px', padding: '8px 12px', marginBottom: '10px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#51cf66', marginBottom: '4px' }}>👷 ASSIGNED WORKER</div>
                      <p style={{ color: textColor, fontSize: '0.85rem', margin: 0 }}>{c.assignedWorker} {c.assignedWorkerPhone && `| 📞 ${c.assignedWorkerPhone}`}</p>
                    </div>
                  )}

                  <div style={{ color: subColor, fontSize: '0.74rem', marginBottom: '12px' }}>🕐 {new Date(c.createdAt).toLocaleString()}</div>

                  {/* Actions Row 1 */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <select value={c.status} onChange={e => updateComplaint(c._id, { status: e.target.value })} style={{ flex: 1, ...inputStyle, padding: '8px' }}>
                      <option>Pending</option><option>In Progress</option><option>Resolved</option>
                    </select>
                    <select value={c.priority || 'Normal'} onChange={e => updateComplaint(c._id, { priority: e.target.value })} style={{ flex: 1, ...inputStyle, padding: '8px' }}>
                      <option>Urgent</option><option>Normal</option><option>Low</option>
                    </select>
                  </div>

                  {/* Expand for more actions */}
                  <button onClick={() => setExpandedCard(expandedCard === c._id ? null : c._id)} style={{ width: '100%', padding: '7px', background: dark ? '#162030' : '#f0f2f5', color: subColor, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem', marginBottom: '8px' }}>
                    {expandedCard === c._id ? '▲ Hide' : '▼ Reply / Assign Worker'}
                  </button>

                  {expandedCard === c._id && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {/* Reply */}
                      <textarea placeholder="Write reply for resident..." value={replyText[c._id] || c.managerReply || ''} onChange={e => setReplyText({ ...replyText, [c._id]: e.target.value })} style={{ ...inputStyle, height: '70px', resize: 'none' }} />
                      <button onClick={() => updateComplaint(c._id, { managerReply: replyText[c._id] || '' })} style={btnGrad}>💬 Save Reply</button>

                      {/* Assign Worker */}
                      <input placeholder="Worker name" value={workerForm[c._id]?.name || c.assignedWorker || ''} onChange={e => setWorkerForm({ ...workerForm, [c._id]: { ...workerForm[c._id], name: e.target.value } })} style={inputStyle} />
                      <input placeholder="Worker phone" value={workerForm[c._id]?.phone || c.assignedWorkerPhone || ''} onChange={e => setWorkerForm({ ...workerForm, [c._id]: { ...workerForm[c._id], phone: e.target.value } })} style={inputStyle} />
                      <button onClick={() => updateComplaint(c._id, { assignedWorker: workerForm[c._id]?.name || '', assignedWorkerPhone: workerForm[c._id]?.phone || '' })} style={{ ...btnGrad, background: 'linear-gradient(90deg,#51cf66,#43aa8b)' }}>👷 Assign Worker</button>
                    </div>
                  )}

                  <button onClick={() => deleteComplaint(c._id)} style={{ width: '100%', padding: '8px', background: '#ff6b6b22', color: '#ff6b6b', border: '1.5px solid #ff6b6b44', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.82rem' }}>🗑 Delete</button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {/* Problem Type Breakdown */}
          <div style={{ ...cardStyle, padding: '24px' }}>
            <h3 style={{ fontWeight: '800', marginBottom: '16px', color: textColor }}>📊 Problem Type Breakdown</h3>
            {Object.entries(typeCount).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
              <div key={type} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '600', fontSize: '0.88rem', color: textColor }}>{TYPE_ICONS[type]} {type}</span>
                  <span style={{ fontWeight: '700', color: TYPE_COLORS[type] }}>{count}</span>
                </div>
                <div style={{ height: '8px', background: dark ? '#2e3f55' : '#e8e8e8', borderRadius: '4px' }}>
                  <div style={{ height: '100%', borderRadius: '4px', background: TYPE_COLORS[type], width: `${(count / complaints.length) * 100}%`, transition: 'width 0.5s' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Status Breakdown */}
          <div style={{ ...cardStyle, padding: '24px' }}>
            <h3 style={{ fontWeight: '800', marginBottom: '16px', color: textColor }}>📈 Status Overview</h3>
            {['Pending', 'In Progress', 'Resolved'].map(s => (
              <div key={s} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '600', fontSize: '0.88rem', color: textColor }}>{s}</span>
                  <span style={{ fontWeight: '700', color: STATUS_COLORS[s] }}>{counts[s]}</span>
                </div>
                <div style={{ height: '8px', background: dark ? '#2e3f55' : '#e8e8e8', borderRadius: '4px' }}>
                  <div style={{ height: '100%', borderRadius: '4px', background: STATUS_COLORS[s], width: complaints.length ? `${(counts[s] / complaints.length) * 100}%` : '0%', transition: 'width 0.5s' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Priority Breakdown */}
          <div style={{ ...cardStyle, padding: '24px' }}>
            <h3 style={{ fontWeight: '800', marginBottom: '16px', color: textColor }}>⚡ Priority Breakdown</h3>
            {['Urgent', 'Normal', 'Low'].map(p => {
              const cnt = complaints.filter(c => (c.priority || 'Normal') === p).length;
              return (
                <div key={p} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.88rem', color: textColor }}>{PRIORITY_ICONS[p]} {p}</span>
                    <span style={{ fontWeight: '700', color: PRIORITY_COLORS[p] }}>{cnt}</span>
                  </div>
                  <div style={{ height: '8px', background: dark ? '#2e3f55' : '#e8e8e8', borderRadius: '4px' }}>
                    <div style={{ height: '100%', borderRadius: '4px', background: PRIORITY_COLORS[p], width: complaints.length ? `${(cnt / complaints.length) * 100}%` : '0%', transition: 'width 0.5s' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* NOTICES TAB */}
      {activeTab === 'notices' && (
        <div>
          {/* Post Notice Form */}
          <div style={{ ...cardStyle, padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ fontWeight: '800', marginBottom: '16px', color: textColor }}>📢 Post New Notice</h3>
            <form onSubmit={postNotice} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input placeholder="Notice Title" value={noticeForm.title} onChange={e => setNoticeForm({ ...noticeForm, title: e.target.value })} required style={inputStyle} />
              <textarea placeholder="Notice message..." value={noticeForm.message} onChange={e => setNoticeForm({ ...noticeForm, message: e.target.value })} required style={{ ...inputStyle, height: '100px', resize: 'vertical' }} />
              <button type="submit" style={btnGrad}>📢 Post Notice</button>
            </form>
          </div>

          {/* Notices List */}
          {notices.map(n => (
            <div key={n._id} style={{ ...cardStyle, padding: '20px', marginBottom: '14px', borderLeft: '4px solid #6c63ff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontWeight: '800', color: textColor, marginBottom: '8px' }}>{n.title}</h4>
                  <p style={{ color: dark ? '#c0d0e0' : '#444', lineHeight: '1.6', fontSize: '0.9rem' }}>{n.message}</p>
                  <span style={{ color: subColor, fontSize: '0.75rem' }}>🕐 {new Date(n.createdAt).toLocaleString()}</span>
                </div>
                <button onClick={() => deleteNotice(n._id)} style={{ marginLeft: '12px', padding: '6px 12px', background: '#ff6b6b22', color: '#ff6b6b', border: '1px solid #ff6b6b44', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.8rem' }}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, cursor: 'pointer' }} onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="full" style={{ maxWidth: '92%', maxHeight: '90vh', borderRadius: '14px' }} />
          <span style={{ position: 'absolute', top: '20px', right: '28px', color: 'white', fontSize: '2rem' }}>✕</span>
        </div>
      )}
    </div>
  );
}
