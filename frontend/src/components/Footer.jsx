import React from 'react';
import { Link } from 'react-router-dom';

const footerColumnStyle = {
  flex: 1,
  minWidth: '220px',
  textAlign: 'center',
  margin: '0 1rem',
};

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#F5F1D7', borderTop: '1px solid #A0B88B', marginTop: 'auto' }}>
      <div
        style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '3rem 1rem',
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
            <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#A0B88B', display: 'inline-block' }}>
              Reaviva
            </Link>
            <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: '#A0B88B', marginLeft: 'auto', marginRight: 'auto', maxWidth: '20rem' }}>
              Conectamos espacios con emprendedores para que puedas montar tu negocio de forma fácil y rápida.
            </p>
          </div>

          {/* Recursos */}
          <div style={footerColumnStyle}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#A0B88B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              RECURSOS
            </h3>
            <ul style={{ marginTop: '1rem', listStyle: 'none', padding: 0 }}>
              <li>
                <Link to="/quienes-somos" style={{ fontSize: '0.875rem', color: '#A0B88B' }}>
                  Quienes somos
                </Link>
              </li>
              <li>
                <Link to="/preguntas-frecuentes" style={{ fontSize: '0.875rem', color: '#A0B88B' }}>
                  Preguntas frecuentes
                </Link>
              </li>
              <li>
                <Link to="/contacto" style={{ fontSize: '0.875rem', color: '#A0B88B' }}>
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div style={footerColumnStyle}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#A0B88B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              LEGAL
            </h3>
            <ul style={{ marginTop: '1rem', listStyle: 'none', padding: 0 }}>
              <li>
                <Link to="/terminos-y-condiciones" style={{ fontSize: '0.875rem', color: '#A0B88B' }}>
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link to="/politica-de-privacidad" style={{ fontSize: '0.875rem', color: '#A0B88B' }}>
                  Política de privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #A0B88B' }}>
          <p style={{ fontSize: '0.875rem', color: '#A0B88B', textAlign: 'center' }}>
            © {new Date().getFullYear()} Reaviva. Todos los derechos reservados.
          </p>
        </div>
      </div>
      {/* Responsive: columna en móvil */}
      <style>{`
        @media (max-width: 800px) {
          footer > div > div {
            flex-direction: column !important;
            align-items: center !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer; 