import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  // Espacios destacados reales
  const [espacios, setEspacios] = useState([]);
  const [imgErrors, setImgErrors] = useState([]);
  const cardsRef = useRef([]);

  useEffect(() => {
    // Obtener espacios reales (máximo 4)
    const fetchEspacios = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const headers = {
          'Content-Type': 'application/json'
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        const response = await fetch('/api/spaces', {
          method: 'GET',
          headers
        });
        const data = await response.json();
        setEspacios(data.slice(0, 2));
      } catch {
        setEspacios([]);
      }
    };
    fetchEspacios();
  }, []);

  // Animación de fade-in para destacados
  useEffect(() => {
    const onScroll = () => {
      cardsRef.current.forEach((card) => {
        if (card) {
          const rect = card.getBoundingClientRect();
          if (rect.top < window.innerHeight - 80) {
            card.classList.add('visible');
          }
        }
      });
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [espacios]);

  return (
    <>
      {/* HERO SECTION */}
      <section className="loveable-hero-bg">
        <div className="loveable-hero-overlay" />
        <div className="loveable-hero-content-box">
          <h1 className="loveable-hero-title">Conectamos espacios rurales<br />con emprendedores</h1>
          <p className="loveable-hero-subtitle">
            La plataforma donde puedes encontrar el espacio perfecto para tu negocio o alquilar tu local a emprendedores.
          </p>
          <div className="loveable-cta-buttons">
            <Link to="/ofrecer-espacio">
              <button className="loveable-btn loveable-btn-outline">Ofrecer un espacio</button>
            </Link>
            <Link to="/espacios">
              <button className="loveable-btn loveable-btn-primary">Buscar un espacio</button>
            </Link>
          </div>
          <div className="loveable-hero-links">
            <span>¿Tienes un local o terreno? <span className="loveable-link-green">¡Ponlo en valor!</span></span>
            <span> · </span>
            <span>Encuentra el lugar ideal para tu proyecto</span>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="loveable-main-content">
        <section className="loveable-destacados-section">
          <h2 className="loveable-section-title">Espacios destacados</h2>
          <p className="loveable-section-subtitle">Descubre los espacios más populares de nuestra plataforma</p>
          <div className="loveable-destacados-list">
            {espacios.length === 0 && (
              <div className="loveable-destacados-empty">No hay espacios destacados disponibles.</div>
            )}
            {espacios.map((espacio, i) => {
              let imageUrl = '';
              if (espacio.images && espacio.images.length > 0) {
                if (espacio.images[0].startsWith('http')) {
                  imageUrl = espacio.images[0];
                } else {
                  imageUrl = `/uploads/spaces/${espacio.images[0]}`;
                }
              }
              const handleImgError = () => {
                setImgErrors(prev => {
                  const arr = [...prev];
                  arr[i] = true;
                  return arr;
                });
              };
              return (
                <div
                  className="espacio-card"
                  key={espacio.id}
                  ref={el => cardsRef.current[i] = el}
                >
                  <div style={{ position: 'relative', width: '100%', height: 140, background: '#f5f1d7', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '18px', marginBottom: 18, boxShadow: '0 2px 12px #a0b88b22' }}>
                    {imageUrl && !imgErrors[i] ? (
                      <img src={imageUrl} alt={espacio.location} className="loveable-destacado-img" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '18px' }} onError={handleImgError} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#A0B88B' }}>
                        <svg style={{ height: '48px', width: '48px', marginBottom: '0.5rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span style={{ color: '#A0B88B99', fontSize: '0.95rem', fontWeight: 500 }}>Sin imagen</span>
                      </div>
                    )}
                  </div>
                  <h3>{espacio.location}</h3>
                  <p className="categoria">{espacio.category}</p>
                  <p>
                    {espacio.description && espacio.description.length > 120
                      ? espacio.description.slice(0, 120) + '...'
                      : espacio.description}
                  </p>
                  <span className="precio">{espacio.price} €/mes</span>
                  <Link to={`/espacios/${espacio.id}`}>
                    <button className="loveable-btn loveable-btn-primary loveable-btn-ver">Ver espacio</button>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        <section className="loveable-how-it-works">
          <h2 className="loveable-section-title">¿Cómo funciona?</h2>
          <p className="loveable-section-subtitle">Conectamos propietarios de espacios rurales con emprendedores de forma simple y directa</p>
          <div className="loveable-features-container">
            <div className="loveable-feature-card loveable-feature-propietario">
              <div className="loveable-feature-header">
                <i className="fas fa-building"></i>
                <span>Para propietarios</span>
              </div>
              <p>Publica tu local, espacio o servicio para que emprendedores puedan alquilarlo y dar vida a su negocio.</p>
              <ul className="loveable-feature-list">
                <li><span className="loveable-feature-list-icon"><i className="fas fa-user-plus"></i></span>Crea tu perfil y publica tu espacio con fotos y detalles</li>
                <li><span className="loveable-feature-list-icon"><i className="fas fa-comments"></i></span>Recibe consultas y conecta con emprendedores interesados</li>
                <li><span className="loveable-feature-list-icon"><i className="fas fa-link"></i></span>Formaliza el alquiler y obtén beneficios de tu espacio</li>
              </ul>
              <Link to="/ofrecer-espacio" className="w-full">
                <button className="loveable-btn loveable-btn-outline">Ofrecer un espacio</button>
              </Link>
            </div>

            <div className="loveable-feature-card loveable-feature-emprendedor">
              <div className="loveable-feature-header loveable-feature-header-emprendedor">
                <i className="fas fa-store"></i>
                <span>Para emprendedores</span>
              </div>
              <p>Encuentra el espacio perfecto para iniciar o expandir tu negocio sin grandes inversiones iniciales.</p>
              <ul className="loveable-feature-list">
                <li><span className="loveable-feature-list-icon"><i className="fas fa-search"></i></span>Explora nuestro catálogo de espacios y servicios disponibles</li>
                <li><span className="loveable-feature-list-icon"><i className="fas fa-calendar-check"></i></span>Contacta directamente con los propietarios y agenda visitas</li>
                <li><span className="loveable-feature-list-icon"><i className="fas fa-rocket"></i></span>Alquila el espacio y comienza a operar tu negocio</li>
              </ul>
              <Link to="/espacios" className="w-full">
                <button className="loveable-btn loveable-btn-primary">Buscar espacios</button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;