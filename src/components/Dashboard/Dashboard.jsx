// src/pages/Dashboard.jsx (o donde esté tu Dashboard)

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { useAuth } from '../../hooks/useAuth';
import './Dashboard.css'; // Si tienes estilos

export function Dashboard() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { username, logout } = useAuth();

    const handleLogout = async () => {
        try {
            // ✅ Llamar al backend para invalidar token
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Limpiar localStorage siempre
            logout();
            navigate('/login');
        }
    };

    return (
        <div className="dashboard-container">
            <h1>{t('dashboard.title')}</h1>
            <p>{t('dashboard.welcome')}, {username}</p>
            <button onClick={handleLogout} className="logout-btn">
                {t('dashboard.logout')}
            </button>
        </div>
    );
}
