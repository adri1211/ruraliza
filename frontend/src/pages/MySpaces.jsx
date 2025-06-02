import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserSpaces from '../components/UserSpaces';

const MySpaces = () => {
    const navigate = useNavigate();
    const [deleteError, setDeleteError] = React.useState(null);

    const handleDelete = (space) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este espacio?");
        if (confirmDelete) {
            const token = localStorage.getItem("jwt_token");
            fetch("http://localhost:8000/api/spaces/" + space.id, { method: "DELETE", headers: { "Authorization": "Bearer " + token } })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error("Error al eliminar el espacio");
                    }
                    window.location.reload();
                })
                .catch((err) => { setDeleteError(err.message); });
        }
    };

    const handleEdit = (space) => {
        navigate(`/editar-espacio/${space.id}`);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Mis Espacios</h1>
                    <Link
                        to="/ofrecer-espacio"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Crear Nuevo Espacio
                    </Link>
                </div>
                {deleteError && ( <div className="mb-4 p-3 bg-red-100 text-red-700 rounded"> {deleteError} </div> ) }
                <UserSpaces onEdit={handleEdit} onDelete={handleDelete} />
            </div>
        </div>
    );
};

export default MySpaces; 