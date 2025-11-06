import React, { useState, useEffect } from 'react';
import type { ProductLabel, Ingredient } from '../../types.ts';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import NutritionLookup from '../../components/NutritionLookup';
import type { NutritionData } from '../../services/nutritionService';

interface LabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (label: ProductLabel) => void;
  label: ProductLabel | null;
}

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const LabelModal: React.FC<LabelModalProps> = ({ isOpen, onClose, onSave, label }) => {
  const [formData, setFormData] = useState<Omit<ProductLabel, 'id'>>({
    productName: '',
    version: 1,
    status: 'draft',
    language: 'es',
    // CAMPOS REQUERIDOS
    ingredients: [],
    countryOfOrigin: '',
    batchNumber: '',
    allergens: [],
    // Campos opcionales
    netWeight: '',
    expirationDate: getTodayDateString(),
    companyName: 'Delicias Caseras S.L.',
    companyAddress: 'Calle de la Repostería, 42, 28001 Madrid, España',
    usageInstructions: '',
    legalDisclaimer: '',
    // Campos nutricionales
    energyKcalPer100g: undefined,
    energyKjPer100g: undefined,
    fatPer100g: undefined,
    saturatedFatPer100g: undefined,
    carbsPer100g: undefined,
    sugarsPer100g: undefined,
    proteinPer100g: undefined,
    saltPer100g: undefined,
    fiberPer100g: undefined,
    sodiumPer100g: undefined,
  });

  const [newIngredient, setNewIngredient] = useState<Omit<Ingredient, 'id'>>({
    name: '',
    quantity: '',
    unit: 'g', // ← Valor por defecto
    isAllergen: false,
  });

  const [showNutritionLookup, setShowNutritionLookup] = useState(false);

  useEffect(() => {
    if (isOpen && label) {
      setFormData(label);
    } else if (isOpen && !label) {
      // Reset form for new label
      setFormData({
        productName: '',
        version: 1,
        status: 'draft',
        language: 'es',
        ingredients: [],
        countryOfOrigin: '',
        batchNumber: '',
        allergens: [],
        netWeight: '',
        expirationDate: getTodayDateString(),
        companyName: 'Delicias Caseras S.L.',
        companyAddress: 'Calle de la Repostería, 42, 28001 Madrid, España',
        usageInstructions: '',
        legalDisclaimer: '',
        energyKcalPer100g: undefined,
        energyKjPer100g: undefined,
        fatPer100g: undefined,
        saturatedFatPer100g: undefined,
        carbsPer100g: undefined,
        sugarsPer100g: undefined,
        proteinPer100g: undefined,
        saltPer100g: undefined,
        fiberPer100g: undefined,
        sodiumPer100g: undefined,
      });
      setNewIngredient({
        name: '',
        quantity: '',
        unit: 'g',
        isAllergen: false,
      });
    }
  }, [label, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value === '' ? undefined : Number(value) 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddIngredient = () => {
    if (newIngredient.name.trim()) {
      const newIngredientWithId: Ingredient = {
        ...newIngredient,
        id: `ing-${Date.now()}`
      };

      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, newIngredientWithId]
      }));

      // Actualizar allergens automáticamente si el ingrediente es alérgeno
      if (newIngredient.isAllergen) {
        setFormData(prev => ({
          ...prev,
          allergens: [...prev.allergens, newIngredient.name]
        }));
      }

      setNewIngredient({ name: '', quantity: '', unit: 'g', isAllergen: false });
    }
  };

  const handleRemoveIngredient = (index: number) => {
    const ingredientToRemove = formData.ingredients[index];
    
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
      // Remover de allergens si era alérgeno
      allergens: ingredientToRemove.isAllergen 
        ? prev.allergens.filter(allergen => allergen !== ingredientToRemove.name)
        : prev.allergens
    }));
  };

  const handleUpdateIngredient = (index: number, field: keyof Ingredient, value: any) => {
    setFormData(prev => {
      const newIngredients = [...prev.ingredients];
      const oldIngredient = newIngredients[index];
      newIngredients[index] = { ...newIngredients[index], [field]: value };
      
      // Actualizar allergens si cambia el estado de alérgeno o el nombre
      let newAllergens = [...prev.allergens];
      
      if (field === 'isAllergen') {
        if (value && !newAllergens.includes(oldIngredient.name)) {
          newAllergens.push(oldIngredient.name);
        } else if (!value) {
          newAllergens = newAllergens.filter(allergen => allergen !== oldIngredient.name);
        }
      } else if (field === 'name' && oldIngredient.isAllergen) {
        // Si cambia el nombre y era alérgeno, actualizar la lista
        newAllergens = newAllergens.filter(allergen => allergen !== oldIngredient.name);
        if (value.trim()) {
          newAllergens.push(value);
        }
      }
      
      return { 
        ...prev, 
        ingredients: newIngredients,
        allergens: newAllergens
      };
    });
  };

  const handleNutritionData = (data: NutritionData) => {
    setFormData(prev => ({
      ...prev,
      energyKcalPer100g: data.energyKcal,
      energyKjPer100g: data.energyKj,
      proteinPer100g: data.protein,
      fatPer100g: data.fat,
      saturatedFatPer100g: data.saturatedFat,
      carbsPer100g: data.carbs,
      sugarsPer100g: data.sugars,
      fiberPer100g: data.fiber,
      saltPer100g: data.salt,
      sodiumPer100g: data.sodium,
    }));
  };

  const handleSubmit = () => {
    // Validar campos requeridos
    if (!formData.productName.trim()) {
      alert('El nombre del producto es requerido');
      return;
    }
    if (!formData.countryOfOrigin.trim()) {
      alert('El país de origen es requerido');
      return;
    }
    if (!formData.batchNumber.trim()) {
      alert('El número de lote es requerido');
      return;
    }
    if (formData.ingredients.length === 0) {
      alert('Al menos un ingrediente es requerido');
      return;
    }

    // Filtrar ingredientes vacíos
    const validIngredients = formData.ingredients.filter(ing => ing.name.trim() !== '');
    
    if (validIngredients.length === 0) {
      alert('Al menos un ingrediente válido es requerido');
      return;
    }

    // Calcular allergens automáticamente desde ingredientes
    const calculatedAllergens = validIngredients
      .filter(ing => ing.isAllergen)
      .map(ing => ing.name);

    const finalLabel: ProductLabel = {
      id: label?.id || `LBL${Date.now()}`,
      ...formData,
      ingredients: validIngredients,
      allergens: calculatedAllergens, // Usar allergens calculados
      version: label ? formData.version + 1 : 1,
    };

    console.log('📦 Enviando etiqueta:', finalLabel);
    onSave(finalLabel);
  };

  const footer = (
    <div className="space-x-2">
      <Button variant="secondary" onClick={onClose}>Cancelar</Button>
      <Button onClick={handleSubmit}>{label ? 'Guardar Cambios' : 'Crear Etiqueta'}</Button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={label ? 'Editar Etiqueta' : 'Nueva Etiqueta'} footer={footer}>
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
        
        {/* Section 1: Información Básica */}
        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-semibold px-2 text-gray-700">Información Básica</legend>
          <div className="space-y-4 pt-2">
            <Input 
              label="Nombre del Producto *" 
              id="productName" 
              name="productName" 
              value={formData.productName} 
              onChange={handleChange} 
              required 
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="País de Origen *" 
                id="countryOfOrigin" 
                name="countryOfOrigin" 
                value={formData.countryOfOrigin} 
                onChange={handleChange} 
                required 
              />
              <Input 
                label="Número de Lote *" 
                id="batchNumber" 
                name="batchNumber" 
                value={formData.batchNumber} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Peso Neto" 
                id="netWeight" 
                name="netWeight" 
                value={formData.netWeight} 
                onChange={handleChange} 
                placeholder="ej. 500g, 750ml"
              />
              <Input 
                label="Fecha de Expiración" 
                id="expirationDate" 
                name="expirationDate" 
                type="date" 
                value={formData.expirationDate} 
                onChange={handleChange} 
              />
            </div>
          </div>
        </fieldset>

        {/* Section 2: Ingredientes */}
        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-semibold px-2 text-gray-700">Ingredientes *</legend>
          <div className="space-y-4 pt-2">
            {/* Lista de ingredientes existentes */}
            {formData.ingredients.map((ingredient, index) => (
              <div key={ingredient.id} className="flex items-center gap-2 p-2 border rounded">
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Nombre del ingrediente"
                    value={ingredient.name}
                    onChange={(e) => handleUpdateIngredient(index, 'name', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Cantidad"
                    value={ingredient.quantity}
                    onChange={(e) => handleUpdateIngredient(index, 'quantity', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <select
                    value={ingredient.unit}
                    onChange={(e) => handleUpdateIngredient(index, 'unit', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="g">g</option>
                    <option value="ml">ml</option>
                  </select>
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={ingredient.isAllergen}
                    onChange={(e) => handleUpdateIngredient(index, 'isAllergen', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Alérgeno</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(index)}
                  className="text-red-600 hover:text-red-800 p-2"
                >
                  ×
                </button>
              </div>
            ))}

            {/* Formulario para nuevo ingrediente */}
            <div className="flex items-center gap-2 p-2 border rounded bg-gray-50">
              <div className="flex-1 grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Nombre del ingrediente"
                  value={newIngredient.name}
                  onChange={(e) => setNewIngredient({...newIngredient, name: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Cantidad"
                  value={newIngredient.quantity}
                  onChange={(e) => setNewIngredient({...newIngredient, quantity: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <select
                  value={newIngredient.unit}
                  onChange={(e) => setNewIngredient({...newIngredient, unit: e.target.value as 'g' | 'ml'})}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="g">g</option>
                  <option value="ml">ml</option>
                </select>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newIngredient.isAllergen}
                  onChange={(e) => setNewIngredient({...newIngredient, isAllergen: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Alérgeno</span>
              </label>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleAddIngredient}
              >
                Agregar
              </Button>
            </div>

            {/* Mostrar alérgenos detectados */}
            {formData.allergens.length > 0 && (
              <div className="mt-2">
                <span className="text-sm font-medium text-gray-700">Alérgenos detectados: </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.allergens.map((allergen, index) => (
                    <span key={index} className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      {allergen}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </fieldset>

        {/* Section 3: Información Nutricional */}
        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-semibold px-2 text-gray-700">Información Nutricional</legend>
          <div className="space-y-4 pt-2">
            {showNutritionLookup ? (
              <NutritionLookup
                onNutritionData={handleNutritionData}
                ingredientName={formData.productName}
                multipleIngredients={formData.ingredients.map(ing => ing.name).filter(name => name.trim())}
              />
            ) : (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setShowNutritionLookup(true)}
              >
                🍎 Buscar Información Nutricional
              </Button>
            )}

            {/* Campos nutricionales (READONLY - calculados por API) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Energía (kcal/100g)</label>
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                  {formData.energyKcalPer100g || 'No disponible'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Energía (kJ/100g)</label>
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                  {formData.energyKjPer100g || 'No disponible'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proteínas (g/100g)</label>
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                  {formData.proteinPer100g || 'No disponible'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grasas (g/100g)</label>
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                  {formData.fatPer100g || 'No disponible'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grasas saturadas (g/100g)</label>
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                  {formData.saturatedFatPer100g || 'No disponible'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">H. carbono (g/100g)</label>
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                  {formData.carbsPer100g || 'No disponible'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Azúcares (g/100g)</label>
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                  {formData.sugarsPer100g || 'No disponible'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fibra (g/100g)</label>
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                  {formData.fiberPer100g || 'No disponible'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sal (g/100g)</label>
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                  {formData.saltPer100g || 'No disponible'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sodio (mg/100g)</label>
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                  {formData.sodiumPer100g || 'No disponible'}
                </div>
              </div>
            </div>
          </div>
        </fieldset>

        {/* Section 4: Información de la Empresa */}
        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-semibold px-2 text-gray-700">Información de la Empresa</legend>
          <div className="space-y-4 pt-2">
            <Input 
              label="Nombre de la Empresa" 
              id="companyName" 
              name="companyName" 
              value={formData.companyName} 
              onChange={handleChange} 
            />
            <div>
              <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Dirección de la Empresa
              </label>
              <textarea 
                id="companyAddress" 
                name="companyAddress" 
                value={formData.companyAddress} 
                onChange={handleChange} 
                rows={2}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
              />
            </div>
          </div>
        </fieldset>

        {/* Section 5: Instrucciones y Avisos */}
        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-semibold px-2 text-gray-700">Instrucciones y Avisos</legend>
          <div className="space-y-4 pt-2">
            <div>
              <label htmlFor="usageInstructions" className="block text-sm font-medium text-gray-700 mb-1">
                Instrucciones de Uso
              </label>
              <textarea 
                id="usageInstructions" 
                name="usageInstructions" 
                value={formData.usageInstructions} 
                onChange={handleChange} 
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
              />
            </div>
            <div>
              <label htmlFor="legalDisclaimer" className="block text-sm font-medium text-gray-700 mb-1">
                Aviso Legal
              </label>
              <textarea 
                id="legalDisclaimer" 
                name="legalDisclaimer" 
                value={formData.legalDisclaimer} 
                onChange={handleChange} 
                rows={2}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
              />
            </div>
          </div>
        </fieldset>

        {/* Section 6: Configuración */}
        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-semibold px-2 text-gray-700">Configuración</legend>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select 
                id="status" 
                name="status" 
                value={formData.status} 
                onChange={handleChange} 
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
              >
                <option value="draft">Borrador</option>
                <option value="approved">Aprobada</option>
                <option value="published">Publicada</option>
              </select>
            </div>
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Idioma</label>
              <select 
                id="language" 
                name="language" 
                value={formData.language} 
                onChange={handleChange} 
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>
        </fieldset>
      </div>
    </Modal>
  );
};

export default LabelModal;
