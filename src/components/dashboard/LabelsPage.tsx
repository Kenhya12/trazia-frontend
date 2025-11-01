import React, { useState, useEffect } from 'react';
import type { ProductLabel } from '../../types.ts';
import Table from '../ui/Table';
import Button from '../ui/Button';
import LabelModal from '../modals/LabelModal';
import LabelPreviewModal from '../modals/LabelPreviewModal';
import { MOCK_LABELS, ListBulletIcon, BookOpenIcon, PlusCircleIcon } from '../../constants';

interface LabelsPageProps {
  openCreateModalOnLoad: boolean;
}

const LabelsPage: React.FC<LabelsPageProps> = ({ openCreateModalOnLoad }) => {
  const [activeTab, setActiveTab] = useState('list');
  const [labels, setLabels] = useState<ProductLabel[]>(MOCK_LABELS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<ProductLabel | null>(null);

  useEffect(() => {
    setIsModalOpen(openCreateModalOnLoad);
    if (openCreateModalOnLoad) {
      setSelectedLabel(null);
    }
  }, [openCreateModalOnLoad]);

  const handleOpenModal = (label: ProductLabel | null = null) => {
    setSelectedLabel(label);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLabel(null);
  };

  const handleOpenPreview = (label: ProductLabel) => {
    setSelectedLabel(label);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setSelectedLabel(null);
  };

  const handleSaveLabel = (label: ProductLabel) => {
    if (selectedLabel) {
      setLabels(labels.map(l => l.id === label.id ? label : l));
    } else {
      setLabels([...labels, label]);
    }
    handleCloseModal();
  };

  const handleDeleteLabel = (labelId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta etiqueta?')) {
      setLabels(labels.filter(l => l.id !== labelId));
    }
  };

  const statusStyles: Record<ProductLabel['status'], string> = {
    draft: 'bg-gray-200 text-gray-800',
    approved: 'bg-blue-200 text-blue-800',
    published: 'bg-green-200 text-green-800',
  };

  const statusText: Record<ProductLabel['status'], string> = {
    draft: 'Borrador',
    approved: 'Aprobada',
    published: 'Publicada',
  };

  const columns = [
    { header: 'Nombre del Producto', accessor: 'productName' as keyof ProductLabel },
    { header: 'Versión', accessor: 'version' as keyof ProductLabel, render: (item: ProductLabel) => `v${item.version}` },
    {
      header: 'Estado',
      accessor: 'status' as keyof ProductLabel,
      render: (item: ProductLabel) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[item.status]}`}>
          {statusText[item.status]}
        </span>
      )
    },
    { header: 'Idioma', accessor: 'language' as keyof ProductLabel, render: (item: ProductLabel) => item.language.toUpperCase() },
    {
      header: 'Acciones',
      accessor: 'id' as keyof ProductLabel,
      render: (item: ProductLabel) => (
        <div className="space-x-2">
          <Button size="sm" variant="secondary" onClick={() => handleOpenPreview(item)}>Previsualizar</Button>
          <Button size="sm" variant="secondary" onClick={() => handleOpenModal(item)}>Editar</Button>
          <Button size="sm" variant="danger" onClick={() => handleDeleteLabel(item.id)}>Eliminar</Button>
        </div>
      ),
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'list':
        return <Table<ProductLabel> columns={columns} data={labels} />;
      case 'regulation':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto space-y-4 text-left">
            <h3 className="text-xl font-semibold text-gray-800">Guía Rápida de Normativa Europea (Reglamento UE Nº 1169/2011)</h3>
            <p className="text-gray-600">Esta es una guía resumida. Consulta siempre la legislación vigente.</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Nombre del Alimento:</strong> Debe ser claro y no inducir a error.</li>
              <li><strong>Lista de Ingredientes:</strong> En orden decreciente de peso. Los alérgenos deben destacarse (p.ej. en <strong>negrita</strong>).</li>
              <li><strong>Cantidad Neta:</strong> Obligatoria para casi todos los productos.</li>
              <li><strong>Fechas:</strong> "Consumir preferentemente antes del" (calidad) o "Fecha de caducidad" (seguridad).</li>
              <li><strong>Lote:</strong> Para garantizar la trazabilidad del producto.</li>
              <li><strong>Datos del Operador:</strong> Nombre o razón social y dirección de la empresa alimentaria.</li>
              <li><strong>País de Origen:</strong> Obligatorio en ciertos casos (carne, miel, aceite de oliva, etc.).</li>
              <li><strong>Instrucciones de Uso:</strong> Si son necesarias para un uso apropiado del alimento.</li>
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  type TabId = 'list' | 'regulation';
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
          <TabButton id="list" icon={<ListBulletIcon className="w-5 h-5" />} label="Listado de Etiquetas" />
          <TabButton id="regulation" icon={<BookOpenIcon className="w-5 h-5" />} label="Normativa (Ayuda)" />
        </div>
        <Button onClick={() => handleOpenModal()}>
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Crear Nueva Etiqueta
        </Button>
      </div>

      <div className="mt-4">
        {renderContent()}
      </div>

      <LabelModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveLabel}
        label={selectedLabel}
      />

      {selectedLabel && (
        <LabelPreviewModal
          isOpen={isPreviewOpen}
          onClose={handleClosePreview}
          label={selectedLabel}
        />
      )}
    </div>
  );
};

export default LabelsPage;