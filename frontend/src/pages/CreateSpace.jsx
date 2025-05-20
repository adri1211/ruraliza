import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Cookies from 'js-cookie';

const CreateSpace = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    location: '',
    price: '',
    description: '',
    category: '',
    images: [],
  });
  const [previewImages, setPreviewImages] = useState([]);

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
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));

    // Crear previsualizaciones
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
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
      formDataToSend.append('category', formData.category);
      formDataToSend.append('userId', user.id);
      formData.images.forEach((image, index) => {
        formDataToSend.append('images', image);
      });

      const token = Cookies.get('jwt_token');
      const response = await fetch('http://localhost:8000/api/spaces', {
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
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Ofrecer un espacio</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Ubicación */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Ubicación
          </label>
          <input
            type="text"
            id="location"
            name="location"
            required
            value={formData.location}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Dirección completa del espacio"
          />
        </div>

        {/* Precio */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Precio (€/mes)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            required
            value={formData.price}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        {/* Categoría */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Categoría
          </label>
          <select
            id="category"
            name="category"
            required
            value={formData.category}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Selecciona una categoría</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            required
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Describe tu espacio..."
          />
        </div>

        {/* Imágenes */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fotos
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="images"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>Sube tus fotos</span>
                  <input
                    id="images"
                    name="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">o arrastra y suelta</p>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF hasta 10MB
              </p>
            </div>
          </div>
          
          {/* Previsualización de imágenes */}
          {previewImages.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {previewImages.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="h-24 w-full object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botón de envío */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar espacio'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSpace; 