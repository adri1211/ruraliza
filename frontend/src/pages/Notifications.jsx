import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = Cookies.get('jwt_token');
      const response = await fetch('http://localhost:8000/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Error al cargar notificaciones');
      const data = await response.json();
      setNotifications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      const token = Cookies.get('jwt_token');
      const response = await fetch(`http://localhost:8000/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setNotifications((prev) => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      }
    } catch (err) {
      // Silenciar error
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Notificaciones</h1>
      {loading ? (
        <div className="text-center text-gray-500">Cargando...</div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
      ) : notifications.length === 0 ? (
        <div className="text-center text-gray-500">No tienes notificaciones.</div>
      ) : (
        <ul className="space-y-4">
          {notifications.map((n) => (
            <li key={n.id} className={`p-4 rounded shadow flex items-center justify-between ${n.isRead ? 'bg-gray-100' : 'bg-indigo-50 border-l-4 border-indigo-400'}`}>
              <div>
                <div className={`font-medium ${n.isRead ? 'text-gray-500' : 'text-indigo-800'}`}>{n.message}</div>
                {n.space && (
                  <div className="text-xs text-gray-400 mt-1">Espacio: {n.space.location}</div>
                )}
                <div className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
              </div>
              {!n.isRead && (
                <button
                  onClick={() => markAsRead(n.id)}
                  className="ml-4 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-xs"
                >
                  Marcar como leída
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications; 