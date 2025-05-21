import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Cookies from 'js-cookie';
import './AdminPanel.css';

const AdminPanel = () => {
    const { user } = useContext(AuthContext);
    const [tabValue, setTabValue] = useState(0);
    const [users, setUsers] = useState([]);
    const [spaces, setSpaces] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [editData, setEditData] = useState({});
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (user?.roles?.includes('ROLE_ADMIN')) {
            fetchUsers();
            fetchSpaces();
        }
    }, [user]);

    const fetchUsers = async () => {
        try {
            const token = Cookies.get('jwt_token');
            const response = await fetch('http://127.0.0.1:8000/api/admin/users', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });
            if (!response.ok) throw new Error('Error al cargar usuarios');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            setError('Error al cargar usuarios: ' + error.message);
        }
    };

    const fetchSpaces = async () => {
        try {
            const token = Cookies.get('jwt_token');
            const response = await fetch('http://127.0.0.1:8000/api/admin/spaces', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });
            if (!response.ok) throw new Error('Error al cargar espacios');
            const data = await response.json();
            setSpaces(data);
        } catch (error) {
            setError('Error al cargar espacios: ' + error.message);
        }
    };

    const handleEdit = (item, type) => {
        setSelectedItem({ ...item, type });
        setEditData(item);
        setOpenDialog(true);
    };

    const handleDelete = async (id, type) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este elemento?')) return;

        try {
            const token = Cookies.get('jwt_token');
            const response = await fetch(`http://127.0.0.1:8000/api/admin/${type}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Error al eliminar');
            
            if (type === 'users') {
                setUsers(users.filter(user => user.id !== id));
            } else {
                setSpaces(spaces.filter(space => space.id !== id));
            }
            
            setSuccess('Elemento eliminado correctamente');
        } catch (error) {
            setError('Error al eliminar: ' + error.message);
        }
    };

    const handleSave = async () => {
        try {
            const token = Cookies.get('jwt_token');
            const { type, id } = selectedItem;
            const response = await fetch(`http://127.0.0.1:8000/api/admin/${type}/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(editData),
            });

            if (!response.ok) throw new Error('Error al actualizar');
            
            if (type === 'users') {
                setUsers(users.map(user => user.id === id ? { ...user, ...editData } : user));
            } else {
                setSpaces(spaces.map(space => space.id === id ? { ...space, ...editData } : space));
            }
            
            setSuccess('Elemento actualizado correctamente');
            setOpenDialog(false);
        } catch (error) {
            setError('Error al actualizar: ' + error.message);
        }
    };

    if (!user?.roles?.includes('ROLE_ADMIN')) {
        return <div className="alert error">No tienes permisos para acceder a esta página</div>;
    }

    return (
        <div className="admin-panel">
            <h1>Panel de Administración</h1>

            {error && <div className="alert error">{error}</div>}
            {success && <div className="alert success">{success}</div>}

            <div className="tabs">
                <button 
                    className={`tab ${tabValue === 0 ? 'active' : ''}`} 
                    onClick={() => setTabValue(0)}
                >
                    Usuarios
                </button>
                <button 
                    className={`tab ${tabValue === 1 ? 'active' : ''}`} 
                    onClick={() => setTabValue(1)}
                >
                    Espacios
                </button>
            </div>

            {tabValue === 0 && (
                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Email</th>
                                <th>Usuario</th>
                                <th>Nombre Completo</th>
                                <th>Roles</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.email}</td>
                                    <td>{user.username}</td>
                                    <td>{user.fullName}</td>
                                    <td>{user.roles.join(', ')}</td>
                                    <td>
                                        <button 
                                            className="action-button edit"
                                            onClick={() => handleEdit(user, 'users')}
                                        >
                                            Editar
                                        </button>
                                        <button 
                                            className="action-button delete"
                                            onClick={() => handleDelete(user.id, 'users')}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {tabValue === 1 && (
                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Ubicación</th>
                                <th>Precio</th>
                                <th>Categoría</th>
                                <th>Propietario</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {spaces.map((space) => (
                                <tr key={space.id}>
                                    <td>{space.id}</td>
                                    <td>{space.location}</td>
                                    <td>{space.price}€</td>
                                    <td>{space.category}</td>
                                    <td>{space.owner.username}</td>
                                    <td>
                                        <button 
                                            className="action-button edit"
                                            onClick={() => handleEdit(space, 'spaces')}
                                        >
                                            Editar
                                        </button>
                                        <button 
                                            className="action-button delete"
                                            onClick={() => handleDelete(space.id, 'spaces')}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {openDialog && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Editar {selectedItem?.type === 'users' ? 'Usuario' : 'Espacio'}</h2>
                        <div className="form-group">
                            {selectedItem?.type === 'users' ? (
                                <>
                                    <div className="form-field">
                                        <label>Email:</label>
                                        <input
                                            type="email"
                                            value={editData.email || ''}
                                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-field">
                                        <label>Usuario:</label>
                                        <input
                                            type="text"
                                            value={editData.username || ''}
                                            onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-field">
                                        <label>Nombre Completo:</label>
                                        <input
                                            type="text"
                                            value={editData.fullName || ''}
                                            onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-field">
                                        <label>Roles:</label>
                                        <input
                                            type="text"
                                            value={editData.roles?.join(', ') || ''}
                                            onChange={(e) => setEditData({ ...editData, roles: e.target.value.split(',').map(r => r.trim()) })}
                                        />
                                        <small>Separar roles por comas</small>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="form-field">
                                        <label>Ubicación:</label>
                                        <input
                                            type="text"
                                            value={editData.location || ''}
                                            onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-field">
                                        <label>Precio:</label>
                                        <input
                                            type="number"
                                            value={editData.price || ''}
                                            onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) })}
                                        />
                                    </div>
                                    <div className="form-field">
                                        <label>Categoría:</label>
                                        <input
                                            type="text"
                                            value={editData.category || ''}
                                            onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-field">
                                        <label>Descripción:</label>
                                        <textarea
                                            value={editData.description || ''}
                                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                            rows={4}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="modal-actions">
                            <button onClick={() => setOpenDialog(false)}>Cancelar</button>
                            <button onClick={handleSave} className="save-button">Guardar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel; 