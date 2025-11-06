import type { ProductLabel } from '../types';

// 🧪 Datos de ejemplo para previsualización
const mockLabels: ProductLabel[] = [
    {
        id: '1',
        productName: 'Mermelada de Fresa Artesanal',
        companyName: 'Delicias Caseras S.L.',
        companyAddress: `Calle de la Repostería, 42, 28001 Madrid, España`,
        countryOfOrigin: 'España',
        batchNumber: 'LOTE-2024-001',
        expirationDate: '2024-12-31',
        ingredients: [
            { id: '1', name: 'Fresas', quantity: '500', unit: 'g', isAllergen: false },
            { id: '2', name: 'Azúcar', quantity: '300', unit: 'g', isAllergen: false },
            { id: '3', name: 'Jugo de limón', quantity: '50', unit: 'ml', isAllergen: false },
        ],
        allergens: [],
        language: 'es',
        status: 'draft',
        version: 1,
        netWeight: '450g',
        energyKcalPer100g: 250,
        energyKjPer100g: 1046,
        proteinPer100g: 0.5,
        fatPer100g: 0.2,
        carbsPer100g: 62,
        sugarsPer100g: 60,
        fiberPer100g: 1.2,
        saltPer100g: 0.1,
        usageInstructions: 'Conservar en lugar fresco y seco. Una vez abierto, conservar en refrigeración.',
    },
    {
        id: '2',
        productName: 'Pan Integral de Centeno',
        companyName: 'Delicias Caseras S.L.',
        companyAddress: `Calle de la Repostería, 42, 28001 Madrid, España`,
        countryOfOrigin: 'España',
        batchNumber: 'LOTE-2024-002',
        expirationDate: '2024-11-15',
        ingredients: [
            { id: '1', name: 'Harina de centeno', quantity: '350', unit: 'g', isAllergen: true },
            { id: '2', name: 'Harina de trigo', quantity: '150', unit: 'g', isAllergen: true },
            { id: '3', name: 'Agua', quantity: '280', unit: 'ml', isAllergen: false },
            { id: '4', name: 'Sal', quantity: '10', unit: 'g', isAllergen: false },
        ],
        allergens: ['Harina de centeno', 'Harina de trigo', 'Gluten'],
        language: 'es',
        status: 'approved',
        version: 1,
        netWeight: '800g',
        energyKcalPer100g: 240,
        energyKjPer100g: 1004,
        proteinPer100g: 8.5,
        fatPer100g: 1.2,
        carbsPer100g: 48,
        sugarsPer100g: 2.5,
        fiberPer100g: 6.8,
        saltPer100g: 1.2,
    },
];

// 🧩 Servicio mockeado de etiquetas
export const mockLabelService = {
    async getLabels(): Promise<ProductLabel[]> {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return [...mockLabels];
    },

    async getLabelById(id: string): Promise<ProductLabel> {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const label = mockLabels.find((l) => l.id === id);
        if (!label) throw new Error('Label not found');
        return { ...label };
    },

    async createLabel(label: Omit<ProductLabel, 'id'>): Promise<ProductLabel> {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const newLabel: ProductLabel = {
            ...label,
            id: `LBL-${Date.now()}`,
            version: 1,
            status: label.status || 'draft',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        mockLabels.push(newLabel);
        return newLabel;
    },

    async updateLabel(id: string, label: Partial<ProductLabel>): Promise<ProductLabel> {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const index = mockLabels.findIndex((l) => l.id === id);
        if (index === -1) throw new Error('Label not found');

        const updatedLabel = {
            ...mockLabels[index],
            ...label,
            version: mockLabels[index].version + 1,
            updatedAt: new Date().toISOString(),
        };
        mockLabels[index] = updatedLabel;
        return updatedLabel;
    },

    async deleteLabel(id: string): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const index = mockLabels.findIndex((l) => l.id === id);
        if (index === -1) throw new Error('Label not found');
        mockLabels.splice(index, 1);
    },
};