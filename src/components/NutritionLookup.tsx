import React, { useState } from 'react';
import { nutritionService, NutritionData } from '../services/nutritionService';
import Button from './ui/Button';

interface NutritionLookupProps {
    onNutritionData: (data: NutritionData) => void;
    ingredientName: string;
    barcode?: string;
    multipleIngredients?: string[];
}

// Función segura para formatear números
const safeFormatNumber = (value: any, decimals: number = 1): string => {
    if (value === null || value === undefined) return '0.0';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(num) ? '0.0' : num.toFixed(decimals);
};

// Función para asegurar que todos los valores sean números
const ensureNumberData = (data: any): NutritionData => {
    return {
        energyKcal: typeof data.energyKcal === 'number' ? data.energyKcal : 0,
        energyKj: typeof data.energyKj === 'number' ? data.energyKj : 0,
        protein: typeof data.protein === 'number' ? data.protein : 0,
        fat: typeof data.fat === 'number' ? data.fat : 0,
        saturatedFat: typeof data.saturatedFat === 'number' ? data.saturatedFat : 0,
        carbs: typeof data.carbs === 'number' ? data.carbs : 0,
        sugars: typeof data.sugars === 'number' ? data.sugars : 0,
        fiber: typeof data.fiber === 'number' ? data.fiber : 0,
        salt: typeof data.salt === 'number' ? data.salt : 0,
        sodium: typeof data.sodium === 'number' ? data.sodium : 0,
    };
};

