import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ErrorPage from "../pages/ErrorPage";
import RootLayout from "../layouts/RootLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import CreateSpace from '../pages/CreateSpace';
import MySpaces from '../pages/MySpaces';
import Spaces from '../pages/Spaces';
import AdminPanel from '../pages/AdminPanel';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from "react-router-dom";
import SpaceDetails from '../pages/SpaceDetails';

// Componente para proteger rutas de administrador
const AdminRoute = ({ children }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!user || !user.roles?.includes('ROLE_ADMIN')) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "register",
                element: <Register />,
            },
            {
                path: "ofrecer-espacio",
                element: (
                    <ProtectedRoute>
                        <CreateSpace />
                    </ProtectedRoute>
                ),
            },
            {
                path: "mis-espacios",
                element: (
                    <ProtectedRoute>
                        <MySpaces />
                    </ProtectedRoute>
                ),
            },
            {
                path: "espacios",
                element: <Spaces />,
            },
            {
                path: "espacios/:id",
                element: <SpaceDetails />,
            },
            {
                path: "admin",
                element: (
                    <ProtectedRoute>
                        <AdminRoute>
                            <AdminPanel />
                        </AdminRoute>
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);
