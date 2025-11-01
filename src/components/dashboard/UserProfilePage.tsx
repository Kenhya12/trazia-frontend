import React, { useState, useEffect } from 'react';
import type { User } from '../../types.ts';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { UserCircleIcon, LockClosedIcon, PaintBrushIcon } from '../../constants';

interface UserProfilePageProps {
  user: User;
  onUserUpdate: (updatedUser: Partial<User>) => void;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ user, onUserUpdate }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [personalData, setPersonalData] = useState({ name: '', email: '', avatarUrl: null as string | null });
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [prefs, setPrefs] = useState({ theme: 'light', language: 'es' });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setPersonalData({ name: user.name, email: user.email, avatarUrl: user.avatarUrl });
      setAvatarPreview(user.avatarUrl);
    }
  }, [user]);

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handlePrefsChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setPrefs(prev => ({ ...prev, [name]: value }));
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        setPersonalData(prev => ({ ...prev, avatarUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };


  const handlePersonalSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUserUpdate(personalData);
    alert(`Datos guardados: Nombre - ${personalData.name}, Email - ${personalData.email}`);
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      alert('Las nuevas contraseñas no coinciden.');
      return;
    }
    alert('Contraseña cambiada con éxito.');
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  const handlePrefsSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Preferencias guardadas: Tema - ${prefs.theme}, Idioma - ${prefs.language}`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <form onSubmit={handlePersonalSave} className="space-y-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="User Avatar" className="w-24 h-24 rounded-full object-cover" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                      <UserCircleIcon className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </label>
                <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
              </div>
              <div className="flex-grow space-y-4">
                <Input label="Nombre Completo" id="name" name="name" value={personalData.name} onChange={handlePersonalChange} />
                <Input label="Correo Electrónico" id="email" name="email" type="email" value={personalData.email} onChange={handlePersonalChange} />
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <Button type="submit">Guardar Cambios</Button>
            </div>
          </form>
        );
      case 'password':
        return (
          <form onSubmit={handlePasswordSave} className="space-y-4">
            <Input label="Contraseña Actual" id="current" name="current" type="password" value={passwordData.current} onChange={handlePasswordChange} />
            <Input label="Nueva Contraseña" id="new" name="new" type="password" value={passwordData.new} onChange={handlePasswordChange} />
            <Input label="Confirmar Nueva Contraseña" id="confirm" name="confirm" type="password" value={passwordData.confirm} onChange={handlePasswordChange} />
            <div className="pt-2 flex justify-end">
              <Button type="submit">Cambiar Contraseña</Button>
            </div>
          </form>
        );
      case 'prefs':
        return (
          <form onSubmit={handlePrefsSave} className="space-y-6">
            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">Tema de la Interfaz</label>
              <select id="theme" name="theme" value={prefs.theme} onChange={handlePrefsChange} className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm focus:ring-slate-500 focus:border-slate-500 bg-white">
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
              </select>
            </div>
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Idioma</label>
              <select id="language" name="language" value={prefs.language} onChange={handlePrefsChange} className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm focus:ring-slate-500 focus:border-slate-500 bg-white">
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
            <div className="pt-2 flex justify-end">
              <Button type="submit">Guardar Preferencias</Button>
            </div>
          </form>
        );
      default:
        return null;
    }
  };

  type TabId = 'personal' | 'password' | 'prefs';
  const TabButton = ({ id, icon, label }: { id: TabId; icon: React.ReactNode; label: string }) => (
    <button onClick={() => setActiveTab(id)} className={`flex items-center space-x-2 py-2 px-4 text-sm font-medium ${activeTab === id ? 'border-b-2 border-slate-700 text-slate-700' : 'text-gray-500 hover:text-gray-700'}`}>
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div>
      <div className="flex border-b border-gray-300">
        <TabButton id="personal" icon={<UserCircleIcon className="w-5 h-5" />} label="Datos Personales" />
        <TabButton id="password" icon={<LockClosedIcon className="w-5 h-5" />} label="Cambiar Contraseña" />
        <TabButton id="prefs" icon={<PaintBrushIcon className="w-5 h-5" />} label="Preferencias" />
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default UserProfilePage;