const NutritionLookup: React.FC<NutritionLookupProps> = ({
    onNutritionData,
    ingredientName,
    barcode,
    multipleIngredients
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<NutritionData | null>(null);
    const [searchType, setSearchType] = useState<'single' | 'composite' | 'recipe'>('single');
    const [apiSource, setApiSource] = useState<string>('');

    const handleSingleLookup = async () => {
        if (!ingredientName.trim()) {
            setError('Ingresa el nombre del ingrediente');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);
        setApiSource('');

        try {
            const response = await nutritionService.getNutritionData(ingredientName, barcode);

            if (response.success && response.data) {
                const safeData = ensureNumberData(response.data);
                setResult(safeData);
                onNutritionData(safeData);
                setApiSource('API Real');
                setError(null);
            } else {
                // Usar datos de ejemplo si la API falla
                console.log('⚠️ API falló, usando datos de ejemplo');
                const sampleData = nutritionService.getSampleNutritionData(ingredientName);
                const safeSampleData = ensureNumberData(sampleData);
                setResult(safeSampleData);
                onNutritionData(safeSampleData);
                setApiSource('Datos de Ejemplo');
                setError(response.error || 'API no disponible - usando datos de ejemplo');
            }
        } catch (err: any) {
            console.log('⚠️ Error en API, usando datos de ejemplo');
            const sampleData = nutritionService.getSampleNutritionData(ingredientName);
            const safeSampleData = ensureNumberData(sampleData);
            setResult(safeSampleData);
            onNutritionData(safeSampleData);
            setApiSource('Datos de Ejemplo');
            setError('Error de conexión - usando datos de ejemplo');
        } finally {
            setLoading(false);
        }
    };

    const handleCompositeLookup = async () => {
        if (!multipleIngredients || multipleIngredients.length === 0) {
            setError('No hay ingredientes para buscar');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);
        setApiSource('');

        try {
            const response = await nutritionService.getCompositeNutritionData(multipleIngredients);

            if (response.success && response.data) {
                const safeData = ensureNumberData(response.data);
                setResult(safeData);
                onNutritionData(safeData);
                setApiSource('API Real - Combinación');
                setError(null);
            } else {
                // Fallback a datos de ejemplo para el primer ingrediente
                console.log('⚠️ API compuesta falló, usando datos de ejemplo');
                const sampleData = nutritionService.getSampleNutritionData(multipleIngredients[0]);
                const safeSampleData = ensureNumberData(sampleData);
                setResult(safeSampleData);
                onNutritionData(safeSampleData);
                setApiSource('Datos de Ejemplo');
                setError(response.error || 'API no disponible - usando datos de ejemplo');
            }
        } catch (err: any) {
            console.log('⚠️ Error en API compuesta, usando datos de ejemplo');
            // Fallback a datos de ejemplo
            const sampleData = multipleIngredients && multipleIngredients.length > 0 
                ? nutritionService.getSampleNutritionData(multipleIngredients[0])
                : nutritionService.getSampleNutritionData('ingrediente');
            const safeSampleData = ensureNumberData(sampleData);
            setResult(safeSampleData);
            onNutritionData(safeSampleData);
            setApiSource('Datos de Ejemplo');
            setError('Error de conexión - usando datos de ejemplo');
        } finally {
            setLoading(false);
        }
    };

    const handleRecipeCalculation = async () => {
        if (!multipleIngredients || multipleIngredients.length === 0) {
            setError('No hay ingredientes para calcular');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);
        setApiSource('');

        try {
            // Para el cálculo de receta, necesitamos cantidades
            // Usar cantidad por defecto de 100g para cada ingrediente
            const ingredientsWithQuantities = multipleIngredients.map(name => ({
                name,
                quantity: '100g'
            }));

            const nutritionData = await nutritionService.calculateRecipeNutrition(ingredientsWithQuantities);
            const safeData = ensureNumberData(nutritionData);
            setResult(safeData);
            onNutritionData(safeData);
            setApiSource('API Real - Cálculo Receta');
            setError(null);
        } catch (err: any) {
            console.log('⚠️ Error en cálculo de receta, usando datos de ejemplo');
            // Fallback a datos de ejemplo
            const sampleData = nutritionService.getSampleNutritionData(multipleIngredients[0]);
            const safeSampleData = ensureNumberData(sampleData);
            setResult(safeSampleData);
            onNutritionData(safeSampleData);
            setApiSource('Datos de Ejemplo');
            setError('Error de cálculo - usando datos de ejemplo');
        } finally {
            setLoading(false);
        }
    };

    const getLookupButton = () => {
        const baseProps = {
            size: "sm" as const,
            variant: "secondary" as const,
            disabled: loading
        };

        switch (searchType) {
            case 'single':
                return (
                    <Button
                        {...baseProps}
                        onClick={handleSingleLookup}
                        disabled={loading || !ingredientName.trim()}
                    >
                        {loading ? '🔍 Buscando...' : '🍎 Buscar Nutrición'}
                    </Button>
                );

            case 'composite':
                return (
                    <Button
                        {...baseProps}
                        onClick={handleCompositeLookup}
                        disabled={loading || !multipleIngredients?.length}
                    >
                        {loading ? '🔍 Analizando...' : '🍽️ Analizar Combinación'}
                    </Button>
                );

            case 'recipe':
                return (
                    <Button
                        {...baseProps}
                        onClick={handleRecipeCalculation}
                        disabled={loading || !multipleIngredients?.length}
                    >
                        {loading ? '🧮 Calculando...' : '📊 Calcular Receta'}
                    </Button>
                );

            default:
                return null;
        }
    };

    const getSearchDescription = () => {
        switch (searchType) {
            case 'single':
                return ingredientName 
                    ? `Buscando datos nutricionales para: "${ingredientName}"`
                    : 'Ingresa un ingrediente para buscar';
            case 'composite':
                return multipleIngredients && multipleIngredients.length > 0
                    ? `Analizando ${multipleIngredients.length} ingredientes combinados`
                    : 'Agrega ingredientes primero';
            case 'recipe':
                return multipleIngredients && multipleIngredients.length > 0
                    ? `Calculando receta completa con ${multipleIngredients.length} ingredientes`
                    : 'Agrega ingredientes para calcular';
            default:
                return '';
        }
    };

    return (
        <div className="border rounded-lg p-4 bg-blue-50">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700">🍎 Buscador de Nutrición</h4>

                <select
                    value={searchType}
                    onChange={(e) => {
                        setSearchType(e.target.value as any);
                        setResult(null);
                        setError(null);
                        setApiSource('');
                    }}
                    className="text-sm border rounded px-2 py-1"
                    disabled={loading}
                >
                    <option value="single">Ingrediente único</option>
                    <option value="composite">Combinación</option>
                    <option value="recipe">Receta completa</option>
                </select>
            </div>

            <div className="mb-3">
                <p className="text-sm text-gray-600 mb-2">{getSearchDescription()}</p>
                
                <div className="flex items-center gap-2">
                    {getLookupButton()}

                    {barcode && (
                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                            📷 Código: {barcode}
                        </span>
                    )}
                </div>
            </div>

            {error && (
                <div className={`rounded-md p-3 mb-3 ${
                    apiSource === 'API Real' ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
                }`}>
                    <p className={`text-sm ${
                        apiSource === 'API Real' ? 'text-green-800' : 'text-yellow-800'
                    }`}>
                        {apiSource && <strong>Fuente: {apiSource}</strong>}
                        <br />
                        {error}
                    </p>
                </div>
            )}

            {result && (
                <div className="text-sm space-y-2 bg-white p-3 rounded border">
                    <div className="flex justify-between items-center">
                        <h5 className="font-medium text-gray-700">Datos nutricionales por 100g:</h5>
                        {apiSource && (
                            <span className={`text-xs px-2 py-1 rounded ${
                                apiSource.includes('API Real') 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {apiSource}
                            </span>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Energía:</span>
                        <span className="font-medium">
                            {safeFormatNumber(result.energyKcal)} kcal / {safeFormatNumber(result.energyKj)} kJ
                        </span>

                        <span className="text-gray-600">Proteínas:</span>
                        <span className="font-medium">{safeFormatNumber(result.protein)}g</span>

                        <span className="text-gray-600">Grasas:</span>
                        <span className="font-medium">{safeFormatNumber(result.fat)}g</span>

                        <span className="text-gray-600">Grasas saturadas:</span>
                        <span className="font-medium">{safeFormatNumber(result.saturatedFat)}g</span>

                        <span className="text-gray-600">Hidratos carbono:</span>
                        <span className="font-medium">{safeFormatNumber(result.carbs)}g</span>

                        <span className="text-gray-600">Azúcares:</span>
                        <span className="font-medium">{safeFormatNumber(result.sugars)}g</span>

                        <span className="text-gray-600">Fibra:</span>
                        <span className="font-medium">{safeFormatNumber(result.fiber)}g</span>

                        <span className="text-gray-600">Sal:</span>
                        <span className="font-medium">{safeFormatNumber(result.salt)}g</span>

                        <span className="text-gray-600">Sodio:</span>
                        <span className="font-medium">{safeFormatNumber(result.sodium)}mg</span>
                    </div>
                    
                    <div className="mt-3 pt-2 border-t border-gray-200">
                        <Button 
                            onClick={() => onNutritionData(result)} 
                            size="sm" 
                            className="w-full bg-green-600 hover:bg-green-700"
                        >
                            ✅ Aplicar estos datos a la etiqueta
                        </Button>
                    </div>
                </div>
            )}

            <div className="mt-3 text-xs text-gray-500">
                <p><strong>🔍 Fuentes consultadas:</strong> USDA FoodData Central & Open Food Facts</p>
                <p className="mt-1">💡 <strong>Nota:</strong> El sistema intenta primero conectar a APIs reales. Si fallan, usa datos de ejemplo automáticamente.</p>
            </div>
        </div>
    );
};

export default NutritionLookup;

