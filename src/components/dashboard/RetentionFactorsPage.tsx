import React, { useState } from 'react';
import type { RetentionFactor } from '../../types.ts';
import Table from '../ui/Table';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { MOCK_RETENTION_FACTORS, CalculatorIcon, PencilIcon, ArrowsRightLeftIcon } from '../../constants';

const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.033c-1.12 0-2.033.954-2.033 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
);

const RetentionFactorsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [factors, setFactors] = useState<RetentionFactor[]>(MOCK_RETENTION_FACTORS);
  const [jsonConfig, setJsonConfig] = useState(JSON.stringify(MOCK_RETENTION_FACTORS, null, 2));
  const [importError, setImportError] = useState('');

  const handleFactorChange = (index: number, field: keyof RetentionFactor, value: string | number) => {
    const newFactors = [...factors];
    newFactors[index] = { ...newFactors[index], [field]: value };
    setFactors(newFactors);
  };

  const addFactor = () => {
    setFactors([...factors, { id: `RF${Date.now()}`, name: 'Nuevo Factor', factor: 1.0 }]);
  };

  const removeFactor = (id: string) => {
    setFactors(factors.filter(f => f.id !== id));
  };
  
  const handleSaveChanges = () => {
    // In a real app, this would be an API call
    alert('Cambios guardados!');
    setJsonConfig(JSON.stringify(factors, null, 2)); // Update JSON view
  };

  const handleImport = () => {
    try {
      const parsedFactors = JSON.parse(jsonConfig);
      // Basic validation
      if (Array.isArray(parsedFactors) && parsedFactors.every(f => 'id' in f && 'name' in f && 'factor' in f)) {
        setFactors(parsedFactors);
        setImportError('');
        alert('Configuración importada con éxito!');
        setActiveTab('list');
      } else {
        throw new Error('El formato del JSON no es válido.');
      }
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Error al procesar el JSON.');
    }
  };

  const columns = [
    { header: 'Nombre del Factor', accessor: 'name' as keyof RetentionFactor },
    { header: 'Factor (ej. 0.90)', accessor: 'factor' as keyof RetentionFactor },
    {
      header: 'Acciones',
      accessor: 'id' as keyof RetentionFactor,
      render: (item: RetentionFactor) => (
        <Button size="sm" variant="secondary" onClick={() => setActiveTab('edit')}>Editar</Button>
      ),
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'list':
        return <Table<RetentionFactor> columns={columns} data={factors} />;
      case 'edit':
        return (
            <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Editar Factores de Retención</h3>
                <div className="space-y-3">
                {factors.map((factor, index) => (
                    <div key={factor.id} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-6">
                            <Input label="" id={`name-${index}`} value={factor.name} onChange={(e) => handleFactorChange(index, 'name', e.target.value)} />
                        </div>
                        <div className="col-span-5">
                            <Input label="" id={`factor-${index}`} type="number" step="0.01" value={factor.factor} onChange={(e) => handleFactorChange(index, 'factor', parseFloat(e.target.value) || 0)} />
                        </div>
                        <div className="col-span-1">
                            <button onClick={() => removeFactor(factor.id)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon className="w-5 h-5"/></button>
                        </div>
                    </div>
                ))}
                </div>
                <div className="mt-4 flex justify-between">
                    <Button variant="secondary" onClick={addFactor}>+ Añadir Factor</Button>
                    <Button onClick={handleSaveChanges}>Guardar Cambios</Button>
                </div>
            </div>
        );
      case 'import_export':
        return (
            <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Exportar Configuración</h3>
                    <p className="text-sm text-gray-600 mb-2">Copia el siguiente texto JSON para guardar tu configuración actual.</p>
                    <textarea value={jsonConfig} readOnly className="w-full h-40 p-2 border rounded-md bg-gray-50 font-mono text-sm" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Importar Configuración</h3>
                    <p className="text-sm text-gray-600 mb-2">Pega una configuración JSON válida en el siguiente campo y haz clic en importar.</p>
                    <textarea value={jsonConfig} onChange={(e) => setJsonConfig(e.target.value)} className="w-full h-40 p-2 border rounded-md font-mono text-sm" />
                    {importError && <p className="text-red-500 text-sm mt-1">{importError}</p>}
                    <div className="mt-2 flex justify-end">
                        <Button onClick={handleImport}>Importar JSON</Button>
                    </div>
                </div>
            </div>
        );
      default:
        return null;
    }
  };

  type TabId = 'list' | 'edit' | 'import_export';
  const TabButton = ({ id, icon, label }: { id: TabId; icon: React.ReactNode; label: string }) => (
    <button onClick={() => setActiveTab(id)} className={`flex items-center space-x-2 py-2 px-4 text-sm font-medium ${activeTab === id ? 'border-b-2 border-slate-700 text-slate-700' : 'text-gray-500 hover:text-gray-700'}`}>
        {icon}
        <span>{label}</span>
    </button>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex border-b border-gray-300">
            <TabButton id="list" icon={<CalculatorIcon className="w-5 h-5"/>} label="Lista de Factores" />
            <TabButton id="edit" icon={<PencilIcon className="w-5 h-5"/>} label="Editar Configuración" />
            <TabButton id="import_export" icon={<ArrowsRightLeftIcon className="w-5 h-5"/>} label="Importar / Exportar JSON" />
        </div>
      </div>

      <div className="mt-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default RetentionFactorsPage;