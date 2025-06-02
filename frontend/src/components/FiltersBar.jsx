import React from 'react';
import useFilters from '../hooks/useFilters';

const FiltersBar = () => {
  const { filters, updateFilter, resetFilters } = useFilters();

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-end', marginBottom: '2.2rem', background: '#fff', padding: '1.5rem 1.2rem', borderRadius: '18px', boxShadow: '0 2px 12px #a0b88b22', border: '1.5px solid #e0e0e0', justifyContent: 'center' }}>
      <div>
        <label style={{ display: 'block', fontSize: '1rem', fontWeight: 700, color: '#232323', marginBottom: '0.3rem' }}>Buscar</label>
        <input
          type="text"
          value={filters.search}
          onChange={e => updateFilter('search', e.target.value)}
          placeholder="Ubicación, descripción..."
          style={{ marginTop: '0.1rem', width: '180px', border: '1.5px solid #2ee59d', borderRadius: '0.5rem', padding: '0.6rem 1rem', color: '#232323', background: '#fff', fontSize: '1rem', fontWeight: 500, outline: 'none', boxShadow: '0 1px 4px #a0b88b11' }}
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '1rem', fontWeight: 700, color: '#232323', marginBottom: '0.3rem' }}>Precio mínimo</label>
        <input
          type="number"
          value={filters.minPrice}
          onChange={e => updateFilter('minPrice', e.target.value)}
          placeholder="Mínimo"
          style={{ marginTop: '0.1rem', width: '120px', border: '1.5px solid #2ee59d', borderRadius: '0.5rem', padding: '0.6rem 1rem', color: '#232323', background: '#fff', fontSize: '1rem', fontWeight: 500, outline: 'none', boxShadow: '0 1px 4px #a0b88b11' }}
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '1rem', fontWeight: 700, color: '#232323', marginBottom: '0.3rem' }}>Precio máximo</label>
        <input
          type="number"
          value={filters.maxPrice}
          onChange={e => updateFilter('maxPrice', e.target.value)}
          placeholder="Máximo"
          style={{ marginTop: '0.1rem', width: '120px', border: '1.5px solid #2ee59d', borderRadius: '0.5rem', padding: '0.6rem 1rem', color: '#232323', background: '#fff', fontSize: '1rem', fontWeight: 500, outline: 'none', boxShadow: '0 1px 4px #a0b88b11' }}
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '1rem', fontWeight: 700, color: '#232323', marginBottom: '0.3rem' }}>Categoría</label>
        <select
          value={filters.category}
          onChange={e => updateFilter('category', e.target.value)}
          style={{ marginTop: '0.1rem', width: '140px', border: '1.5px solid #2ee59d', borderRadius: '0.5rem', padding: '0.6rem 1rem', color: '#232323', background: '#fff', fontSize: '1rem', fontWeight: 500, outline: 'none', boxShadow: '0 1px 4px #a0b88b11' }}
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
        style={{ background: '#2ee59d', color: '#fff', padding: '0.7rem 1.4rem', borderRadius: '0.5rem', marginLeft: '0.5rem', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px #2ee59d22', transition: 'background 0.18s, transform 0.18s' }}
        onMouseOver={e => { e.target.style.background = '#1ecb7a'; }}
        onMouseOut={e => { e.target.style.background = '#2ee59d'; }}
      >
        Limpiar
      </button>
    </div>
  );
};

export default FiltersBar; 