import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Chats = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = Cookies.get('jwt_token');
        const response = await fetch('http://localhost:8000/api/chats', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Error al cargar los chats');
        const data = await response.json();
        setChats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-gray-500">Cargando chats...</div>;
  }
  if (error) {
    return <div className="flex items-center justify-center h-screen bg-red-100 text-red-700 p-4 rounded">{error}</div>;
  }
  if (chats.length === 0) {
    return <div className="flex items-center justify-center h-screen text-gray-500">No tienes chats activos.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Tus chats</h2>
      <ul className="divide-y divide-gray-200">
        {chats.map((chat) => {
          const currentUser = JSON.parse(localStorage.getItem('user'));
          const otherUser = chat.owner.id === currentUser.id ? chat.renter : chat.owner;
          return (
            <li
              key={chat.id}
              className="py-4 cursor-pointer hover:bg-gray-100 rounded transition"
              onClick={() => navigate(`/chat/${chat.id}`)}
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">
                  {otherUser.username[0].toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{otherUser.username}</div>
                  <div className="text-sm text-gray-500">Espacio: {chat.space.location}</div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Chats; 