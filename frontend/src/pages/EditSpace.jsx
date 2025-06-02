import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditSpace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    location: '',
    price: '',
    description: '',
    category: '',
    images: [], // solo archivos nuevos
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const response = await fetch(`http://localhost:8000/api/spaces/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('No se pudo cargar el espacio');
        const data = await response.json();
        setFormData({
          location: data.location || '',
          price: data.price || '',
          description: data.description || '',
          category: data.category || '',
          images: [], // solo archivos nuevos
        });
        setPreviewImages((data.images || []).map(img =>
          img.endsWith('.pdf')
            ? { type: 'pdf', name: img, src: img }
            : { type: 'image', name: img, src: `http://localhost:8000/uploads/spaces/${img}` }
        ));
      } catch (err) {
        setError(err.message);
      }
    };
    fetchSpace();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
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
    setError(null);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('location', formData.location);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      // Solo archivos nuevos
      formData.images.forEach((image) => {
        if (image instanceof File) {
          formDataToSend.append('images[]', image);
        }
      });
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`http://localhost:8000/api/spaces/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataToSend,
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Error al actualizar el espacio');
      navigate('/mis-espacios');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f1d7 0%, #eaf6e3 100%)', padding: '32px 0' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', borderRadius: 22, boxShadow: '0 8px 32px #a0b88b33', background: '#fff', overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(90deg, #A0B88B 0%, #2ee59d 100%)', padding: '32px 32px 18px 32px' }}>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#fff', marginBottom: 4 }}>Editar espacio</h1>
          <p style={{ color: '#eaf6e3', fontWeight: 500, fontSize: '1.08rem' }}>Modifica los datos de tu espacio</p>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="location" style={{ fontWeight: 600, color: '#232323', marginBottom: 2 }}>Ubicación</label>
            <input type="text" id="location" name="location" required value={formData.location} onChange={handleInputChange}
              style={{ border: '1.5px solid #A0B88B', borderRadius: 8, padding: '10px 14px', fontSize: '1rem', outline: 'none', transition: 'border 0.2s', boxShadow: '0 1px 6px #a0b88b11' }}
              onFocus={e => e.target.style.border = '2px solid #2ee59d'}
              onBlur={e => e.target.style.border = '1.5px solid #A0B88B'}
              placeholder="Dirección completa del espacio"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="price" style={{ fontWeight: 600, color: '#232323', marginBottom: 2 }}>Precio (€/mes)</label>
            <input type="number" id="price" name="price" required value={formData.price} onChange={handleInputChange}
              style={{ border: '1.5px solid #A0B88B', borderRadius: 8, padding: '10px 14px', fontSize: '1rem', outline: 'none', transition: 'border 0.2s', boxShadow: '0 1px 6px #a0b88b11' }}
              onFocus={e => e.target.style.border = '2px solid #2ee59d'}
              onBlur={e => e.target.style.border = '1.5px solid #A0B88B'}
              placeholder="0.00" min="0" step="0.01"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="category" style={{ fontWeight: 600, color: '#232323', marginBottom: 2 }}>Categoría</label>
            <input type="text" id="category" name="category" required value={formData.category} onChange={handleInputChange}
              style={{ border: '1.5px solid #A0B88B', borderRadius: 8, padding: '10px 14px', fontSize: '1rem', outline: 'none', transition: 'border 0.2s', boxShadow: '0 1px 6px #a0b88b11' }}
              onFocus={e => e.target.style.border = '2px solid #2ee59d'}
              onBlur={e => e.target.style.border = '1.5px solid #A0B88B'}
              placeholder="Categoría"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="description" style={{ fontWeight: 600, color: '#232323', marginBottom: 2 }}>Descripción</label>
            <textarea id="description" name="description" required value={formData.description} onChange={handleInputChange} rows={4}
              style={{ border: '1.5px solid #A0B88B', borderRadius: 8, padding: '10px 14px', fontSize: '1rem', outline: 'none', transition: 'border 0.2s', boxShadow: '0 1px 6px #a0b88b11', resize: 'vertical' }}
              onFocus={e => e.target.style.border = '2px solid #2ee59d'}
              onBlur={e => e.target.style.border = '1.5px solid #A0B88B'}
              placeholder="Describe tu espacio..."
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontWeight: 600, color: '#232323', marginBottom: 2 }}>Fotos y documentos (PDF)</label>
            <input id="images" name="images" type="file" multiple accept="image/*,application/pdf" onChange={handleImageChange}
              style={{ marginBottom: 8 }}
            />
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
          {error && <div style={{ background: '#ffeaea', color: '#b91c1c', borderRadius: 8, padding: '10px 16px', fontWeight: 500 }}>{error}</div>}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
            <button type="submit" disabled={isSubmitting}
              style={{
                background: 'linear-gradient(90deg, #A0B88B 0%, #2ee59d 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '13px 38px',
                fontWeight: 700,
                fontSize: '1.08rem',
                boxShadow: '0 2px 10px #a0b88b22',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                transition: 'background 0.18s, transform 0.18s',
              }}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSpace; 