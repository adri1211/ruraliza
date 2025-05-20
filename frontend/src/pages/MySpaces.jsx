import React from 'react';
import { Link } from 'react-router-dom';
import UserSpaces from '../components/UserSpaces';

const MySpaces = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Mis Espacios</h1>
                <Link
                    to="/ofrecer-espacio"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Crear Nuevo Espacio
                </Link>
            </div>
            <UserSpaces />
        </div>
    );
};

export default MySpaces; 