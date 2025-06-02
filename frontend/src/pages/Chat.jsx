import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';

const Chat = () => {
  const { id } = useParams();
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const typingPollingIntervalRef = useRef(null);
  const prevMessagesLength = useRef(messages.length);
  const [imgError, setImgError] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > prevMessagesLength.current) {
      scrollToBottom();
    }
    prevMessagesLength.current = messages.length;
  }, [messages]);

  const fetchChat = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`http://localhost:8000/api/chats/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Error al cargar el chat');
      const data = await response.json();
      setChat(data.chat);
      setMessages(data.messages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchNewMessages = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`http://localhost:8000/api/chats/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Error al cargar mensajes');
      const data = await response.json();
      
      // Solo actualizamos si hay nuevos mensajes
      if (data.messages.length > messages.length) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error('Error al obtener nuevos mensajes:', err);
    }
  };

  const fetchTypingStatus = async () => {
    if (!chat) return; // No hacer la petición si no hay chat

    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`http://localhost:8000/api/chats/${id}/typing`, {
        method: 'POST', // Cambiado a POST
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isTyping: false }), // Enviamos false para consultar el estado
      });
      if (!response.ok) return;
      const data = await response.json();
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (data.userId !== currentUser.id) {
        setOtherUserTyping(data.isTyping);
      }
    } catch (err) {
      console.error('Error al obtener estado de escritura:', err);
    }
  };

  const notifyTyping = async (isTyping) => {
    try {
      const token = localStorage.getItem('jwt_token');
      await fetch(`http://localhost:8000/api/chats/${id}/typing`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isTyping }),
      });
    } catch (err) {
      console.error('Error al notificar estado de escritura:', err);
    }
  };

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      notifyTyping(true);
    }

    // Limpiar el timeout anterior si existe
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Establecer un nuevo timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      notifyTyping(false);
    }, 2000);
  };

  useEffect(() => {
    fetchChat();

    // Iniciamos el polling de mensajes cada 3 segundos
    pollingIntervalRef.current = setInterval(fetchNewMessages, 3000);

    // Iniciamos el polling del estado de escritura cada segundo
    // Solo si el chat está cargado
    if (chat) {
      typingPollingIntervalRef.current = setInterval(fetchTypingStatus, 1000);
    }

    // Limpiamos los intervalos cuando el componente se desmonta
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (typingPollingIntervalRef.current) {
        clearInterval(typingPollingIntervalRef.current);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [id, chat]); // Añadimos chat como dependencia

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`http://localhost:8000/api/chats/${id}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newMessage }),
      });

      if (!response.ok) throw new Error('Error al enviar el mensaje');
      const message = await response.json();
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      // Mostrar mensaje de error al usuario
      setError('Error al enviar el mensaje. Por favor, inténtalo de nuevo.');
      // Limpiar el error después de 3 segundos
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Cargando chat...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Chat no encontrado</div>
      </div>
    );
  }

  const currentUser = JSON.parse(localStorage.getItem('user'));
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 text-red-700 p-4 rounded">No se encontró la información del usuario</div>
      </div>
    );
  }

  const otherUser = chat.owner?.id === currentUser.id ? chat.renter : chat.owner;
  if (!otherUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 text-red-700 p-4 rounded">No se encontró la información del otro usuario</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f1d7 0%, #eaf6e3 100%)', padding: '40px 0' }}>
      <div style={{
        maxWidth: 1100,
        margin: '0 auto',
        borderRadius: 22,
        boxShadow: '0 8px 32px #a0b88b33',
        background: '#fff',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        minHeight: 540,
        gap: 0
      }}>
        {/* Chat principal */}
        <div style={{ flex: 2, minWidth: 0, display: 'flex', flexDirection: 'column', borderRight: '1.5px solid #e0e0e0' }}>
          {/* Header */}
          <div style={{ background: 'linear-gradient(90deg, #A0B88B 0%, #2ee59d 100%)', padding: '24px 32px 16px 32px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ background: '#fff', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px #a0b88b22' }}>
              <svg style={{ width: 28, height: 28, color: '#A0B88B' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2V10a2 2 0 012-2h2m4-4v4m0 0l-2-2m2 2l2-2" /></svg>
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: 2 }}>Chat con {otherUser.username}</h1>
              <p style={{ color: '#eaf6e3', fontSize: '1rem', fontWeight: 500 }}>Espacio: {chat.space.location}</p>
            </div>
          </div>
          {/* Mensajes */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '32px 24px', background: '#f5f8ee', minHeight: 320 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    display: 'flex',
                    justifyContent: message.sender.id === currentUser.id ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '70%',
                      borderRadius: 16,
                      padding: '12px 18px',
                      background: message.sender.id === currentUser.id ? 'linear-gradient(90deg, #A0B88B 0%, #2ee59d 100%)' : '#fff',
                      color: message.sender.id === currentUser.id ? '#fff' : '#232323',
                      boxShadow: '0 2px 12px #a0b88b22',
                      fontSize: '1.05rem',
                      fontWeight: 500,
                      textAlign: 'left',
                      position: 'relative',
                    }}
                  >
                    <div>{message.content}</div>
                    <div style={{ fontSize: '0.85rem', marginTop: 6, color: message.sender.id === currentUser.id ? '#eaf6e3' : '#A0B88B', textAlign: 'right', fontWeight: 400 }}>
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              {otherUserTyping && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ background: '#fff', color: '#A0B88B', padding: '10px 18px', borderRadius: 16, fontSize: '1rem', boxShadow: '0 2px 12px #a0b88b22' }}>
                    {otherUser.username} está escribiendo...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          {/* Input de mensaje */}
          <div style={{ background: '#f5f8ee', borderTop: '1.5px solid #e0e0e0', padding: 20 }}>
            <form onSubmit={sendMessage} style={{ display: 'flex', gap: 10 }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                placeholder="Escribe un mensaje..."
                style={{ flex: 1, borderRadius: 12, border: '1.5px solid #A0B88B', padding: '12px 16px', fontSize: '1rem', outline: 'none', transition: 'border 0.2s' }}
                onFocus={e => e.target.style.border = '2px solid #2ee59d'}
                onBlur={e => e.target.style.border = '1.5px solid #A0B88B'}
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                style={{ background: 'linear-gradient(90deg, #A0B88B 0%, #2ee59d 100%)', color: '#fff', fontWeight: 700, fontSize: '1rem', border: 'none', borderRadius: 12, padding: '0 32px', cursor: !newMessage.trim() ? 'not-allowed' : 'pointer', opacity: !newMessage.trim() ? 0.7 : 1, transition: 'background 0.18s' }}
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
        {/* Barra lateral informativa */}
        <div style={{ flex: 1, minWidth: 0, background: '#f5f8ee', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '36px 18px', gap: 18 }}>
          <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #a0b88b22', width: '100%', maxWidth: 340, padding: 0, overflow: 'hidden', border: '1.5px solid #A0B88B', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Imagen */}
            <div style={{ width: '100%', height: 140, background: '#f5f1d7', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '18px 18px 0 0', overflow: 'hidden' }}>
              {chat.space.images && chat.space.images.length > 0 && !imgError ? (
                <img src={`http://localhost:8000/uploads/spaces/${chat.space.images[0]}`} alt={chat.space.location} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setImgError(true)} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#A0B88B' }}>
                  <svg style={{ height: '48px', width: '48px', marginBottom: '0.5rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span style={{ color: '#A0B88B99', fontSize: '0.95rem', fontWeight: 500 }}>Sin imagen</span>
                </div>
              )}
            </div>
            <div style={{ padding: '22px 18px 18px 18px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <h3 style={{ fontSize: '1.13rem', fontWeight: 800, color: '#232323', marginBottom: 2, textAlign: 'center' }}>{chat.space.location}</h3>
              <span style={{ color: '#2ee59d', fontWeight: 600, fontSize: '1.08rem', marginBottom: 2 }}>{chat.space.category}</span>
              <span style={{ color: '#2ee59d', fontWeight: 700, fontSize: '1.15rem', marginBottom: 8, marginTop: 2 }}>{chat.space.price} €/mes</span>
              <p style={{ color: '#6b7c6c', fontSize: '1.01rem', marginBottom: 8, textAlign: 'center', minHeight: 40, maxHeight: 60, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{chat.space.description && chat.space.description.length > 120 ? chat.space.description.slice(0, 120) + '...' : chat.space.description}</p>
              <Link to={`/espacios/${chat.space.id}`} style={{ background: '#2ee59d', color: '#fff', border: 'none', borderRadius: '6px', padding: '10px 22px', fontWeight: 600, fontSize: '1rem', marginTop: '8px', transition: 'background 0.18s, transform 0.18s', cursor: 'pointer', width: '100%', textDecoration: 'none', textAlign: 'center', display: 'block' }}
                onMouseOver={e => { e.target.style.background = '#1ecb7a'; }}
                onMouseOut={e => { e.target.style.background = '#2ee59d'; }}
              >
                Ver ficha del espacio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat; 