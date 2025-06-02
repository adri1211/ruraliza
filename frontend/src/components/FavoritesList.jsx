import React, { useEffect, useState } from 'react';
// import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

const FavoritesList = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imgErrors, setImgErrors] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('jwt_token');
                const response = await fetch('http://localhost:8000/api/favorites', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Error al obtener favoritos');
                }
                const data = await response.json();
                setFavorites(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchFavorites();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            </div>
        );
    }

    if (favorites.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No tienes favoritos</h3>
                    <p className="mt-1 text-sm text-gray-500">¡Añade algunos espacios a favoritos para verlos aquí!</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center' }}>
            {favorites.map((space, i) => {
                let imageUrl = '';
                if (space.images && space.images.length > 0) {
                    if (space.images[0].startsWith('http')) {
                        imageUrl = space.images[0];
                    } else {
                        imageUrl = `http://localhost:8000/uploads/spaces/${space.images[0]}`;
                    }
                }
                const handleImgError = () => {
                    setImgErrors(prev => {
                        const arr = [...prev];
                        arr[i] = true;
                        return arr;
                    });
                };
                const cardTitleStyle = {
                    fontSize: '1.3rem',
                    fontWeight: 800,
                    color: '#222',
                    marginBottom: '8px',
                    textAlign: 'center',
                };
                const cardDescStyle = {
                    color: '#6b7c6c',
                    fontSize: '1.08rem',
                    marginBottom: '10px',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    minHeight: '60px',
                    maxHeight: '4.5em',
                    textAlign: 'center',
                };
                const cardCategoryStyle = {
                    color: '#2ee59d',
                    fontWeight: 600,
                    marginBottom: '2px',
                    fontSize: '1.08rem',
                    textAlign: 'center',
                };
                const cardPriceStyle = {
                    color: '#2ee59d',
                    fontWeight: 700,
                    fontSize: '1.15rem',
                    marginBottom: '10px',
                    marginTop: '2px',
                    textAlign: 'center',
                };
                return (
                    <div
                        key={space.id}
                        style={{
                            background: '#fff',
                            overflow: 'hidden',
                            boxShadow: '0 6px 24px #a0b88b22',
                            borderRadius: '20px',
                            border: '1.5px solid #A0B88B',
                            transition: 'box-shadow 0.2s, transform 0.2s',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            margin: '0 auto',
                            width: '100%',
                            maxWidth: '500px',
                            minWidth: '320px',
                            minHeight: '370px',
                            textAlign: 'center',
                        }}
                    >
                        <div style={{ position: 'relative', width: '100%', height: '120px', background: '#f5f1d7', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '14px', marginBottom: '18px', boxShadow: '0 2px 12px #a0b88b22' }}>
                            {imageUrl && !imgErrors[i] ? (
                                <img
                                    src={imageUrl}
                                    alt={space.location}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px' }}
                                    onError={handleImgError}
                                />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#A0B88B' }}>
                                    <svg style={{ height: '48px', width: '48px', marginBottom: '0.5rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span style={{ color: '#A0B88B99', fontSize: '0.95rem', fontWeight: 500 }}>Sin imagen</span>
                                </div>
                            )}
                            <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: '0.5rem' }}>
                                <span style={cardCategoryStyle}>
                                    {space.category}
                                </span>
                            </div>
                        </div>
                        <div style={{ padding: '0 22px 22px 22px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
                            <h3 style={cardTitleStyle}>{space.location}</h3>
                            <p style={cardDescStyle}>{space.description && space.description.length > 120 ? space.description.slice(0, 120) + '...' : space.description}</p>
                            <span style={cardPriceStyle}>{space.price} €/mes</span>
                            <Link
                                to={`/espacios/${space.id}`}
                                style={{ background: '#2ee59d', color: '#fff', border: 'none', borderRadius: '6px', padding: '10px 22px', fontWeight: 600, fontSize: '1rem', marginTop: '8px', transition: 'background 0.18s, transform 0.18s', cursor: 'pointer', width: '100%', textDecoration: 'none', textAlign: 'center', display: 'block' }}
                                onMouseOver={e => { e.target.style.background = '#1ecb7a'; }}
                                onMouseOut={e => { e.target.style.background = '#2ee59d'; }}
                            >
                                Ver detalles
                            </Link>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default FavoritesList; 