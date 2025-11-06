/* USUARIO Y EMPRESA */

export interface Company {
    name: string;
    taxId: string; // CIF / NIF
    address: string;
    country: string;
    phone: string;
    logoUrl: string | null;
    email: string;
    sector: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  role: 'admin' | 'operator';
  avatarUrl: string | null;
  hasCompanySetup: boolean;
}

export interface Supplier {
  id: string;
  name: string;
}

export interface RawMaterial {
  id: string;
  name: string;
  supplierId: string;
  internalCode: string;
  unit: 'kg' | 'g' | 'L' | 'ml' | 'unit';
  category: string;
  minStock: number;
  currentStock: number;
}

export type RawMaterialLotUnit = 'kg' | 'g' | 'L' | 'ml' | 'unit';

export interface RawMaterialLot {
  id: string;
  name: string;
  invoiceNumber: string;
  batchNumber: string;
  rawMaterialId: string;
  supplierId: string;
  quantity: number;
  unit: RawMaterialLotUnit;
  receivingDate: string;
  expirationDate: string;
  documents?: string[];
  comments?: string;
}

export interface FinalProduct {
    id: string;
    name: string;
    internalCode: string;
    category: string;
}

export interface ProductionLot {
    id: string;
    lotNumber: string;
    finalProductId: string;
    recipeId: string;
    elaborationDate: string;
    expiryDate: string;
}

export interface RetentionFactor {
    id: string;
    name: string;
    factor: number;
}

/* INGREDIENTE - INTERFAZ ACTUALIZADA CON UNIDAD */
export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  unit: 'g' | 'ml'; // ← NUEVO CAMPO AGREGADO
  isAllergen: boolean;
}

/* ETIQUETAS - VERSIÓN UNIFICADA Y ACTUALIZADA */

export type LabelSymbol = 'recycling' | 'ce' | 'gluten_free' | 'vegan';

export interface ProductLabel {
  // === CAMPOS OBLIGATORIOS (Normativa UE) ===
  id: string;
  productName: string;
  companyName: string;
  companyAddress: string;
  countryOfOrigin: string;
  batchNumber: string;
  expirationDate: string; // Formato ISO - CAMBIO: de expiryDate a expirationDate
  ingredients: Ingredient[]; // CAMBIO: de string a Ingredient[]
  allergens: string[]; // Se calculará automáticamente desde ingredients
  
  // === CAMPOS DEL SISTEMA ===
  language: 'es' | 'en' | 'fr';
  status: 'draft' | 'approved' | 'published';
  version: number;
  createdAt?: string;
  updatedAt?: string;

  // === CAMPOS OPCIONALES/ADICIONALES ===
  
  // Información de receta
  recipeName?: string;
  recipeDescription?: string;
  productionDate?: string;
  usageInstructions?: string;
  yieldWeightGrams?: number;

  // Información nutricional (opcional)
  energyKcalPer100g?: number; // CAMBIO: más específico
  energyKjPer100g?: number;   // NUEVO: energía en kJ
  fatPer100g?: number;
  saturatedFatPer100g?: number;
  carbsPer100g?: number;
  sugarsPer100g?: number;
  proteinPer100g?: number;
  saltPer100g?: number;
  fiberPer100g?: number;
  sodiumPer100g?: number;

  // Costos (opcional)
  totalCost?: number;
  costPer100g?: number;

  // Etiquetas de dieta (opcional)
  vegan?: boolean;
  vegetarian?: boolean;
  glutenFree?: boolean;
  lactoseFree?: boolean;
  organic?: boolean;

  // Extras (opcional)
  barcode?: string;
  qrCode?: string;
  nutriScore?: string;
  legalDisclaimer?: string;
  
  // === CAMPOS LEGACY (para compatibilidad con componentes existentes) ===
  netWeight?: string; // CAMBIO: de netQuantity a netWeight
  instructions?: string; // Alias de usageInstructions
  companyContact?: string; // Información de contacto adicional
  warnings?: string; // Advertencias generales
  symbols?: LabelSymbol[]; // Símbolos de la etiqueta
  originCountry?: string; // Alias de countryOfOrigin
  lotNumber?: string; // Alias de batchNumber
  
  // === CAMPOS DE COMPATIBILIDAD TEMPORAL ===
  expiryDate?: string; // Legacy - usar expirationDate
  netQuantity?: string; // Legacy - usar netWeight
}

/* RECETAS */

export interface RecipeIngredient {
  rawMaterialId: string;
  quantityGrams: number;
}

// Representa la estructura para un ingrediente al crear/actualizar una receta
export interface RecipeIngredientRequest {
  productId: number;
  quantityGrams: number;
  displayOrder: number;
}

// Representa un solo ingrediente como se devuelve desde el backend dentro de una receta completa
export interface RecipeIngredientResponse {
  id: number;
  product: { id: number; name: string; }; // ProductDTO simplificado
  quantityGrams: number;
  displayOrder: number;
  cost: number;
}

// Representa el payload para crear o actualizar una receta
export interface RecipeRequest {
  name: string;
  description: string;
  yieldWeightGrams: number;
  ingredients: RecipeIngredientRequest[];
}

// Representa el objeto de receta completo desde el backend
export interface Recipe {
  id: number;
  name: string;
  description: string;
  yieldWeightGrams: number;
  ingredients: RecipeIngredientResponse[];
  totalCost: number;
  costPerGram: number;
  costPer100g: number;
  totalIngredientsWeight: number;
  yieldLossPercentage: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

// Representa un resumen de una receta para vistas de lista
export interface RecipeSummary {
  id: number;
  name: string;
  description: string;
  yieldWeightGrams: number;
  totalCost: number;
  ingredientCount: number;
  updatedAt: string;
}
