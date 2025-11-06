import React, { useState, useEffect } from 'react';
import type { ProductLabel, Ingredient } from '../../types.ts';
import Table from '../ui/Table';
import Button from '../ui/Button';
import LabelModal from '../modals/LabelModal';
import LabelPreviewModal from '../modals/LabelPreviewModal';
import ErrorBoundary from '../ui/errorBoundary';
import { ListBulletIcon, BookOpenIcon, PlusCircleIcon } from '../../constants';
import { labelServiceAPI, serviceInfo } from '../../services/labelServiceSelector';

interface LabelsPageProps {
  openCreateModalOnLoad: boolean;
}

const LabelsPage: React.FC<LabelsPageProps> = ({ openCreateModalOnLoad }) => {
  const [activeTab, setActiveTab] = useState('list');
  const [labels, setLabels] = useState<ProductLabel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<ProductLabel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar etiquetas al montar el componente
  useEffect(() => {
    loadLabels();
  }, []);

  useEffect(() => {
    setIsModalOpen(openCreateModalOnLoad);
    if (openCreateModalOnLoad) {
      setSelectedLabel(null);
    }
  }, [openCreateModalOnLoad]);

  const loadLabels = async () => {
    try {
      setLoading(true);
      setError(null);
      const labelsData = await labelServiceAPI.getLabels();
      setLabels(labelsData);
    } catch (err) {
      setError('Error al cargar las etiquetas');
      console.error('Error loading labels:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSaveLabel = async (labelData: ProductLabel) => {
    try {
      setError(null);

      // Convertir al formato correcto para el backend
      const labelForBackend = {
        ...labelData,
        // Asegurar que ingredients sea siempre Ingredient[] con unidad
        ingredients: Array.isArray(labelData.ingredients) 
          ? labelData.ingredients.map(ing => ({
              ...ing,
              unit: ing.unit || 'g' // Valor por defecto si no tiene unidad
            }))
          : convertIngredientsToArray(labelData.ingredients as any),
        // Asegurar campos requeridos
        allergens: labelData.allergens || [],
        countryOfOrigin: labelData.countryOfOrigin || '',
        batchNumber: labelData.batchNumber || '',
      };

      console.log('📦 Saving label:', labelForBackend);

      if (selectedLabel) {
        // Actualizar etiqueta existente
        const updatedLabel = await labelServiceAPI.updateLabel(selectedLabel.id, labelForBackend);
        setLabels(labels.map(l => l.id === updatedLabel.id ? updatedLabel : l));
      } else {
        // Crear nueva etiqueta
        const { id, ...labelWithoutId } = labelForBackend;
        const newLabel = await labelServiceAPI.createLabel(labelWithoutId);
        setLabels([...labels, newLabel]);
      }

      handleCloseModal();
    } catch (err: any) {
      setError(err.message || 'Error al guardar la etiqueta');
      console.error('Error saving label:', err);
    }
  };

  // Función helper para convertir ingredientes al formato correcto
  const convertIngredientsToArray = (ingredients: any): Ingredient[] => {
    if (Array.isArray(ingredients)) {
      // Si ya es un array, verificar que tenga la estructura correcta
      return ingredients.map(ing => ({
        id: ing.id || `ing-${Date.now()}-${Math.random()}`,
        name: ing.name || '',
        quantity: ing.quantity || '',
        unit: ing.unit || 'g', // ← Incluir unidad
        isAllergen: ing.isAllergen || false
      }));
    }

    if (typeof ingredients === 'string') {
      // Convertir string separado por comas a array de Ingredient
      return ingredients.split(',')
        .map(ing => ing.trim())
        .filter(ing => ing)
        .map((name, index) => ({
          id: `ing-${Date.now()}-${index}`,
          name,
          quantity: '',
          unit: 'g', // ← Valor por defecto
          isAllergen: false
        }));
    }

    // Si no se puede convertir, retornar array vacío
    console.warn('No se pudo convertir ingredients:', ingredients);
    return [];
  };

  const handleDeleteLabel = async (labelId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta etiqueta?')) {
      try {
        setError(null);
        await labelServiceAPI.deleteLabel(labelId);
        setLabels(labels.filter(l => l.id !== labelId));
      } catch (err: any) {
        setError(err.message || 'Error al eliminar la etiqueta');
        console.error('Error deleting label:', err);
      }
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
    { 
      header: 'Versión', 
      accessor: 'version' as keyof ProductLabel, 
      render: (item: ProductLabel) => `v${item.version}` 
    },
    {
      header: 'Estado',
      accessor: 'status' as keyof ProductLabel,
      render: (item: ProductLabel) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[item.status]}`}>
          {statusText[item.status]}
        </span>
      )
    },
    { 
      header: 'Idioma', 
      accessor: 'language' as keyof ProductLabel, 
      render: (item: ProductLabel) => item.language.toUpperCase() 
    },
    {
      header: 'Ingredientes',
      accessor: 'ingredients' as keyof ProductLabel,
      render: (item: ProductLabel) => {
        const ingredients = Array.isArray(item.ingredients) 
          ? item.ingredients 
          : convertIngredientsToArray(item.ingredients);
        return `${ingredients.length} ingredientes`;
      }
    },
    {
      header: 'Acciones',
      accessor: 'id' as keyof ProductLabel,
      render: (item: ProductLabel) => (
        <div className="space-x-2">
          <Button size="sm" variant="secondary" onClick={() => handleOpenPreview(item)}>
            Previsualizar
          </Button>
          <Button size="sm" variant="secondary" onClick={() => handleOpenModal(item)}>
            Editar
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDeleteLabel(item.id)}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">Cargando etiquetas...</div>
        </div>
      );
    }

    if (error && activeTab === 'list') {
      return (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">{error}</div>
          <Button onClick={loadLabels} variant="secondary" className="mt-2">
            Reintentar
          </Button>
        </div>
      );
    }

    switch (activeTab) {
      case 'list':
        return labels.length > 0 ? (
          <div>
            {/* Indicador del servicio activo */}
            <div className={`mb-4 p-3 rounded-md text-sm ${
              serviceInfo.isMock 
                ? 'bg-yellow-50 border border-yellow-200 text-yellow-800' 
                : 'bg-green-50 border border-green-200 text-green-800'
            }`}>
              <strong>Modo:</strong> {serviceInfo.type} | <strong>Origen:</strong> {serviceInfo.baseURL}
              {serviceInfo.isMock && (
                <span className="ml-2 text-xs">(Usando datos de ejemplo)</span>
              )}
            </div>
            <Table<ProductLabel> columns={columns} data={labels} />
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">
            No hay etiquetas creadas. Crea tu primera etiqueta.
          </div>
        );
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
    <button 
      onClick={() => setActiveTab(id)} 
      className={`flex items-center space-x-2 py-2 px-4 text-sm font-medium ${activeTab === id ? 'border-b-2 border-slate-700 text-slate-700' : 'text-gray-500 hover:text-gray-700'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
};

export default LabelsPage;

