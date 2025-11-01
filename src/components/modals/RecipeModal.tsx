import React, { useState, useEffect } from 'react';
import type { Recipe, RecipeIngredient } from '../../types.ts';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { MOCK_RAW_MATERIALS, MOCK_FINAL_PRODUCTS } from '../../constants';

interface RecipeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (recipe: Recipe) => void;
    recipe: Recipe | null;
}

const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.033c-1.12 0-2.033.954-2.033 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
);

const RecipeModal: React.FC<RecipeModalProps> = ({ isOpen, onClose, onSave, recipe }) => {
    const [activeTab, setActiveTab] = useState('ingredients');
    const [formData, setFormData] = useState<Omit<Recipe, 'id' | 'lastUpdated'>>({
        name: '', description: '', ingredients: [], retentionFactor: 1, finalProductId: null, process: '', observations: ''
    });

    useEffect(() => {
        if (isOpen) {
            if (recipe) {
                setFormData({
                    name: recipe.name,
                    description: recipe.description,
                    ingredients: recipe.ingredients,
                    retentionFactor: recipe.retentionFactor,
                    finalProductId: recipe.finalProductId,
                    process: recipe.process,
                    observations: recipe.observations,
                });
            } else {
                setFormData({
                    name: '', description: '', ingredients: [], retentionFactor: 1, finalProductId: MOCK_FINAL_PRODUCTS[0]?.id || null, process: '', observations: ''
                });
            }
            setActiveTab('ingredients'); // Reset to first tab on open
        }
    }, [recipe, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let processedValue: string | number | null = value;
        if (type === 'number') {
            processedValue = parseFloat(value) || 0;
        }
        if (name === 'finalProductId' && value === '') {
            processedValue = null;
        }
        setFormData(prev => ({ ...prev, [name]: processedValue }));
    };

    const handleIngredientChange = (index: number, field: keyof RecipeIngredient, value: string | number) => {
        const newIngredients = [...formData.ingredients];
        const updatedIngredient = { ...newIngredients[index], [field]: value };
        newIngredients[index] = updatedIngredient;
        setFormData(prev => ({ ...prev, ingredients: newIngredients }));
    };

    const addIngredient = () => {
        setFormData(prev => ({
            ...prev,
            ingredients: [...prev.ingredients, {
                rawMaterialId: MOCK_RAW_MATERIALS[0]?.id || '',
                quantityGrams: 0,
            }]
        }));
    };

    const removeIngredient = (index: number) => {
        setFormData(prev => ({
            ...prev,
            ingredients: prev.ingredients.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = () => {
        const finalRecipe: Recipe = {
            id: recipe?.id || `R${Date.now()}`,
            ...formData,
            lastUpdated: new Date().toISOString().split('T')[0]
        };
        onSave(finalRecipe);
    };

    const footer = (
        <div className="space-x-2">
            <Button variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSubmit}>{recipe ? 'Guardar Cambios' : 'Crear Receta'}</Button>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'ingredients':
                return (
                    <div>
                        <h4 className="text-md font-semibold text-gray-800 mb-2">Ingredientes</h4>
                        <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                            {formData.ingredients.map((ing, index) => (
                                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                                    <div className="col-span-6">
                                        <select
                                            value={ing.rawMaterialId}
                                            onChange={(e) => handleIngredientChange(index, 'rawMaterialId', e.target.value)}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm focus:ring-slate-500 focus:border-slate-500 bg-white"
                                        >
                                            {MOCK_RAW_MATERIALS.map(rm => <option key={rm.id} value={rm.id}>{rm.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-span-5">
                                        <input
                                            type="number"
                                            placeholder="Cantidad (g)"
                                            value={ing.quantityGrams}
                                            onChange={e => handleIngredientChange(index, 'quantityGrams', parseFloat(e.target.value) || 0)}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm focus:ring-slate-500 focus:border-slate-500 bg-white"
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <button onClick={() => removeIngredient(index)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon className="w-5 h-5" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                            <Button variant="secondary" size="sm" onClick={addIngredient}>+ Añadir ingrediente</Button>
                        </div>
                    </div>
                );
            case 'process':
                return (
                    <div>
                        <label htmlFor="process" className="block text-sm font-medium text-gray-700 mb-1">Proceso de elaboración</label>
                        <textarea id="process" name="process" value={formData.process} onChange={handleChange} rows={8} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm focus:ring-slate-500 focus:border-slate-500 bg-white"></textarea>
                    </div>
                );
            case 'observations':
                return (
                    <div>
                        <label htmlFor="observations" className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                        <textarea id="observations" name="observations" value={formData.observations} onChange={handleChange} rows={8} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm focus:ring-slate-500 focus:border-slate-500 bg-white"></textarea>
                    </div>
                );
            default: return null;
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={recipe ? 'Editar Receta' : 'Nueva Receta'} footer={footer}>
            <div className="space-y-4">
                <Input label="Nombre de receta" id="name" name="name" value={formData.name} onChange={handleChange} />
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={2} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm focus:ring-slate-500 focus:border-slate-500 bg-white"></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Factor de Retención (ej. 0.9)" id="retentionFactor" name="retentionFactor" type="number" step="0.01" value={formData.retentionFactor} onChange={handleChange} />
                    <div>
                        <label htmlFor="finalProductId" className="block text-sm font-medium text-gray-700 mb-1">Producto Final Asociado</label>
                        <select id="finalProductId" name="finalProductId" value={formData.finalProductId || ''} onChange={handleChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm focus:ring-slate-500 focus:border-slate-500 bg-white">
                            <option value="">Ninguno</option>
                            {MOCK_FINAL_PRODUCTS.map(fp => <option key={fp.id} value={fp.id}>{fp.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                        <button onClick={() => setActiveTab('ingredients')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'ingredients' ? 'border-slate-500 text-slate-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            Ingredientes
                        </button>
                        <button onClick={() => setActiveTab('process')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'process' ? 'border-slate-500 text-slate-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            Proceso
                        </button>
                        <button onClick={() => setActiveTab('observations')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'observations' ? 'border-slate-500 text-slate-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            Observaciones
                        </button>
                    </nav>
                </div>
                <div className="pt-4">
                    {renderTabContent()}
                </div>
            </div>
        </Modal>
    );
};

export default RecipeModal;