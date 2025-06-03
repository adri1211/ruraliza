import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Inicialmente true para el spinner
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('jwt_token');
            const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

            if (token && isAuthenticated) {
                await getUser();
            } else {
                setUser(null);
            }
            setIsLoading(false); // Termina la carga inicial
        };

        checkAuth();
    }, []);

    const getUser = async () => {
        try {
            const token = localStorage.getItem('jwt_token');
            if (!token) {
                setUser(null);
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('user');
                return;
            }

            const response = await fetch("/api/user", {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.trim()}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const userData = await response.json();
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('isAuthenticated', 'true');
        } catch (error) {
            console.error('Error fetching user:', error);
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    const login = async (email, password) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch("/api/login", {
                method: "POST",
                credentials: 'include',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error en el inicio de sesión');
            }

            if (data.token) {
                localStorage.setItem('jwt_token', data.token.trim());
                localStorage.setItem('isAuthenticated', 'true');
                await getUser();
                return true;
            } else {
                throw new Error('No se recibió el token de autenticación');
            }
        } catch (error) {
            console.error('Error completo:', error);
            setError(error.message || 'Error en el servidor');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (email, password, username, fullName, phone, birthdate) => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password,
                    username,
                    fullName,
                    phone,
                    birthdate
                }),
            });
            const data = await response.json();
            if (response.ok) {
                await login(email, password); // Login automático tras registro
            } else {
                setError(data.error || 'Error en el registro');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        setUser(null);
        setIsLoading(false);
        setError(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, error, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};