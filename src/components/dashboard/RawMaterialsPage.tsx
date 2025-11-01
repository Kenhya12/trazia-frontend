import React, { useState, useEffect } from 'react';
import type { RawMaterial, Supplier } from '../../types.ts';
import Table from '../ui/Table';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { MOCK_RAW_MATERIALS, MOCK_SUPPLIERS, ListBulletIcon, PlusCircleIcon, ClockIcon } from '../../constants';

type RawMaterialTab = 'list' | 'add' | 'history';

interface RawMaterialsPageProps {
    initialTab: 'list' | 'add';
}

const RawMaterialsPage: React.FC<RawMaterialsPageProps> = ({ initialTab }) => {
  const [activeTab, setActiveTab] = useState<RawMaterialTab>(initialTab);
  const [materials, setMaterials] = useState<RawMaterial[]>(MOCK_RAW_MATERIALS);
  const [suppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [newMaterial, setNewMaterial] = useState<Omit<RawMaterial, 'id'>>({
    name: '',
    supplierId: suppliers[0]?.id || '',
    internalCode: '',
    unit: 'kg',
    category: '',
    minStock: 0,
    currentStock: 0,
  });

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setNewMaterial(prev => ({
        ...prev,
        [name]: isNumber ? parseFloat(value) || 0 : value
    }));
  };

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    const materialToAdd: RawMaterial = {
        id: `RM${Date.now()}`,
        ...newMaterial
    };
    setMaterials(prev => [...prev, materialToAdd]);
    // Reset form
    setNewMaterial({
        name: '', supplierId: suppliers[0]?.id || '', internalCode: '', unit: 'kg', category: '', minStock: 0, currentStock: 0,
    });
    setActiveTab('list'); // Switch back to list view
  };

  const columns = [
    { header: 'Nombre', accessor: 'name' as keyof RawMaterial },
    { 
      header: 'Proveedor', 
      accessor: 'supplierId' as keyof RawMaterial,
      render: (item: RawMaterial) => suppliers.find(s => s.id === item.supplierId)?.name || 'N/A'
    },
    { header: 'Código Interno', accessor: 'internalCode' as keyof RawMaterial },
    { 
      header: 'Stock Actual', 
      accessor: 'currentStock' as keyof RawMaterial,
      render: (item: RawMaterial) => (
        <span className={item.currentStock < item.minStock ? 'text-red-600 font-bold' : ''}>
          {item.currentStock} {item.unit}
        </span>
      )
    },
    { 
        header: 'Stock Mínimo', 
        accessor: 'minStock' as keyof RawMaterial,
        render: (item: RawMaterial) => `${item.minStock} ${item.unit}`
    },
    {
      header: 'Acciones',
      accessor: 'id' as keyof RawMaterial,
      render: (item: RawMaterial) => (
        <div className="space-x-2">
            <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); alert(`Editing ${item.name}`)}}>Editar</Button>
            <Button size="sm" variant="danger" onClick={(e) => { e.stopPropagation(); alert(`Deleting ${item.name}`)}}>Eliminar</Button>
        </div>
      ),
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'list':
        return <Table<RawMaterial> columns={columns} data={materials} />;
      case 'add':
        return (
            <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Agregar Nueva Materia Prima</h3>
                <form onSubmit={handleAddMaterial} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Nombre Materia Prima" id="name" name="name" value={newMaterial.name} onChange={handleInputChange} required />
                        <div>
                            <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                            <select id="supplierId" name="supplierId" value={newMaterial.supplierId} onChange={handleInputChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm focus:ring-slate-500 focus:border-slate-500 bg-white">
                                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <Input label="Código Interno" id="internalCode" name="internalCode" value={newMaterial.internalCode} onChange={handleInputChange} required />
                         <div>
                            <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">Unidad de Medida</label>
                            <select id="unit" name="unit" value={newMaterial.unit} onChange={handleInputChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm focus:ring-slate-500 focus:border-slate-500 bg-white">
                                <option value="kg">Kilogramos (kg)</option>
                                <option value="g">Gramos (g)</option>
                                <option value="L">Litros (L)</option>
                                <option value="ml">Mililitros (ml)</option>
                                <option value="unit">Unidad (unit)</option>
                            </select>
                        </div>
                        <Input label="Categoría" id="category" name="category" value={newMaterial.category} onChange={handleInputChange} />
                        <Input label="Stock Mínimo" id="minStock" name="minStock" type="number" value={newMaterial.minStock} onChange={handleInputChange} required />
                        <Input label="Stock Actual" id="currentStock" name="currentStock" type="number" value={newMaterial.currentStock} onChange={handleInputChange} required />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setActiveTab('list')}>Cancelar</Button>
                        <Button type="submit">Guardar Materia Prima</Button>
                    </div>
                </form>
            </div>
        );
      case 'history':
        return <p className="text-gray-600 bg-white p-6 rounded-lg shadow-md">El historial de lotes y entradas estará disponible aquí.</p>;
      default:
        return null;
    }
  };

  const TabButton = ({ id, icon, label }: { id: RawMaterialTab; icon: React.ReactNode; label: string }) => (
    <button onClick={() => setActiveTab(id)} className={`flex items-center space-x-2 py-2 px-4 text-sm font-medium ${activeTab === id ? 'border-b-2 border-slate-700 text-slate-700' : 'text-gray-500 hover:text-gray-700'}`}>
        {icon}
        <span>{label}</span>
    </button>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex border-b border-gray-300">
          <TabButton id="list" icon={<ListBulletIcon className="w-5 h-5"/>} label="Listado de Materias Primas" />
          <TabButton id="add" icon={<PlusCircleIcon className="w-5 h-5"/>} label="Agregar Nueva" />
          <TabButton id="history" icon={<ClockIcon className="w-5 h-5"/>} label="Historial de Entradas / Lotes" />
        </div>
      </div>

      <div className="mt-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default RawMaterialsPage;