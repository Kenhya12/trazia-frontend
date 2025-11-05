import React, { useState, useEffect } from 'react';
import type { Recipe, RecipeSummary, RecipeIngredientRequest, RecipeRequest } from '../../types';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { MOCK_RAW_MATERIALS } from '../../constants';
import { recipeApi } from "../../api/recipeApi";

interface RecipeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveSuccess: () => void;
    recipeSummary: RecipeSummary | null;
}

const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.033c-1.12 0-2.033.954-2.033 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
);

type FormData = {
    name: string;
    description: string;
    yieldWeightGrams: number;
    ingredients: { uid: string; productId: number, quantityGrams: number }[];
};

const RecipeModal: React.FC<RecipeModalProps> = ({ isOpen, onClose, onSaveSuccess, recipeSummary }) => {
    const [formData, setFormData] = useState<FormData>({
        name: '', description: '', ingredients: [], yieldWeightGrams: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecipe = async (id: number) => {
            setLoading(true);
            setError(null);
            try {
                const recipeData = await recipeApi.getById(id);
                setFormData({
                    name: recipeData.name,
                    description: recipeData.description,
                    yieldWeightGrams: recipeData.yieldWeightGrams,
                    ingredients: recipeData.ingredients.map(ing => ({
                        uid: crypto.randomUUID(),
                        productId: ing.product.id,
                        quantityGrams: ing.quantityGrams
                    }))
                });
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Failed to load recipe data.');
            } finally {
                setLoading(false);
            }
        }

        if (isOpen) {
            if (recipeSummary) {
                fetchRecipe(recipeSummary.id);
            } else {
                setFormData({
                    name: '', description: '', ingredients: [], yieldWeightGrams: 0
                });
            }
        }
    }, [recipeSummary, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    const handleIngredientChange = (
        index: number,
        field: 'productId' | 'quantityGrams',
        value: string | number
    ) => {
        const newIngredients = [...formData.ingredients];
        const updatedIngredient = {
            ...newIngredients[index],
            [field]: field === 'productId' ? Number(value) : value,
        };
        newIngredients[index] = updatedIngredient;
        setFormData(prev => ({
            ...prev,
            ingredients: newIngredients,
        }));
    };

    const addIngredient = () => {
        setFormData(prev => ({
            ...prev,
            ingredients: [...prev.ingredients, {
                uid: crypto.randomUUID(),
                productId: MOCK_RAW_MATERIALS[0]?.id || 0,
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

    const handleSubmit = async () => {
        setError(null);
        setLoading(true);

        const payload: RecipeRequest = {
            ...formData,
            ingredients: formData.ingredients.map((ing, index) => ({
                uid: ing.uid,
                productId: Number(ing.productId),
                quantityGrams: Number(ing.quantityGrams),
                displayOrder: index,
            })),
        };

        try {
            if (recipeSummary) {
                await recipeApi.update(recipeSummary.id, payload);
            } else {
                await recipeApi.create(payload);
            }
            onSaveSuccess();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to save recipe.');
        } finally {
            setLoading(false);
        }
    };

    const footer = (
        <div className="space-x-2">
            <Button variant="secondary" onClick={onClose} disabled={loading}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={loading}>{loading ? 'Guardando...' : recipeSummary ? 'Guardar Cambios' : 'Crear Receta'}</Button>
        </div>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={recipeSummary ? 'Editar Receta' : 'Nueva Receta'} footer={footer}>
            {loading && <p>Cargando...</p>}
            {error && <p className="text-red-500 bg-red-50 p-3 rounded-md mb-4">{error}</p>}
            {!loading && (
                <div className="space-y-4">
                    <Input label="Nombre de receta" id="name" name="name" value={formData.name} onChange={handleChange} />
                  <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={2} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm focus:ring-slate-500 focus:border-slate-500 bg-white"></textarea>
                    </div>
                    <Input label="Peso del Rendimiento (gramos)" id="yieldWeightGrams" name="yieldWeightGrams" type="number" step="0.01" value={formData.yieldWeightGrams} onChange={handleChange} />

                    <div className="pt-4">
                        <h4 className="text-md font-semibold text-gray-800 mb-2">Ingredientes</h4>
                        <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                            {formData.ingredients.map((ing, idx) => {
                                const selectedMaterial = MOCK_RAW_MATERIALS.find(rm => rm.id === ing.productId);
                                const isLiquid = selectedMaterial?.unit === 'L' || selectedMaterial?.unit === 'ml';

                                return (
                                    <div key={ing.uid} className="grid grid-cols-12 gap-2 items-center">
                                        <div className="col-span-6">
                                            <select
                                                value={ing.productId}
                                                onChange={(e) => handleIngredientChange(formData.ingredients.findIndex(i => i.uid === ing.uid), 'productId', parseInt(e.target.value))}
                                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm focus:ring-slate-500 focus:border-slate-500 bg-white"
                                            >
                                                {MOCK_RAW_MATERIALS.map((rm, idx) => <option key={`${rm.id}-${idx}`} value={rm.id}>{rm.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-span-5">
                                            <input
                                                type="number"
                                                placeholder="Cantidad (g)"
                                                value={ing.quantityGrams}
                                                onChange={e => handleIngredientChange(formData.ingredients.findIndex(i => i.uid === ing.uid), 'quantityGrams', parseFloat(e.target.value) || 0)}
                                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm focus:ring-slate-500 focus:border-slate-500 bg-white"
                                            />
                                            {isLiquid && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Introduce el peso en gramos (ej: 100ml ≈ 100g).
                                                </p>
                                            )}
                                        </div>
                                        <div className="col-span-1">
                                            <button onClick={() => removeIngredient(formData.ingredients.findIndex(i => i.uid === ing.uid))} className="text-red-500 hover:text-red-700 p-1"><TrashIcon className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                            <Button variant="secondary" size="sm" onClick={addIngredient}>+ Añadir ingrediente</Button>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default RecipeModal;