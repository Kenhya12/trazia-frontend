import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';

export function LoginForm() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({ 
        email: '', 
        password: '' 
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
        if (serverError) {
            setServerError("");
        }
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const newErrors = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = t('auth.errors.emailRequired');
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = t('auth.errors.emailInvalid');
        }

        if (!formData.password) {
            newErrors.password = t('auth.errors.passwordRequired');
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");

        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        try {
            const loginResult = await login({
                email: formData.email,
                password: formData.password
            });

            if (loginResult.success) {
                navigate("/dashboard");
            } else {
                setServerError(loginResult.error || t('auth.errors.invalidCredentials'));
            }
        } catch (err) {
            if (err.response?.status === 401) {
                setServerError(t('auth.errors.invalidCredentials'));
            } else {
                setServerError(t('auth.errors.unexpectedError'));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex w-full">
            <div className="hidden lg:block lg:flex-1">
                <div
                    className="h-full w-full bg-cover bg-center"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80")'
                    }}
                />
            </div>

            <div className="flex-1 lg:flex-none lg:w-2/5 flex items-center justify-center p-8 bg-base-100">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-black text-base-content">Trazia</h1>
                        <h2 className="text-xl font-bold text-base-content mt-6">
                            {t('auth.login.title')}
                        </h2>
                    </div>

                    {serverError && (
                        <div className="alert alert-error mb-8">
                            <span>{serverError}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate className="space-y-6">
                        <div className="form-control">
                            <label htmlFor="email" className="label">
                                <span className="label-text font-semibold">
                                    {t('auth.login.email')} *
                                </span>
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
                                placeholder="Ingresa tu correo electrónico"
                            />
                            {errors.email && (
                                <span className="text-error text-sm mt-1">
                                    {errors.email}
                                </span>
                            )}
                        </div>

                        <div className="form-control">
                            <label htmlFor="password" className="label">
                                <span className="label-text font-semibold">
                                    {t('auth.login.password')} *
                                </span>
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`input input-bordered ${errors.password ? 'input-error' : ''}`}
                                placeholder="········"
                            />
                            {errors.password && (
                                <span className="text-error text-sm mt-1">
                                    {errors.password}
                                </span>
                            )}
                        </div>

                        <div className="flex justify-between items-center">
                            <label className="flex items-center">
                                <input 
                                    type="checkbox" 
                                    className="checkbox checkbox-sm"
                                />
                                <span className="ml-2 text-sm text-base-content/70">
                                    {t('auth.login.rememberMe')}
                                </span>
                            </label>
                            
                            <Link 
                                to="/forgot-password" 
                                className="text-sm text-primary font-semibold hover:text-primary-focus"
                            >
                                {t('auth.login.forgotPassword')}
                            </Link>
                        </div>

                        <div className="pt-15">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-full py-3 font-bold text-lg"
                            >
                                {loading ? t('common.loading') : t('auth.login.submit')}
                            </button>
                        </div>

                        <div className="text-center pt-8">
                            <p className="text-base-content/70">
                                {t('auth.login.noAccount')}{' '}
                                <Link
                                    to="/register"
                                    className="text-primary font-bold hover:text-primary-focus text-lg"
                                >
                                    {t('auth.login.registerLink')}
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}