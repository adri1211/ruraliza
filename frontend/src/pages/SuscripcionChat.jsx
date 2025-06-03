import React from "react";
import { useAuth } from "../hooks/useAuth"; // Si tienes un hook de autenticación
import { useNavigate } from "react-router-dom";

const SuscripcionChat = () => {
  const { user } = useAuth(); // O usa tu método para obtener el usuario
  const navigate = useNavigate();

  const handleSubscribe = async () => {
    if (!user || !user.email) {
      navigate("/login");
      return;
    }
    const token = localStorage.getItem("jwt_token"); // O de donde lo guardes
    const res = await fetch("/api/stripe/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ email: user.email }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Error al iniciar la suscripción. Intenta de nuevo.");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "60px auto", background: "#F5F1D7", borderRadius: 16, padding: 32, boxShadow: "0 2px 12px rgba(160,184,139,0.10)" }}>
      <h1 style={{ color: "#A0B88B" }}>Suscríbete al Chat Inteligente</h1>
      <p style={{ color: "#A0B88B", margin: "24px 0" }}>
        Con la suscripción tendrás acceso a nuestro chat inteligente (IA Gemini de Google) que te recomienda espacios según tus necesidades, te ayuda a filtrar y te da soporte personalizado.
      </p>
      <ul style={{ color: "#A0B88B", marginBottom: 24 }}>
        <li>✔️ Recomendaciones personalizadas de espacios</li>
        <li>✔️ Acceso prioritario a nuevas funciones</li>
        <li>✔️ Soporte premium</li>
      </ul>
      <button
        onClick={handleSubscribe}
        style={{
          background: "#A0B88B",
          color: "#F5F1D7",
          border: "none",
          borderRadius: 8,
          padding: "12px 32px",
          fontWeight: 700,
          fontSize: "1.1rem",
          cursor: "pointer"
        }}
      >
        Suscribirse
      </button>
    </div>
  );
};

export default SuscripcionChat; 