import React from 'react';
import FavoritesList from '../components/FavoritesList';

const Favorites = () => (
    <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-5xl mx-auto px-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-10 text-center">Mis Favoritos</h1>
            <FavoritesList />
        </div>
    </div>
);

export default Favorites;
