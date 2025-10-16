import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '../../services/auth.service';
import { useAuth } from '../../hooks/useAuth.jsx';

export function LoginForm() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const data = await authService.login(formData);
            login(data.token, data.username);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || t('auth.login.errors.serverError'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div>
            <h2>{t('auth.login.title')}</h2>
            <form onSubmit={handleSubmit}>
                {error && <div style={{ color: 'red' }}>{error}</div>}

                <div>
                    <label>{t('auth.login.email')}</label>
                    <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>{t('auth.login.password')}</label>
                    <input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" disabled={isLoading}>
                    {isLoading ? t('auth.login.loading') : t('auth.login.submit')}
                </button>

                <div>
                    <Link to="/register">{t('auth.login.registerLink')}</Link>
                </div>
            </form>
        </div>
    );
}


