import React, { useState, useEffect } from 'react';
import type { ProductLabel, LabelSymbol } from '../../types.ts';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface LabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (label: ProductLabel) => void;
  label: ProductLabel | null;
}

const ALL_SYMBOLS: { id: LabelSymbol; name: string }[] = [
    { id: 'recycling', name: 'Reciclaje' },
    { id: 'ce', name: 'Marcado CE' },
    { id: 'gluten_free', name: 'Sin Gluten' },
    { id: 'vegan', name: 'Vegano' },
];

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const LabelModal: React.FC<LabelModalProps> = ({ isOpen, onClose, onSave, label }) => {
  const [formData, setFormData] = useState<Omit<ProductLabel, 'id'>>({
    productName: '',
    ingredients: '',
    netQuantity: '',
    instructions: '',
    expiryDate: getTodayDateString(),
    lotNumber: '',
    companyName: 'Delicias Caseras S.L.',
    companyAddress: 'Calle de la Repostería, 42, 28001 Madrid, España',
    companyContact: 'contacto@deliciascaseras.com',
    warnings: '',
    allergens: [],
    originCountry: 'España',
    symbols: [],
    barcode: '',
    language: 'es',
    version: 1,
    status: 'draft',
  });
  const [allergenInput, setAllergenInput] = useState('');

  useEffect(() => {
    if (isOpen && label) {
      setFormData(label);
    } else if (isOpen && !label) {
      // Reset form for new label
      setFormData({
        productName: '', ingredients: '', netQuantity: '', instructions: '',
        expiryDate: getTodayDateString(), lotNumber: '',
        companyName: 'Delicias Caseras S.L.', companyAddress: 'Calle de la Repostería, 42, 28001 Madrid, España',
        companyContact: 'contacto@deliciascaseras.com', warnings: '', allergens: [],
        originCountry: 'España', symbols: [], barcode: '', language: 'es',
        version: 1, status: 'draft',
      });
    }
  }, [label, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSymbolChange = (symbolId: LabelSymbol) => {
    setFormData(prev => {
        const newSymbols = prev.symbols.includes(symbolId)
            ? prev.symbols.filter(s => s !== symbolId)
            : [...prev.symbols, symbolId];
        return { ...prev, symbols: newSymbols };
    });
  };

  const handleAddAllergen = () => {
    if (allergenInput && !formData.allergens.includes(allergenInput.toLowerCase())) {
        setFormData(prev => ({ ...prev, allergens: [...prev.allergens, allergenInput.toLowerCase().trim()] }));
        setAllergenInput('');
    }
  };

  const handleRemoveAllergen = (allergen: string) => {
    setFormData(prev => ({ ...prev, allergens: prev.allergens.filter(a => a !== allergen) }));
  };

  const handleSubmit = () => {
    const finalLabel: ProductLabel = {
      id: label?.id || `LBL${Date.now()}`,
      ...formData,
      version: label ? formData.version : 1,
    };
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
        
        {/* Section 1: Product Info */}
        <fieldset className="border p-4 rounded-md">
            <legend className="text-lg font-semibold px-2 text-gray-700">Información del Producto</legend>
            <div className="space-y-4 pt-2">
                <Input label="Nombre del Producto" id="productName" name="productName" value={formData.productName} onChange={handleChange} />
                <div>
                    <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-1">Ingredientes (destacar alérgenos en MAYÚSCULAS)</label>
                    <textarea id="ingredients" name="ingredients" value={formData.ingredients} onChange={handleChange} rows={3} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm focus:ring-slate-500 focus:border-slate-500 bg-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Cantidad Neta (ej. 500g, 750ml)" id="netQuantity" name="netQuantity" value={formData.netQuantity} onChange={handleChange} />
                    <Input label="País de Origen" id="originCountry" name="originCountry" value={formData.originCountry} onChange={handleChange} />
                </div>
                 <div>
                    <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">Instrucciones de Uso / Preparación</label>
                    <textarea id="instructions" name="instructions" value={formData.instructions} onChange={handleChange} rows={2} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm focus:ring-slate-500 focus:border-slate-500 bg-white" />
                </div>
            </div>
        </fieldset>

        {/* Section 2: Production Info */}
        <fieldset className="border p-4 rounded-md">
            <legend className="text-lg font-semibold px-2 text-gray-700">Trazabilidad y Control</legend>
            <div className="grid grid-cols-2 gap-4 pt-2">
                <Input label="Fecha de Caducidad / Consumo Preferente" id="expiryDate" name="expiryDate" type="date" value={formData.expiryDate} onChange={handleChange} />
                <Input label="Lote de Producción" id="lotNumber" name="lotNumber" value={formData.lotNumber} onChange={handleChange} />
                <Input label="Código de Barras / QR" id="barcode" name="barcode" value={formData.barcode} onChange={handleChange} />
                <Input label="Versión de la Etiqueta" id="version" name="version" type="number" value={formData.version} onChange={handleChange} />
            </div>
        </fieldset>

        {/* Section 3: Allergens and Symbols */}
         <fieldset className="border p-4 rounded-md">
            <legend className="text-lg font-semibold px-2 text-gray-700">Advertencias y Símbolos</legend>
            <div className="space-y-4 pt-2">
                <div>
                    <label htmlFor="warnings" className="block text-sm font-medium text-gray-700 mb-1">Advertencias Generales (ej. "Puede contener trazas de...")</label>
                    <input id="warnings" name="warnings" value={formData.warnings} onChange={handleChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm focus:ring-slate-500 focus:border-slate-500 bg-white" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alérgenos (para resaltado automático)</label>
                    <div className="flex items-center gap-2">
                        <input value={allergenInput} onChange={e => setAllergenInput(e.target.value)} placeholder="Ej. trigo, leche" className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm focus:ring-slate-500 focus:border-slate-500 bg-white" />
                        <Button type="button" variant="secondary" size="sm" onClick={handleAddAllergen}>Añadir</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {formData.allergens.map(allergen => (
                            <span key={allergen} className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                                {allergen}
                                <button onClick={() => handleRemoveAllergen(allergen)} className="ml-1.5 text-gray-500 hover:text-gray-800">&times;</button>
                            </span>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Símbolos Obligatorios</label>
                    <div className="flex flex-wrap gap-4">
                        {ALL_SYMBOLS.map(symbol => (
                            <label key={symbol.id} className="inline-flex items-center">
                                <input type="checkbox" checked={formData.symbols.includes(symbol.id)} onChange={() => handleSymbolChange(symbol.id)} className="rounded border-gray-300 text-slate-600 shadow-sm focus:ring-slate-500" />
                                <span className="ml-2 text-sm text-gray-600">{symbol.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </fieldset>

         {/* Section 4: Settings */}
        <fieldset className="border p-4 rounded-md">
            <legend className="text-lg font-semibold px-2 text-gray-700">Configuración</legend>
            <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <select id="status" name="status" value={formData.status} onChange={handleChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm focus:ring-slate-500 focus:border-slate-500 bg-white">
                        <option value="draft">Borrador</option>
                        <option value="approved">Aprobada</option>
                        <option value="published">Publicada</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Idioma</label>
                    <select id="language" name="language" value={formData.language} onChange={handleChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm focus:ring-slate-500 focus:border-slate-500 bg-white">
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