import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/auth.service";

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
        <p style={{ color: colors[score], fontWeight: 'bold', marginTop: '0.25rem' }}>
            {t('validation.password.strength.label')}: {labels[score]}
        </p>
    );
}

const MAX_PASSWORD_ATTEMPTS = 5;
const ATTEMPTS_STORAGE_KEY = 'register_password_attempts';

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
    const [passwordAttempts, setPasswordAttempts] = useState(() => {
        const stored = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
        return stored ? parseInt(stored, 10) : 0;
    });

    const navigate = useNavigate();
    const { login: authLogin } = useAuth();  // ✅ CAMBIO AQUÍ

    const passwordStrengthScore = getPasswordStrength(formData.password);
    const isBlocked = passwordAttempts >= MAX_PASSWORD_ATTEMPTS;

    useEffect(() => {
        localStorage.setItem(ATTEMPTS_STORAGE_KEY, passwordAttempts.toString());
    }, [passwordAttempts]);

    useEffect(() => {
        if (isBlocked) {
            setServerError(t('validation.password.maxAttemptsReached'));
        }
    }, [isBlocked, t]);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");

        if (isBlocked) {
            setServerError(t('validation.password.maxAttemptsReached'));
            return;
        }

        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);

            if (validationErrors.password) {
                const newAttempts = passwordAttempts + 1;
                setPasswordAttempts(newAttempts);

                if (newAttempts >= MAX_PASSWORD_ATTEMPTS) {
                    setServerError(t('validation.password.maxAttemptsReached'));
                } else {
                    const remaining = MAX_PASSWORD_ATTEMPTS - newAttempts;
                    setServerError(t('validation.password.attemptsRemaining', { remaining }));
                }
            }
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword: _, ...dataToSend } = formData;
            const response = await authService.register(dataToSend);

            // Limpiar intentos al registrarse correctamente
            localStorage.removeItem(ATTEMPTS_STORAGE_KEY);
            
            // ✅ CAMBIO AQUÍ - Usar el login del hook
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
        <div>
            <h2>{t('auth.register.title')}</h2>

            <form onSubmit={handleSubmit} noValidate>
                {serverError && (
                    <div style={{
                        color: 'red',
                        marginBottom: '10px',
                        fontWeight: 'bold',
                        padding: '10px',
                        backgroundColor: '#ffe6e6',
                        borderRadius: '4px',
                        border: '1px solid red'
                    }}>
                        {serverError}
                    </div>
                )}

                <div>
                    <label htmlFor="username">{t('auth.register.username')}</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        disabled={isBlocked}
                        aria-invalid={errors.username ? "true" : "false"}
                    />
                    {errors.username && (
                        <span style={{ color: 'red', fontSize: '12px' }}>
                            {errors.username}
                        </span>
                    )}
                </div>

                <div>
                    <label htmlFor="email">{t('auth.register.email')}</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isBlocked}
                        aria-invalid={errors.email ? "true" : "false"}
                    />
                    {errors.email && (
                        <span style={{ color: 'red', fontSize: '12px' }}>
                            {errors.email}
                        </span>
                    )}
                </div>

                <div>
                    <label htmlFor="password">{t('auth.register.password')}</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={isBlocked}
                        aria-invalid={errors.password ? "true" : "false"}
                        aria-describedby="password-strength"
                    />
                    {errors.password && (
                        <span style={{ color: 'red', fontSize: '12px' }}>
                            {errors.password}
                        </span>
                    )}
                    {!isBlocked && <PasswordStrengthIndicator score={passwordStrengthScore} t={t} />}
                </div>

                <div>
                    <label htmlFor="confirmPassword">{t('auth.register.confirmPassword')}</label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={isBlocked}
                        aria-invalid={errors.confirmPassword ? "true" : "false"}
                    />
                    {errors.confirmPassword && (
                        <span style={{ color: 'red', fontSize: '12px' }}>
                            {errors.confirmPassword}
                        </span>
                    )}
                </div>

                <button type="submit" disabled={loading || isBlocked}>
                    {loading ? t('auth.register.loading') : t('auth.register.submit')}
                </button>

                <div>
                    <p>{t('auth.register.hasAccount')} <Link to="/login">{t('auth.register.loginLink')}</Link></p>
                </div>
            </form>
        </div>
    );
}
