import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, error, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      }
    } catch (error) {
      console.error('Error en el login:', error);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen">
      {/* Columna izquierda: branding */}
      <div className="hidden md:flex w-1/2 bg-[#f6f3e7] relative flex-col px-8 py-8">
        {/* Contenedor centrado */}
        <div className="flex flex-1 flex-col items-center justify-center min-h-0">
          <img src="/reaviva.jpg" alt="Logo Reaviva" className="w-2/3 max-w-xs mb-4" />
          <p className="text-[#7b8c6a] text-center text-base mt-2">
            Es una iniciativa en desarrollo impulsada por un equipo comprometido con el potencial de los pueblos como espacios de emprendimiento y vida. Nuestro objetivo es conectar a personas con ganas de emprender con localidades de la provincia de Granada que, a pesar del reto de la despoblación, siguen luchando por mantenerse activas y sostenibles.
          </p>
          {/* Logos institucionales */}
          <div className="flex flex-row items-center justify-center gap-4 mt-6">
            {/* <img src="/logo-ugr.png" alt="UGR" className="h-8" /> */}
            {/* <img src="/logo-emprendedora.png" alt="UGR Emprendedora" className="h-8" /> */}
            <span className="text-xs text-[#b3b3a1]">Universidad de Granada</span>
            <span className="text-xs text-[#b3b3a1]">UGR Emprendedora</span>
          </div>
        </div>
        {/* Redes sociales y contacto */}
        <div className="flex flex-col items-center mb-2">
          <div className="flex flex-row gap-4 mb-2">
            <a href="https://www.instagram.com/reavivagr/" target="_blank" rel="noopener noreferrer" title="Instagram">
              <svg className="w-6 h-6 text-[#a2b48c] hover:text-[#7b8c6a]" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2A5.75 5.75 0 0 0 2 7.75v8.5A5.75 5.75 0 0 0 7.75 22h8.5A5.75 5.75 0 0 0 22 16.25v-8.5A5.75 5.75 0 0 0 16.25 2h-8.5zm0 1.5h8.5A4.25 4.25 0 0 1 20.5 7.75v8.5A4.25 4.25 0 0 1 16.25 20.5h-8.5A4.25 4.25 0 0 1 3.5 16.25v-8.5A4.25 4.25 0 0 1 7.75 3.5zm8.25 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 1.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7z"/></svg>
            </a>
            <a href="mailto:emprenderenunpueblo@gmail.com" title="Correo electrónico">
              <svg className="w-6 h-6 text-[#a2b48c] hover:text-[#7b8c6a]" fill="currentColor" viewBox="0 0 24 24"><path d="M2.25 6.75A2.25 2.25 0 0 1 4.5 4.5h15a2.25 2.25 0 0 1 2.25 2.25v10.5A2.25 2.25 0 0 1 19.5 19.5h-15A2.25 2.25 0 0 1 2.25 17.25V6.75zm1.5 0v.638l8.25 5.512 8.25-5.512V6.75a.75.75 0 0 0-.75-.75h-15a.75.75 0 0 0-.75.75zm17.25 1.862-7.728 5.167a1.5 1.5 0 0 1-1.544 0L3 8.612v8.638c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75V8.612z"/></svg>
            </a>
            <a href="tel:+3465847165" title="Teléfono">
              <svg className="w-6 h-6 text-[#a2b48c] hover:text-[#7b8c6a]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0-2.071 1.679-3.75 3.75-3.75h1.386c.966 0 1.84.622 2.123 1.543l.438 1.376a2.25 2.25 0 0 1-.516 2.31l-.548.548a.75.75 0 0 0-.073.976 11.042 11.042 0 0 0 5.292 5.292.75.75 0 0 0 .976-.073l.548-.548a2.25 2.25 0 0 1 2.31-.516l1.376.438a2.25 2.25 0 0 1 1.543 2.123v1.386c0 2.071-1.679 3.75-3.75 3.75h-.75C7.022 20.25 3.75 16.978 3.75 12.75v-.75z"/></svg>
            </a>
          </div>
          <span className="text-xs text-[#b3b3a1]">@reavivagr</span>
        </div>
      </div>
      {/* Columna derecha: formulario */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-white">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold text-center text-[#a2b48c]">Iniciar Sesión</h2>
          {error && <div className="p-3 bg-red-100 text-red-700 rounded">{error.message}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-[#a2b48c] focus:border-[#a2b48c]"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-[#a2b48c] focus:border-[#a2b48c]"
                />
                <button 
                  type="button" 
                  onClick={toggleShowPassword} 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 mt-1"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 text-white bg-[#a2b48c] rounded-md hover:bg-[#8fa07a] focus:outline-none focus:ring-2 focus:ring-[#a2b48c] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;