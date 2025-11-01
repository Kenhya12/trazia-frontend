import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import type { Company } from '../../types.js';
import { companyApi } from '../../api/companyApi.js';

interface CompanyRegistrationPageProps {
  onSetupSuccess: (companyData: Omit<Company, 'logoUrl'>) => void;
}

const CompanyRegistrationPage: React.FC<CompanyRegistrationPageProps> = ({ onSetupSuccess }) => {
  // Use businessName instead of name to match CompanyData
  const [formData, setFormData] = useState({
    businessName: '',
    taxId: '',
    address: '',
    country: '',
    phone: '',
    email: '',
    sector: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await companyApi.register(formData);
      // Map response to match Omit<Company, 'logoUrl'>
      const mappedResponse: Omit<Company, 'logoUrl'> = {
        name: response.businessName,
        taxId: response.taxId,
        address: response.address,
        country: response.country,
        phone: response.phone,
        email: response.email,
        sector: response.sector,
      };
      onSetupSuccess(mappedResponse);
    } catch (error) {
      console.error('Error registering company:', error);
    }
  };

  const handleSkip = () => {
    // Crear datos de empresa temporales para permitir continuar
    const tempCompany: Omit<Company, 'logoUrl'> = {
      name: 'Mi Empresa',
      taxId: 'TEMP-001',
      address: 'Por definir',
      country: 'España',
      phone: 'Por definir',
      email: 'empresa@temp.com',
      sector: 'Por definir'
    };
    console.log('⏭️ Saltando registro de empresa, continuando al dashboard...');
    onSetupSuccess(tempCompany);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">¡Un último paso!</h2>
        <p className="text-center text-gray-600 mb-6">Registra los datos de tu empresa o configura más tarde.</p>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input label="Nombre de la Empresa" id="companyName" name="businessName" value={formData.businessName} onChange={handleChange} required />
            <Input label="CIF / NIF" id="taxId" name="taxId" value={formData.taxId} onChange={handleChange} required />
            <Input label="Dirección" id="address" name="address" value={formData.address} onChange={handleChange} required />
            <Input label="País" id="country" name="country" value={formData.country} onChange={handleChange} required />
            <Input label="Teléfono" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
            <Input label="Correo Electrónico de la Empresa" id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            <Input label="Sector" id="sector" name="sector" value={formData.sector} onChange={handleChange} required />
          </div>
          <div className="mt-6">
            <Button type="submit" className="w-full">
              Guardar y continuar
            </Button>
          </div>
        </form>

        {/* BOTÓN PARA SALTAR REGISTRO */}
        <div className="mt-4 text-center">
          <button 
            onClick={handleSkip}
            className="text-gray-500 hover:text-gray-700 underline text-sm"
          >
            Configurar empresa más tarde
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyRegistrationPage;