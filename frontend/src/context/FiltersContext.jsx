import React, { createContext, useState } from 'react';

export const FiltersContext = createContext();

export const FiltersProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    category: '',
  });

  const updateFilter = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({ search: '', minPrice: '', maxPrice: '', category: '' });
  };

  return (
    <FiltersContext.Provider value={{ filters, updateFilter, resetFilters }}>
      {children}
    </FiltersContext.Provider>
  );
}; 