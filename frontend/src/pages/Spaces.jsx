import React from 'react';
import SpacesList from '../components/SpacesList';
import FiltersBar from '../components/FiltersBar';

const Spaces = () => {
    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e9f5ee 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 0' }}>
            <div style={{ maxWidth: '1100px', width: '100%', background: '#fff', borderRadius: '32px', boxShadow: '0 8px 40px #0003, 0 1.5px 8px #a0b88b22', padding: '3rem 2rem 2.5rem 2rem', margin: '0 1rem' }}>
                <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#232323', marginBottom: '2.2rem', textAlign: 'center', fontFamily: 'Segoe UI, Arial, sans-serif', letterSpacing: '-1px', textShadow: '0 2px 8px #00000008' }}>Espacios Disponibles</h1>
                <FiltersBar />
                <SpacesList />
            </div>
        </div>
    );
};

export default Spaces; 