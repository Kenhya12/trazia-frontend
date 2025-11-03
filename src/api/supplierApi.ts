// src/api/supplierApi.ts

import client from './client';
import { API_ENDPOINTS } from './endpoints';
import { AxiosResponse } from 'axios';

export interface Supplier {
    id: string;
    name: string;
}

function isAxiosError(error: unknown): error is { response?: { data?: any; status?: number } } {
    return typeof error === 'object' && error !== null && 'response' in error;
}

export const supplierApi = {
    /**
     * Obtener todos los proveedores
     * @returns {Promise<Supplier[]>}
     */
    getAll: async (): Promise<Supplier[]> => {
        console.log('🔧 supplierApi.getAll - Obteniendo proveedores...');
        
        try {
            const response: AxiosResponse<Supplier[]> = await client.get(API_ENDPOINTS.SUPPLIERS.GET_ALL);
            
            console.log('✅ supplierApi.getAll - Proveedores obtenidos:', response.data.length);
            return response.data;
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                console.error('❌ supplierApi.getAll - Error:', error.response?.data);
                throw { message: error.response?.data?.message || 'Error al obtener proveedores', status: error.response?.status };
            } else {
                throw error;
            }
        }
    }
};
