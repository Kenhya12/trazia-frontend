import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { authApi } from '../../api/authApi';
import { StorageService } from '../../services/storage.service';

interface LoginPageProps {
  onLoginSuccess: (credentials: { email: string, password?: string }) => boolean;
  onSwitchToRegister: () => void;
  statusMessage?: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onSwitchToRegister, statusMessage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  try {
    const response = await authApi.login({ email, password });
    StorageService.setToken(response.token);
    StorageService.setRefreshToken(response.refreshToken);
    StorageService.setUsername(response.username);
    
    // Llama a onLoginSuccess pero no dependas del return value
    onLoginSuccess({ email, password });
    
    // Redirige directamente aquí
    // window.location.href = '/dashboard'; // O la ruta que corresponda
    
  } catch (err: any) {
    setError(err?.response?.data?.message || 'Credenciales incorrectas.');
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Iniciar Sesión en Trazia</h2>
        
        {statusMessage && <p className="mb-4 text-center text-sm font-medium text-green-600 bg-green-50 p-3 rounded-md">{statusMessage}</p>}
        {error && <p className="mb-4 text-center text-sm font-medium text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input label="Correo Electrónico" id="email" type="email" placeholder="usuario@empresa.com" value={email} onChange={e => setEmail(e.target.value)} required />
            <Input label="Contraseña" id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div className="mt-6">
            <Button type="submit" className="w-full">
              Iniciar Sesión
            </Button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          ¿No tienes una cuenta?{' '}
          <button onClick={onSwitchToRegister} className="font-medium text-slate-600 hover:text-slate-500">
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;