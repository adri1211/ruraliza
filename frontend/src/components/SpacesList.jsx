import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Cookies from 'js-cookie';
import useFilters from '../hooks/useFilters';
import Spinner from './Spinner';

const SpacesList = () => {
    const [spaces, setSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const { user } = useAuth();
    const { filters } = useFilters();
    const [feedback, setFeedback] = useState('');

    const fetchSpaces = async () => {
        try {
            setLoading(true);
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

            if (!response.ok) {
                throw new Error('Error al obtener los espacios');
            }

            const data = await response.json();
            // Filtrar los espacios usando el owner_id
            const filteredSpaces = data.filter(space => {
                return user && space.owner_id !== user.id;
            });
            console.log('Usuario actual:', user);
            console.log('Espacios sin filtrar:', data);
            console.log('Espacios filtrados:', filteredSpaces);
            setSpaces(filteredSpaces);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = async (spaceId) => {
        if (!user) return;

        const token = localStorage.getItem('jwt_token');
        const isFavorite = favorites.includes(spaceId);
        const method = isFavorite ? 'DELETE' : 'POST';

        try {
            const response = await fetch(`/api/favorites/${spaceId}`, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                // Si es conflicto (409), forzamos el borrado en backend y frontend
                if (response.status === 409 && !isFavorite) {
                    // Hacemos la petición DELETE real
                    const deleteResponse = await fetch(`/api/favorites/${spaceId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    if (deleteResponse.ok) {
                        setFavorites(prev => prev.filter(id => id !== spaceId));
                        setFeedback('Eliminado de favoritos');
                    } else {
                        setFeedback('Error al eliminar de favoritos');
                    }
                    setTimeout(() => setFeedback(''), 1500);
                    return;
                }
                throw new Error('Error al actualizar favoritos');
            }

            setFavorites(prev =>
                isFavorite
                    ? prev.filter(id => id !== spaceId)
                    : [...prev, spaceId]
            );
            setFeedback(isFavorite ? 'Eliminado de favoritos' : 'Añadido a favoritos');
            setTimeout(() => setFeedback(''), 1500);
        } catch (err) {
            setFeedback('Error al actualizar favoritos');
            setTimeout(() => setFeedback(''), 1500);
        }
    };

    // Función para cargar los favoritos del usuario
    const fetchFavorites = async () => {
        if (!user) return;
        
        try {
            const token = localStorage.getItem('jwt_token');
            const response = await fetch('/api/favorites', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener favoritos');
            }

            const data = await response.json();
            setFavorites(data.map(fav => fav.space_id));
        } catch (err) {
            console.error('Error al cargar favoritos:', err);
        }
    };

    useEffect(() => {
        fetchSpaces();
        fetchFavorites();
    }, [user]);

    // Aplicar filtros del contexto
    const filteredSpaces = spaces.filter(space => {
        // Filtro de búsqueda por ubicación, descripción, etc.
        const searchText = filters.search.toLowerCase();
        const matchesSearch =
            !searchText ||
            (space.location && space.location.toLowerCase().includes(searchText)) ||
            (space.description && space.description.toLowerCase().includes(searchText));

        // Filtro de precio mínimo
        const matchesMinPrice = !filters.minPrice || space.price >= Number(filters.minPrice);
        // Filtro de precio máximo
        const matchesMaxPrice = !filters.maxPrice || space.price <= Number(filters.maxPrice);
        // Filtro de categoría
        const matchesCategory = !filters.category || space.category === filters.category;

        return matchesSearch && matchesMinPrice && matchesMaxPrice && matchesCategory;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (spaces.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay espacios disponibles</h3>
                    <p className="mt-1 text-sm text-gray-500">Vuelve a intentarlo más tarde.</p>
                </div>
            </div>
        );
    }

    // Componente hijo para cada tarjeta de espacio
    const SpaceCard = ({ space, isFavorite, toggleFavorite }) => {
        const [imgError, setImgError] = React.useState(false);
        let imageUrl = '';
        if (space.images && space.images.length > 0) {
            if (space.images[0].startsWith('http')) {
                imageUrl = space.images[0];
            } else {
                imageUrl = `/uploads/spaces/${space.images[0]}`;
            }
        }
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
                    {imageUrl && imageUrl !== '' && !imgError ? (
                        <img
                            src={imageUrl}
                            alt={space.location}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px' }}
                            onError={() => setImgError(true)}
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
                        <button
                            onClick={() => toggleFavorite(space.id)}
                            title={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                            style={{ background: 'none', border: 'none', padding: 0, color: isFavorite ? '#A0B88B' : '#A0B88B88', cursor: 'pointer', transition: 'color 0.2s' }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill={isFavorite ? '#A0B88B' : 'none'}
                                stroke="#A0B88B"
                                style={{ width: '22px', height: '22px' }}
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
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
    };

    return (
        <div style={{ maxWidth: '90rem', margin: '0 auto', padding: '2rem 1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#A0B88B', marginBottom: '1.5rem' }}>Espacios Disponibles</h1>
            {feedback && (
                <div style={{ position: 'fixed', top: 80, right: 30, background: '#A0B88B', color: '#fff', padding: '10px 20px', borderRadius: 8, zIndex: 1000 }}>
                    {feedback}
                </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {filteredSpaces.map((space) => (
                    <SpaceCard
                        key={space.id}
                        space={space}
                        isFavorite={favorites.includes(space.id)}
                        toggleFavorite={toggleFavorite}
                    />
                ))}
            </div>
        </div>
    );
};

export default SpacesList; 