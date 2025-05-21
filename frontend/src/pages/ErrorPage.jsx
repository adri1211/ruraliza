import React from 'react';
import { Link } from 'react-router-dom';
import './ErrorPage.css';

const ErrorPage = () => {


  return (
    <div className="error-page">
      <div className="error-container">
        <h1 className="error-title">¡Vaya!</h1>
        <p className="error-message">
          Lo sentimos, ha ocurrido un error inesperado.
          <br />
          Por favor, inténtelo de nuevo más tarde.
        </p>
        <Link to="/" className="error-link">
          Volver a la página de inicio
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;