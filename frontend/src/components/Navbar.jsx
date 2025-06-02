import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Fondo transparente solo en la home
  const navbarStyle = { backgroundColor: 'transparent' };

  return (
    <nav style={navbarStyle}>
      <div style={{ maxWidth: '90rem', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', height: '4rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#A0B88B', textDecoration: 'none' }}>
              Reaviva
            </Link>
            <button
              onClick={toggleMenu}
              style={{ marginLeft: '1rem', padding: '0.5rem', borderRadius: '0.375rem', color: '#A0B88B', background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              {isMenuOpen ? (
                <FaTimes style={{ height: '1.5rem', width: '1.5rem' }} />
              ) : (
                <FaBars style={{ height: '1.5rem', width: '1.5rem' }} />
              )}
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {user ? (
              <>
                <Link
                  to="/notificaciones"
                  style={{ color: '#A0B88B', fontWeight: 500, fontSize: '1rem', textDecoration: 'none' }}
                >
                  Notificaciones
                </Link>
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={toggleDropdown}
                    style={{ display: 'flex', alignItems: 'center', color: '#A0B88B', background: 'transparent', border: 'none', cursor: 'pointer' }}
                  >
                    <span style={{ fontSize: '1rem' }}>{user.fullName || user.email}</span>
                    <svg
                      style={{ height: '1.25rem', width: '1.25rem', marginLeft: '0.25rem', transition: 'transform 0.2s', transform: isDropdownOpen ? 'rotate(180deg)' : 'none', color: '#A0B88B' }}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {isDropdownOpen && (
                    <div style={{ position: 'absolute', right: 0, marginTop: '0.5rem', width: '12rem', borderRadius: '0.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', background: '#F5F1D7', border: '1px solid #A0B88B', zIndex: 10 }}>
                      <div style={{ padding: '0.5rem 0' }}>
                        <Link
                          to="/favoritos"
                          style={{ display: 'block', padding: '0.5rem 1rem', color: '#A0B88B', textDecoration: 'none' }}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Favoritos
                        </Link>
                        <Link
                          to="/mis-espacios"
                          style={{ display: 'block', padding: '0.5rem 1rem', color: '#A0B88B', textDecoration: 'none' }}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Mis Espacios
                        </Link>
                        <Link
                          to="/chats"
                          style={{ display: 'block', padding: '0.5rem 1rem', color: '#A0B88B', textDecoration: 'none' }}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Mis Chats
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            style={{ display: 'block', padding: '0.5rem 1rem', color: '#A0B88B', textDecoration: 'none' }}
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            Panel de Admin
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsDropdownOpen(false);
                          }}
                          style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.5rem 1rem', color: '#A0B88B', background: 'transparent', border: 'none', cursor: 'pointer' }}
                        >
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  style={{ color: '#A0B88B', fontWeight: 500, fontSize: '1rem', textDecoration: 'none' }}
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/register" 
                  style={{ padding: '0.5rem 1rem', background: '#A0B88B', color: '#F5F1D7', borderRadius: '0.375rem', fontWeight: 500, fontSize: '1rem', textDecoration: 'none', marginLeft: '0.5rem' }}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Menú móvil */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
            {user && (
              <>
                <Link 
                  to="/notificaciones" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition duration-150"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Notificaciones
                </Link>
                <Link 
                  to="/mis-espacios" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition duration-150"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mis Espacios
                </Link>
                <Link 
                  to="/chats" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition duration-150"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mis Chats
                </Link>
              </>
            )}
            {user && isAdmin && (
              <Link 
                to="/admin" 
                className="block px-3 py-2 rounded-md text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition duration-150"
                onClick={() => setIsMenuOpen(false)}
              >
                Panel de Admin
              </Link>
            )}
            {user ? (
              <button 
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition duration-150"
              >
                Cerrar Sesión
              </button>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition duration-150"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/register" 
                  className="block px-3 py-2 rounded-md text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition duration-150"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;