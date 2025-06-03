import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';
import Cookies from 'js-cookie';

const CreateSpace = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    location: '',
    price: '',
    description: '',
    category: '',
    images: [],
    customCategory: '',
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  const categories = [
    'Local comercial',
    'Oficina',
    'Nave industrial',
    'Terreno',
    'Otros'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'category') {
      setShowCustomCategory(value === 'Otros');
      if (value !== 'Otros') {
        setFormData(prev => ({ ...prev, customCategory: '' }));
      }
    }
    if (name === 'customCategory') {
      setFormData(prev => ({ ...prev, customCategory: value }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));

    // Crear previsualizaciones solo para imágenes
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImages(prev => [...prev, { type: 'image', src: reader.result, name: file.name }]);
        };
        reader.readAsDataURL(file);
      } else if (file.type === 'application/pdf') {
        setPreviewImages(prev => [...prev, { type: 'pdf', name: file.name }]);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('location', formData.location);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category === 'Otros' ? (formData.customCategory || 'Otros') : formData.category);
      formData.images.forEach((image) => {
        formDataToSend.append('images[]', image);
      });

      const token = localStorage.getItem('jwt_token');
      const response = await fetch('/api/spaces', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Error al crear el espacio');
      }

      navigate('/mis-espacios');
    } catch (error) {
      console.error('Error:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f1d7 0%, #eaf6e3 100%)', padding: '32px 0' }}>
      <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#232323', textAlign: 'center', marginBottom: 6, letterSpacing: '-1px', fontFamily: 'sans-serif' }}>
        Publicar tu espacio
      </h1>
      <p style={{ fontSize: '1.15rem', color: '#6b7c6c', textAlign: 'center', marginBottom: 32, fontFamily: 'sans-serif', maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
        Comparte tu local o terreno con emprendedores
      </p>
      <div style={{ maxWidth: 600, margin: '0 auto', borderRadius: 22, boxShadow: '0 8px 32px #a0b88b33', background: '#fff', overflow: 'hidden', border: '1.5px solid #e0e0e0' }}>
        <form onSubmit={handleSubmit} style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 22 }}>
          {/* Ubicación */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="location" style={{ fontWeight: 600, color: '#232323', marginBottom: 2 }}>Ubicación</label>
            <div style={{ position: 'relative' }}>
              <svg style={{ position: 'absolute', left: 12, top: 13, height: 20, width: 20, color: '#A0B88B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <input
                type="text"
                id="location"
                name="location"
                required
                value={formData.location}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  borderRadius: 8,
                  border: '1.5px solid #A0B88B',
                  background: '#fff',
                  padding: '10px 14px 10px 40px',
                  fontSize: '1rem',
                  color: '#232323',
                  marginBottom: 0,
                  outline: 'none',
                  transition: 'border 0.2s',
                  boxShadow: '0 1px 6px #a0b88b11',
                }}
                onFocus={e => e.target.style.border = '2px solid #2ee59d'}
                onBlur={e => e.target.style.border = '1.5px solid #A0B88B'}
                placeholder="Dirección completa del espacio"
              />
            </div>
          </div>

          {/* Precio */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="price" style={{ fontWeight: 600, color: '#232323', marginBottom: 2 }}>Precio (€/mes)</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: 13, color: '#A0B88B', fontSize: 18, fontWeight: 600 }}>€</span>
              <input
                type="number"
                id="price"
                name="price"
                required
                value={formData.price}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  borderRadius: 8,
                  border: '1.5px solid #A0B88B',
                  background: '#fff',
                  padding: '10px 14px 10px 38px',
                  fontSize: '1rem',
                  color: '#232323',
                  marginBottom: 0,
                  outline: 'none',
                  transition: 'border 0.2s',
                  boxShadow: '0 1px 6px #a0b88b11',
                }}
                onFocus={e => e.target.style.border = '2px solid #2ee59d'}
                onBlur={e => e.target.style.border = '1.5px solid #A0B88B'}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Categoría */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="category" style={{ fontWeight: 600, color: '#232323', marginBottom: 2 }}>Categoría</label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleInputChange}
              style={{
                width: '100%',
                borderRadius: 8,
                border: '1.5px solid #A0B88B',
                background: '#fff',
                padding: '10px 14px',
                fontSize: '1rem',
                color: '#232323',
                marginBottom: 0,
                outline: 'none',
                transition: 'border 0.2s',
                boxShadow: '0 1px 6px #a0b88b11',
              }}
              onFocus={e => e.target.style.border = '2px solid #2ee59d'}
              onBlur={e => e.target.style.border = '1.5px solid #A0B88B'}
            >
              <option value="">Selecciona una categoría</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {showCustomCategory && (
              <input
                type="text"
                id="customCategory"
                name="customCategory"
                required
                value={formData.customCategory || ''}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  borderRadius: 8,
                  border: '1.5px solid #A0B88B',
                  background: '#fff',
                  padding: '10px 14px',
                  fontSize: '1rem',
                  color: '#232323',
                  marginTop: 8,
                  outline: 'none',
                  transition: 'border 0.2s',
                  boxShadow: '0 1px 6px #a0b88b11',
                }}
                onFocus={e => e.target.style.border = '2px solid #2ee59d'}
                onBlur={e => e.target.style.border = '1.5px solid #A0B88B'}
                placeholder="Escribe la categoría..."
              />
            )}
          </div>

          {/* Descripción */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="description" style={{ fontWeight: 600, color: '#232323', marginBottom: 2 }}>Descripción</label>
            <textarea
              id="description"
              name="description"
              required
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              style={{
                width: '100%',
                borderRadius: 8,
                border: '1.5px solid #A0B88B',
                background: '#fff',
                padding: '10px 14px',
                fontSize: '1rem',
                color: '#232323',
                marginBottom: 0,
                outline: 'none',
                transition: 'border 0.2s',
                boxShadow: '0 1px 6px #a0b88b11',
                resize: 'vertical',
              }}
              onFocus={e => e.target.style.border = '2px solid #2ee59d'}
              onBlur={e => e.target.style.border = '1.5px solid #A0B88B'}
              placeholder="Describe tu espacio..."
            />
          </div>

          {/* Imágenes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontWeight: 600, color: '#232323', marginBottom: 2 }}>Fotos y documentos (PDF)</label>
            <div style={{ border: '2px dashed #A0B88B', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f5f1d7', marginBottom: 8 }}>
              <svg style={{ height: 44, width: 44, color: '#A0B88B', marginBottom: 8 }} fill="none" stroke="currentColor" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <label htmlFor="images" style={{ color: '#2e3a2e', fontWeight: 600, cursor: 'pointer', fontSize: '1.01rem' }}>
                <span style={{ color: '#2e3a2e', fontWeight: 600 }}>Sube tus fotos o PDFs</span>
                <input
                  id="images"
                  name="images"
                  type="file"
                  multiple
                  accept="image/*,application/pdf"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </label>
              <span style={{ color: '#6b7c6c', fontSize: '0.98rem', marginTop: 2 }}>o arrastra y suelta</span>
              <span style={{ color: '#A0B88B', fontSize: '0.92rem', marginTop: 2 }}>PNG, JPG, GIF, PDF hasta 10MB</span>
            </div>
            {/* Previsualización de archivos */}
            {previewImages.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                {previewImages.map((preview, index) => (
                  <div key={index} style={{ background: '#f5f1d7', border: '1.5px solid #A0B88B', borderRadius: 12, boxShadow: '0 2px 10px #a0b88b22', width: 110, height: 110, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                    {preview.type === 'image' ? (
                      <img src={preview.src} alt={preview.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} />
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <svg style={{ height: 32, width: 32, color: '#A0B88B', marginBottom: 6 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span style={{ fontSize: '0.7rem', color: '#232323', textAlign: 'center', wordBreak: 'break-all' }}>{preview.name}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botón de envío */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                background: 'linear-gradient(90deg, #A0B88B 0%, #2ee59d 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1.13rem',
                border: 'none',
                borderRadius: 22,
                padding: '16px 0',
                marginTop: 8,
                boxShadow: '0 2px 10px #a0b88b22',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                transition: 'background 0.18s, transform 0.18s',
              }}
            >
              {isSubmitting ? (
                <>
                  <svg style={{ display: 'inline', marginRight: 8, height: 22, width: 22, verticalAlign: 'middle' }} className="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                'Publicar espacio'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSpace; 