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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-indigo-600 to-purple-600">
            <h1 className="text-3xl font-bold text-white">Editar espacio</h1>
            <p className="mt-2 text-indigo-100">Modifica los datos de tu espacio</p>
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="space-y-2">
              <label htmlFor="location" className="block text-sm font-semibold text-gray-700">Ubicación</label>
              <input type="text" id="location" name="location" required value={formData.location} onChange={handleInputChange} className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" placeholder="Dirección completa del espacio" />
            </div>
            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-semibold text-gray-700">Precio (€/mes)</label>
              <input type="number" id="price" name="price" required value={formData.price} onChange={handleInputChange} className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" placeholder="0.00" min="0" step="0.01" />
            </div>
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-semibold text-gray-700">Categoría</label>
              <input type="text" id="category" name="category" required value={formData.category} onChange={handleInputChange} className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" placeholder="Categoría" />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700">Descripción</label>
              <textarea id="description" name="description" required value={formData.description} onChange={handleInputChange} rows={4} className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" placeholder="Describe tu espacio..." />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Fotos y documentos (PDF)</label>
              <input id="images" name="images" type="file" multiple accept="image/*,application/pdf" onChange={handleImageChange} className="block" />
              {/* Previsualización de archivos existentes y nuevos */}
              {previewImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {previewImages.map((preview, index) => (
                    <div key={index} className="relative group">
                      {preview.type === 'image' ? (
                        <img src={preview.src} alt={preview.name} className="h-32 w-full object-cover rounded-lg shadow-sm group-hover:shadow-md transition duration-150" />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-32 w-full bg-gray-100 rounded-lg border border-gray-300">
                          <svg className="h-10 w-10 text-indigo-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span className="text-xs text-gray-700">{preview.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {error && <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>}
            <div className="flex justify-end pt-4">
              <button type="submit" disabled={isSubmitting} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150">
                {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSpace; 