import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Cookies from 'js-cookie';
import useFilters from '../hooks/useFilters';

const SpacesList = () => {
    const [spaces, setSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const { user } = useAuth();
    const { filters } = useFilters();

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
            const response = await fetch('http://localhost:8000/api/spaces', {
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
        if (!user) {
            // Si el usuario no está autenticado, podríamos mostrar un mensaje o redirigir al login
            return;
        }

        try {
            const token = localStorage.getItem('jwt_token');
            const isFavorite = favorites.includes(spaceId);
            const method = isFavorite ? 'DELETE' : 'POST';
            
            const response = await fetch(`http://localhost:8000/api/favorites/${spaceId}`, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al actualizar favoritos');
            }

            setFavorites(prev => 
                isFavorite 
                    ? prev.filter(id => id !== spaceId)
                    : [...prev, spaceId]
            );
        } catch (err) {
            console.error('Error al actualizar favoritos:', err);
        }
    };

    // Función para cargar los favoritos del usuario
    const fetchFavorites = async () => {
        if (!user) return;
        
        try {
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
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
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

    return (
        <div style={{ maxWidth: '90rem', margin: '0 auto', padding: '2rem 1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#A0B88B', marginBottom: '1.5rem' }}>Espacios Disponibles</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {filteredSpaces.map((space) => {
                    let imageUrl = '';
                    if (space.images && space.images.length > 0) {
                        if (space.images[0].startsWith('http')) {
                            imageUrl = space.images[0];
                        } else {
                            imageUrl = `http://localhost:8000/uploads/spaces/${space.images[0]}`;
                        }
                    }
                    return (
                        <div
                            key={space.id}
                            style={{
                                background: '#F5F1D7',
                                overflow: 'hidden',
                                boxShadow: '0 4px 12px rgba(160,184,139,0.10)',
                                borderRadius: '16px',
                                border: '1.5px solid #A0B88B',
                                transition: 'box-shadow 0.3s',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <div style={{ position: 'relative', height: '190px', background: '#A0B88B22' }}>
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt={space.location}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', background: '#A0B88B22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <svg style={{ height: '48px', width: '48px', color: '#A0B88B' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                                <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => toggleFavorite(space.id)}
                                        title={favorites.includes(space.id) ? "Quitar de favoritos" : "Añadir a favoritos"}
                                        style={{ background: 'none', border: 'none', padding: 0, color: favorites.includes(space.id) ? '#A0B88B' : '#A0B88B88', cursor: 'pointer', transition: 'color 0.2s' }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill={favorites.includes(space.id) ? '#A0B88B' : 'none'}
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
                                    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600, background: '#A0B88B22', color: '#A0B88B' }}>
                                        {space.category}
                                    </span>
                                </div>
                            </div>
                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#A0B88B', marginBottom: '0.5rem' }}>{space.location}</h3>
                                <p style={{ margin: 0, fontSize: '1rem', color: '#A0B88B', opacity: 0.85, marginBottom: '1.2rem', minHeight: '2.2em' }}>{space.description}</p>
                                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#A0B88B' }}>{space.price}€/mes</span>
                                    <Link
                                        to={`/espacios/${space.id}`}
                                        style={{ padding: '0.5rem 1.2rem', border: '1.5px solid #A0B88B', borderRadius: '0.5rem', color: '#A0B88B', background: 'transparent', fontWeight: 600, fontSize: '1rem', textDecoration: 'none', transition: 'all 0.2s', marginLeft: '0.5rem' }}
                                        onMouseOver={e => { e.target.style.background = '#A0B88B'; e.target.style.color = '#F5F1D7'; }}
                                        onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.color = '#A0B88B'; }}
                                    >
                                        Ver detalles
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SpacesList; 