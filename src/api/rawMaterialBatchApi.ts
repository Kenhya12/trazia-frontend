// src/api/rawMaterialBatchApi.ts

import client from './client';
import { API_ENDPOINTS } from './endpoints';
import { AxiosResponse } from 'axios';

export type RawMaterialLotUnit = 'kg' | 'g' | 'L' | 'ml' | 'unit';

export interface RawMaterialBatch {
    id?: string;
    name: string;
    invoiceNumber: string;
    batchNumber: string;
    rawMaterialId: string;
    supplierId: string;
    quantity: number;
    unit: RawMaterialLotUnit;
    receivingDate: string;
    expirationDate: string;
    purchaseDate?: string;
    documents?: File[];
    comments?: string;
}

function isAxiosError(error: unknown): error is { response?: { data?: any; status?: number } } {
    return typeof error === 'object' && error !== null && 'response' in error;
}

export const rawMaterialBatchApi = {
    /**
     * Obtener todos los lotes
     * @returns {Promise<RawMaterialBatch[]>}
     */
    getAll: async (): Promise<RawMaterialBatch[]> => {
        console.log('🔧 rawMaterialBatchApi.getAll - Obteniendo lotes...');
        
        try {
            const response: AxiosResponse<RawMaterialBatch[]> = await client.get(API_ENDPOINTS.RAW_MATERIAL_BATCH.GET_ALL);
            
            console.log('✅ rawMaterialBatchApi.getAll - Lotes obtenidos:', response.data.length);
            return response.data;
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                console.error('❌ rawMaterialBatchApi.getAll - Error:', error.response?.data);
                throw { message: error.response?.data?.message || 'Error al obtener lotes', status: error.response?.status };
            } else {
                throw error;
            }
        }
    },

    /**
     * Obtener un lote por ID
     * @param {string} id - ID del lote
     * @returns {Promise<RawMaterialBatch>}
     */
    getById: async (id: string): Promise<RawMaterialBatch> => {
        console.log('🔧 rawMaterialBatchApi.getById - Obteniendo lote:', id);
        
        try {
            const response: AxiosResponse<RawMaterialBatch> = await client.get(API_ENDPOINTS.RAW_MATERIAL_BATCH.GET_BY_ID(id));
            
            console.log('✅ rawMaterialBatchApi.getById - Lote obtenido:', response.data.batchNumber);
            return response.data;
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                console.error('❌ rawMaterialBatchApi.getById - Error:', error.response?.data);
                throw { message: error.response?.data?.message || 'Error al obtener lote', status: error.response?.status };
            } else {
                throw error;
            }
        }
    },

    /**
     * Crear un nuevo lote
     * @param {Omit<RawMaterialBatch, 'id'>} batch - Datos del lote
     * @returns {Promise<RawMaterialBatch>}
     */
    create: async (batch: Omit<RawMaterialBatch, 'id'>): Promise<RawMaterialBatch> => {
        console.log('🔧 rawMaterialBatchApi.create - Creando lote:', batch.batchNumber);
        
        try {
            // ✅ ENVIAR COMO JSON DIRECTAMENTE - SIN FormData
            const response: AxiosResponse<RawMaterialBatch> = await client.post(
                API_ENDPOINTS.RAW_MATERIAL_BATCH.CREATE,
                batch
                // ❌ ELIMINAR headers de multipart/form-data
            );

            console.log('✅ rawMaterialBatchApi.create - Lote creado:', response.data.batchNumber);
            return response.data;
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                console.error('❌ rawMaterialBatchApi.create - Error:', error.response?.data);
                throw { message: error.response?.data?.message || 'Error al crear lote', status: error.response?.status };
            } else {
                throw error;
            }
        }
    },

    /**
     * Actualizar un lote
     * @param {string} id - ID del lote
     * @param {Partial<RawMaterialBatch>} batch - Datos actualizados
     * @returns {Promise<RawMaterialBatch>}
     */
    update: async (id: string, batch: Partial<RawMaterialBatch>): Promise<RawMaterialBatch> => {
        console.log('🔧 rawMaterialBatchApi.update - Actualizando lote:', id);
        
        try {
            const response: AxiosResponse<RawMaterialBatch> = await client.put(API_ENDPOINTS.RAW_MATERIAL_BATCH.UPDATE(id), batch);
            
            console.log('✅ rawMaterialBatchApi.update - Lote actualizado');
            return response.data;
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                console.error('❌ rawMaterialBatchApi.update - Error:', error.response?.data);
                throw { message: error.response?.data?.message || 'Error al actualizar lote', status: error.response?.status };
            } else {
                throw error;
            }
        }
    },

    /**
     * Eliminar un lote
     * @param {string} id - ID del lote
     * @returns {Promise<void>}
     */
    delete: async (id: string): Promise<void> => {
        console.log('🔧 rawMaterialBatchApi.delete - Eliminando lote:', id);
        
        try {
            await client.delete(API_ENDPOINTS.RAW_MATERIAL_BATCH.DELETE(id));
            
            console.log('✅ rawMaterialBatchApi.delete - Lote eliminado');
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                console.error('❌ rawMaterialBatchApi.delete - Error:', error.response?.data);
                throw { message: error.response?.data?.message || 'Error al eliminar lote', status: error.response?.status };
            } else {
                throw error;
            }
        }
    }
};