import React, { useState, useEffect, useCallback } from 'react';
import type { Recipe, RecipeSummary } from '../../types';
import Button from '../ui/Button';
import RecipeModal from '../modals/RecipeModal';
import { recipeApi } from "../../api/recipeApi";

const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

interface RecipeTabsProps {
  openCreateModalOnLoad: boolean;
}

const RecipeTabs: React.FC<RecipeTabsProps> = ({ openCreateModalOnLoad }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeSummary | null>(null);
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [expandedRecipeId, setExpandedRecipeId] = useState<number | null>(null);
  const [detailedRecipe, setDetailedRecipe] = useState<Recipe | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await recipeApi.getAll();
      console.log('📋 Recetas recibidas:', data);
      setRecipes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recipes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  useEffect(() => {
    setIsModalOpen(openCreateModalOnLoad);
    if (openCreateModalOnLoad) {
      setSelectedRecipe(null);
    }
  }, [openCreateModalOnLoad]);

  const handleOpenModal = (recipe: RecipeSummary | null = null) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  const handleSaveSuccess = () => {
    fetchRecipes();
    handleCloseModal();
  };

  const handleDelete = async (recipeId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta receta?')) {
      try {
        await recipeApi.delete(recipeId);
        fetchRecipes();
      } catch (err) {
        alert('Failed to delete recipe.');
        console.error(err);
      }
    }
  };

  const handleToggleExpand = async (recipeId: number) => {
    if (expandedRecipeId === recipeId) {
      setExpandedRecipeId(null);
    } else {
      setExpandedRecipeId(recipeId);
      if (detailedRecipe?.id !== recipeId) {
        setDetailedRecipe(null);
        setDetailsLoading(true);
        setDetailsError(null);
        try {
          const data = await recipeApi.getById(recipeId);
          setDetailedRecipe(data);
        } catch (err) {
          setDetailsError(err instanceof Error ? err.message : 'Failed to fetch recipe details.');
        } finally {
          setDetailsLoading(false);
        }
      }
    }
  };

  const renderContent = () => {
    if (loading) return <p>Cargando recetas...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    const safeRecipes = Array.isArray(recipes) ? recipes : [];

    switch (activeTab) {
      case 'all':
        return (
          <div className="space-y-4">
            {safeRecipes.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay recetas creadas aún.</p>
            ) : (
              safeRecipes.map((recipe) => {
                const isExpanded = expandedRecipeId === recipe.id;
                return (
                  <div key={recipe.id} className="bg-white rounded-lg shadow-md transition-all duration-300">
                    <button
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 rounded-t-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                      onClick={() => handleToggleExpand(recipe.id)}
                      aria-expanded={isExpanded}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-slate-800 truncate">{recipe.name}</h3>
                        <p className="text-sm text-gray-600 truncate">{recipe.description}</p>
                      </div>
                      <div className="flex items-center space-x-4 ml-4 flex-shrink-0">
                        <div className="text-sm text-gray-500 text-right hidden md:block">
                          <p>Ingredientes: {recipe.ingredientCount || 0}</p>
                          <p>Costo Total: ${(recipe.totalCost || 0).toFixed(2)}</p>
                        </div>
                        <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); handleOpenModal(recipe); }}>Editar</Button>
                        <Button size="sm" variant="danger" onClick={(e) => { e.stopPropagation(); handleDelete(recipe.id) }}>Eliminar</Button>
                        <ChevronDownIcon className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1000px]' : 'max-h-0'}`}>
                      <div className="border-t border-gray-200 p-6">
                        {detailsLoading && <p>Cargando detalles...</p>}
                        {detailsError && <p className="text-red-500">{detailsError}</p>}
                        {detailedRecipe && detailedRecipe.id === recipe.id && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                            <div className="md:col-span-2 space-y-4">
                              <h4 className="text-md font-semibold text-gray-800">Ingredientes</h4>
                              <ul className="list-disc list-inside bg-gray-50 p-3 rounded-md border">
                                {detailedRecipe.ingredients?.map(ing => (
                                  <li key={ing.id} className="text-gray-700">
                                    <span className="font-medium">{ing.product?.name || 'Producto desconocido'}</span>: {ing.quantityGrams || 0}g
                                  </li>
                                )) || <li>No hay ingredientes</li>}
                              </ul>
                            </div>
                            <div className="space-y-2 bg-gray-50 p-3 rounded-md border">
                              <h4 className="text-md font-semibold text-gray-800 border-b pb-2 mb-2">Detalles de Costo y Rendimiento</h4>
                              <p><span className="font-semibold">Peso Ingredientes:</span> {(detailedRecipe.totalIngredientsWeight || 0).toFixed(2)}g</p>
                              <p><span className="font-semibold">Peso Rendimiento:</span> {(detailedRecipe.yieldWeightGrams || 0).toFixed(2)}g</p>
                              <p><span className="font-semibold">Pérdida:</span> {(detailedRecipe.yieldLossPercentage || 0).toFixed(2)}%</p>
                              <p><span className="font-semibold">Costo Total:</span> ${(detailedRecipe.totalCost || 0).toFixed(2)}</p>
                              <p><span className="font-semibold">Costo / 100g:</span> ${(detailedRecipe.costPer100g || 0).toFixed(2)}</p>
                              <p className="text-xs text-gray-500 pt-2 border-t mt-2">
                                Última actualización: {new Date(detailedRecipe.updatedAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        );
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
        onSaveSuccess={handleSaveSuccess}
        recipeSummary={selectedRecipe}
      />
    </div>
  );
};

export default RecipeTabs;