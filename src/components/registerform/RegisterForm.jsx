import React from 'react';

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/authService";

function getPasswordStrength(password) {
    let score = 0;
    if (!password) return score;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[\W_]/.test(password)) score++;
    return score;
}

function PasswordStrengthIndicator({ score, t }) {
    const labels = [
        t('validation.password.strength.veryWeak'),
        t('validation.password.strength.weak'),
        t('validation.password.strength.medium'),
        t('validation.password.strength.strong'),
        t('validation.password.strength.veryStrong')
    ];
    const colors = ['#FF4E42', '#FF7F50', '#FFA500', '#9ACD32', '#4CAF50'];
    return (
        <div className="flex items-center mt-2">
            <span className="text-sm mr-2">⭐</span>
            <span className="text-sm font-medium" style={{ color: colors[score] }}>
                {labels[score]}
            </span>
        </div>
    );
}

export function RegisterForm() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login: authLogin } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
        setFormData({ ...formData, [name]: value });
    };

    const passwordStrengthScore = getPasswordStrength(formData.password);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username) {
            newErrors.username = t('validation.username.required');
        } else if (formData.username.length < 3) {
            newErrors.username = t('validation.username.minLength');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = t('validation.email.required');
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = t('validation.email.invalid');
        }

        if (!formData.password) {
            newErrors.password = t('validation.password.required');
        } else if (formData.password.length < 8) {
            newErrors.password = t('validation.password.minLength');
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = t('validation.password.weak');
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = t('validation.confirmPassword.required');
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = t('validation.confirmPassword.mismatch');
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
            const response = await authService.register(formData);
            console.log('Registro exitoso:', response);

            const loginResult = await authLogin({
                email: formData.email,
                password: formData.password
            });

            if (loginResult.success) {
                navigate("/dashboard");
            } else {
                setServerError(loginResult.error || t('auth.register.errors.serverError'));
            }
        } catch (err) {
            if (err.response?.status === 409) {
                setServerError(t('auth.register.errors.emailExists'));
            } else if (err.response?.status === 400) {
                setServerError(t('auth.register.errors.invalidData'));
            } else {
                setServerError(t('auth.register.errors.serverError'));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex w-full">
            {/* Imagen de fondo - CON IMAGEN TEMPORAL QUE SÍ FUNCIONA */}
            <div className="hidden lg:block lg:flex-1">
                <div
                    className="h-full w-full bg-cover bg-center"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80")'
                    }}
                />
            </div>

            {/* Formulario - lado derecho (40%) */}
            <div className="flex-1 lg:flex-none lg:w-2/5 flex items-center justify-center p-8 bg-base-100">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-black text-base-content">Trazia</h1>
                        <h2 className="text-xl font-bold text-base-content mt-6">
                            {t('auth.register.title')}
                        </h2>
                    </div>

                    {/* Mensaje de error del servidor */}
                    {serverError && (
                        <div className="alert alert-error mb-8">
                            {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate className="space-y-6">
                        {/* Campo Username */}
                        <div className="form-control">
                            <label htmlFor="username" className="label">
                                <span className="label-text font-semibold">
                                    {t('auth.register.username')} *
                                </span>
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                                className={`input input-bordered ${errors.username ? 'input-error' : ''}`}
                                placeholder="Enter your username"
                            />
                            {errors.username && (
                                <span className="text-error text-sm mt-1">
                                    {errors.username}
                                </span>
                            )}
                        </div>

                        {/* Campo Email */}
                        <div className="form-control">
                            <label htmlFor="email" className="label">
                                <span className="label-text font-semibold">
                                    {t('auth.register.email')} *
                                </span>
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
                                placeholder="Enter your email address"
                            />
                            {errors.email && (
                                <span className="text-error text-sm mt-1">
                                    {errors.email}
                                </span>
                            )}
                        </div>

                        {/* Campo Password */}
                        <div className="form-control">
                            <label htmlFor="password" className="label">
                                <span className="label-text font-semibold">
                                    {t('auth.register.password')} *
                                </span>
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`input input-bordered ${errors.password ? 'input-error' : ''}`}
                                placeholder="······"
                            />
                            {errors.password && (
                                <span className="text-error text-sm mt-1">
                                    {errors.password}
                                </span>
                            )}
                            {formData.password && (
                                <PasswordStrengthIndicator score={passwordStrengthScore} t={t} />
                            )}
                        </div>

                        {/* Campo Confirmar Password */}
                        <div className="form-control">
                            <label htmlFor="confirmPassword" className="label">
                                <span className="label-text font-semibold">
                                    {t('auth.register.confirmPassword')} *
                                </span>
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`input input-bordered ${errors.confirmPassword ? 'input-error' : ''}`}
                                placeholder="······"
                            />
                            {errors.confirmPassword && (
                                <span className="text-error text-sm mt-1">
                                    {errors.confirmPassword}
                                </span>
                            )}
                        </div>

                        {/* Botón de Registro con más espacio */}
                        <div className="pt-15">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-full py-3 font-bold text-lg"
                            >
                                {loading ? t('auth.register.loading') : t('auth.register.title')}
                            </button>
                        </div>

                        {/* Enlace a Login con más espacio */}
                        <div className="text-center pt-8">
                            <p className="text-base-content/70">
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    className="text-primary font-bold hover:text-primary-focus text-lg"
                                >
                                    Sign in instead
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}