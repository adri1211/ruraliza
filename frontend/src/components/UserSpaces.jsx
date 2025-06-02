import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const UserSpaces = () => {
    const [spaces, setSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imgErrors, setImgErrors] = useState([]);
    const navigate = useNavigate();

    const fetchUserSpaces = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('jwt_token');
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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center', padding: '1rem 0' }}>
            {spaces.map((space, i) => (
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
                        position: 'relative',
                        minHeight: '370px',
                        textAlign: 'center',
                        maxWidth: '420px',
                        width: '100%',
                        margin: '0 auto',
                    }}
                >
                    {/* Acciones editar/eliminar */}
                    <div style={{ position: 'absolute', top: 12, right: 14, display: 'flex', gap: 10, zIndex: 2 }}>
                        <button
                            onClick={() => navigate(`/editar-espacio/${space.id}`)}
                            title="Editar"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2ee59d', fontSize: 20, padding: 4 }}
                        >
                            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#2ee59d"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.414 1.414-4.243a4 4 0 01.828-1.414z" /></svg>
                        </button>
                        <button
                            onClick={() => {
                                if (window.confirm("¿Estás seguro de eliminar este espacio?")) {
                                    (async () => {
                                        const token = localStorage.getItem("jwt_token");
                                        const res = await fetch(`http://localhost:8000/api/spaces/${space.id}`, {
                                            method: "DELETE",
                                            headers: {
                                                "Authorization": `Bearer ${token}`
                                            },
                                            credentials: "include"
                                        });
                                        if (res.ok) {
                                            fetchUserSpaces();
                                        } else {
                                            alert("Error al eliminar el espacio.");
                                        }
                                    })();
                                }
                            }}
                            title="Eliminar"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e57373', fontSize: 20, padding: 4 }}
                        >
                            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#e57373"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div style={{ position: 'relative', width: '100%', height: '120px', background: '#f5f1d7', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '14px', marginBottom: '18px', boxShadow: '0 2px 12px #a0b88b22' }}>
                        {space.images && space.images.length > 0 && !imgErrors[i] ? (
                            <img
                                src={`http://localhost:8000/uploads/spaces/${space.images[0]}`}
                                alt={space.location}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px' }}
                                onError={() => setImgErrors(prev => { const arr = [...prev]; arr[i] = true; return arr; })}
                            />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#A0B88B' }}>
                                <svg style={{ height: '48px', width: '48px', marginBottom: '0.5rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span style={{ color: '#A0B88B99', fontSize: '0.95rem', fontWeight: 500 }}>Sin imagen</span>
                            </div>
                        )}
                    </div>
                    <div style={{ padding: '0 22px 22px 22px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
                        <h3 style={{ fontSize: '1.13rem', fontWeight: 800, color: '#232323', marginBottom: 8 }}>{space.location}</h3>
                        <span style={{ color: '#2ee59d', fontWeight: 600, fontSize: '1.08rem', marginBottom: 2 }}>{space.category}</span>
                        <span style={{ color: '#2ee59d', fontWeight: 700, fontSize: '1.15rem', marginBottom: 10, marginTop: 2 }}>{space.price} €/mes</span>
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
            ))}
        </div>
    );
};

export default UserSpaces; 