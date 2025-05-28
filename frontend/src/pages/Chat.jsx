import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

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
      const token = Cookies.get('jwt_token');
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
      const token = Cookies.get('jwt_token');
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
      const token = Cookies.get('jwt_token');
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
      const token = Cookies.get('jwt_token');
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
      const token = Cookies.get('jwt_token');
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
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto bg-gray-100 rounded-lg shadow-lg mt-10">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-semibold text-gray-900">
            Chat con {otherUser.username}
          </h1>
          <p className="text-sm text-gray-500">
            Espacio: {chat.space.location}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 max-h-[400px]">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender.id === currentUser.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  message.sender.id === currentUser.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-900'
                }`}
              >
                <div className="text-sm">{message.content}</div>
                <div className={`text-xs mt-1 ${
                  message.sender.id === currentUser.id
                    ? 'text-indigo-200'
                    : 'text-gray-500'
                }`}>
                  {new Date(message.createdAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {otherUserTyping && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-500 px-4 py-2 rounded-lg text-sm">
                {otherUser.username} está escribiendo...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t p-4">
        <form onSubmit={sendMessage} className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Escribe un mensaje..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat; 