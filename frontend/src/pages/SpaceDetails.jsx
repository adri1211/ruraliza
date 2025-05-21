import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const SpaceDetails = () => {
  const { id } = useParams();
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        setLoading(true);
        const token = Cookies.get('jwt_token');
        const response = await fetch(`http://localhost:8000/api/spaces/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        if (!response.ok) throw new Error('No se pudo cargar el espacio');
        const data = await response.json();
        setSpace(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSpace();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  if (error) {
    return <div className="max-w-xl mx-auto mt-10 p-4 bg-red-100 text-red-700 rounded">{error}</div>;
  }

  if (!space) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/espacios" className="text-indigo-600 hover:underline mb-4 inline-block">← Volver a espacios</Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{space.location}</h1>
      <div className="mb-6">
        {space.images && space.images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {space.images.map((img, idx) => (
              <img
                key={idx}
                src={img.startsWith('http') ? img : `http://localhost:8000/uploads/spaces/${img}`}
                alt={`Imagen ${idx + 1}`}
                className="w-full h-64 object-cover rounded shadow"
              />
            ))}
          </div>
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded">
            <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      <div className="bg-white rounded shadow p-6">
        <p className="mb-2"><span className="font-semibold">Precio:</span> <span className="text-indigo-600 font-bold">{space.price}€/mes</span></p>
        <p className="mb-2"><span className="font-semibold">Categoría:</span> {space.category}</p>
        <p className="mb-2"><span className="font-semibold">Descripción:</span> {space.description}</p>
        <p className="mb-2"><span className="font-semibold">Propietario:</span> {space.owner?.username || 'Desconocido'}</p>
        <p className="mb-2"><span className="font-semibold">Creado el:</span> {space.createdAt ? new Date(space.createdAt).toLocaleString() : ''}</p>
      </div>
    </div>
  );
};

export default SpaceDetails; 