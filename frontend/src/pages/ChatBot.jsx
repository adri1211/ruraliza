import React, { useState } from 'react';
import { api } from '../services/api';

function parseMessageWithLinks(text) {
  // Busca patrones tipo [ID: n] y los convierte en enlaces
  return text.split(/(\[ID: \d+\])/g).map((part, idx) => {
    const match = part.match(/\[ID: (\d+)\]/);
    if (match) {
      const id = match[1];
      return <a key={idx} href={`/espacios/${id}`} style={{ color: '#A0B88B', textDecoration: 'underline' }}>Ver espacio {id}</a>;
    }
    return part;
  });
}

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: input }]);
    setLoading(true);

    try {
      const res = await api.post('/chat-openai', { message: input });
      setMessages(prev => [
        ...prev,
        { from: 'ai', text: res.response }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { from: 'ai', text: 'Error al conectar con la IA.' }
      ]);
    }
    setInput('');
    setLoading(false);
  };

  return (
    <div className="chat-container" style={{ maxWidth: 600, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Chat inteligente de espacios</h2>
      <div className="chat-messages" style={{ minHeight: 200, marginBottom: 16 }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            textAlign: msg.from === 'user' ? 'right' : 'left',
            margin: '8px 0',
            color: msg.from === 'user' ? '#A0B88B' : '#333',
            background: msg.from === 'user' ? '#F5F1D7' : '#F0F0F0',
            display: 'inline-block',
            padding: '8px 12px',
            borderRadius: 8,
            maxWidth: '80%'
          }}>
            <b>{msg.from === 'user' ? 'Tú' : 'IA'}:</b> {msg.from === 'ai' ? parseMessageWithLinks(msg.text) : msg.text}
          </div>
        ))}
        {loading && <div style={{ color: '#A0B88B' }}>IA está escribiendo...</div>}
      </div>
      <div className="chat-input" style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Escribe tus requisitos aquí..."
          disabled={loading}
          style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
        />
        <button onClick={handleSend} disabled={loading || !input.trim()} style={{ background: '#A0B88B', color: '#fff', border: 'none', borderRadius: 6, padding: '0 16px' }}>Enviar</button>
      </div>
    </div>
  );
};

export default ChatBot; 