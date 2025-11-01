import React, { useState, useMemo } from 'react';
import type { RawMaterialLot } from '../../types.ts';
import Table from '../ui/Table';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { MOCK_BATCHES, MOCK_RAW_MATERIALS, MOCK_SUPPLIERS, ClipboardListIcon, PlusCircleIcon, ClockIcon } from '../../constants';

const RawMaterialBatchesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [batches, setBatches] = useState<RawMaterialLot[]>(MOCK_BATCHES);
  
  const getTodayDateString = () => new Date().toISOString().split('T')[0];

  const [newBatch, setNewBatch] = useState<Omit<RawMaterialLot, 'id'>>({
    lotNumber: '',
    rawMaterialId: MOCK_RAW_MATERIALS[0]?.id || '',
    supplierId: MOCK_SUPPLIERS[0]?.id || '',
    quantity: 0,
    purchaseDate: getTodayDateString(),
    receptionDate: getTodayDateString(),
    expiryDate: getTodayDateString(),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setNewBatch(prev => ({
        ...prev,
        [name]: isNumber ? parseFloat(value) || 0 : value
    }));
  };

  const handleAddBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const batchToAdd: RawMaterialLot = {
        id: `B${Date.now()}`,
        ...newBatch
    };
    setBatches(prev => [...prev, batchToAdd]);
    setActiveTab('list');
  };

  const getStatus = (expiryDate: string): { text: string; className: string } => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: 'Vencido', className: 'bg-red-100 text-red-800' };
    }
    if (diffDays <= 30) {
      return { text: `Vence en ${diffDays} días`, className: 'bg-yellow-100 text-yellow-800' };
    }
    return { text: 'OK', className: 'bg-green-100 text-green-800' };
  };

  const columns = [
    { header: 'Nº Lote', accessor: 'lotNumber' as keyof RawMaterialLot },
    { 
      header: 'Materia Prima', 
      accessor: 'rawMaterialId' as keyof RawMaterialLot,
      render: (item: RawMaterialLot) => MOCK_RAW_MATERIALS.find(m => m.id === item.rawMaterialId)?.name || 'N/A'
    },
     { 
      header: 'Proveedor', 
      accessor: 'supplierId' as keyof RawMaterialLot,
      render: (item: RawMaterialLot) => MOCK_SUPPLIERS.find(s => s.id === item.supplierId)?.name || 'N/A'
    },
    { header: 'Fecha Vencimiento', accessor: 'expiryDate' as keyof RawMaterialLot },
    {
      header: 'Estado',
      accessor: 'id' as keyof RawMaterialLot,
      render: (item: RawMaterialLot) => {
        const status = getStatus(item.expiryDate);
        return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.className}`}>{status.text}</span>
      }
    },
    {
      header: 'Acciones',
      accessor: 'id' as keyof RawMaterialLot,
      render: (item: RawMaterialLot) => (
        <div className="space-x-2">
            <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); alert(`Viewing ${item.lotNumber}`)}}>Ver</Button>
        </div>
      ),
    },
  ];

  const expiringBatches = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    return batches.filter(batch => {
        const expiryDate = new Date(batch.expiryDate);
        return expiryDate >= today && expiryDate <= thirtyDaysFromNow;
    });
  }, [batches]);

  const renderContent = () => {
    switch (activeTab) {
      case 'list':
        return <Table<RawMaterialLot> columns={columns} data={batches} />;
      case 'add':
        return (
            <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Registrar Nuevo Lote de Materia Prima</h3>
                <form onSubmit={handleAddBatch} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <Input label="Número de Lote" id="lotNumber" name="lotNumber" value={newBatch.lotNumber} onChange={handleInputChange} required />
                       <div>
                           <label htmlFor="rawMaterialId" className="block text-sm font-medium text-gray-700 mb-1">Materia Prima Asociada</label>
                           <select id="rawMaterialId" name="rawMaterialId" value={newBatch.rawMaterialId} onChange={handleInputChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm focus:ring-slate-500 focus:border-slate-500 bg-white">
                               {MOCK_RAW_MATERIALS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                           </select>
                       </div>
                       <div>
                           <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                           <select id="supplierId" name="supplierId" value={newBatch.supplierId} onChange={handleInputChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm focus:ring-slate-500 focus:border-slate-500 bg-white">
                               {MOCK_SUPPLIERS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                           </select>
                       </div>
                       <Input label="Cantidad" id="quantity" name="quantity" type="number" value={newBatch.quantity} onChange={handleInputChange} required />
                       <Input label="Fecha de Compra" id="purchaseDate" name="purchaseDate" type="date" value={newBatch.purchaseDate} onChange={handleInputChange} required />
                       <Input label="Fecha de Recepción" id="receptionDate" name="receptionDate" type="date" value={newBatch.receptionDate} onChange={handleInputChange} required />
                       <Input label="Fecha de Vencimiento" id="expiryDate" name="expiryDate" type="date" value={newBatch.expiryDate} onChange={handleInputChange} required />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setActiveTab('list')}>Cancelar</Button>
                        <Button type="submit">Guardar Lote</Button>
                    </div>
                </form>
            </div>
        );
      case 'expiring':
        return <Table<RawMaterialLot> columns={columns} data={expiringBatches} />;
      default:
        return null;
    }
  };

  type TabId = 'list' | 'add' | 'expiring';
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
          <TabButton id="list" icon={<ClipboardListIcon className="w-5 h-5"/>} label="Todos los Lotes" />
          <TabButton id="add" icon={<PlusCircleIcon className="w-5 h-5"/>} label="Registrar Lote Nuevo" />
          <TabButton id="expiring" icon={<ClockIcon className="w-5 h-5"/>} label="Lotes Próximos a Vencer" />
        </div>
      </div>

      <div className="mt-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default RawMaterialBatchesPage;