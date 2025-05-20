import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Cookies from 'js-cookie';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Tabs,
    Tab,
    Box,
    Typography,
    IconButton,
    Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

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
        return <Alert severity="error">No tienes permisos para acceder a esta página</Alert>;
    }

    return (
        <Box sx={{ width: '100%', p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Panel de Administración
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 2 }}>
                <Tab label="Usuarios" />
                <Tab label="Espacios" />
            </Tabs>

            {tabValue === 0 && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Usuario</TableCell>
                                <TableCell>Nombre Completo</TableCell>
                                <TableCell>Roles</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.fullName}</TableCell>
                                    <TableCell>{user.roles.join(', ')}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleEdit(user, 'users')}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(user.id, 'users')}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {tabValue === 1 && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Ubicación</TableCell>
                                <TableCell>Precio</TableCell>
                                <TableCell>Categoría</TableCell>
                                <TableCell>Propietario</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {spaces.map((space) => (
                                <TableRow key={space.id}>
                                    <TableCell>{space.id}</TableCell>
                                    <TableCell>{space.location}</TableCell>
                                    <TableCell>{space.price}€</TableCell>
                                    <TableCell>{space.category}</TableCell>
                                    <TableCell>{space.owner.username}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleEdit(space, 'spaces')}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(space.id, 'spaces')}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>
                    Editar {selectedItem?.type === 'users' ? 'Usuario' : 'Espacio'}
                </DialogTitle>
                <DialogContent>
                    {selectedItem?.type === 'users' ? (
                        <>
                            <TextField
                                margin="dense"
                                label="Email"
                                fullWidth
                                value={editData.email || ''}
                                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                            />
                            <TextField
                                margin="dense"
                                label="Usuario"
                                fullWidth
                                value={editData.username || ''}
                                onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                            />
                            <TextField
                                margin="dense"
                                label="Nombre Completo"
                                fullWidth
                                value={editData.fullName || ''}
                                onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                            />
                            <TextField
                                margin="dense"
                                label="Roles"
                                fullWidth
                                value={editData.roles?.join(', ') || ''}
                                onChange={(e) => setEditData({ ...editData, roles: e.target.value.split(',').map(r => r.trim()) })}
                                helperText="Separar roles por comas"
                            />
                        </>
                    ) : (
                        <>
                            <TextField
                                margin="dense"
                                label="Ubicación"
                                fullWidth
                                value={editData.location || ''}
                                onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                            />
                            <TextField
                                margin="dense"
                                label="Precio"
                                type="number"
                                fullWidth
                                value={editData.price || ''}
                                onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) })}
                            />
                            <TextField
                                margin="dense"
                                label="Categoría"
                                fullWidth
                                value={editData.category || ''}
                                onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                            />
                            <TextField
                                margin="dense"
                                label="Descripción"
                                fullWidth
                                multiline
                                rows={4}
                                value={editData.description || ''}
                                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminPanel; 