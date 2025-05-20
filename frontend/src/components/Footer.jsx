import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {/* Logo y descripción */}
          <div className="col-span-1">
            <Link to="/" className="text-xl font-bold text-gray-900 inline-block">
              Ruraliza
            </Link>
            <p className="mt-3 text-sm text-gray-600 mx-auto max-w-xs">
              Conectamos espacios con emprendedores para que puedas montar tu negocio de forma fácil y rápida.
            </p>
          </div>

          {/* Recursos */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              RECURSOS
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/como-funciona" className="text-sm text-gray-600 hover:text-gray-900">
                  Cómo funciona
                </Link>
              </li>
              <li>
                <Link to="/preguntas-frecuentes" className="text-sm text-gray-600 hover:text-gray-900">
                  Preguntas frecuentes
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-sm text-gray-600 hover:text-gray-900">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              LEGAL
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/terminos-y-condiciones" className="text-sm text-gray-600 hover:text-gray-900">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link to="/politica-de-privacidad" className="text-sm text-gray-600 hover:text-gray-900">
                  Política de privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} Ruraliza. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 