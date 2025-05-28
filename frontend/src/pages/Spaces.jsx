import React from 'react';
import SpacesList from '../components/SpacesList';
import FiltersBar from '../components/FiltersBar';

const Spaces = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto pt-8">
                <FiltersBar />
                <SpacesList />
            </div>
        </div>
    );
};

export default Spaces; 