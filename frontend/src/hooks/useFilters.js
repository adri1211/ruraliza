import { useContext } from 'react';
import { FiltersContext } from '../context/FiltersContext';

const useFilters = () => {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error('useFilters debe usarse dentro de un FiltersProvider');
  }
  return context;
};

export default useFilters; 