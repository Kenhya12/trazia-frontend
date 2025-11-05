import React, { useState, useMemo, useEffect } from 'react';
import type { RawMaterialLot as RawMaterialLotBase } from '../../types.ts';
import Table from '../ui/Table';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { ClipboardListIcon, PlusCircleIcon, ClockIcon } from '../../constants'; // ✅ Solo iconos que existen
import { rawMaterialBatchApi, RawMaterialBatch } from '../../api/rawMaterialBatchApi';
import { supplierApi, Supplier } from '../../api/supplierApi';
import { rawMaterialApi, RawMaterial } from '../../api/rawMaterialApi';

type RawMaterialLotUnit = "L" | "kg" | "g" | "ml" | "unit";

type RawMaterialLot = Omit<RawMaterialLotBase, 'unit' | 'documents'> & {
  unit: RawMaterialLotUnit;
  documents: File[];
};

const MOCK_UNITS: Array<RawMaterialLotUnit> = ['kg', 'g', 'L', 'ml', 'unit'];

const RawMaterialBatchesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'expiring'>('list');
  const [batches, setBatches] = useState<RawMaterialLot[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getTodayDateString = () => new Date().toISOString().split('T')[0];

  const [newBatch, setNewBatch] = useState<Omit<RawMaterialBatch, 'id'>>({
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
    setIsSubmitting(true);

    try {
      // ✅ ENVIAR COMO JSON DIRECTAMENTE - SIN FormData
      const createdBatch = await rawMaterialBatchApi.create({
        invoiceNumber: newBatch.invoiceNumber,
        batchNumber: newBatch.batchNumber,
        name: newBatch.name,
        supplierId: newBatch.supplierId,
        rawMaterialId: newBatch.rawMaterialId,
        quantity: newBatch.quantity,
        unit: newBatch.unit,
        receivingDate: newBatch.receivingDate,
        expirationDate: newBatch.expirationDate,
        comments: newBatch.comments,
      });
      
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
        comments: '',
      });
      
      setActiveTab('list');
      alert('Lote creado exitosamente');
    } catch (err: any) {
      console.error('Error creando lote:', err);
      alert(err.message || 'Error al crear lote');
    } finally {
      setIsSubmitting(false);
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

  // ✅ FORM SECTION usando solo iconos que SABEMOS que existen
  const FormSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-gray-100">
        <div className="text-slate-600">
          {/* Usar PlusCircleIcon para todo temporalmente - o dime qué iconos tienes */}
          <PlusCircleIcon className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );

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
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Registrar Nuevo Lote de Materia Prima</h2>
              <p className="text-gray-600">Complete la información del lote organizada por secciones</p>
            </div>

            <form onSubmit={handleAddBatch} className="space-y-6">
              {/* Sección 1: Información del Lote */}
              <FormSection title="Información del Lote">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label="Nº de Factura" 
                    type="text" 
                    name="invoiceNumber" 
                    value={newBatch.invoiceNumber} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="Ej: FACT-001"
                  />
                  <Input 
                    label="Nº de Lote" 
                    type="text" 
                    name="batchNumber" 
                    value={newBatch.batchNumber} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="Ej: BATCH-2024-001"
                  />
                  <div className="md:col-span-2">
                    <Input 
                      label="Nombre del Lote" 
                      type="text" 
                      name="name" 
                      value={newBatch.name} 
                      onChange={handleInputChange} 
                      required 
                      placeholder="Ej: Harina de Trigo Premium"
                    />
                  </div>
                </div>
              </FormSection>

              {/* Sección 2: Proveedor y Materia Prima */}
              <FormSection title="Proveedor y Materia Prima">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Proveedor</label>
                    <select 
                      name="supplierId" 
                      value={newBatch.supplierId} 
                      onChange={handleInputChange} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white"
                      required
                    >
                      <option value="">Seleccione un proveedor</option>
                      {suppliers.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Materia Prima</label>
                    <select 
                      name="rawMaterialId" 
                      value={newBatch.rawMaterialId} 
                      onChange={handleInputChange} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white"
                      required
                    >
                      <option value="">Seleccione materia prima</option>
                      {rawMaterials.map(rm => (
                        <option key={rm.id} value={rm.id}>{rm.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </FormSection>

              {/* Sección 3: Cantidades y Unidades */}
              <FormSection title="Cantidades y Unidades">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label="Cantidad" 
                    type="number" 
                    name="quantity" 
                    value={newBatch.quantity} 
                    onChange={handleInputChange} 
                    required 
                    min="0.01"
                    step="any"
                    placeholder="0.00"
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unidad de Medida</label>
                    <select 
                      name="unit" 
                      value={newBatch.unit} 
                      onChange={handleInputChange} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white"
                    >
                      {MOCK_UNITS.map(u => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </FormSection>

              {/* Sección 4: Fechas */}
              <FormSection title="Fechas">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label="Fecha de Recepción" 
                    type="date" 
                    name="receivingDate" 
                    value={newBatch.receivingDate} 
                    onChange={handleInputChange} 
                    required 
                  />
                  <Input 
                    label="Fecha de Vencimiento" 
                    type="date" 
                    name="expirationDate" 
                    value={newBatch.expirationDate} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
              </FormSection>

              {/* Sección 5: Comentarios */}
              <FormSection title="Comentarios Adicionales">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones y Notas</label>
                  <textarea 
                    name="comments" 
                    value={newBatch.comments} 
                    onChange={handleInputChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white" 
                    rows={4}
                    placeholder="Ingrese cualquier observación, nota especial o información adicional relevante sobre este lote..."
                  />
                </div>
              </FormSection>

              {/* Botones de acción */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={() => setActiveTab('list')}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="min-w-32"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar Lote'}
                </Button>
              </div>
            </form>
          </div>
        );
      case 'expiring':
        return <Table columns={columns} data={expiringBatches} />;
      default:
        return null;
    }
  };

  type TabId = 'list' | 'add' | 'expiring';
  const TabButton = ({ id, icon, label }: { id: TabId; icon: React.ReactNode; label: string }) => (
    <button 
      onClick={() => setActiveTab(id)} 
      className={`flex items-center space-x-2 py-3 px-4 text-sm font-medium transition-colors ${
        activeTab === id 
          ? 'border-b-2 border-slate-700 text-slate-700 bg-slate-50' 
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div>
      <div className="flex border-b bg-white rounded-t-lg overflow-hidden">
        <TabButton id="list" icon={<ClipboardListIcon className="w-5 h-5" />} label="Todos los Lotes" />
        <TabButton id="add" icon={<PlusCircleIcon className="w-5 h-5" />} label="Registrar Lote Nuevo" />
        <TabButton id="expiring" icon={<ClockIcon className="w-5 h-5" />} label="Lotes Próximos a Vencer" />
      </div>
      <div className="bg-gray-50 min-h-screen p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default RawMaterialBatchesPage;