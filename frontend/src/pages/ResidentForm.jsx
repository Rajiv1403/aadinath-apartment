import { useState, useEffect } from 'react';
import axios from 'axios';
import Slideshow from './Slideshow';
import { useContext } from 'react';
import { DarkModeContext } from '../App';

const PROBLEM_TYPES = ['Plumber', 'Carpenter', 'Electrician', 'Painter', 'Cleaner', 'Other'];
const TYPE_ICONS = { Plumber: '🔧', Carpenter: '🪚', Electrician: '⚡', Painter: '🎨', Cleaner: '🧹', Other: '🔨' };
const TYPE_COLORS = { Plumber: '#4cc9f0', Carpenter: '#f77f00', Electrician: '#f9c74f', Painter: '#90be6d', Cleaner: '#43aa8b', Other: '#9b5de5' };

export default function ResidentForm() {
  const dark = useContext(DarkModeContext);
  const [form, setForm] = useState({ flatNumber: '', wing: '', floor: '', residentName: '', phone: '', problemType: '', description: '', priority: 'Normal' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [listening, setListening] = useState(false);

  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert('Your browser does not support voice input. Please use Chrome.'); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = e => {
      const transcript = e.results[0][0].transcript;
      setForm(prev => ({ ...prev, description: prev.description ? prev.description + ' ' + transcript : transcript }));
    };
    recognition.onerror = () => setListening(false);
    recognition.start();
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = e => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (image) data.append('image', image);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/complaints`, data);
      setSubmitted(true);
    } catch {
      setError('Failed to submit. Please try again.');
    }
    setLoading(false);
  };

  const resetForm = () => {
    setSubmitted(false);
    setForm({ flatNumber: '', wing: '', floor: '', residentName: '', phone: '', problemType: '', description: '', priority: 'Normal' });
    setImage(null);
    setPreview(null);
  };

  const card = { background: dark ? '#1e2a3a' : 'white', color: dark ? '#e0e0e0' : '#1a1a2e', borderRadius: '16px', boxShadow: dark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(108,99,255,0.1)', padding: '32px' };
  const inputStyle = { padding: '11px 14px', border: `1.5px solid ${dark ? '#2e3f55' : '#e0e0e0'}`, borderRadius: '10px', fontSize: '0.95rem', width: '100%', background: dark ? '#162030' : '#f8f9ff', color: dark ? '#e0e0e0' : '#1a1a2e' };
  const labelStyle = { fontWeight: '700', marginBottom: '7px', fontSize: '0.88rem', color: dark ? '#a0b4c8' : '#555', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' };

  if (submitted) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div style={{ ...card, textAlign: 'center', maxWidth: '420px', padding: '50px 40px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎉</div>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '10px', color: '#6c63ff' }}>Complaint Submitted!</h2>
        <p style={{ color: dark ? '#a0b4c8' : '#666', marginBottom: '24px' }}>Our team will contact you soon.</p>
        <button style={btnStyle} onClick={resetForm}>Submit Another Complaint</button>
      </div>
    </div>
  );

  return (
    <div>
      <Slideshow />
      <div style={{ maxWidth: '720px', margin: '36px auto', padding: '0 16px' }}>

        {/* Problem Type Selector Cards */}
        <div style={{ ...card, marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1rem', fontWeight: '700', color: dark ? '#a0b4c8' : '#555', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Select Problem Type *</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {PROBLEM_TYPES.map(t => (
              <div key={t} onClick={() => setForm({ ...form, problemType: t })}
                style={{ padding: '14px 10px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', border: `2px solid ${form.problemType === t ? TYPE_COLORS[t] : dark ? '#2e3f55' : '#e8e8e8'}`, background: form.problemType === t ? `${TYPE_COLORS[t]}22` : dark ? '#162030' : '#f8f9ff', transition: 'all 0.2s', transform: form.problemType === t ? 'scale(1.04)' : 'scale(1)' }}>
                <div style={{ fontSize: '1.8rem' }}>{TYPE_ICONS[t]}</div>
                <div style={{ fontWeight: '700', fontSize: '0.85rem', marginTop: '6px', color: form.problemType === t ? TYPE_COLORS[t] : dark ? '#a0b4c8' : '#555' }}>{t}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Selector */}
        <div style={{ ...card, marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1rem', fontWeight: '700', color: dark ? '#a0b4c8' : '#555', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Priority Level *</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[{ key: 'Urgent', icon: '🔴', color: '#ff6b6b' }, { key: 'Normal', icon: '🟡', color: '#ffa94d' }, { key: 'Low', icon: '🟢', color: '#51cf66' }].map(({ key, icon, color }) => (
              <div key={key} onClick={() => setForm({ ...form, priority: key })}
                style={{ padding: '14px 10px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', border: `2px solid ${form.priority === key ? color : dark ? '#2e3f55' : '#e8e8e8'}`, background: form.priority === key ? `${color}22` : dark ? '#162030' : '#f8f9ff', transition: 'all 0.2s', transform: form.priority === key ? 'scale(1.04)' : 'scale(1)' }}>
                <div style={{ fontSize: '1.8rem' }}>{icon}</div>
                <div style={{ fontWeight: '700', fontSize: '0.85rem', marginTop: '6px', color: form.priority === key ? color : dark ? '#a0b4c8' : '#555' }}>{key}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Form */}
        <div style={card}>
          <h2 style={{ textAlign: 'center', marginBottom: '28px', fontSize: '1.5rem', fontWeight: '800', background: 'linear-gradient(90deg,#6c63ff,#48cae4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>📝 Report a Problem</h2>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={labelStyle}>Resident Name *</label>
                <input style={inputStyle} name="residentName" value={form.residentName} onChange={handleChange} required placeholder="Your full name" />
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={labelStyle}>Phone Number *</label>
                <input style={inputStyle} name="phone" value={form.phone} onChange={handleChange} required placeholder="10-digit mobile" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <div style={{ flex: 1, minWidth: '120px' }}>
                <label style={labelStyle}>Wing *</label>
                <input style={inputStyle} name="wing" value={form.wing} onChange={handleChange} required placeholder="e.g. A" />
              </div>
              <div style={{ flex: 1, minWidth: '120px' }}>
                <label style={labelStyle}>Floor *</label>
                <input style={inputStyle} name="floor" value={form.floor} onChange={handleChange} required placeholder="e.g. 2nd" />
              </div>
              <div style={{ flex: 1, minWidth: '120px' }}>
                <label style={labelStyle}>Flat No. *</label>
                <input style={inputStyle} name="flatNumber" value={form.flatNumber} onChange={handleChange} required placeholder="e.g. 204" />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Problem Description *</label>
                <button type="button" onClick={startVoice} title="Speak your problem" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: '700', fontSize: '0.82rem', background: listening ? 'linear-gradient(90deg,#ff6b6b,#ff4757)' : 'linear-gradient(90deg,#6c63ff,#48cae4)', color: 'white', boxShadow: listening ? '0 0 0 4px rgba(255,107,107,0.3)' : 'none', animation: listening ? 'pulse 1s infinite' : 'none' }}>
                  <span style={{ fontSize: '1rem' }}>{listening ? '🔴' : '🎤'}</span>
                  {listening ? 'Listening...' : 'Speak'}
                </button>
              </div>
              <textarea style={{ ...inputStyle, height: '110px', resize: 'vertical' }} name="description" value={form.description} onChange={handleChange} required placeholder="Type or click 🎤 Speak and describe your problem by voice (Hindi/English)..." />
              {listening && <p style={{ color: '#6c63ff', fontSize: '0.82rem', marginTop: '6px', fontWeight: '600' }}>🎙️ Bol rahe hain... (Speaking in Hindi or English)</p>}
            </div>

            {/* Image Upload */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Upload Image (optional)</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', border: `2px dashed ${dark ? '#2e3f55' : '#c8d0e0'}`, borderRadius: '12px', cursor: 'pointer', background: dark ? '#162030' : '#f8f9ff' }}>
                <span style={{ fontSize: '1.5rem' }}>📷</span>
                <span style={{ color: dark ? '#a0b4c8' : '#888', fontSize: '0.9rem' }}>{image ? image.name : 'Click to upload photo of problem'}</span>
                <input type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
              </label>
              {preview && <img src={preview} alt="preview" style={{ marginTop: '12px', maxWidth: '220px', borderRadius: '10px', border: `2px solid ${dark ? '#2e3f55' : '#e0e0e0'}` }} />}
            </div>

            {error && <p style={{ color: '#ff6b6b', textAlign: 'center', marginBottom: '12px' }}>{error}</p>}
            <button type="submit" style={{ ...btnStyle, opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? '⏳ Submitting...' : '🚀 Submit Complaint'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const btnStyle = { width: '100%', padding: '14px', background: 'linear-gradient(90deg,#6c63ff,#48cae4)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', letterSpacing: '0.5px' };
