import React, { useState } from 'react';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import CompanyRegistrationPage from './components/auth/CompanyRegistrationPage';
import DashboardPage from './components/dashboard/DashboardPage';
import type { User, Company } from './types';

type View = 'login' | 'register' | 'company_setup' | 'dashboard';

const App: React.FC = () => {
  const [view, setView] = useState<View>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]); 
  const [loginStatusMessage, setLoginStatusMessage] = useState('');

  const handleRegister = (newUserData: Omit<User, 'id' | 'role' | 'avatarUrl' | 'hasCompanySetup'>) => {
    if (users.find(u => u.email === newUserData.email)) {
      alert('El correo electrónico ya está en uso.');
      return;
    }

    const newUser: User = {
      id: `u${users.length + 1}`,
      name: newUserData.name,
      email: newUserData.email,
      password: newUserData.password,
      role: 'admin',
      avatarUrl: null,
      hasCompanySetup: true, // ← MARCAR COMO QUE YA TIENE EMPRESA CONFIGURADA
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setLoginStatusMessage('¡Registro exitoso!');
    setView('dashboard'); // ← IR DIRECTAMENTE AL DASHBOARD
  };

  const handleLogin = (credentials: { email: string; password?: string }) => {
    // SOLUCIÓN TEMPORAL: Ir directamente al dashboard sin verificar usuario
    console.log('✅ Login exitoso, redirigiendo a dashboard...');
    
    // Crear usuario temporal basado en el email
    const tempUser: User = {
      id: `u${Date.now()}`,
      name: credentials.email.split('@')[0], // Usar parte del email como nombre
      email: credentials.email,
      password: credentials.password,
      role: 'admin',
      avatarUrl: null,
      hasCompanySetup: true, // ← MARCAR COMO QUE YA TIENE EMPRESA
    };
    
    setCurrentUser(tempUser);
    setView('dashboard'); // ← REDIRIGIR DIRECTAMENTE AL DASHBOARD
    setLoginStatusMessage('');
    return true;
  };

  const handleCompanySetup = (companyData: Omit<Company, 'logoUrl'>) => {
    if (currentUser) {
      console.log("Company data saved:", companyData);

      const updatedUser = { ...currentUser, hasCompanySetup: true };
      setCurrentUser(updatedUser);
      setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updatedUser : u));

      setView('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('login');
  };

  const handleUserUpdate = (updatedData: Partial<User>) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updatedData };
      setCurrentUser(updatedUser);
      setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updatedUser : u));
    }
  };

  const renderView = () => {
    switch(view) {
      case 'login':
        return <LoginPage onLoginSuccess={handleLogin} onSwitchToRegister={() => setView('register')} statusMessage={loginStatusMessage} />;
      case 'register':
        return <RegisterPage onRegisterSuccess={handleRegister} onSwitchToLogin={() => setView('login')} />;
      case 'company_setup':
        return <CompanyRegistrationPage onSetupSuccess={handleCompanySetup} />;
      case 'dashboard':
        return currentUser ? <DashboardPage user={currentUser} onLogout={handleLogout} onUserUpdate={handleUserUpdate} /> : null;
      default:
        return <LoginPage onLoginSuccess={handleLogin} onSwitchToRegister={() => setView('register')} />;
    }
  };

  return <div className="min-h-screen">{renderView()}</div>;
};

export default App;