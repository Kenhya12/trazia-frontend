import React, { useState, useEffect } from 'react';
import type { FinalProduct, ProductionLot } from '../../types.ts';
import Table from '../ui/Table';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { MOCK_FINAL_PRODUCTS, MOCK_PRODUCTION_LOTS, MOCK_RECIPES, ListBulletIcon, PlusCircleIcon, CubeIcon } from '../../constants';

interface FinalProductsPageProps {
    initialTab: 'list' | 'add' | 'lots';
}

const FinalProductsPage: React.FC<FinalProductsPageProps> = ({ initialTab }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [products, setProducts] = useState<FinalProduct[]>(MOCK_FINAL_PRODUCTS);
  const [productionLots, setProductionLots] = useState<ProductionLot[]>(MOCK_PRODUCTION_LOTS);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const getTodayDateString = () => new Date().toISOString().split('T')[0];

  const [newProductData, setNewProductData] = useState({
      name: '',
      internalCode: '',
      category: 'Panadería',
      lotNumber: '',
      recipeId: MOCK_RECIPES[0]?.id || '',
      elaborationDate: getTodayDateString(),
      expiryDate: getTodayDateString(),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProductId = `FP${Date.now()}`;
    const newProduct: FinalProduct = {
        id: newProductId,
        name: newProductData.name,
        internalCode: newProductData.internalCode,
        category: newProductData.category,
    };
    const newLot: ProductionLot = {
        id: `PL${Date.now()}`,
        lotNumber: newProductData.lotNumber,
        finalProductId: newProductId,
        recipeId: newProductData.recipeId,
        elaborationDate: newProductData.elaborationDate,
        expiryDate: newProductData.expiryDate,
    };
    setProducts(prev => [...prev, newProduct]);
    setProductionLots(prev => [...prev, newLot]);
    setActiveTab('list');
  };

  const productColumns = [
    { header: 'Nombre Producto', accessor: 'name' as keyof FinalProduct },
    { header: 'Código Interno', accessor: 'internalCode' as keyof FinalProduct },
    { header: 'Categoría', accessor: 'category' as keyof FinalProduct },
    {
      header: 'Acciones',
      accessor: 'id' as keyof FinalProduct,
      render: (item: FinalProduct) => (
        <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); alert(`Editing ${item.name}`)}}>Editar</Button>
      ),
    },
  ];

  const recipeMap = MOCK_RECIPES.reduce((acc, recipe) => {
    acc[recipe.id] = recipe.name;
    return acc;
  }, {} as Record<string, string>);

  const lotColumns = [
    { header: 'Nº Lote Fabricación', accessor: 'lotNumber' as keyof ProductionLot },
    { 
        header: 'Producto Final', 
        accessor: 'finalProductId' as keyof ProductionLot,
        render: (item: ProductionLot) => products.find(p => p.id === item.finalProductId)?.name || 'N/A'
    },
    { 
        header: 'Receta Utilizada', 
        accessor: 'recipeId' as keyof ProductionLot,
        render: (item: ProductionLot) => recipeMap[item.recipeId] || 'N/A'
    },
    { header: 'Fecha Elaboración', accessor: 'elaborationDate' as keyof ProductionLot },
    { header: 'Fecha Caducidad', accessor: 'expiryDate' as keyof ProductionLot },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'list':
        return <Table<FinalProduct> columns={productColumns} data={products} />;
      case 'add':
        return (
            <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Crear Nuevo Producto y Primer Lote</h3>
                <form onSubmit={handleAddProduct} className="space-y-6">
                    <div>
                        <h4 className="font-medium text-gray-700 mb-2">Datos del Producto</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md">
                            <Input label="Nombre del Producto" id="name" name="name" value={newProductData.name} onChange={handleInputChange} required />
                            <Input label="Código Interno" id="internalCode" name="internalCode" value={newProductData.internalCode} onChange={handleInputChange} required />
                            <Input label="Categoría" id="category" name="category" value={newProductData.category} onChange={handleInputChange} required />
                        </div>
                    </div>
                     <div>
                        <h4 className="font-medium text-gray-700 mb-2">Datos del Lote de Fabricación</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md">
                            <Input label="Número de Lote" id="lotNumber" name="lotNumber" value={newProductData.lotNumber} onChange={handleInputChange} required />
                            <div>
                               <label htmlFor="recipeId" className="block text-sm font-medium text-gray-700 mb-1">Receta Base</label>
                               <select id="recipeId" name="recipeId" value={newProductData.recipeId} onChange={handleInputChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm focus:ring-slate-500 focus:border-slate-500 bg-white">
                                   {MOCK_RECIPES.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                               </select>
                           </div>
                           <Input label="Fecha de Elaboración" id="elaborationDate" name="elaborationDate" type="date" value={newProductData.elaborationDate} onChange={handleInputChange} required />
                           <Input label="Fecha de Caducidad" id="expiryDate" name="expiryDate" type="date" value={newProductData.expiryDate} onChange={handleInputChange} required />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setActiveTab('list')}>Cancelar</Button>
                        <Button type="submit">Guardar Producto y Lote</Button>
                    </div>
                </form>
            </div>
        );
      case 'lots':
        return <Table<ProductionLot> columns={lotColumns} data={productionLots} />;
      default:
        return null;
    }
  };

  type TabId = 'list' | 'add' | 'lots';
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
          <TabButton id="list" icon={<ListBulletIcon className="w-5 h-5"/>} label="Listado de Productos" />
          <TabButton id="add" icon={<PlusCircleIcon className="w-5 h-5"/>} label="Crear Producto" />
          <TabButton id="lots" icon={<CubeIcon className="w-5 h-5"/>} label="Lotes de Fabricación" />
        </div>
      </div>

      <div className="mt-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default FinalProductsPage;