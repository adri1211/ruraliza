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
            const token = Cookies.get('jwt_token');
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
            const token = Cookies.get('jwt_token');
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
            const token = Cookies.get('jwt_token');
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Espacios Disponibles</h1>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredSpaces.map((space) => {
                    // Log para depuración
                    console.log('Imágenes del espacio', space.id, space.images);
                    let imageUrl = '';
                    if (space.images && space.images.length > 0) {
                        // Si la imagen es una URL absoluta, úsala tal cual
                        if (space.images[0].startsWith('http')) {
                            imageUrl = space.images[0];
                        } else {
                            imageUrl = `http://localhost:8000/uploads/spaces/${space.images[0]}`;
                        }
                    }
                    return (
                        <div
                            key={space.id}
                            className="bg-white overflow-hidden shadow rounded-lg transition duration-300 hover:shadow-lg"
                        >
                            <div className="relative h-48">
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt={space.location}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                                <div className="absolute top-0 right-0 mt-2 mr-2 flex space-x-2">
                                    <button
                                        onClick={() => toggleFavorite(space.id)}
                                        className={`transition-colors duration-200 focus:outline-none ${
                                            favorites.includes(space.id)
                                                ? 'text-red-500 hover:text-red-600'
                                                : 'text-gray-400 hover:text-red-500'
                                        }`}
                                        title={favorites.includes(space.id) ? "Quitar de favoritos" : "Añadir a favoritos"}
                                        style={{ background: 'none', border: 'none', padding: 0 }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill={favorites.includes(space.id) ? "currentColor" : "none"}
                                            stroke="currentColor"
                                            className="w-5 h-5"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                        {space.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900">{space.location}</h3>
                                <p className="mt-2 text-sm text-gray-500 line-clamp-2">{space.description}</p>
                                <div className="mt-4 flex justify-between items-center">
                                    <span className="text-lg font-bold text-indigo-600">{space.price}€/mes</span>
                                    <Link
                                        to={`/espacios/${space.id}`}
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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