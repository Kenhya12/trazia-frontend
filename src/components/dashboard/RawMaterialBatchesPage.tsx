import React, { useState, useMemo } from 'react';
import type { RawMaterialLot as RawMaterialLotBase } from '../../types.ts';
import Table from '../ui/Table';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { ClipboardListIcon, PlusCircleIcon, ClockIcon } from '../../constants';
import mockup from '../../mock/mockup.json';
const MOCK_BATCHES = mockup.batches;
const MOCK_RAW_MATERIALS = mockup.rawMaterials;
const MOCK_SUPPLIERS = mockup.suppliers;
type RawMaterialLotUnit = "L" | "kg" | "g" | "ml" | "unit";
type RawMaterialLot = Omit<RawMaterialLotBase, 'unit' | 'documents'> & {
  unit: RawMaterialLotUnit;
  documents: string[];
};
const MOCK_UNITS: Array<RawMaterialLot['unit']> = ['kg', 'g', 'L', 'ml', 'unit'];

const RawMaterialBatchesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('list');
  const MOCK_BATCHES: RawMaterialLot[] = mockup.batches as RawMaterialLot[];
  const [batches, setBatches] = useState<RawMaterialLot[]>(MOCK_BATCHES);
  
  const getTodayDateString = () => new Date().toISOString().split('T')[0];

  const [newBatch, setNewBatch] = useState<Omit<RawMaterialLot, 'id'>>({
    invoiceNumber: '',
    batchNumber: '',
    name: '',
    supplierId: MOCK_SUPPLIERS[0]?.id || '',
    rawMaterialId: MOCK_RAW_MATERIALS[0]?.id || '',
    quantity: 0,
    unit: MOCK_UNITS[0],
    receivingDate: getTodayDateString(),
    expirationDate: getTodayDateString(),
    documents: [],
    comments: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name === 'unit') {
      setNewBatch(prev => ({
        ...prev,
        unit: value as RawMaterialLotUnit,
      }));
    } else if (name === 'quantity') {
      setNewBatch(prev => ({
        ...prev,
        quantity: parseFloat(value) || 0,
      }));
    } else if (name === 'documents') {
      // Allow comma-separated string input for documents
      setNewBatch(prev => ({
        ...prev,
        documents: value ? value.split(',').map((s) => s.trim()) : [],
      }));
    } else if (name === 'supplierId' || name === 'rawMaterialId') {
      setNewBatch(prev => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setNewBatch(prev => ({
        ...prev,
        [name]: value,
      }));
    }
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

  const getStatus = (expirationDate: string): { text: string; className: string } => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expirationDate);
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
    { header: 'Nº Factura', accessor: 'invoiceNumber' as keyof RawMaterialLot },
    { header: 'Nº Lote', accessor: 'batchNumber' as keyof RawMaterialLot },
    { header: 'Nombre', accessor: 'name' as keyof RawMaterialLot },
    { 
      header: 'Proveedor', 
      accessor: 'supplierId' as keyof RawMaterialLot,
      render: (item: RawMaterialLot) => MOCK_SUPPLIERS.find(s => s.id === item.supplierId)?.name || 'N/A'
    },
    { 
      header: 'Materia Prima', 
      accessor: 'rawMaterialId' as keyof RawMaterialLot,
      render: (item: RawMaterialLot) => MOCK_RAW_MATERIALS.find(rm => rm.id === item.rawMaterialId)?.name || 'N/A'
    },
    { header: 'Cantidad', accessor: 'quantity' as keyof RawMaterialLot },
    { header: 'Unidad', accessor: 'unit' as keyof RawMaterialLot },
    { header: 'Fecha Recepción', accessor: 'receivingDate' as keyof RawMaterialLot },
    { header: 'Fecha Vencimiento', accessor: 'expirationDate' as keyof RawMaterialLot },
    {
      header: 'Documentos',
      accessor: 'documents' as keyof RawMaterialLot,
      render: (item: RawMaterialLot) => item.documents && item.documents.length > 0 ? item.documents.join(', ') : '—'
    },
    {
      header: 'Comentarios',
      accessor: 'comments' as keyof RawMaterialLot,
      render: (item: RawMaterialLot) => item.comments && item.comments.trim() !== '' ? item.comments : '—'
    },
    {
      header: 'Estado',
      accessor: 'id' as keyof RawMaterialLot,
      render: (item: RawMaterialLot) => {
        const status = getStatus(item.expirationDate);
        return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.className}`}>{status.text}</span>
      }
    },
    {
      header: 'Acciones',
      accessor: 'id' as keyof RawMaterialLot,
      render: (item: RawMaterialLot) => (
        <div className="space-x-2">
            <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); alert(`Viewing ${item.batchNumber}`)}}>Ver</Button>
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
        const expiryDate = new Date(batch.expirationDate);
        return expiryDate >= today && expiryDate <= thirtyDaysFromNow;
    });
  }, [batches]);

  // TODO: Implementar seguridad JWT en esta página (pendiente)
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
                       <Input label="Número de Factura" id="invoiceNumber" name="invoiceNumber" value={newBatch.invoiceNumber} onChange={handleInputChange} required />
                       <Input label="Número de Lote" id="batchNumber" name="batchNumber" value={newBatch.batchNumber} onChange={handleInputChange} required />
                       <Input label="Nombre" id="name" name="name" value={newBatch.name} onChange={handleInputChange} required />
                       <div>
                           <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                           <select id="supplierId" name="supplierId" value={newBatch.supplierId} onChange={handleInputChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm focus:ring-slate-500 focus:border-slate-500 bg-white" required>
                               {MOCK_SUPPLIERS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                           </select>
                       </div>
                       <div>
                           <label htmlFor="rawMaterialId" className="block text-sm font-medium text-gray-700 mb-1">Materia Prima</label>
                           <select id="rawMaterialId" name="rawMaterialId" value={newBatch.rawMaterialId} onChange={handleInputChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm focus:ring-slate-500 focus:border-slate-500 bg-white" required>
                               {MOCK_RAW_MATERIALS.map(rm => <option key={rm.id} value={rm.id}>{rm.name}</option>)}
                           </select>
                       </div>
                       <Input label="Cantidad" id="quantity" name="quantity" type="number" value={newBatch.quantity} onChange={handleInputChange} required />
                       <div>
                           <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">Unidad</label>
                           <select id="unit" name="unit" value={newBatch.unit} onChange={handleInputChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm focus:ring-slate-500 focus:border-slate-500 bg-white" required>
                               {MOCK_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                           </select>
                       </div>
                       <Input label="Fecha de Recepción" id="receivingDate" name="receivingDate" type="date" value={newBatch.receivingDate} onChange={handleInputChange} required />
                       <Input label="Fecha de Vencimiento" id="expirationDate" name="expirationDate" type="date" value={newBatch.expirationDate} onChange={handleInputChange} required />
                       <Input label="Documentos" id="documents" name="documents" value={newBatch.documents.join(', ')} onChange={handleInputChange} />
                       <Input label="Comentarios" id="comments" name="comments" value={newBatch.comments} onChange={handleInputChange} />
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