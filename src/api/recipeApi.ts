// src/api/recipeApi.ts
import client from './client';
import { API_ENDPOINTS } from './endpoints';
import { AxiosResponse, AxiosError } from 'axios';
import { Recipe, RecipeSummary } from '../types';

// Interface para la respuesta paginada del backend
interface RecipePageResponse {
    recipes: RecipeSummary[];
    currentPage: number;
    totalPages: number;
    totalRecipes: number;
    pageSize: number;
    first: boolean;
    last: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
}

// Interface para errores de validación del backend
interface ValidationErrors {
    [key: string]: string;
}

interface BackendError {
    message?: string;
    errors?: ValidationErrors;
    status?: number;
    error?: string;
    path?: string;
    timestamp?: string;
}

// 📘 API de Recetas
export const recipeApi = {
    /**
     * Obtener todas las recetas (listado resumen)
     */
    getAll: async (): Promise<RecipeSummary[]> => {
        try {
            const response: AxiosResponse<RecipePageResponse> = await client.get(API_ENDPOINTS.RECIPES.GET_ALL);

            console.log('🔍 Respuesta completa del backend:', response.data);

            // ✅ EXTRAER el array de recetas de la respuesta paginada
            if (response.data && Array.isArray(response.data.recipes)) {
                return response.data.recipes;
            } else if (Array.isArray(response.data)) {
                return response.data;
            } else {
                console.warn('⚠️  Respuesta inesperada del backend:', response.data);
                return [];
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.error('❌ recipeApi.getAll - Error:', error.response?.data);
                throw { 
                    message: (error.response?.data as BackendError)?.message || 'Error al obtener recetas', 
                    status: error.response?.status 
                };
            }
            throw error;
        }
    },

    /**
     * Obtener una receta completa por ID
     */
    getById: async (id: number): Promise<Recipe> => {
        try {
            const response: AxiosResponse<Recipe> = await client.get(API_ENDPOINTS.RECIPES.GET_BY_ID(id));
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.error('❌ recipeApi.getById - Error:', error.response?.data);
                throw { 
                    message: (error.response?.data as BackendError)?.message || 'Error al obtener detalles de receta', 
                    status: error.response?.status 
                };
            }
            throw error;
        }
    },

    /**
     * Crear una nueva receta
     */
    create: async (recipeData: Omit<Recipe, 'id' | 'updatedAt'>): Promise<Recipe> => {
        try {
            console.log('🔧 recipeApi.create - Enviando receta:', {
                name: recipeData.name,
                yieldWeightGrams: recipeData.yieldWeightGrams,
                ingredients: recipeData.ingredients?.length
            });
            
            const response: AxiosResponse<Recipe> = await client.post(API_ENDPOINTS.RECIPES.CREATE, recipeData);
            
            console.log('✅ recipeApi.create - Receta creada:', response.data.id);
            return response.data;
            
        } catch (error: unknown) {
            // ✅ MANEJO CORRECTO DE ERRORES CON TYPESCRIPT
            if (error instanceof AxiosError) {
                const backendError = error.response?.data as BackendError;
                
                console.error('❌ recipeApi.create - Error detallado:', {
                    status: error.response?.status,
                    data: backendError,
                    validationErrors: backendError?.errors
                });
                
                // ✅ MENSAJES ESPECÍFICOS SEGÚN EL ERROR
                let userMessage = 'Error al crear receta';
                
                if (backendError?.errors) {
                    const errors = backendError.errors;
                    if (errors.yieldWeightGrams) {
                        userMessage = 'El peso de rendimiento debe ser mayor o igual a 1 gramo';
                    } else if (errors.ingredients) {
                        userMessage = 'Debe agregar al menos un ingrediente';
                    } else if (errors.name) {
                        userMessage = 'El nombre de la receta es requerido';
                    }
                } else if (backendError?.message) {
                    userMessage = backendError.message;
                }
                
                throw new Error(userMessage);
            }
            
            // ✅ ERROR NO RELACIONADO CON AXIOS
            throw new Error('Error de conexión al crear receta');
        }
    },

    /**
     * Actualizar una receta existente por ID
     */
    update: async (id: number, recipeData: Partial<Omit<Recipe, 'id' | 'updatedAt'>>): Promise<Recipe> => {
        try {
            const response: AxiosResponse<Recipe> = await client.put(API_ENDPOINTS.RECIPES.UPDATE(id), recipeData);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.error('❌ recipeApi.update - Error:', error.response?.data);
                throw { 
                    message: (error.response?.data as BackendError)?.message || 'Error al actualizar receta', 
                    status: error.response?.status 
                };
            }
            throw error;
        }
    },

    /**
     * Eliminar una receta por ID
     */
    delete: async (id: number): Promise<void> => {
        try {
            await client.delete(API_ENDPOINTS.RECIPES.DELETE(id));
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.error('❌ recipeApi.delete - Error:', error.response?.data);
                throw { 
                    message: (error.response?.data as BackendError)?.message || 'Error al eliminar receta', 
                    status: error.response?.status 
                };
            }
            throw error;
        }
    },
};

export const getRecipes = recipeApi.getAll;
export const getRecipeById = recipeApi.getById;
export const createRecipe = recipeApi.create;
export const updateRecipe = recipeApi.update;
export const deleteRecipe = recipeApi.delete;