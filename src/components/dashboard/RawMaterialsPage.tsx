import React, { useState, useEffect } from 'react';
import type { RawMaterialLot, Supplier, RawMaterialLotUnit } from '../../types.ts';
import Table from '../ui/Table';
import Button from '../ui/Button';
import Input from '../ui/Input';

import { MOCK_SUPPLIERS, ListBulletIcon, PlusCircleIcon, ClockIcon } from '../../constants';

import { rawMaterialBatchApi, RawMaterialBatch } from '../../api/rawMaterialBatchApi';
import { supplierApi, Supplier as SupplierAPI } from '../../api/supplierApi';
import { rawMaterialApi, RawMaterial } from '../../api/rawMaterialApi';

const MOCK_RAW_MATERIALS: RawMaterialLot[] = [
  {
    id: 'RM1',
    rawMaterialId: 'RMID1',
    supplierId: 'SUP1',
    invoiceNumber: 'INV123',
    name: 'Materia Prima 1',
    batchNumber: 'BATCH001',
    quantity: 100,
    unit: 'kg',
    receivingDate: '2024-01-01',
    expirationDate: '2025-01-01',
    documents: [],
    comments: 'Comentario de ejemplo 1',
  },
  {
    id: 'RM2',
    rawMaterialId: 'RMID2',
    supplierId: 'SUP2',
    invoiceNumber: 'INV456',
    name: 'Materia Prima 2',
    batchNumber: 'BATCH002',
    quantity: 50,
    unit: 'L',
    receivingDate: '2024-02-15',
    expirationDate: '2025-02-15',
    documents: [],
    comments: 'Comentario de ejemplo 2',
  },
];

type RawMaterialTab = 'list' | 'add' | 'history';

interface RawMaterialsPageProps {
  initialTab: 'list' | 'add';
}

