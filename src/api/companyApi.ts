import client from './client';
import { API_ENDPOINTS } from './endpoints';
import { AxiosResponse } from 'axios';

interface CompanyData {
    businessName: string;
    taxId: string;
    address?: string;
    country?: string;
    phone?: string;
    email?: string;
    sector?: string;
}

interface CompanyResponse {
    id: number;
    businessName: string;
    taxId?: string;
    address?: string;
    country?: string;
    phone?: string;
    email?: string;
    sector?: string;
    [key: string]: any;
}

function isAxiosError(error: unknown): error is { response?: { data?: any; status?: number } } {
    return typeof error === 'object' && error !== null && 'response' in error;
}

export const companyApi = {
    /**
     * Registrar una nueva empresa
     * @param {CompanyData} companyData - Datos de la empresa
     * @returns {Promise<CompanyResponse>} - Empresa creada
     */
    register: async (companyData: CompanyData): Promise<CompanyResponse> => {
        console.log('🔧 companyApi.register - Registrando empresa...');
        console.log('📤 URL:', API_ENDPOINTS.COMPANY.REGISTER);
        console.log('🔑 Token presente:', !!localStorage.getItem('token'));
        console.log('🏢 Datos empresa:', { 
            businessName: companyData.businessName,
            taxId: companyData.taxId,
            address: companyData.address,
            country: companyData.country,
            phone: companyData.phone,
            email: companyData.email,
            sector: companyData.sector
        });
        
        try {
            const response: AxiosResponse<CompanyResponse> = await client.post(API_ENDPOINTS.COMPANY.REGISTER, companyData);
            
            console.log('✅ companyApi.register - Empresa registrada exitosamente');
            console.log('📨 Status:', response.status);
            console.log('🏢 Empresa:', response.data.businessName);
            
            return response.data;
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                console.error('❌ companyApi.register - Error:', error.response?.data || (error as Error).message);
                console.error('📊 Status error:', error.response?.status);
                
                const errorMessage = error.response?.data?.message || 'Error al registrar la empresa';
                throw { message: errorMessage, status: error.response?.status };
            } else {
                console.error('❌ companyApi.register - Error inesperado:', error);
                throw error;
            }
        }
    },

    /**
     * Actualizar datos de la empresa
     * @param {number} companyId - ID de la empresa
     * @param {Partial<CompanyData>} companyData - Datos actualizados
     * @returns {Promise<CompanyResponse>} - Empresa actualizada
     */
    update: async (companyId: number, companyData: Partial<CompanyData>): Promise<CompanyResponse> => {
        console.log('🔧 companyApi.update - Actualizando empresa...');
        console.log('🔑 Token presente:', !!localStorage.getItem('token'));
        
        try {
            const response: AxiosResponse<CompanyResponse> = await client.put(`${API_ENDPOINTS.COMPANY.UPDATE}/${companyId}`, companyData);
            
            console.log('✅ companyApi.update - Empresa actualizada exitosamente');
            return response.data;
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                console.error('❌ companyApi.update - Error:', error.response?.data || (error as Error).message);
                
                const errorMessage = error.response?.data?.message || 'Error al actualizar la empresa';
                throw { message: errorMessage, status: error.response?.status };
            } else {
                console.error('❌ companyApi.update - Error inesperado:', error);
                throw error;
            }
        }
    },

    /**
     * Obtener datos de la empresa del usuario actual
     * @returns {Promise<CompanyResponse | null>} - Datos de la empresa
     */
    getCurrent: async (): Promise<CompanyResponse | null> => {
        console.log('🔧 companyApi.getCurrent - Obteniendo empresa actual...');
        console.log('🔑 Token presente:', !!localStorage.getItem('token'));
        
        try {
            // Si tienes endpoint para obtener empresa, implementa aquí
            // const response = await client.get<CompanyResponse>(API_ENDPOINTS.COMPANY.GET_CURRENT);
            // return response.data;
            
            // Por ahora, retornar null hasta que implementes el endpoint
            console.log('⚠️ companyApi.getCurrent - Endpoint no implementado, retornando null');
            return null;
        } catch (error: unknown) {
            console.error('❌ companyApi.getCurrent - Error:', error);
            throw error;
        }
    }
};