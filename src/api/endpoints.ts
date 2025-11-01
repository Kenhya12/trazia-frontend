// src/api/endpoints.ts

export interface ApiEndpoints {
    AUTH: {
        LOGIN: string;
        REGISTER: string;
        REFRESH: string;
        LOGOUT: string;
        VALIDATE: string;
    };
    COMPANY: {
        REGISTER: string;
        UPDATE: string;
        GET_CURRENT: string;
    };
    USER: {
        PROFILE: string;
        UPDATE: string;
    };
    PRODUCTS: {
        BASE: string;
        SEARCH: string;
        BARCODE: string;
        USDA: string;
    };
    RAW_MATERIAL_BATCH: {
        GET_BY_ID: (id: string) => string;
        UPDATE: (id: string) => string;
        DELETE: (id: string) => string;
    };
}

export const API_ENDPOINTS: ApiEndpoints = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        REFRESH: '/api/auth/refresh',
        LOGOUT: '/api/auth/logout',
        VALIDATE: '/api/auth/validate'
    },
    COMPANY: {
        REGISTER: '/api/company/register',
        UPDATE: '/api/company/update',
        GET_CURRENT: '/api/company/current'
    },
    USER: {
        PROFILE: '/user/profile',
        UPDATE: '/user/update'
    },
    PRODUCTS: {
        BASE: '/api/products',
        SEARCH: '/api/products/search',
        BARCODE: '/api/products/search-barcode',
        USDA: '/api/products/search-usda',
    },
    RAW_MATERIAL_BATCH: {
        GET_BY_ID: (id: string) => `/api/raw-material-batch/${id}`,
        UPDATE: (id: string) => `/api/raw-material-batch/${id}/update`,
        DELETE: (id: string) => `/api/raw-material-batch/${id}/delete`,
    }
};