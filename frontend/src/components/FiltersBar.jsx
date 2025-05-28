import React from 'react';
import useFilters from '../hooks/useFilters';

const FiltersBar = () => {
  const { filters, updateFilter, resetFilters } = useFilters();

  return (
    <div className="flex flex-wrap gap-4 items-end mb-6 bg-white p-4 rounded shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700">Buscar</label>
        <input
          type="text"
          value={filters.search}
          onChange={e => updateFilter('search', e.target.value)}
          placeholder="Ubicación, descripción..."
          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Precio mínimo</label>
        <input
          type="number"
          value={filters.minPrice}
          onChange={e => updateFilter('minPrice', e.target.value)}
          placeholder="Mínimo"
          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Precio máximo</label>
        <input
          type="number"
          value={filters.maxPrice}
          onChange={e => updateFilter('maxPrice', e.target.value)}
          placeholder="Máximo"
          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Categoría</label>
        <select
          value={filters.category}
          onChange={e => updateFilter('category', e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Todas</option>
          <option value="rural">Rural</option>
          <option value="urbano">Urbano</option>
          <option value="almacen">Almacén</option>
          <option value="oficina">Oficina</option>
        </select>
      </div>
      <button
        onClick={resetFilters}
        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2"
      >
        Limpiar
      </button>
    </div>
  );
};

export default FiltersBar; 