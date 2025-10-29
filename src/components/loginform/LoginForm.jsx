import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '../services/authService.js';
import { useAuth } from '../hooks/useAuth.jsx';

export function LoginPage() {
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
            setError(err.message || t('auth.login.errors.serverError'));
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
        <div className="min-h-screen flex w-full">
            {/* Lado izquierdo - Fondo */}
             <div className="hidden lg:block lg:flex-1 bg-gradient-to-br from-blue-600 to-purple-700">
                <div 
                    className="h-full w-full bg-cover bg-center"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80")',
                        opacity: 0.3
                    }}
                />
            </div>

            {/* Formulario - lado derecho (40%) */}
            <div className="flex-1 lg:flex-none lg:w-2/5 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-black text-gray-900">Trazia</h1>
                        <h2 className="text-xl font-bold text-gray-900 mt-6">
                            {t('auth.login.title', 'Sign in to your account')}
                        </h2>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('auth.login.email', 'Email Address')} *
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your email address"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('auth.login.password', 'Password')} *
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex justify-between items-center">
                            <label className="flex items-center">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-600">
                                    {t('auth.login.rememberMe', 'Remember me')}
                                </span>
                            </label>
                            
                            <Link 
                                to="/forgot-password" 
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                {t('auth.login.forgotPassword', 'Forgot password?')}
                            </Link>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                            >
                                {isLoading ? t('auth.login.loading', 'Signing in...') : t('auth.login.submit', 'Sign In')}
                            </button>
                        </div>

                        <div className="text-center pt-8">
                            <p className="text-gray-600">
                                {t('auth.login.noAccount', "Don't have an account?")}{' '}
                                <Link
                                    to="/register"
                                    className="text-blue-600 font-bold hover:text-blue-800 text-lg"
                                >
                                    {t('auth.login.registerLink', 'Sign up')}
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
