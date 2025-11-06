import React, { useRef, useState, useCallback } from 'react';
import type { ProductLabel, LabelSymbol } from '../../types.ts';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface LabelPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  label: ProductLabel;
}

// Dummy symbol components
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
  const labelRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  // Función segura para formatear ingredientes
  const formatIngredientsList = useCallback((ingredients: typeof label.ingredients) => {
    if (!ingredients || !Array.isArray(ingredients)) {
      return 'No hay ingredientes especificados';
    }
    
    return ingredients
      .filter(ing => ing && ing.name && ing.name.trim())
      .map(ing => {
        const quantity = ing.quantity || '';
        const unit = ing.unit || 'g';
        return `${ing.name}${quantity ? ` (${quantity}${unit})` : ''}`;
      })
      .join(', ');
  }, []);

  // Función segura para resaltar alérgenos
  const highlightAllergens = useCallback((ingredients: typeof label.ingredients, allergens: string[]) => {
    const ingredientsText = formatIngredientsList(ingredients);
    
    if (!allergens || !Array.isArray(allergens) || allergens.length === 0) {
      return ingredientsText;
    }

    let highlightedText = ingredientsText;
    allergens.forEach(allergen => {
      if (allergen && allergen.trim()) {
        const regex = new RegExp(`\\b${allergen}\\b`, 'gi');
        highlightedText = highlightedText.replace(regex, `<strong>${allergen}</strong>`);
      }
    });

    return highlightedText;
  }, [formatIngredientsList]);

  const formatDate = useCallback((dateString: string | undefined) => {
    if (!dateString) return 'No especificada';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  }, []);

  const handlePrint = useCallback(async () => {
    if (!labelRef.current) return;

    setIsPrinting(true);
    
    try {
      // Crear estilos de impresión
      const printStyles = `
        <style>
          @page { 
            size: 100mm 150mm; 
            margin: 5mm; 
          }
          @media print {
            body { 
              margin: 0; 
              padding: 0; 
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .print-content { 
              width: 100mm !important; 
              height: 150mm !important; 
              margin: 0 !important; 
              padding: 5mm !important; 
              box-shadow: none !important; 
              border: none !important; 
              font-size: 10px !important;
              font-family: Arial, sans-serif !important;
            }
          }
        </style>
      `;

      // Crear ventana de impresión
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Por favor, permite ventanas emergentes para imprimir');
        return;
      }

      printWindow.document.write(`
        <html>
          <head>
            <title>Etiqueta - ${label.productName || 'Producto'}</title>
            ${printStyles}
          </head>
          <body>
            ${labelRef.current.innerHTML}
          </body>
        </html>
      `);

      printWindow.document.close();
      
      // Esperar a que se cargue el contenido
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        printWindow.onafterprint = () => {
          printWindow.close();
          setIsPrinting(false);
        };
      };
      
    } catch (error) {
      console.error('Error al imprimir:', error);
      setIsPrinting(false);
      alert('Error al imprimir. Intenta nuevamente.');
    }
  }, [label.productName]);

  const downloadAsPDF = () => {
    handlePrint();
  };

  const footer = (
    <div className="space-x-2">
      <Button variant="secondary" onClick={onClose} disabled={isPrinting}>
        Cerrar
      </Button>
      <Button onClick={downloadAsPDF} disabled={isPrinting}>
        {isPrinting ? '🖨️ Imprimiendo...' : '🖨️ Imprimir / Exportar a PDF'}
      </Button>
    </div>
  );

  // Validar que el label tenga los datos mínimos necesarios
  if (!label) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Error de Previsualización" footer={footer}>
        <div className="text-center p-6">
          <p className="text-red-600">Error: No hay datos de etiqueta para mostrar</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Previsualización de Etiqueta" footer={footer} size="lg">
      {/* Contenedor principal de la etiqueta */}
      <div ref={labelRef} className="print-content bg-white p-4 font-sans text-xs text-black mx-auto border-2 border-gray-300">
        {/* Encabezado */}
        <div className="text-center border-b border-gray-300 pb-2 mb-3">
          <h1 className="text-lg font-bold uppercase tracking-tight">
            {label.productName || 'Nombre del Producto No Especificado'}
          </h1>
        </div>

        {/* Información básica */}
        <div className="space-y-1 mb-3 text-xs">
          <div className="flex justify-between">
            <span className="font-semibold">Lote:</span>
            <span className="font-mono">{label.batchNumber || 'No especificado'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Caducidad:</span>
            <span>{formatDate(label.expirationDate)}</span>
          </div>
          {label.netWeight && (
            <div className="flex justify-between">
              <span className="font-semibold">Peso neto:</span>
              <span>{label.netWeight}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="font-semibold">País de origen:</span>
            <span>{label.countryOfOrigin || 'No especificado'}</span>
          </div>
        </div>

        {/* Ingredientes */}
        <div className="mb-3">
          <h2 className="font-bold text-sm border-b border-gray-300 pb-1 mb-1">INGREDIENTES</h2>
          <p 
            className="text-xs leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: highlightAllergens(label.ingredients, label.allergens || []) 
            }} 
          />
        </div>

        {/* Alérgenos */}
        {label.allergens && Array.isArray(label.allergens) && label.allergens.length > 0 && (
          <div className="mb-3 bg-red-50 border border-red-200 p-2 rounded">
            <h2 className="font-bold text-sm text-red-800 mb-1">⚠️ CONTIENE ALCÉRGENOS</h2>
            <p className="text-xs text-red-700 font-semibold">
              {label.allergens.filter(allergen => allergen && allergen.trim()).join(', ')}
            </p>
          </div>
        )}

        {/* Información Nutricional */}
        {(label.energyKcalPer100g || label.proteinPer100g || label.fatPer100g) && (
          <div className="mb-3">
            <h2 className="font-bold text-sm border-b border-gray-300 pb-1 mb-1 text-center">INFORMACIÓN NUTRICIONAL</h2>
            <p className="text-xs text-center mb-2 text-gray-600">(Por 100g de producto)</p>
            <div className="space-y-1 text-xs">
              {label.energyKcalPer100g !== undefined && (
                <div className="flex justify-between">
                  <span>Valor energético</span>
                  <span className="font-semibold">
                    {label.energyKcalPer100g} kcal / {label.energyKjPer100g || Math.round(label.energyKcalPer100g * 4.184)} kJ
                  </span>
                </div>
              )}
              {label.fatPer100g !== undefined && (
                <div className="flex justify-between">
                  <span>Grasas</span>
                  <span>{label.fatPer100g}g</span>
                </div>
              )}
              {label.saturatedFatPer100g !== undefined && (
                <div className="flex justify-between pl-3">
                  <span className="text-gray-600">• de las cuales saturadas</span>
                  <span>{label.saturatedFatPer100g}g</span>
                </div>
              )}
              {label.carbsPer100g !== undefined && (
                <div className="flex justify-between">
                  <span>Hidratos de carbono</span>
                  <span>{label.carbsPer100g}g</span>
                </div>
              )}
              {label.sugarsPer100g !== undefined && (
                <div className="flex justify-between pl-3">
                  <span className="text-gray-600">• de los cuales azúcares</span>
                  <span>{label.sugarsPer100g}g</span>
                </div>
              )}
              {label.proteinPer100g !== undefined && (
                <div className="flex justify-between">
                  <span>Proteínas</span>
                  <span>{label.proteinPer100g}g</span>
                </div>
              )}
              {label.saltPer100g !== undefined && (
                <div className="flex justify-between">
                  <span>Sal</span>
                  <span>{label.saltPer100g}g</span>
                </div>
              )}
              {label.fiberPer100g !== undefined && (
                <div className="flex justify-between">
                  <span>Fibra alimentaria</span>
                  <span>{label.fiberPer100g}g</span>
                </div>
              )}
              {label.sodiumPer100g !== undefined && (
                <div className="flex justify-between">
                  <span>Sodio</span>
                  <span>{label.sodiumPer100g}mg</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instrucciones */}
        {label.usageInstructions && (
          <div className="mb-3">
            <h2 className="font-bold text-sm border-b border-gray-300 pb-1 mb-1">INSTRUCCIONES DE USO</h2>
            <p className="text-xs leading-relaxed">{label.usageInstructions}</p>
          </div>
        )}

        {/* Empresa */}
        <div className="border-t border-gray-300 pt-2 text-center text-xs">
          <p className="font-bold">{label.companyName || 'Empresa No Especificada'}</p>
          <p className="text-gray-600">{label.companyAddress || 'Dirección No Especificada'}</p>
          {label.companyContact && <p className="text-gray-600">{label.companyContact}</p>}
        </div>

        {/* Símbolos */}
        {label.symbols && Array.isArray(label.symbols) && label.symbols.length > 0 && (
          <div className="flex justify-center space-x-4 mt-3 pt-2 border-t border-gray-300">
            {label.symbols.map(symbol => (
              <div key={symbol} className="text-center">
                <div className="text-lg">{SYMBOL_MAP[symbol]}</div>
                <div className="text-[8px] text-gray-500 mt-1 capitalize">
                  {symbol.replace('_', ' ')}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Código de barras simulado */}
        {label.barcode && (
          <div className="mt-3 pt-2 border-t border-gray-300 text-center">
            <div className="font-mono text-[8px] bg-white p-1 inline-block border">
              <div>║█║▌║█║▌│║▌█║▌║</div>
              <div className="mt-1">{label.barcode}</div>
            </div>
          </div>
        )}

        {label.legalDisclaimer && (
          <div className="mt-3 pt-2 border-t text-[8px] text-gray-600">
            <p>{label.legalDisclaimer}</p>
          </div>
        )}
      </div>

      {/* Información para el usuario */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm text-blue-700 text-center">
          💡 <strong>Consejo:</strong> La etiqueta está optimizada para impresión en tamaño 100x150mm. 
          Al hacer clic en "Imprimir/Exportar a PDF" se abrirá una ventana de impresión.
        </p>
      </div>
    </Modal>
  );
};

export default LabelPreviewModal;
