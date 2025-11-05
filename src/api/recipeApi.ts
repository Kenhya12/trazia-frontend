// src/api/recipeApi.ts
import client from './client';
import { API_ENDPOINTS } from './endpoints';
import { AxiosResponse } from 'axios';
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

// Función para verificar si es error de Axios
function isAxiosError(error: unknown): error is { response?: { data?: any; status?: number } } {
    return typeof error === 'object' && error !== null && 'response' in error;
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
            if (isAxiosError(error)) {
                console.error('❌ recipeApi.getAll - Error:', error.response?.data);
                throw { message: error.response?.data?.message || 'Error al obtener recetas', status: error.response?.status };
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
            if (isAxiosError(error)) {
                console.error('❌ recipeApi.getById - Error:', error.response?.data);
                throw { message: error.response?.data?.message || 'Error al obtener detalles de receta', status: error.response?.status };
            }
            throw error;
        }
    },

    /**
     * Crear una nueva receta
     */
    create: async (recipeData: Omit<Recipe, 'id' | 'updatedAt'>): Promise<Recipe> => {
        try {
            const response: AxiosResponse<Recipe> = await client.post(API_ENDPOINTS.RECIPES.CREATE, recipeData);
            return response.data;
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                console.error('❌ recipeApi.create - Error:', error.response?.data);
                throw { message: error.response?.data?.message || 'Error al crear receta', status: error.response?.status };
            }
            throw error;
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
            if (isAxiosError(error)) {
                console.error('❌ recipeApi.update - Error:', error.response?.data);
                throw { message: error.response?.data?.message || 'Error al actualizar receta', status: error.response?.status };
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
            if (isAxiosError(error)) {
                console.error('❌ recipeApi.delete - Error:', error.response?.data);
                throw { message: error.response?.data?.message || 'Error al eliminar receta', status: error.response?.status };
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