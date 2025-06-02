import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Chats = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f1d7 0%, #eaf6e3 100%)', padding: '40px 0' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', background: '#fff', borderRadius: 22, boxShadow: '0 8px 32px #a0b88b33', padding: '38px 32px', overflow: 'hidden' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#232323', marginBottom: 28 }}>Tus chats</h2>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {chats.map((chat) => {
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const otherUser = chat.owner.id === currentUser.id ? chat.renter : chat.owner;
            return (
              <li
                key={chat.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18,
                  background: '#f5f8ee',
                  borderRadius: 16,
                  padding: '18px 22px',
                  boxShadow: '0 2px 12px #a0b88b22',
                  cursor: 'pointer',
                  transition: 'background 0.18s',
                  border: '1.5px solid #A0B88B',
                }}
                onClick={() => navigate(`/chat/${chat.id}`)}
              >
                <div style={{ background: 'linear-gradient(90deg, #A0B88B 0%, #2ee59d 100%)', color: '#fff', borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 22, flexShrink: 0 }}>
                  {otherUser.username[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: '#232323', fontSize: '1.13rem', marginBottom: 2 }}>{otherUser.username}</div>
                  <div style={{ color: '#6b7c6c', fontSize: '1.01rem', marginBottom: 2, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>Espacio: {chat.space.location}</div>
                </div>
                <a
                  style={{ background: '#2ee59d', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: '1rem', textDecoration: 'none', transition: 'background 0.18s', cursor: 'pointer', marginLeft: 8 }}
                  onClick={e => { e.stopPropagation(); navigate(`/chat/${chat.id}`); }}
                  onMouseOver={e => { e.target.style.background = '#1ecb7a'; }}
                  onMouseOut={e => { e.target.style.background = '#2ee59d'; }}
                >
                  Ir al chat
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Chats; 