import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import type { User } from '../../types';
import { authApi } from '../../api/authApi';
import { StorageService } from '../../services/storage.service';

interface RegisterPageProps {
  onRegisterSuccess: (data: Omit<User, 'id' | 'role' | 'avatarUrl' | 'hasCompanySetup'>) => void;
  onSwitchToLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setError('');
    try {
      const response = await authApi.register({ username: name, email, password });
      StorageService.setToken(response.token);
      // StorageService.setRefreshToken(response.refreshToken); //
      StorageService.setUsername(response.username || name);
      onRegisterSuccess({ username: response.username || name, email: response.email || email, password });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar el usuario.');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1661956600040-65a77a8c6f87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NjE0NzZ8MHwxfHNlYXJjaHwxfHxjYXJkb24lMjBhbmQlMjBmcmV1dG98ZW58MHx8fHwxNjgwOTk3MjQ1&ixlib=rb-4.0.3&q=80&w=1080')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-white/50"></div>
      <div className="relative max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Crear Cuenta en Trazia</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input label="Nombre Completo" id="fullname" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Correo Electrónico" id="email" type="email" placeholder="usuario@empresa.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Contraseña" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Input label="Confirmar Contraseña" id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          {error && <p className="mt-2 text-sm text-red-600 text-center">{error}</p>}
          <div className="mt-6">
            <Button type="submit" className="w-full">
              Crear cuenta
            </Button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <button onClick={onSwitchToLogin} className="font-medium text-slate-600 hover:text-slate-500">
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;