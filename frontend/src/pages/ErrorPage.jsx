import React from 'react';
import { Link } from 'react-router-dom';
import './ErrorPage.css';

const ErrorPage = () => {


  return (
    <div className="error-page ruraliza-error-bg">
      <div className="error-container ruraliza-error-container">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
          <svg style={{ width: 54, height: 54, color: '#A0B88B' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7m-9 2v6m4-6v6m5 2a2 2 0 002-2V7a2 2 0 00-.586-1.414l-7-7a2 2 0 00-2.828 0l-7 7A2 2 0 003 7v9a2 2 0 002 2h3m10 0h3" />
          </svg>
        </div>
        <h1 className="error-title" style={{ color: '#2ee59d', fontWeight: 900, fontSize: '2.2rem', marginBottom: 10 }}>¡Oh, no! Algo salió del camino rural...</h1>
        <p className="error-message" style={{ color: '#232323', fontSize: '1.15rem', marginBottom: 22 }}>
          No hemos encontrado el espacio que buscabas o ha ocurrido un error inesperado.<br />
          Vuelve a la página principal y sigue explorando nuevos caminos rurales.
        </p>
        <Link to="/" className="error-link" style={{ background: 'linear-gradient(90deg, #A0B88B 0%, #2ee59d 100%)', color: '#fff', borderRadius: 8, fontWeight: 700, fontSize: '1.08rem', padding: '13px 32px', border: 'none', textDecoration: 'none', transition: 'background 0.18s' }}>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;