import React from 'react';
import FavoritesList from '../components/FavoritesList';

const Favorites = () => (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e9f5ee 100%)', padding: '3rem 0' }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#232323', marginBottom: '1.1rem', textAlign: 'center', fontFamily: 'Segoe UI, Arial, sans-serif', letterSpacing: '-1px', textShadow: '0 2px 8px #00000008' }}>Mis Favoritos</h1>
        <p style={{ textAlign: 'center', color: '#6b7c6c', fontSize: '1.15rem', marginBottom: '2.5rem', fontWeight: 400 }}>Aquí puedes ver y acceder rápidamente a los espacios que has guardado como favoritos.</p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <FavoritesList />
        </div>
    </div>
);

export default Favorites;
