import axios from 'axios';
import type { ProductLabel } from '../types';
import { USE_MOCK_SERVICE, API_BASE_URL } from './labelServiceConfig';
import { mockLabelService } from '../mock/mockLabelService';

// Crear cliente axios
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Interceptor para incluir JWT
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor de respuesta: manejo de 401
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Servicio real con CRUD completo
const apiLabelService = {
    async getLabels(): Promise<ProductLabel[]> {
        const res = await apiClient.get<ProductLabel[]>('/labels');
        return res.data;
    },
    async getLabelById(id: string): Promise<ProductLabel> {
        const res = await apiClient.get<ProductLabel>(`/labels/${id}`);
        return res.data;
    },
    async createLabel(label: Omit<ProductLabel, 'id'>): Promise<ProductLabel> {
        const labelWithDefaults = {
            ...label,
            version: label.version || 1,
            status: label.status || 'draft',
            language: label.language || 'es',
            ingredients: label.ingredients || [],
            countryOfOrigin: label.countryOfOrigin || '',
            batchNumber: label.batchNumber || '',
        };
        const res = await apiClient.post<ProductLabel>('/labels', labelWithDefaults);
        return res.data;
    },
    async updateLabel(id: string, label: Partial<ProductLabel>): Promise<ProductLabel> {
        const res = await apiClient.put<ProductLabel>(`/labels/${id}`, label);
        return res.data;
    },
    async deleteLabel(id: string): Promise<void> {
        await apiClient.delete(`/labels/${id}`);
    },
};

// Export único: alterna entre mock y real según USE_MOCK_SERVICE
export const labelService = USE_MOCK_SERVICE ? mockLabelService : apiLabelService;