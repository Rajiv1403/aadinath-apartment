import { useState, useEffect } from 'react';

const photos = ['/photo1.webp', '/photo2.webp', '/photo3.webp', '/photo4.webp'];

export default function Slideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % photos.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={styles.wrapper}>
      {photos.map((photo, i) => (
        <img
          key={i}
          src={photo}
          alt={`apartment-${i}`}
          style={{ ...styles.img, opacity: i === current ? 1 : 0 }}
        />
      ))}

      {/* Dots */}
      <div style={styles.dots}>
        {photos.map((_, i) => (
          <span
            key={i}
            onClick={() => setCurrent(i)}
            style={{ ...styles.dot, background: i === current ? 'white' : 'rgba(255,255,255,0.4)' }}
          />
        ))}
      </div>

      {/* Arrows */}
      <button style={{ ...styles.arrow, left: '16px' }} onClick={() => setCurrent((current - 1 + photos.length) % photos.length)}>❮</button>
      <button style={{ ...styles.arrow, right: '16px' }} onClick={() => setCurrent((current + 1) % photos.length)}>❯</button>

      {/* Overlay text */}
      <div style={styles.overlay}>
        <h1 style={styles.heading}>🏢 Aadinath Apartment</h1>
        <p style={styles.subtext}>Report your problems easily — we resolve them quickly</p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { position: 'relative', width: '100%', height: '420px', overflow: 'hidden', background: '#000' },
  img: { position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.8s ease' },
  dots: { position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 10 },
  dot: { width: '10px', height: '10px', borderRadius: '50%', cursor: 'pointer', transition: 'background 0.3s' },
  arrow: { position: 'absolute', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.4)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '1.2rem', cursor: 'pointer', zIndex: 10 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 5 },
  heading: { color: 'white', fontSize: '2.2rem', fontWeight: 'bold', textShadow: '0 2px 8px rgba(0,0,0,0.6)', marginBottom: '10px' },
  subtext: { color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }
};
