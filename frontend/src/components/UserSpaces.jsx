import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const UserSpaces = () => {
    const [spaces, setSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUserSpaces = async () => {
        try {
            setLoading(true);
            const token = Cookies.get('jwt_token');
            const response = await fetch('http://localhost:8000/api/spaces/user/spaces', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Error al obtener los espacios');
            }

            const data = await response.json();
            setSpaces(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserSpaces();
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
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-700">
                            {error}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (spaces.length === 0) {
        return (
            <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No tienes espacios</h3>
                <p className="mt-1 text-sm text-gray-500">Comienza creando tu primer espacio.</p>
                <div className="mt-6">
                    <Link
                        to="/ofrecer-espacio"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Crear Nuevo Espacio
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {spaces.map((space) => (
                <div
                    key={space.id}
                    className="bg-white overflow-hidden shadow rounded-lg"
                >
                    <div className="relative h-48">
                        {space.images && space.images.length > 0 ? (
                            <img
                                src={`http://localhost:8000/uploads/spaces/${space.images[0]}`}
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
                    </div>
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900">{space.location}</h3>
                        <p className="mt-1 text-sm text-gray-500">{space.category}</p>
                        <p className="mt-2 text-sm text-gray-900">{space.price}€/mes</p>
                        <div className="mt-4">
                            <Link
                                to={`/espacios/${space.id}`}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Ver detalles
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserSpaces; 