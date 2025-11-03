// src/api/rawMaterialApi.ts

import client from './client';
import { API_ENDPOINTS } from './endpoints';
import { AxiosResponse } from 'axios';

export interface RawMaterial {
    id?: string;
    name: string;
    supplierId: string;
    internalCode: string;
    unit: 'kg' | 'g' | 'L' | 'ml' | 'unit';
    category: string;
    minStock: number;
    currentStock: number;
}

interface RawMaterialListResponse {
    rawMaterials: RawMaterial[];
    total: number;
}

function isAxiosError(error: unknown): error is { response?: { data?: any; status?: number } } {
    return typeof error === 'object' && error !== null && 'response' in error;
}

export const rawMaterialApi = {
    /**
     * Obtener todas las materias primas
     * @returns {Promise<RawMaterial[]>}
     */
    getAll: async (): Promise<RawMaterial[]> => {
        console.log('🔧 rawMaterialApi.getAll - Obteniendo materias primas...');
        
        try {
            const response: AxiosResponse<RawMaterial[]> = await client.get(API_ENDPOINTS.RAW_MATERIALS.GET_ALL);
            
            console.log('✅ rawMaterialApi.getAll - Materias primas obtenidas:', response.data.length);
            return response.data;
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                console.error('❌ rawMaterialApi.getAll - Error:', error.response?.data);
                throw { message: error.response?.data?.message || 'Error al obtener materias primas', status: error.response?.status };
            } else {
                console.error('❌ rawMaterialApi.getAll - Error inesperado:', error);
                throw error;
            }
        }
    },

    /**
     * Obtener una materia prima por ID
     * @param {string} id - ID de la materia prima
     * @returns {Promise<RawMaterial>}
     */
    getById: async (id: string): Promise<RawMaterial> => {
        console.log('🔧 rawMaterialApi.getById - Obteniendo materia prima:', id);
        
        try {
            const response: AxiosResponse<RawMaterial> = await client.get(API_ENDPOINTS.RAW_MATERIALS.GET_BY_ID(id));
            
            console.log('✅ rawMaterialApi.getById - Materia prima obtenida:', response.data.name);
            return response.data;
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                console.error('❌ rawMaterialApi.getById - Error:', error.response?.data);
                throw { message: error.response?.data?.message || 'Error al obtener materia prima', status: error.response?.status };
            } else {
                throw error;
            }
        }
    },

    /**
     * Crear una nueva materia prima
     * @param {Omit<RawMaterial, 'id'>} rawMaterial - Datos de la materia prima
     * @returns {Promise<RawMaterial>}
     */
    create: async (rawMaterial: Omit<RawMaterial, 'id'>): Promise<RawMaterial> => {
        console.log('🔧 rawMaterialApi.create - Creando materia prima:', rawMaterial.name);
        
        try {
            const response: AxiosResponse<RawMaterial> = await client.post(API_ENDPOINTS.RAW_MATERIALS.CREATE, rawMaterial);
            
            console.log('✅ rawMaterialApi.create - Materia prima creada:', response.data.name);
            return response.data;
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                console.error('❌ rawMaterialApi.create - Error:', error.response?.data);
                throw { message: error.response?.data?.message || 'Error al crear materia prima', status: error.response?.status };
            } else {
                throw error;
            }
        }
    },

    /**
     * Actualizar una materia prima
     * @param {string} id - ID de la materia prima
     * @param {Partial<RawMaterial>} rawMaterial - Datos actualizados
     * @returns {Promise<RawMaterial>}
     */
    update: async (id: string, rawMaterial: Partial<RawMaterial>): Promise<RawMaterial> => {
        console.log('🔧 rawMaterialApi.update - Actualizando materia prima:', id);
        
        try {
            const response: AxiosResponse<RawMaterial> = await client.put(API_ENDPOINTS.RAW_MATERIALS.UPDATE(id), rawMaterial);
            
            console.log('✅ rawMaterialApi.update - Materia prima actualizada');
            return response.data;
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                console.error('❌ rawMaterialApi.update - Error:', error.response?.data);
                throw { message: error.response?.data?.message || 'Error al actualizar materia prima', status: error.response?.status };
            } else {
                throw error;
            }
        }
    },

    /**
     * Eliminar una materia prima
     * @param {string} id - ID de la materia prima
     * @returns {Promise<void>}
     */
    delete: async (id: string): Promise<void> => {
        console.log('🔧 rawMaterialApi.delete - Eliminando materia prima:', id);
        
        try {
            await client.delete(API_ENDPOINTS.RAW_MATERIALS.DELETE(id));
            
            console.log('✅ rawMaterialApi.delete - Materia prima eliminada');
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                console.error('❌ rawMaterialApi.delete - Error:', error.response?.data);
                throw { message: error.response?.data?.message || 'Error al eliminar materia prima', status: error.response?.status };
            } else {
                throw error;
            }
        }
    }
};
