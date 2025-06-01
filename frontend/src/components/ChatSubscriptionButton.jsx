import { FaComments } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { api } from '../services/api';

const ChatSubscriptionButton = () => {
  const navigate = useNavigate();

  const handleChatClick = async () => {
    try {
      const user = await api.get('/user'); // Ajusta el endpoint si es diferente
      if (user.isSubscribed) {
        navigate('/chatbot');
      } else {
        navigate('/suscripcion-chat');
      }
    } catch (error) {
      // Maneja el error (por ejemplo, redirigir a login si no está autenticado)
      navigate('/login');
    }
  };

  return (
    <button
      onClick={handleChatClick}
      style={{
        position: "fixed",
        bottom: "32px",
        right: "32px",
        background: "#A0B88B",
        color: "#F5F1D7",
        border: "none",
        borderRadius: "50%",
        width: "64px",
        height: "64px",
        boxShadow: "0 4px 16px rgba(160,184,139,0.18)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        cursor: "pointer",
        fontSize: "2rem"
      }}
      title="Accede al chat inteligente"
    >
      <FaComments />
    </button>
  );
};

export default ChatSubscriptionButton; 