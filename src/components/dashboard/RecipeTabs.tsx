import React, { useState, useEffect } from 'react';
import type { Recipe, FinalProduct } from '../../types.ts';
import Table from '../ui/Table';
import Button from '../ui/Button';
import RecipeModal from '../modals/RecipeModal';
import { MOCK_RECIPES, MOCK_FINAL_PRODUCTS } from '../../constants';

interface RecipeTabsProps {
    openCreateModalOnLoad: boolean;
}

const RecipeTabs: React.FC<RecipeTabsProps> = ({ openCreateModalOnLoad }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    setIsModalOpen(openCreateModalOnLoad);
    if(openCreateModalOnLoad) {
      setSelectedRecipe(null); // Ensure it's a new recipe form
    }
  }, [openCreateModalOnLoad]);

  const handleOpenModal = (recipe: Recipe | null = null) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };
  
  const handleSaveRecipe = (recipe: Recipe) => {
    console.log('Saving recipe:', recipe);
    // Here you would typically call an API to save the recipe
    // and then refetch the list of recipes.
    handleCloseModal();
  };

  const finalProductsMap = MOCK_FINAL_PRODUCTS.reduce((acc, product) => {
    acc[product.id] = product.name;
    return acc;
  }, {} as Record<string, string>);

  const columns = [
    { header: 'Nombre', accessor: 'name' as keyof Recipe },
    { 
        header: 'Producto Final', 
        accessor: 'finalProductId' as keyof Recipe,
        render: (recipe: Recipe) => recipe.finalProductId ? finalProductsMap[recipe.finalProductId] : 'N/A'
    },
    { header: 'Última Modificación', accessor: 'lastUpdated' as keyof Recipe },
    {
      header: 'Acciones',
      accessor: 'id' as keyof Recipe,
      render: (recipe: Recipe) => (
        <div className="space-x-2">
            <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); handleOpenModal(recipe); }}>Editar</Button>
            <Button size="sm" variant="danger" onClick={(e) => { e.stopPropagation(); alert(`Deleting ${recipe.name}`)}}>Eliminar</Button>
        </div>
      ),
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'all':
        return <Table<Recipe> columns={columns} data={MOCK_RECIPES} onRowClick={(recipe) => handleOpenModal(recipe)} />;
      case 'history':
        return <p className="text-gray-600">El historial de cambios estará disponible en una futura versión.</p>;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex border-b border-gray-300">
          <button onClick={() => setActiveTab('all')} className={`py-2 px-4 text-sm font-medium ${activeTab === 'all' ? 'border-b-2 border-slate-700 text-slate-700' : 'text-gray-500 hover:text-gray-700'}`}>
            Todas las recetas
          </button>
          <button onClick={() => setActiveTab('history')} className={`py-2 px-4 text-sm font-medium ${activeTab === 'history' ? 'border-b-2 border-slate-700 text-slate-700' : 'text-gray-500 hover:text-gray-700'}`}>
            Historial
          </button>
        </div>
        <Button onClick={() => handleOpenModal()}>Nueva Receta</Button>
      </div>

      <div className="mt-4">
        {renderContent()}
      </div>

      <RecipeModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveRecipe}
        recipe={selectedRecipe}
      />
    </div>
  );
};

export default RecipeTabs;