const RawMaterialsPage: React.FC<RawMaterialsPageProps> = ({ initialTab }) => {
  const [activeTab, setActiveTab] = useState<RawMaterialTab>(initialTab);
  const [materials, setMaterials] = useState<RawMaterialLot[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [rawMaterialsCatalog, setRawMaterialsCatalog] = useState<RawMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBatch, setNewBatch] = useState<RawMaterialLot>({
    id: '',
    rawMaterialId: '',
    supplierId: '',
    invoiceNumber: '',
    name: '',
    batchNumber: '',
    quantity: 0,
    unit: 'kg' as RawMaterialLotUnit,
    receivingDate: '',
    expirationDate: '',
    documents: [],
    comments: '',
  });
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        const [batchesData, suppliersData, rawMaterialsData] = await Promise.all([
          rawMaterialBatchApi.getAll(),
          supplierApi.getAll(),
          rawMaterialApi.getAll(),
        ]);

        setMaterials(batchesData as RawMaterialLot[]);
        setSuppliers(suppliersData);
        setRawMaterialsCatalog(rawMaterialsData);

        setNewBatch(prev => ({
          ...prev,
          supplierId: suppliersData[0]?.id || '',
          rawMaterialId: rawMaterialsData[0]?.id || '',
        }));
      } catch (err: any) {
        console.error('Error cargando datos:', err);
        alert(err.message || 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, files } = e.target as any;
    if (type === 'file') {
      setFilesToUpload(files ? Array.from(files) : []);
      return;
    }
    const isNumber = type === 'number';
    setNewBatch((prev) => ({
      ...prev,
      [name]: isNumber ? parseFloat(value) || 0 : value,
    }));
  };

  const validateBatch = (batch: RawMaterialLot) => {
    if (!batch.name.trim()) return false;
    if (!batch.rawMaterialId.trim()) return false;
    if (!batch.supplierId) return false;
    if (!batch.batchNumber.trim()) return false;
    if (batch.quantity <= 0) return false;
    if (!batch.unit) return false;
    if (!batch.receivingDate) return false;
    if (batch.expirationDate && batch.expirationDate < batch.receivingDate) return false;
    return true;
  };

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📦 newBatch antes de enviar:', newBatch);
    console.log('📝 Campo name:', newBatch.name);
    
    if (!validateBatch(newBatch)) {
      alert('Por favor, complete todos los campos obligatorios correctamente.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('id', newBatch.id);
      formData.append('rawMaterialId', newBatch.rawMaterialId);
      formData.append('supplierId', newBatch.supplierId);
      formData.append('invoiceNumber', newBatch.invoiceNumber);
      formData.append('name', newBatch.name);
      formData.append('batchNumber', newBatch.batchNumber);
      formData.append('quantity', newBatch.quantity.toString());
      formData.append('unit', newBatch.unit);
      formData.append('receivingDate', newBatch.receivingDate);
      formData.append('expirationDate', newBatch.expirationDate);
      formData.append('comments', newBatch.comments);
      filesToUpload.forEach((file, index) => {
        formData.append('documents', file);
      });

      const createdBatch = await rawMaterialBatchApi.create(formData);
      setMaterials(prev => [
        ...prev,
        {
          ...newBatch,
          id: createdBatch.id,
          documents: filesToUpload.map(f => f.name),
        }
      ]);
      
      setNewBatch({
        id: '',
        rawMaterialId: rawMaterialsCatalog[0]?.id || '',
        supplierId: suppliers[0]?.id || '',
        invoiceNumber: '',
        name: '',
        batchNumber: '',
        quantity: 0,
        unit: 'kg' as RawMaterialLotUnit,
        receivingDate: '',
        expirationDate: '',
        documents: [],
        comments: '',
      });
      setFilesToUpload([]);
      
      setActiveTab('list');
      alert('Lote creado exitosamente');
    } catch (err: any) {
      console.error('Error creando lote:', err);
      alert(err.message || 'Error al crear lote');
    }
  };

  const handleDeleteBatch = async (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este lote?')) {
      try {
        await rawMaterialBatchApi.delete(id);
        setMaterials(prev => prev.filter(batch => batch.id !== id));
        alert('Lote eliminado exitosamente');
      } catch (err: any) {
        console.error('Error eliminando lote:', err);
        alert(err.message || 'Error al eliminar lote');
      }
    }
  };

  const columns = [
    { header: 'Nombre', accessor: 'name' as keyof RawMaterialLot },
    {
      header: 'Proveedor',
      accessor: 'supplierId' as keyof RawMaterialLot,
      render: (item: RawMaterialLot) => suppliers.find(s => s.id === item.supplierId)?.name || 'N/A'
    },
    { header: 'Número de Lote', accessor: 'batchNumber' as keyof RawMaterialLot },
    { header: 'Número de Factura', accessor: 'invoiceNumber' as keyof RawMaterialLot },
    {
      header: 'Cantidad',
      accessor: 'quantity' as keyof RawMaterialLot,
      render: (item: RawMaterialLot) => (
        <span>
          {item.quantity} {item.unit}
        </span>
      )
    },
    {
      header: 'Fecha de Recepción',
      accessor: 'receivingDate' as keyof RawMaterialLot,
    },
    {
      header: 'Fecha de Vencimiento',
      accessor: 'expirationDate' as keyof RawMaterialLot,
    },
    {
      header: 'Acciones',
      accessor: 'id' as keyof RawMaterialLot,
      render: (item: RawMaterialLot) => (
        <div className="space-x-2">
          <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); alert(`Editar lote ${item.batchNumber} de ${item.name}`) }}>Editar</Button>
          <Button size="sm" variant="danger" onClick={(e) => { e.stopPropagation(); handleDeleteBatch(item.id) }}>Eliminar</Button>
        </div>
      ),
    },
  ];

  const renderContent = () => {
    if (loading) {
      return <div className="p-4 text-center">Cargando...</div>;
    }
    switch (activeTab) {
      case 'list':
        return <Table<RawMaterialLot> columns={columns} data={materials} />;
      case 'add':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Agregar Nuevo Lote de Materia Prima</h3>
            <form onSubmit={handleAddMaterial} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 p-4 bg-gray-50 border border-gray-200 rounded">
                  <p className="text-sm text-gray-700">Por favor, asegúrese de que los datos ingresados sean correctos antes de guardar el lote.</p>
                </div>
                {/* Materia Prima (Nombre) */}
                <div>
                  <label className="block text-sm font-medium mb-1">Materia Prima (Nombre)</label>
                  <input
                    type="text"
                    name="name"
                    value={newBatch.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                {/* Proveedor */}
                <div>
                  <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                  <select
                    id="supplierId"
                    name="supplierId"
                    value={newBatch.supplierId}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm focus:ring-slate-500 focus:border-slate-500 bg-white"
                    required
                  >
                    <option value="">Seleccione un proveedor</option>
                    {(suppliers.length > 0 ? suppliers : MOCK_SUPPLIERS).map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Input label="ID Materia Prima" id="rawMaterialId" name="rawMaterialId" value={newBatch.rawMaterialId} onChange={handleInputChange} required />
                <Input label="Número de Factura" id="invoiceNumber" name="invoiceNumber" value={newBatch.invoiceNumber} onChange={handleInputChange} />
                <Input label="Número de Lote" id="batchNumber" name="batchNumber" value={newBatch.batchNumber} onChange={handleInputChange} required />
                <Input label="Cantidad" id="quantity" name="quantity" type="number" min={0.01} step="any" value={newBatch.quantity} onChange={handleInputChange} required />
                <div>
                  <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">Unidad de Medida</label>
                  <select id="unit" name="unit" value={newBatch.unit} onChange={handleInputChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm focus:ring-slate-500 focus:border-slate-500 bg-white" required>
                    <option value="kg">Kilogramos (kg)</option>
                    <option value="g">Gramos (g)</option>
                    <option value="L">Litros (L)</option>
                    <option value="ml">Mililitros (ml)</option>
                    <option value="unit">Unidad (unit)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="receivingDate" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Recepción</label>
                  <input
                    type="date"
                    id="receivingDate"
                    name="receivingDate"
                    value={newBatch.receivingDate}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm focus:ring-slate-500 focus:border-slate-500 bg-white"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Vencimiento</label>
                  <input
                    type="date"
                    id="expirationDate"
                    name="expirationDate"
                    value={newBatch.expirationDate}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm focus:ring-slate-500 focus:border-slate-500 bg-white"
                    min={newBatch.receivingDate || undefined}
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="documents" className="block text-sm font-medium text-gray-700 mb-1">Documentos Adjuntos</label>
                  <input
                    type="file"
                    id="documents"
                    name="documents"
                    multiple
                    onChange={handleInputChange}
                    className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">Comentarios</label>
                  <textarea
                    id="comments"
                    name="comments"
                    value={newBatch.comments}
                    onChange={handleInputChange}
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm focus:ring-slate-500 focus:border-slate-500 bg-white"
                    placeholder="Observaciones, notas, etc."
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  className="border border-slate-700 text-slate-700 hover:bg-slate-100"
                  variant="secondary"
                  onClick={() => setActiveTab('list')}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-slate-700 hover:bg-slate-800 text-white"
                >
                  Guardar Lote
                </Button>
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
          <TabButton id="list" icon={<ListBulletIcon className="w-5 h-5" />} label="Listado de Materias Primas" />
          <TabButton id="add" icon={<PlusCircleIcon className="w-5 h-5" />} label="Agregar Nueva" />
          <TabButton id="history" icon={<ClockIcon className="w-5 h-5" />} label="Historial de Entradas / Lotes" />
        </div>
      </div>

      <div className="mt-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default RawMaterialsPage;