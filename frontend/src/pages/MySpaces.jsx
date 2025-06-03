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
            fetch("/api/spaces/" + space.id, { method: "DELETE", headers: { "Authorization": "Bearer " + token } })
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
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e9f5ee 100%)', padding: '3rem 0' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 44, color: '#2ee59d', marginBottom: 0 }}>
                            <svg width="44" height="44" fill="none" viewBox="0 0 24 24" stroke="#2ee59d"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10l9-7 9 7v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 21V9h6v12" /></svg>
                        </span>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#232323', margin: 0, fontFamily: 'Segoe UI, Arial, sans-serif', letterSpacing: '-1px' }}>Mis Espacios</h1>
                        <p style={{ color: '#6b7c6c', fontSize: '1.13rem', margin: 0, fontWeight: 400 }}>Gestiona, edita o elimina los espacios que has publicado en la plataforma.</p>
                    </div>
                    <Link
                        to="/ofrecer-espacio"
                        style={{ display: 'inline-block', marginTop: '1.7rem', background: '#2ee59d', color: '#fff', fontWeight: 700, fontSize: '1.1rem', borderRadius: '999px', padding: '13px 36px', boxShadow: '0 2px 8px #2ee59d22', textDecoration: 'none', transition: 'background 0.18s, transform 0.18s' }}
                        onMouseOver={e => { e.target.style.background = '#1ecb7a'; }}
                        onMouseOut={e => { e.target.style.background = '#2ee59d'; }}
                    >
                        <span style={{ fontSize: 18, marginRight: 8, verticalAlign: 'middle' }}>+</span> Crear Nuevo Espacio
                    </Link>
                </div>
                {deleteError && (<div className="mb-4 p-3 bg-red-100 text-red-700 rounded"> {deleteError} </div>)}
                <UserSpaces onEdit={handleEdit} onDelete={handleDelete} />
            </div>
        </div>
    );
};

export default MySpaces; 