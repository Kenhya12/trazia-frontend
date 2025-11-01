export interface RecipeIngredient {
  rawMaterialId: string;
  quantityGrams: number;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  retentionFactor: number;
  finalProductId: string | null;
  process: string;
  observations: string;
  ingredients: RecipeIngredient[];
  lastUpdated: string;
}

export interface User {
  id: string;
  name: string;
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

export interface RawMaterialLot {
    id: string;
    rawMaterialId: string;
    supplierId: string;
    lotNumber: string;
    purchaseDate: string;
    receptionDate: string;
    expiryDate: string;
    quantity: number;
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