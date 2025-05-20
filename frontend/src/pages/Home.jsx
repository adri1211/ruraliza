import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';


const Home = () => {
  return (
    <div className="home">
      <div className="hero-section">
        <h1>Conectamos espacios rurales con emprendedores</h1>
        <p>La plataforma donde puedes encontrar el espacio perfecto para tu negocio o alquilar tu local a emprendedores.</p>
        <div className="cta-buttons">
          <Link to="/ofrecer-espacio">
            <button className="btn-outline">Ofrecer un espacio</button>
          </Link>
          <Link to="/espacios">
            <button className="btn-primary">Buscar un espacio</button>
          </Link>
        </div>
      </div>

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