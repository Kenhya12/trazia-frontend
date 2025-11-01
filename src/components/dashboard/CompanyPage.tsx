import React, { useState, useEffect } from 'react';
import type { Company, User } from '../../types.ts';
import Table from '../ui/Table';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { MOCK_COMPANY, MOCK_USERS, ImageIcon, BuildingOfficeIcon, UsersIcon, ChartIcon } from '../../constants';

type CompanyPageTab = 'info' | 'users' | 'params';

interface CompanyPageProps {
  initialTab: 'info' | 'users';
}

const CompanyPage: React.FC<CompanyPageProps> = ({ initialTab }) => {
  const [activeTab, setActiveTab] = useState<CompanyPageTab>(initialTab);
  const [companyData, setCompanyData] = useState<Company>(MOCK_COMPANY);
  const [logoPreview, setLogoPreview] = useState<string | null>(MOCK_COMPANY.logoUrl);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        setCompanyData(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Información de la empresa guardada!');
    // Here you would make an API call to save the data
  };

  const roleStyles: Record<User['role'], string> = {
    admin: 'bg-blue-100 text-blue-800',
    operator: 'bg-green-100 text-green-800',
  };

  const userColumns = [
    { header: 'Nombre', accessor: 'name' as keyof User },
    { header: 'Email', accessor: 'email' as keyof User },
    {
      header: 'Rol',
      accessor: 'role' as keyof User,
      render: (item: User) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${roleStyles[item.role]}`}>
          {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
        </span>
      )
    },
    {
      header: 'Acciones',
      accessor: 'id' as keyof User,
      render: (item: User) => (
        <Button size="sm" variant="secondary" onClick={() => alert(`Editando usuario ${item.name}`)}>Editar Permisos</Button>
      ),
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Información General de la Empresa</h3>
            <form onSubmit={handleSaveChanges} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="grow space-y-4">
                  <Input label="Nombre de Empresa" id="name" name="name" value={companyData.name} onChange={handleInputChange} />
                  <Input label="CIF/NIF" id="taxId" name="taxId" value={companyData.taxId} onChange={handleInputChange} />
                  <Input label="Dirección" id="address" name="address" value={companyData.address} onChange={handleInputChange} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Email de Contacto" id="email" name="email" type="email" value={companyData.email} onChange={handleInputChange} />
                    <Input label="Teléfono" id="phone" name="phone" value={companyData.phone} onChange={handleInputChange} />
                  </div>
                  <Input label="Sector" id="sector" name="sector" value={companyData.sector} onChange={handleInputChange} />
                </div>
                <div className="w-full md:w-48 shrink-0 text-center">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                  <div className="relative w-32 h-32 mx-auto border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-slate-500">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain rounded-lg" />
                    ) : (
                      <div className="text-gray-400 text-center p-2">
                        <ImageIcon className="w-8 h-8 mx-auto" />
                        <span className="text-xs mt-1 block">Subir imagen</span>
                      </div>
                    )}
                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" onChange={handleLogoChange} />
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit">Guardar Cambios</Button>
              </div>
            </form>
          </div>
        );
      case 'params':
        return <div className="bg-white p-6 rounded-lg shadow-md"><p>Los parámetros de producción se configurarán aquí.</p></div>;
      case 'users':
        return (
          <div>
            <div className="flex justify-end mb-4">
              <Button>+ Invitar Usuario</Button>
            </div>
            <Table<User> columns={userColumns} data={MOCK_USERS} />
          </div>
        );
      default:
        return null;
    }
  };

  const TabButton = ({ id, icon, label }: { id: CompanyPageTab; icon: React.ReactNode; label: string }) => (
    <button onClick={() => setActiveTab(id)} className={`flex items-center space-x-2 py-2 px-4 text-sm font-medium ${activeTab === id ? 'border-b-2 border-slate-700 text-slate-700' : 'text-gray-500 hover:text-gray-700'}`}>
      {icon}
      <span>{label}</span>
    </button>
  );


  return (
    <div>
      <div className="flex border-b border-gray-300">
        <TabButton id="info" icon={<BuildingOfficeIcon className="w-5 h-5" />} label="Información General" />
        <TabButton id="params" icon={<ChartIcon className="w-5 h-5" />} label="Parámetros de Producción" />
        <TabButton id="users" icon={<UsersIcon className="w-5 h-5" />} label="Usuarios y Permisos" />
      </div>

      <div className="mt-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default CompanyPage;