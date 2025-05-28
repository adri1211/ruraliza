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
      console.log('Notificaciones recibidas (estructura completa):', JSON.stringify(data, null, 2));
      
      // Validar la estructura de cada notificación
      data.forEach((notification, index) => {
        if (!notification.space || !notification.space.id) {
          console.error(`Notificación ${index} no tiene espacio válido:`, notification);
        }
        if (!notification.sender || !notification.sender.id) {
          console.error(`Notificación ${index} no tiene remitente válido:`, notification);
        }
      });
      
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

  const iniciarChat = async (notification) => {
    try {
      const token = Cookies.get('jwt_token');
      
      // Mostrar la estructura completa de la notificación
      console.log('Estructura completa de la notificación:', JSON.stringify(notification, null, 2));
      
      // Validación detallada de la estructura
      if (!notification) {
        throw new Error('La notificación es nula o indefinida');
      }

      if (!notification.space) {
        console.error('La notificación no tiene espacio:', notification);
        throw new Error('La notificación no contiene información del espacio');
      }

      // Validar específicamente el ID del espacio
      if (typeof notification.space.id !== 'number') {
        console.error('ID del espacio no válido:', notification.space);
        throw new Error(`El ID del espacio no es válido: ${notification.space.id}`);
      }

      if (!notification.sender) {
        console.error('La notificación no tiene remitente:', notification);
        throw new Error('La notificación no contiene información del remitente');
      }

      // Validar específicamente el ID del remitente
      if (typeof notification.sender.id !== 'number') {
        console.error('ID del remitente no válido:', notification.sender);
        throw new Error(`El ID del remitente no es válido: ${notification.sender.id}`);
      }

      const chatData = {
        spaceId: parseInt(notification.space.id),
        renterId: parseInt(notification.sender.id)
      };

      console.log('Datos para crear el chat:', chatData);
      
      // Primero creamos el chat
      const chatResponse = await fetch('http://localhost:8000/api/chats', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chatData),
      });

      const responseData = await chatResponse.json();
      
      if (!chatResponse.ok) {
        throw new Error(responseData.error || 'Error al crear el chat');
      }

      // Redirigir a la página de chat
      window.location.href = `/chat/${responseData.id}`;
    } catch (err) {
      console.error('Error al iniciar chat:', err);
      alert(err.message);
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
              <div className="flex gap-2">
                {!n.isRead && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-xs"
                  >
                    Marcar como leída
                  </button>
                )}
                <button
                  onClick={() => iniciarChat(n)}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                >
                  Iniciar chat
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications; 