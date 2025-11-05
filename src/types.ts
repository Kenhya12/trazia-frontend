/*USUARIO*/

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



/*ETIQUETAS*/

export type LabelSymbol = 'recycling' | 'ce' | 'gluten_free' | 'vegan';

export interface ProductLabel {
  id: string;
  productName: string;
  ingredients: string;
  netQuantity: string;
  instructions: string;
  expiryDate: string;
  lotNumber: string;
  companyName: string;
  companyAddress: string;
  companyContact: string;
  warnings: string;
  allergens: string[];
  originCountry: string;
  symbols: LabelSymbol[];
  barcode: string;
  language: 'es' | 'en' | 'fr';
  version: number;
  status: 'draft' | 'approved' | 'published';
}


/*RECETAS*/

export interface RecipeIngredient {
  rawMaterialId: string;
  quantityGrams: number;
}


// Represents the structure for an ingredient when creating/updating a recipe
export interface RecipeIngredientRequest {
  productId: number;
  quantityGrams: number;
  displayOrder: number;
}

// Represents a single ingredient as returned from the backend inside a full recipe
export interface RecipeIngredientResponse {
  id: number;
  product: { id: number; name: string; }; // Simplified ProductDTO
  quantityGrams: number;
  displayOrder: number;
  cost: number;
}

// Represents the payload for creating or updating a recipe
export interface RecipeRequest {
  name: string;
  description: string;
  yieldWeightGrams: number;
  ingredients: RecipeIngredientRequest[];
}

// Represents the full recipe object from the backend
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

/* export interface Recipe {
  id: string;
  name: string;
  description: string;
  retentionFactor: number;
  finalProductId: string | null;
  process: string;
  observations: string;
  ingredients: RecipeIngredient[];
  lastUpdated: string;
} */


// Represents a summary of a recipe for list views
export interface RecipeSummary {
  id: number;
  name: string;
  description: string;
  yieldWeightGrams: number;
  totalCost: number;
  ingredientCount: number;
  updatedAt: string;
}
