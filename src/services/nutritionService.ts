export interface NutritionData {
    energyKcal: number;
    energyKj: number;
    protein: number;
    fat: number;
    saturatedFat: number;
    carbs: number;
    sugars: number;
    fiber: number;
    salt: number;
    sodium: number;
}

export interface NutritionResponse {
    success: boolean;
    data?: NutritionData;
    error?: string;
}

export interface RecipeIngredient {
    name: string;
    quantity: string;
}

// Servicio de nutrición con datos de ejemplo robustos
export const nutritionService = {
    async getNutritionData(ingredientName: string, barcode?: string): Promise<NutritionResponse> {
        try {
            // Simular llamada a API con delay
            await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

            // Por ahora, siempre devolvemos datos de ejemplo
            const sampleData = this.getSampleNutritionData(ingredientName);
            return {
                success: true,
                data: sampleData
            };
        } catch (error) {
            console.error('Error en getNutritionData:', error);
            return {
                success: false,
                error: 'Error al obtener datos nutricionales'
            };
        }
    },

    async getCompositeNutritionData(ingredients: string[]): Promise<NutritionResponse> {
        try {
            // Simular procesamiento de múltiples ingredientes
            await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));

            if (!ingredients || ingredients.length === 0) {
                return {
                    success: false,
                    error: 'No se proporcionaron ingredientes'
                };
            }

            // Calcular promedio simple de datos de ejemplo
            const sampleDataArray = ingredients.map(ing => this.getSampleNutritionData(ing));
            const compositeData: NutritionData = {
                energyKcal: this.calculateAverage(sampleDataArray.map(d => d.energyKcal)),
                energyKj: this.calculateAverage(sampleDataArray.map(d => d.energyKj)),
                protein: this.calculateAverage(sampleDataArray.map(d => d.protein)),
                fat: this.calculateAverage(sampleDataArray.map(d => d.fat)),
                saturatedFat: this.calculateAverage(sampleDataArray.map(d => d.saturatedFat)),
                carbs: this.calculateAverage(sampleDataArray.map(d => d.carbs)),
                sugars: this.calculateAverage(sampleDataArray.map(d => d.sugars)),
                fiber: this.calculateAverage(sampleDataArray.map(d => d.fiber)),
                salt: this.calculateAverage(sampleDataArray.map(d => d.salt)),
                sodium: this.calculateAverage(sampleDataArray.map(d => d.sodium)),
            };

            return {
                success: true,
                data: compositeData
            };
        } catch (error) {
            console.error('Error en getCompositeNutritionData:', error);
            return {
                success: false,
                error: 'Error al obtener datos nutricionales compuestos'
            };
        }
    },

    async calculateRecipeNutrition(ingredients: RecipeIngredient[]): Promise<NutritionData> {
        try {
            // Simular cálculo complejo de receta
            await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

            if (!ingredients || ingredients.length === 0) {
                return this.getSampleNutritionData('receta');
            }

            // Calcular nutrición basada en cantidades (simulación)
            let totalWeight = 0;
            const weightedData = ingredients.map(ing => {
                const quantity = this.parseQuantity(ing.quantity);
                const nutrition = this.getSampleNutritionData(ing.name);
                totalWeight += quantity;
                return {
                    data: nutrition,
                    weight: quantity
                };
            });

            // Calcular promedio ponderado
            const recipeData: NutritionData = {
                energyKcal: this.calculateWeightedAverage(weightedData.map(w => w.data.energyKcal), weightedData.map(w => w.weight)),
                energyKj: this.calculateWeightedAverage(weightedData.map(w => w.data.energyKj), weightedData.map(w => w.weight)),
                protein: this.calculateWeightedAverage(weightedData.map(w => w.data.protein), weightedData.map(w => w.weight)),
                fat: this.calculateWeightedAverage(weightedData.map(w => w.data.fat), weightedData.map(w => w.weight)),
                saturatedFat: this.calculateWeightedAverage(weightedData.map(w => w.data.saturatedFat), weightedData.map(w => w.weight)),
                carbs: this.calculateWeightedAverage(weightedData.map(w => w.data.carbs), weightedData.map(w => w.weight)),
                sugars: this.calculateWeightedAverage(weightedData.map(w => w.data.sugars), weightedData.map(w => w.weight)),
                fiber: this.calculateWeightedAverage(weightedData.map(w => w.data.fiber), weightedData.map(w => w.weight)),
                salt: this.calculateWeightedAverage(weightedData.map(w => w.data.salt), weightedData.map(w => w.weight)),
                sodium: this.calculateWeightedAverage(weightedData.map(w => w.data.sodium), weightedData.map(w => w.weight)),
            };

            return recipeData;
        } catch (error) {
            console.error('Error en calculateRecipeNutrition:', error);
            // Fallback a datos de ejemplo del primer ingrediente
            return ingredients && ingredients.length > 0
                ? this.getSampleNutritionData(ingredients[0].name)
                : this.getSampleNutritionData('receta');
        }
    },

    getSampleNutritionData(ingredientName: string): NutritionData {
        const name = ingredientName.toLowerCase();

        // Base de datos de ejemplo más extensa
        if (name.includes('fresa') || name.includes('frutilla')) {
            return {
                energyKcal: 32,
                energyKj: 134,
                protein: 0.7,
                fat: 0.3,
                saturatedFat: 0.1,
                carbs: 7.7,
                sugars: 4.9,
                fiber: 2.0,
                salt: 0.0,
                sodium: 1
            };
        } else if (name.includes('azúcar') || name.includes('sugar')) {
            return {
                energyKcal: 387,
                energyKj: 1620,
                protein: 0.0,
                fat: 0.0,
                saturatedFat: 0.0,
                carbs: 100.0,
                sugars: 100.0,
                fiber: 0.0,
                salt: 0.0,
                sodium: 1
            };
        } else if (name.includes('harina') || name.includes('flour')) {
            return {
                energyKcal: 364,
                energyKj: 1524,
                protein: 10.3,
                fat: 1.0,
                saturatedFat: 0.2,
                carbs: 76.3,
                sugars: 0.3,
                fiber: 2.7,
                salt: 0.0,
                sodium: 2
            };
        } else if (name.includes('leche') || name.includes('milk')) {
            return {
                energyKcal: 61,
                energyKj: 255,
                protein: 3.2,
                fat: 3.3,
                saturatedFat: 2.1,
                carbs: 4.8,
                sugars: 4.8,
                fiber: 0.0,
                salt: 0.1,
                sodium: 40
            };
        } else if (name.includes('huevo') || name.includes('egg')) {
            return {
                energyKcal: 155,
                energyKj: 649,
                protein: 13.0,
                fat: 11.0,
                saturatedFat: 3.3,
                carbs: 1.1,
                sugars: 1.1,
                fiber: 0.0,
                salt: 0.3,
                sodium: 124
            };
        } else if (name.includes('aceite') || name.includes('oil')) {
            return {
                energyKcal: 884,
                energyKj: 3700,
                protein: 0.0,
                fat: 100.0,
                saturatedFat: 14.0,
                carbs: 0.0,
                sugars: 0.0,
                fiber: 0.0,
                salt: 0.0,
                sodium: 0
            };
        } else if (name.includes('sal') || name.includes('salt')) {
            return {
                energyKcal: 0,
                energyKj: 0,
                protein: 0.0,
                fat: 0.0,
                saturatedFat: 0.0,
                carbs: 0.0,
                sugars: 0.0,
                fiber: 0.0,
                salt: 100.0,
                sodium: 38758
            };
        } else if (name.includes('agua') || name.includes('water')) {
            return {
                energyKcal: 0,
                energyKj: 0,
                protein: 0.0,
                fat: 0.0,
                saturatedFat: 0.0,
                carbs: 0.0,
                sugars: 0.0,
                fiber: 0.0,
                salt: 0.0,
                sodium: 5
            };
        } else if (name.includes('chocolate') || name.includes('cacao')) {
            return {
                energyKcal: 546,
                energyKj: 2285,
                protein: 4.9,
                fat: 31.3,
                saturatedFat: 18.5,
                carbs: 61.2,
                sugars: 47.9,
                fiber: 7.0,
                salt: 0.1,
                sodium: 11
            };
        } else if (name.includes('mantequilla') || name.includes('butter')) {
            return {
                energyKcal: 717,
                energyKj: 3000,
                protein: 0.9,
                fat: 81.1,
                saturatedFat: 51.4,
                carbs: 0.1,
                sugars: 0.1,
                fiber: 0.0,
                salt: 0.1,
                sodium: 11
            };
        } else if (name.includes('pan') || name.includes('bread')) {
            return {
                energyKcal: 265,
                energyKj: 1110,
                protein: 9.0,
                fat: 3.2,
                saturatedFat: 0.7,
                carbs: 49.0,
                sugars: 5.0,
                fiber: 2.7,
                salt: 1.2,
                sodium: 491
            };
        }

        // Datos por defecto para ingredientes desconocidos
        return {
            energyKcal: 150,
            energyKj: 628,
            protein: 5.0,
            fat: 3.0,
            saturatedFat: 1.0,
            carbs: 25.0,
            sugars: 8.0,
            fiber: 2.0,
            salt: 0.5,
            sodium: 200
        };
    },

    // Helper functions
    calculateAverage(numbers: number[]): number {
        if (!numbers.length) return 0;
        const sum = numbers.reduce((a, b) => a + b, 0);
        return sum / numbers.length;
    },

    calculateWeightedAverage(values: number[], weights: number[]): number {
        if (!values.length || !weights.length || values.length !== weights.length) return 0;
        const weightedSum = values.reduce((sum, value, index) => sum + value * weights[index], 0);
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        return totalWeight > 0 ? weightedSum / totalWeight : 0;
    },

    parseQuantity(quantity: string): number {
        // Extraer número de cantidad (ej: "100g" -> 100, "250ml" -> 250)
        const match = quantity.match(/(\d+(\.\d+)?)/);
        return match ? parseFloat(match[1]) : 100; // Default 100g/ml
    }
};
