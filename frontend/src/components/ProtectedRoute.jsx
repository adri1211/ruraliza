import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Spinner from './Spinner';

const ProtectedRoute = ({ children }) => {
    const { user, isLoading } = useAuth();

    // Mostrar un spinner simple mientras se verifica la autenticación
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner />
            </div>
        );
    }

    // Si el usuario no está autenticado, redirigir al login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Si el usuario está autenticado, mostrar el contenido protegido
    return children;
};

export default ProtectedRoute;