import React from 'react';
import { Link } from 'react-router-dom';

const footerColumnStyle = {
  flex: 1,
  minWidth: '220px',
  textAlign: 'left',
  margin: '0 1rem',
};

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#181f28', color: '#e5eaf1', marginTop: 'auto', padding: 0 }}>
      <div
        style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '3rem 1rem 0 1rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: '2rem',
          }}
        >
          {/* Logo y descripción */}
          <div style={footerColumnStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <i className="fas fa-building" style={{ color: '#27d88d', fontSize: 28 }}></i>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>Reaviva</span>
            </div>
            <p style={{ marginTop: '0.75rem', fontSize: '1rem', color: '#e5eaf1', marginLeft: '0', marginRight: 'auto', maxWidth: '24rem' }}>
              Conectamos espacios rurales con emprendedores para impulsar el desarrollo económico sostenible en nuestros pueblos.
            </p>
            <div style={{ display: 'flex', gap: 16, marginTop: 18 }}>
              <a href="#" style={{ background: '#232a36', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e5eaf1', fontSize: 20 }}><i className="fab fa-instagram"></i></a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div style={footerColumnStyle}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fff', marginBottom: 12 }}>Enlaces rápidos</h3>
            <ul style={{ marginTop: 0, listStyle: 'none', padding: 0 }}>
              <li><Link to="/espacios" style={{ color: '#e5eaf1', fontSize: '1rem', textDecoration: 'none' }}>Buscar espacios</Link></li>
              <li><Link to="/ofrecer-espacio" style={{ color: '#e5eaf1', fontSize: '1rem', textDecoration: 'none' }}>Ofrecer espacio</Link></li>
              <li><Link to="/como-funciona" style={{ color: '#e5eaf1', fontSize: '1rem', textDecoration: 'none' }}>Cómo funciona</Link></li>
            </ul>
          </div>

          {/* Contacto */}
          <div style={footerColumnStyle}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fff', marginBottom: 12 }}>Contacto</h3>
            <ul style={{ marginTop: 0, listStyle: 'none', padding: 0 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><i className="fas fa-envelope" style={{ color: '#27d88d', fontSize: 18 }}></i><span style={{ color: '#e5eaf1', fontSize: '1rem' }}>reavivagr@gmail.com</span></li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><i className="fas fa-phone" style={{ color: '#27d88d', fontSize: 18 }}></i><span style={{ color: '#e5eaf1', fontSize: '1rem' }}>+34 655 449 676</span></li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><i className="fas fa-map-marker-alt" style={{ color: '#27d88d', fontSize: 18 }}></i><span style={{ color: '#e5eaf1', fontSize: '1rem' }}>Granada, Andalucía</span></li>
            </ul>
          </div>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid #232a36', margin: '2.5rem 0 1.5rem 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', color: '#e5eaf1', fontSize: '0.95rem' }}>
          <span>© 2025 Reaviva. Todos los derechos reservados.</span>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          footer > div > div {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 2rem !important;
          }
          footer > div > div > div {
            min-width: 0 !important;
            width: 100% !important;
            margin: 0 0 2rem 0 !important;
          }
          footer hr {
            margin: 2rem 0 1.5rem 0 !important;
          }
          footer > div > div:last-child {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1rem !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer; 