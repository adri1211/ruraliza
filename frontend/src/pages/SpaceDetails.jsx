import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Spinner from '../components/Spinner';

const SpaceDetails = () => {
  const { id } = useParams();
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notificationStatus, setNotificationStatus] = useState(null);

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('jwt_token');
        const response = await fetch(`/api/spaces/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        if (!response.ok) throw new Error('No se pudo cargar el espacio');
        const data = await response.json();
        setSpace(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSpace();
  }, [id]);

  const handleRent = async () => {
    setNotificationStatus(null);
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        setNotificationStatus({ type: 'error', message: 'Debes iniciar sesión para alquilar.' });
        return;
      }
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ spaceId: id }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al enviar la notificación');
      }
      setNotificationStatus({ type: 'success', message: '¡Se ha notificado al propietario!' });
    } catch (err) {
      setNotificationStatus({ type: 'error', message: err.message });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><Spinner /></div>;
  }

  if (error) {
    return <div className="max-w-xl mx-auto mt-10 p-4 bg-red-100 text-red-700 rounded">{error}</div>;
  }

  if (!space) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e9f5ee 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 0' }}>
      <div style={{ maxWidth: '900px', width: '100%', background: '#fff', borderRadius: '32px', boxShadow: '0 8px 40px #0003, 0 1.5px 8px #a0b88b22', padding: '2.5rem 2rem 2rem 2rem', margin: '0 1rem' }}>
        <Link to="/espacios" style={{ color: '#2ee59d', textDecoration: 'none', fontWeight: 600, fontSize: '1.05rem', marginBottom: '1.5rem', display: 'inline-block' }}>← Volver a espacios</Link>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#232323', marginBottom: '1.5rem', fontFamily: 'Segoe UI, Arial, sans-serif', letterSpacing: '-1px' }}>{space.location}</h1>
        <div style={{ marginBottom: '2rem' }}>
          {space.images && space.images.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
              {space.images.map((img, idx) => {
                if (img.endsWith('.pdf')) {
                  return (
                    <a
                      key={idx}
                      href={img.startsWith('http') ? img : '/uploads/spaces/' + img}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '160px', background: '#f5f1d7', borderRadius: '14px', boxShadow: '0 2px 12px #a0b88b22', textDecoration: 'none', color: '#2ee59d', fontWeight: 600, fontSize: '1.1rem', transition: 'background 0.18s' }}
                    >
                      <svg style={{ height: '48px', width: '48px', marginBottom: '0.5rem' }} fill="none" viewBox="0 0 24 24" stroke="#2ee59d">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Ver PDF</span>
                    </a>
                  );
                } else {
                  return (
                    <img
                      key={idx}
                      src={img.startsWith('http') ? img : '/uploads/spaces/' + img}
                      alt={'Imagen ' + (idx + 1)}
                      style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '14px', boxShadow: '0 2px 12px #a0b88b22' }}
                    />
                  );
                }
              })}
            </div>
          ) : (
            <div style={{ width: '100%', height: '160px', background: '#f5f1d7', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A0B88B', boxShadow: '0 2px 12px #a0b88b22' }}>
              <svg style={{ height: '48px', width: '48px', marginBottom: '0.5rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span style={{ color: '#A0B88B99', fontSize: '1rem', fontWeight: 500 }}>Sin imagen</span>
            </div>
          )}
        </div>
        <div style={{ background: '#f8fafc', borderRadius: '18px', boxShadow: '0 1px 8px #a0b88b11', padding: '2rem', marginBottom: '0.5rem' }}>
          <p style={{ fontWeight: 700, color: '#232323', marginBottom: '0.5rem' }}>Precio: <span style={{ color: '#2ee59d', fontWeight: 700 }}>{space.price} €/mes</span></p>
          <p style={{ fontWeight: 700, color: '#232323', marginBottom: '0.5rem' }}>Categoría: <span style={{ color: '#2ee59d', fontWeight: 600 }}>{space.category}</span></p>
          <p style={{ fontWeight: 700, color: '#232323', marginBottom: '0.5rem' }}>Descripción: <span style={{ fontWeight: 400, color: '#6b7c6c' }}>{space.description}</span></p>
          <p style={{ fontWeight: 700, color: '#232323', marginBottom: '0.5rem' }}>Propietario: <span style={{ fontWeight: 400, color: '#6b7c6c' }}>{space.owner?.username || 'Desconocido'}</span></p>
          <p style={{ fontWeight: 700, color: '#232323', marginBottom: '0.5rem' }}>Creado el: <span style={{ fontWeight: 400, color: '#6b7c6c' }}>{space.createdAt ? new Date(space.createdAt).toLocaleString() : ''}</span></p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button
              style={{ padding: '0.9rem 2.2rem', background: '#2ee59d', color: '#fff', border: 'none', borderRadius: '0.7rem', fontWeight: 700, fontSize: '1.1rem', boxShadow: '0 2px 8px #2ee59d22', cursor: 'pointer', transition: 'background 0.18s, transform 0.18s' }}
              onMouseOver={e => { e.target.style.background = '#1ecb7a'; }}
              onMouseOut={e => { e.target.style.background = '#2ee59d'; }}
              onClick={handleRent}
            >
              Alquilar
            </button>
          </div>
          {notificationStatus && (
            <div className={`mt-4 p-3 rounded text-sm ${notificationStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
              {notificationStatus.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpaceDetails; 