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
    <div style={{ minHeight: '100vh', background: '#f5f8ee', padding: '40px 0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 36, flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* Tarjeta explicativa */}
        <div style={{ flex: '1 1 340px', maxWidth: 400, background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #a0b88b22', padding: 36, display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ background: 'linear-gradient(90deg, #A0B88B 0%, #2ee59d 100%)', borderRadius: '50%', width: 70, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
            <svg style={{ width: 38, height: 38, color: '#fff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8a9 9 0 100-18 9 9 0 000 18zm-4-4h.01" /></svg>
          </div>
          <h2 style={{ fontWeight: 800, fontSize: '1.45rem', color: '#232323', marginBottom: 8, textAlign: 'center' }}>¿Qué puede hacer este chat?</h2>
          <p style={{ color: '#6b7c6c', fontSize: '1.05rem', textAlign: 'center', marginBottom: 18 }}>
            La IA te ayuda a encontrar espacios rurales que se ajusten a tus requisitos. Solo tienes que escribir lo que buscas y el chat te mostrará los espacios disponibles que cumplen esas características.
          </p>
          <div style={{ width: '100%' }}>
            <span style={{ color: '#232323', fontWeight: 600, fontSize: '1.01rem', marginBottom: 6, display: 'block' }}>Ejemplos de uso:</span>
            <ul style={{ color: '#232323', fontSize: '1.01rem', paddingLeft: 18, margin: 0, listStyle: 'disc' }}>
              <li style={{ marginBottom: 8 }}>"Busco un local en Granada de menos de 500 €"</li>
              <li style={{ marginBottom: 8 }}>"Quiero una nave industrial en Jaén"</li>
              <li style={{ marginBottom: 8 }}>"Terreno disponible en Almería"</li>
              <li>"Oficinas por menos de 300 € en Córdoba"</li>
            </ul>
          </div>
        </div>
        {/* Chat */}
        <div style={{ flex: '2 1 420px', minWidth: 340, maxWidth: 600, background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #a0b88b22', padding: 36, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 420 }}>
          <h2 style={{ textAlign: 'center', marginBottom: 24, fontWeight: 700, color: '#232323' }}>Chat inteligente de espacios</h2>
          <div className="chat-messages" style={{ minHeight: 200, marginBottom: 16, flex: 1, overflowY: 'auto' }}>
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
          <div className="chat-input" style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Escribe tus requisitos aquí..."
              disabled={loading}
              style={{ flex: 1, padding: 10, borderRadius: 8, border: '1.5px solid #A0B88B', fontSize: '1rem', outline: 'none', transition: 'border 0.2s' }}
              onFocus={e => e.target.style.border = '2px solid #2ee59d'}
              onBlur={e => e.target.style.border = '1.5px solid #A0B88B'}
            />
            <button onClick={handleSend} disabled={loading || !input.trim()} style={{ background: 'linear-gradient(90deg, #A0B88B 0%, #2ee59d 100%)', color: '#fff', border: 'none', borderRadius: 8, padding: '0 28px', fontWeight: 700, fontSize: '1rem', transition: 'background 0.18s', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', opacity: loading || !input.trim() ? 0.7 : 1 }}>Enviar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot; 