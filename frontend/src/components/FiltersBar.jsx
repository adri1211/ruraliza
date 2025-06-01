import React from 'react';
import useFilters from '../hooks/useFilters';

const FiltersBar = () => {
  const { filters, updateFilter, resetFilters } = useFilters();

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end', marginBottom: '1.5rem', background: '#F5F1D7', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 1px 4px rgba(160,184,139,0.08)' }}>
      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#A0B88B' }}>Buscar</label>
        <input
          type="text"
          value={filters.search}
          onChange={e => updateFilter('search', e.target.value)}
          placeholder="Ubicación, descripción..."
          style={{ marginTop: '0.25rem', width: '100%', border: '1px solid #A0B88B', borderRadius: '0.375rem', padding: '0.5rem 0.75rem', color: '#A0B88B', background: '#F5F1D7' }}
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#A0B88B' }}>Precio mínimo</label>
        <input
          type="number"
          value={filters.minPrice}
          onChange={e => updateFilter('minPrice', e.target.value)}
          placeholder="Mínimo"
          style={{ marginTop: '0.25rem', width: '100%', border: '1px solid #A0B88B', borderRadius: '0.375rem', padding: '0.5rem 0.75rem', color: '#A0B88B', background: '#F5F1D7' }}
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#A0B88B' }}>Precio máximo</label>
        <input
          type="number"
          value={filters.maxPrice}
          onChange={e => updateFilter('maxPrice', e.target.value)}
          placeholder="Máximo"
          style={{ marginTop: '0.25rem', width: '100%', border: '1px solid #A0B88B', borderRadius: '0.375rem', padding: '0.5rem 0.75rem', color: '#A0B88B', background: '#F5F1D7' }}
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#A0B88B' }}>Categoría</label>
        <select
          value={filters.category}
          onChange={e => updateFilter('category', e.target.value)}
          style={{ marginTop: '0.25rem', width: '100%', border: '1px solid #A0B88B', borderRadius: '0.375rem', padding: '0.5rem 0.75rem', color: '#A0B88B', background: '#F5F1D7' }}
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
        style={{ background: '#A0B88B', color: '#F5F1D7', padding: '0.5rem 1rem', borderRadius: '0.375rem', marginLeft: '0.5rem', border: 'none', fontWeight: 500, cursor: 'pointer' }}
      >
        Limpiar
      </button>
    </div>
  );
};

export default FiltersBar; 