import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  // Espacios destacados reales
  const [espacios, setEspacios] = useState([]);
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
        const response = await fetch('http://localhost:8000/api/spaces', {
          method: 'GET',
          headers
        });
        const data = await response.json();
        setEspacios(data.slice(0, 4));
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
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Conectamos espacios rurales con emprendedores</h1>
          <p>La plataforma donde puedes encontrar el espacio perfecto para tu negocio o alquilar tu local a emprendedores.</p>
          <div className="cta-buttons">
            <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
              <Link to="/ofrecer-espacio">
                <button className="btn-outline">Ofrecer un espacio</button>
              </Link>
              <span style={{fontSize:'0.95rem',color:'#A0B88B',marginTop:'4px'}}>¿Tienes un local o terreno? ¡Ponlo en valor!</span>
            </div>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
              <Link to="/espacios">
                <button className="btn-primary">Buscar un espacio</button>
              </Link>
              <span style={{fontSize:'0.95rem',color:'#A0B88B',marginTop:'4px'}}>Encuentra el lugar ideal para tu proyecto</span>
            </div>
          </div>
        </div>
      </div>

      <section className="destacados-section">
        <h2 style={{textAlign:'center'}}>Espacios destacados</h2>
        <div className="destacados-list" style={{justifyContent:'center', display:'flex', flexWrap:'wrap', gap:'32px'}}>
          {espacios.length === 0 && (
            <div style={{color:'#A0B88B',fontWeight:500,fontSize:'1.1rem',padding:'2rem'}}>No hay espacios destacados disponibles.</div>
          )}
          {espacios.map((espacio, i) => {
            let imageUrl = '';
            if (espacio.images && espacio.images.length > 0) {
              if (espacio.images[0].startsWith('http')) {
                imageUrl = espacio.images[0];
              } else {
                imageUrl = `http://localhost:8000/uploads/spaces/${espacio.images[0]}`;
              }
            }
            return (
              <div
                className="destacado-card"
                key={espacio.id}
                ref={el => cardsRef.current[i] = el}
                style={{background:'#fff',borderRadius:'16px',boxShadow:'0 4px 16px #a0b88b22',border:'1.5px solid #A0B88B',width:'320px',maxWidth:'90vw',padding:'24px 18px 18px 18px',display:'flex',flexDirection:'column',alignItems:'center',margin:'0 auto'}}
              >
                {imageUrl && <img src={imageUrl} alt={espacio.location} style={{width:'100%',height:'160px',objectFit:'cover',borderRadius:'12px',marginBottom:'16px'}} />}
                <h3>{espacio.location}</h3>
                <p className="categoria">{espacio.category}</p>
                <p>{espacio.description}</p>
                <span className="precio">{espacio.price} €/mes</span>
                <Link to={`/espacios/${espacio.id}`}>
                  <button className="btn-ver">Ver espacio</button>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <section className="how-it-works">
        <h2>¿Cómo funciona?</h2>
        
        <div className="features-container">
          <div className="feature-card">
            <div className="icon-container">
              <i className="fas fa-building"></i>
            </div>
            <h3>Para propietarios</h3>
            <p>Publica tu local, espacio o servicio para que emprendedores puedan alquilarlo y dar vida a su negocio.</p>
            <ol>
              <li>Crea tu perfil y publica tu espacio con fotos y detalles</li>
              <li>Recibe consultas y conecta con emprendedores interesados</li>
              <li>Formaliza el alquiler y obtén beneficios de tu espacio</li>
            </ol>
            <Link to="/ofrecer-espacio" className="w-full">
              <button className="btn-outline">Ofrecer un espacio</button>
            </Link>
          </div>

          <div className="feature-card">
            <div className="icon-container">
              <i className="fas fa-store"></i>
            </div>
            <h3>Para emprendedores</h3>
            <p>Encuentra el espacio perfecto para iniciar o expandir tu negocio sin grandes inversiones iniciales.</p>
            <ol>
              <li>Explora nuestro catálogo de espacios y servicios disponibles</li>
              <li>Contacta directamente con los propietarios y agenda visitas</li>
              <li>Alquila el espacio y comienza a operar tu negocio</li>
            </ol>
            <Link to="/espacios" className="w-full">
              <button className="btn-primary">Buscar espacios</button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;