import React from 'react';
import type { ProductLabel, LabelSymbol } from '../../types.ts';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface LabelPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  label: ProductLabel;
}

// Dummy symbol components for demonstration
const RecyclingIcon = () => <span title="Reciclaje">♻️</span>;
const CEIcon = () => <span className="font-bold" title="Marcado CE">CE</span>;
const GlutenFreeIcon = () => <span title="Sin Gluten">🌾</span>;
const VeganIcon = () => <span title="Vegano">🌱</span>;

const SYMBOL_MAP: Record<LabelSymbol, React.ReactNode> = {
    recycling: <RecyclingIcon />,
    ce: <CEIcon />,
    'gluten_free': <GlutenFreeIcon />,
    vegan: <VeganIcon />,
};

const LabelPreviewModal: React.FC<LabelPreviewModalProps> = ({ isOpen, onClose, label }) => {

  const highlightAllergens = (text: string, allergens: string[]) => {
    if (!allergens.length) return text;
    const regex = new RegExp(`(${allergens.join('|')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
        allergens.some(allergen => allergen.toLowerCase() === part.toLowerCase())
            ? <strong key={i}>{part}</strong>
            : part
    );
  };

  const footer = (
    <Button onClick={() => window.print()}>Imprimir / Exportar a PDF</Button>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Previsualización de Etiqueta" footer={footer}>
      <div className="bg-white border-2 border-dashed border-gray-300 p-6 font-sans text-xs text-black">
        <h1 className="text-xl font-bold text-center mb-2">{label.productName}</h1>
        
        <div className="grid grid-cols-2 gap-4 border-t border-b py-2 my-2">
            <div>
                <p><span className="font-bold">Cantidad Neta:</span> {label.netQuantity}</p>
                <p><span className="font-bold">País de Origen:</span> {label.originCountry}</p>
            </div>
             <div className="text-right">
                <p><span className="font-bold">Lote:</span> {label.lotNumber}</p>
                <p><span className="font-bold">Consumir preferentemente antes del:</span> {label.expiryDate}</p>
            </div>
        </div>

        <div>
            <h2 className="font-bold">Ingredientes:</h2>
            <p>{highlightAllergens(label.ingredients, label.allergens)}</p>
        </div>
        
        {label.warnings && (
            <div className="mt-2">
                <p><span className="font-bold">Advertencias:</span> {label.warnings}</p>
            </div>
        )}

        <div className="mt-2">
            <h2 className="font-bold">Instrucciones de uso:</h2>
            <p>{label.instructions}</p>
        </div>

        <div className="mt-4 pt-2 border-t text-center text-[10px]">
            <p className="font-bold">{label.companyName}</p>
            <p>{label.companyAddress}</p>
            <p>{label.companyContact}</p>
        </div>
        
        <div className="flex justify-between items-center mt-4">
             <div className="flex space-x-2 text-lg">
                {label.symbols.map(s => <span key={s}>{SYMBOL_MAP[s]}</span>)}
            </div>
            <div className="font-mono text-center">
                <p>║█║▌║█║▌│║▌█║▌║</p>
                <p>{label.barcode}</p>
            </div>
        </div>
      </div>
    </Modal>
  );
};

export default LabelPreviewModal;