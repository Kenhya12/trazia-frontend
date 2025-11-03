import React, { useState, useMemo, useEffect } from 'react';
import type { RawMaterialLot as RawMaterialLotBase } from '../../types.ts';
import Table from '../ui/Table';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { ClipboardListIcon, PlusCircleIcon, ClockIcon } from '../../constants';
import { rawMaterialBatchApi, RawMaterialBatch } from '../../api/rawMaterialBatchApi';
import { supplierApi, Supplier } from '../../api/supplierApi';
import { rawMaterialApi, RawMaterial } from '../../api/rawMaterialApi';

type RawMaterialLotUnit = "L" | "kg" | "g" | "ml" | "unit";

type RawMaterialLot = Omit<RawMaterialLotBase, 'unit' | 'documents'> & {
  unit: RawMaterialLotUnit;
  documents: string[];
};

const MOCK_UNITS: Array<RawMaterialLotUnit> = ['kg', 'g', 'L', 'ml', 'unit'];

const RawMaterialBatchesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'expiring'>('list');
  const [batches, setBatches] = useState<RawMaterialLot[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getTodayDateString = () => new Date().toISOString().split('T')[0];

  const [newBatch, setNewBatch] = useState<Omit<RawMaterialLot, 'id'>>({
    invoiceNumber: '',
    batchNumber: '',
    name: '',
    supplierId: '',
    rawMaterialId: '',
    quantity: 0,
    unit: MOCK_UNITS[0],
    receivingDate: getTodayDateString(),
    expirationDate: getTodayDateString(),
    documents: [],
    comments: '',
  });

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [batchesData, suppliersData, rawMaterialsData] = await Promise.all([
          rawMaterialBatchApi.getAll(),
          supplierApi.getAll(),
          rawMaterialApi.getAll(),
        ]);

        setBatches(batchesData as RawMaterialLot[]);
        setSuppliers(suppliersData);
        setRawMaterials(rawMaterialsData);

        // Setear valores iniciales del formulario
        if (suppliersData.length > 0 && rawMaterialsData.length > 0) {
          setNewBatch(prev => ({
            ...prev,
            supplierId: suppliersData[0].id,
            rawMaterialId: rawMaterialsData[0].id || '',
          }));
        }
      } catch (err: any) {
        console.error('Error cargando datos:', err);
        setError(err.message || 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

  const handleAddBatch = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const createdBatch = await rawMaterialBatchApi.create(newBatch);
      setBatches(prev => [...prev, createdBatch as RawMaterialLot]);
      
      // Reset form
      setNewBatch({
        invoiceNumber: '',
        batchNumber: '',
        name: '',
        supplierId: suppliers[0]?.id || '',
        rawMaterialId: rawMaterials[0]?.id || '',
        quantity: 0,
        unit: MOCK_UNITS[0],
        receivingDate: getTodayDateString(),
        expirationDate: getTodayDateString(),
        documents: [],
        comments: '',
      });
      
      setActiveTab('list');
      alert('Lote creado exitosamente');
    } catch (err: any) {
      console.error('Error creando lote:', err);
      alert(err.message || 'Error al crear lote');
    }
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
      render: (item: RawMaterialLot) => suppliers.find(s => s.id === item.supplierId)?.name || 'N/A'
    },
    {
      header: 'Materia Prima',
      accessor: 'rawMaterialId' as keyof RawMaterialLot,
      render: (item: RawMaterialLot) => rawMaterials.find(rm => rm.id === item.rawMaterialId)?.name || 'N/A'
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
        return <span className={`px-2 py-1 rounded text-xs ${status.className}`}>{status.text}</span>
      }
    },
    {
      header: 'Acciones',
      accessor: 'id' as keyof RawMaterialLot,
      render: (item: RawMaterialLot) => (
        <button onClick={(e) => { e.stopPropagation(); alert(`Viewing ${item.batchNumber}`) }} className="text-blue-500 hover:underline">Ver</button>
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

  const renderContent = () => {
    if (loading) {
      return <div className="p-4 text-center">Cargando...</div>;
    }

    if (error) {
      return <div className="p-4 text-center text-red-500">Error: {error}</div>;
    }

    switch (activeTab) {
      case 'list':
        return <Table columns={columns} data={batches} />;
      case 'add':
        return (
          <form onSubmit={handleAddBatch} className="space-y-4 p-4">
            <h2 className="text-xl font-semibold">Registrar Nuevo Lote de Materia Prima</h2>
            
            <Input label="Nº de Factura" type="text" name="invoiceNumber" value={newBatch.invoiceNumber} onChange={handleInputChange} required />
            <Input label="Nº de Lote" type="text" name="batchNumber" value={newBatch.batchNumber} onChange={handleInputChange} required />
            <Input label="Nombre" type="text" name="name" value={newBatch.name} onChange={handleInputChange} required />
            
            <div>
              <label className="block text-sm font-medium mb-1">Proveedor</label>
              <select name="supplierId" value={newBatch.supplierId} onChange={handleInputChange} className="w-full p-2 border rounded" required>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Materia Prima</label>
              <select name="rawMaterialId" value={newBatch.rawMaterialId} onChange={handleInputChange} className="w-full p-2 border rounded" required>
                {rawMaterials.map(rm => <option key={rm.id} value={rm.id}>{rm.name}</option>)}
              </select>
            </div>
            
            <Input label="Cantidad" type="number" name="quantity" value={newBatch.quantity} onChange={handleInputChange} required />
            
            <div>
              <label className="block text-sm font-medium mb-1">Unidad</label>
              <select name="unit" value={newBatch.unit} onChange={handleInputChange} className="w-full p-2 border rounded">
                {MOCK_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            
            <Input label="Fecha de Recepción" type="date" name="receivingDate" value={newBatch.receivingDate} onChange={handleInputChange} required />
            <Input label="Fecha de Vencimiento" type="date" name="expirationDate" value={newBatch.expirationDate} onChange={handleInputChange} required />
            <Input label="Documentos (separados por comas)" type="text" name="documents" value={newBatch.documents.join(', ')} onChange={handleInputChange} />
            
            <div>
              <label className="block text-sm font-medium mb-1">Comentarios</label>
              <textarea name="comments" value={newBatch.comments} onChange={handleInputChange} className="w-full p-2 border rounded" rows={3} />
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={() => setActiveTab('list')}>Cancelar</Button>
              <Button type="submit">Guardar Lote</Button>
            </div>
          </form>
        );
      case 'expiring':
        return <Table columns={columns} data={expiringBatches} />;
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
      <div className="flex border-b">
        <TabButton id="list" icon={<ClipboardListIcon className="w-5 h-5" />} label="Todos los Lotes" />
        <TabButton id="add" icon={<PlusCircleIcon className="w-5 h-5" />} label="Registrar Lote Nuevo" />
        <TabButton id="expiring" icon={<ClockIcon className="w-5 h-5" />} label="Lotes Próximos a Vencer" />
      </div>
      {renderContent()}
    </div>
  );
};

export default RawMaterialBatchesPage;
