import React, { useState, useEffect } from 'react';
import type { Recipe, RecipeSummary } from '../../types';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { recipeApi } from "../../api/recipeApi";

interface RecipeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveSuccess: () => void;
    recipeSummary: RecipeSummary | null;
}

interface Ingredient {
    uid: string;
    name: string;
    quantity: number | '';
    unit: 'g' | 'ml' | 'unidades';
    quantityGrams: number;
    fdcId?: string;
    nutritionData?: NutritionData;
}

interface NutritionData {
    calories: number;
    protein: number;
    carbohydrates: number;
    sugars: number;
    fat: number;
    saturatedFat: number;
    fiber: number;
    sodium: number;
    salt: number;
}

interface FormData {
    name: string;
    description: string;
    yieldWeightGrams: number;
    ingredients: Ingredient[];
}

interface CreateRecipePayload {
    name: string;
    description: string;
    yieldWeightGrams: number;
    ingredients: {
        name: string;
        quantityGrams: number;
        fdcId?: string;
        displayOrder: number;
    }[];
}

const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.033c-1.12 0-2.033.954-2.033 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

const RecipeModal: React.FC<RecipeModalProps> = ({ isOpen, onClose, onSaveSuccess, recipeSummary }) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        description: '',
        ingredients: [],
        yieldWeightGrams: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchingIngredient, setSearchingIngredient] = useState<string | null>(null);
    const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);

    const convertToGrams = (quantity: number, unit: 'g' | 'ml' | 'unidades'): number => {
        switch (unit) {
            case 'g':
                return quantity;
            case 'ml':
                return quantity;
            case 'unidades':
                return quantity * 100;
            default:
                return quantity;
        }
    };

    const calculateTotalWeight = (ingredients: Ingredient[]): number => {
        return ingredients.reduce((total, ing) => total + (ing.quantityGrams || 0), 0);
    };

    useEffect(() => {
        const fetchRecipe = async (id: number) => {
            setLoading(true);
            setError(null);
            try {
                const recipeData = await recipeApi.getById(id);
                const ingredients: Ingredient[] = recipeData.ingredients.map(ing => ({
                    uid: crypto.randomUUID(),
                    name: ing.product?.name || 'Ingrediente',
                    quantity: ing.quantityGrams,
                    unit: 'g',
                    quantityGrams: ing.quantityGrams,
                    fdcId: ing.fdcId,
                    nutritionData: ing.nutritionData
                }));

                setFormData({
                    name: recipeData.name,
                    description: recipeData.description,
                    yieldWeightGrams: recipeData.yieldWeightGrams,
                    ingredients: ingredients
                });
                
                calculateTotalNutrition(ingredients);
            } catch (e: unknown) {
                if (e instanceof Error) {
                    setError(e.message);
                } else {
                    setError('Error al cargar los datos de la receta.');
                }
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            if (recipeSummary) {
                fetchRecipe(recipeSummary.id);
            } else {
                setFormData({
                    name: '',
                    description: '',
                    ingredients: [],
                    yieldWeightGrams: 0
                });
                setNutritionData(null);
            }
        }
    }, [recipeSummary, isOpen]);

    useEffect(() => {
        const totalWeight = calculateTotalWeight(formData.ingredients);
        setFormData(prev => ({
            ...prev,
            yieldWeightGrams: totalWeight
        }));
    }, [formData.ingredients]);

    const searchNutritionData = async (ingredientName: string, ingredientIndex: number) => {
        if (!ingredientName.trim()) {
            setError('Ingresa un nombre de ingrediente para buscar');
            return;
        }

        setSearchingIngredient(ingredientName);
        setError(null);

        try {
            const usdaUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=FwKNSHr77iMAwmJSUWIro9w53Gm4YSqrP3YLp4Ql&query=${encodeURIComponent(ingredientName)}&pageSize=3`;
            const usdaResponse = await fetch(usdaUrl);

            let nutrition: NutritionData | null = null;
            let fdcId: string | undefined;

            if (usdaResponse.ok) {
                const usdaData = await usdaResponse.json();
                if (usdaData.foods && usdaData.foods.length > 0) {
                    const food = usdaData.foods[0];
                    fdcId = food.fdcId;
                    const nutrients = food.foodNutrients;
                    
                    const getNutrient = (nutrientId: number) => {
                        const nutrient = nutrients.find((n: any) => n.nutrientId === nutrientId);
                        return nutrient ? nutrient.value : 0;
                    };

                    nutrition = {
                        calories: getNutrient(1008),
                        protein: getNutrient(1003),
                        carbohydrates: getNutrient(1005),
                        sugars: getNutrient(2000),
                        fat: getNutrient(1004),
                        saturatedFat: getNutrient(1258),
                        fiber: getNutrient(1079),
                        sodium: getNutrient(1093),
                        salt: getNutrient(1093) * 2.5 / 1000
                    };
                }
            }

            if (!nutrition) {
                const offUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(ingredientName)}&page_size=1&json=1`;
                const offResponse = await fetch(offUrl);

                if (offResponse.ok) {
                    const offData = await offResponse.json();
                    if (offData.products && offData.products.length > 0) {
                        const product = offData.products[0];
                        const nutriments = product.nutriments || {};
                        
                        nutrition = {
                            calories: nutriments['energy-kcal_100g'] || nutriments['energy-kcal'] || 0,
                            protein: nutriments['proteins_100g'] || nutriments['proteins'] || 0,
                            carbohydrates: nutriments['carbohydrates_100g'] || nutriments['carbohydrates'] || 0,
                            sugars: nutriments['sugars_100g'] || nutriments['sugars'] || 0,
                            fat: nutriments['fat_100g'] || nutriments['fat'] || 0,
                            saturatedFat: nutriments['saturated-fat_100g'] || nutriments['saturated-fat'] || 0,
                            fiber: nutriments['fiber_100g'] || nutriments['fiber'] || 0,
                            sodium: nutriments['sodium_100g'] || nutriments['sodium'] || 0,
                            salt: nutriments['salt_100g'] || nutriments['salt'] || 0
                        };
                    }
                }
            }

            if (nutrition) {
                const updatedIngredients = [...formData.ingredients];
                updatedIngredients[ingredientIndex] = {
                    ...updatedIngredients[ingredientIndex],
                    fdcId: fdcId,
                    nutritionData: nutrition
                };
                
                setFormData(prev => ({ ...prev, ingredients: updatedIngredients }));
                calculateTotalNutrition(updatedIngredients);
                
                setError(`✅ Datos nutricionales encontrados para "${ingredientName}"`);
            } else {
                setError(`❌ No se encontraron datos nutricionales para "${ingredientName}"`);
            }

        } catch (error) {
            console.error('Error buscando datos nutricionales:', error);
            setError('Error de conexión al buscar datos nutricionales');
        } finally {
            setSearchingIngredient(null);
        }
    };

    const calculateTotalNutrition = (ingredients: Ingredient[]) => {
        if (ingredients.length === 0) {
            setNutritionData(null);
            return;
        }

        const totalNutrition: NutritionData = {
            calories: 0,
            protein: 0,
            carbohydrates: 0,
            sugars: 0,
            fat: 0,
            saturatedFat: 0,
            fiber: 0,
            sodium: 0,
            salt: 0
        };

        ingredients.forEach(ingredient => {
            if (ingredient.nutritionData && ingredient.quantityGrams > 0) {
                const factor = ingredient.quantityGrams / 100;
                Object.keys(totalNutrition).forEach(key => {
                    const nutrientKey = key as keyof NutritionData;
                    totalNutrition[nutrientKey] += (ingredient.nutritionData![nutrientKey] || 0) * factor;
                });
            }
        });

        setNutritionData(totalNutrition);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    const handleIngredientChange = (
        index: number,
        field: 'name' | 'quantity' | 'unit',
        value: string | number
    ) => {
        const newIngredients = [...formData.ingredients];
        const currentIngredient = newIngredients[index];
        
        let updatedIngredient: Ingredient;

        if (field === 'unit') {
            const unit = value as 'g' | 'ml' | 'unidades';
            const currentQuantity = currentIngredient.quantity === '' ? 0 : currentIngredient.quantity as number;
            const quantityGrams = convertToGrams(currentQuantity, unit);
            updatedIngredient = {
                ...currentIngredient,
                unit: unit,
                quantityGrams: quantityGrams
            };
        } else if (field === 'quantity') {
            if (value === '') {
                updatedIngredient = {
                    ...currentIngredient,
                    quantity: '',
                    quantityGrams: 0
                };
            } else {
                const quantity = typeof value === 'number' ? value : parseFloat(value as string) || 0;
                const quantityGrams = convertToGrams(quantity, currentIngredient.unit);
                updatedIngredient = {
                    ...currentIngredient,
                    quantity: quantity,
                    quantityGrams: quantityGrams
                };
            }
        } else {
            updatedIngredient = {
                ...currentIngredient,
                [field]: value
            };
        }

        newIngredients[index] = updatedIngredient;
        setFormData(prev => ({
            ...prev,
            ingredients: newIngredients,
        }));

        if (field === 'quantity' || field === 'unit') {
            calculateTotalNutrition(newIngredients);
        }
    };

    const addIngredient = () => {
        setFormData(prev => ({
            ...prev,
            ingredients: [...prev.ingredients, {
                uid: crypto.randomUUID(),
                name: '',
                quantity: '',
                unit: 'g',
                quantityGrams: 0,
            }]
        }));
    };

    const removeIngredient = (index: number) => {
        const newIngredients = formData.ingredients.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            ingredients: newIngredients
        }));
        calculateTotalNutrition(newIngredients);
    };

    const handleSubmit = async () => {
        setError(null);
        
        const invalidIngredient = formData.ingredients.find(ing => {
            const quantity = ing.quantity === '' ? 0 : ing.quantity as number;
            return !quantity || quantity <= 0 || !ing.name.trim();
        });
        
        if (invalidIngredient) {
            setError('Cada ingrediente debe tener un nombre y una cantidad mayor a 0');
            return;
        }

        if (!formData.yieldWeightGrams || formData.yieldWeightGrams < 1) {
            setError('El peso total debe ser mayor o igual a 1 gramo');
            return;
        }
        
        if (!formData.ingredients || formData.ingredients.length === 0) {
            setError('Debe agregar al menos un ingrediente');
            return;
        }
        
        if (!formData.name?.trim()) {
            setError('El nombre de la receta es requerido');
            return;
        }

        setLoading(true);

        const payload: CreateRecipePayload = {
            name: formData.name.trim(),
            description: formData.description?.trim() || '',
            yieldWeightGrams: Math.max(1, formData.yieldWeightGrams),
            ingredients: formData.ingredients.map((ing, index) => ({
                name: ing.name.trim(),
                quantityGrams: Math.max(0.01, ing.quantityGrams),
                fdcId: ing.fdcId,
                displayOrder: index,
            })),
        };

        try {
            if (recipeSummary) {
                await recipeApi.update(recipeSummary.id, payload as any);
            } else {
                await recipeApi.create(payload as any);
            }
            onSaveSuccess();
            onClose();
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError('Error desconocido al guardar la receta');
            }
        } finally {
            setLoading(false);
        }
    };

    const footer = (
        <div className="space-x-2">
            <Button variant="secondary" onClick={onClose} disabled={loading}>
                Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Guardando...' : recipeSummary ? 'Guardar Cambios' : 'Crear Receta'}
            </Button>
        </div>
    );

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={recipeSummary ? 'Editar Receta' : 'Nueva Receta'} 
            footer={footer} 
            size="lg"
            maxHeight="85vh"
        >
            {loading && <p>Cargando...</p>}
            {error && (
                <p className={`p-3 rounded-md mb-4 ${
                    error.includes('✅') 
                        ? 'text-green-700 bg-green-50 border border-green-200' 
                        : 'text-red-500 bg-red-50 border border-red-200'
                }`}>
                    {error}
                </p>
            )}
            
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                        label="Nombre de receta" 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                    />
                    <div>
                        <label htmlFor="yieldWeightGrams" className="block text-sm font-medium text-gray-700 mb-1">
                            Peso Total Calculado (gramos)
                        </label>
                        <input
                            id="yieldWeightGrams"
                            name="yieldWeightGrams"
                            type="number"
                            step="0.01"
                            min="1"
                            value={formData.yieldWeightGrams.toFixed(2)}
                            readOnly
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-700 sm:text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Calculado automáticamente de los ingredientes
                        </p>
                    </div>
                </div>
                
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <textarea 
                        id="description" 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange} 
                        rows={2} 
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm focus:ring-slate-500 focus:border-slate-500 bg-white"
                    />
                </div>

                <div className="pt-4 border-t">
                    <h4 className="text-md font-semibold text-gray-800 mb-3">Ingredientes</h4>
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2 border rounded-lg p-3 bg-gray-50">
                        {formData.ingredients.map((ing, idx) => (
                            <div key={ing.uid} className="grid grid-cols-12 gap-2 items-start border-b pb-3 last:border-b-0">
                                <div className="col-span-4">
                                    <input
                                        type="text"
                                        placeholder="Nombre del ingrediente"
                                        value={ing.name}
                                        onChange={e => handleIngredientChange(idx, 'name', e.target.value)}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm focus:ring-slate-500 focus:border-slate-500 bg-white"
                                    />
                                </div>
                                
                                <div className="col-span-2">
                                    <input
                                        type="number"
                                        placeholder="Cantidad"
                                        step="0.01"
                                        min="0"
                                        value={ing.quantity}
                                        onChange={e => {
                                            const value = e.target.value;
                                            if (value === '') {
                                                handleIngredientChange(idx, 'quantity', '');
                                            } else {
                                                handleIngredientChange(idx, 'quantity', parseFloat(value) || 0);
                                            }
                                        }}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm focus:ring-slate-500 focus:border-slate-500 bg-white"
                                    />
                                </div>
                                
                                <div className="col-span-2">
                                    <select
                                        value={ing.unit}
                                        onChange={e => handleIngredientChange(idx, 'unit', e.target.value)}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm focus:ring-slate-500 focus:border-slate-500 bg-white"
                                    >
                                        <option value="g">gramos</option>
                                        <option value="ml">mililitros</option>
                                        <option value="unidades">unidades</option>
                                    </select>
                                </div>
                                
                                <div className="col-span-4 flex space-x-1">
                                    <Button 
                                        size="sm" 
                                        variant="secondary"
                                        onClick={() => searchNutritionData(ing.name, idx)}
                                        disabled={!ing.name.trim() || searchingIngredient === ing.name}
                                        className="flex items-center space-x-1"
                                    >
                                        {searchingIngredient === ing.name ? (
                                            <>
                                                <SearchIcon className="w-3 h-3 animate-pulse" />
                                                <span>Buscando...</span>
                                            </>
                                        ) : (
                                            <>
                                                <SearchIcon className="w-3 h-3" />
                                                <span>Buscar Nutri</span>
                                            </>
                                        )}
                                    </Button>
                                    
                                    <button 
                                        onClick={() => removeIngredient(idx)} 
                                        className="text-red-500 hover:text-red-700 p-1 flex items-center"
                                        type="button"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                                
                                {ing.nutritionData && (
                                    <div className="col-span-12 mt-2">
                                        <p className="text-xs text-green-600 bg-green-50 p-2 rounded border border-green-200">
                                            ✓ Datos nutricionales cargados ({ing.quantityGrams.toFixed(1)}g total)
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-3">
                        <Button variant="secondary" size="sm" onClick={addIngredient}>
                            + Añadir ingrediente
                        </Button>
                        <span className="text-sm text-gray-500">
                            {formData.ingredients.length} ingredientes · {formData.yieldWeightGrams.toFixed(1)}g total
                        </span>
                    </div>
                </div>

                {nutritionData && (
                    <div className="pt-4 border-t">
                        <h4 className="text-md font-semibold text-gray-800 mb-3">
                            Información Nutricional Calculada ({formData.yieldWeightGrams.toFixed(1)}g total)
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-md border">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                <div>
                                    <span className="font-medium">Calorías:</span>
                                    <br />
                                    <span className="text-gray-600">{nutritionData.calories.toFixed(1)} kcal</span>
                                </div>
                                <div>
                                    <span className="font-medium">Proteínas:</span>
                                    <br />
                                    <span className="text-gray-600">{nutritionData.protein.toFixed(1)}g</span>
                                </div>
                                <div>
                                    <span className="font-medium">Carbohidratos:</span>
                                    <br />
                                    <span className="text-gray-600">{nutritionData.carbohydrates.toFixed(1)}g</span>
                                </div>
                                <div>
                                    <span className="font-medium">Azúcares:</span>
                                    <br />
                                    <span className="text-gray-600">{nutritionData.sugars.toFixed(1)}g</span>
                                </div>
                                <div>
                                    <span className="font-medium">Grasas:</span>
                                    <br />
                                    <span className="text-gray-600">{nutritionData.fat.toFixed(1)}g</span>
                                </div>
                                <div>
                                    <span className="font-medium">Grasas Sat.:</span>
                                    <br />
                                    <span className="text-gray-600">{nutritionData.saturatedFat.toFixed(1)}g</span>
                                </div>
                                <div>
                                    <span className="font-medium">Fibra:</span>
                                    <br />
                                    <span className="text-gray-600">{nutritionData.fiber.toFixed(1)}g</span>
                                </div>
                                <div>
                                    <span className="font-medium">Sodio:</span>
                                    <br />
                                    <span className="text-gray-600">{nutritionData.sodium.toFixed(1)}mg</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default RecipeModal;