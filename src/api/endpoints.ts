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
        GET_ALL: string;
        GET_BY_ID: (id: string) => string;
        CREATE: string;
        UPDATE: (id: string) => string;
        DELETE: (id: string) => string;
    };
    SUPPLIERS: {
        GET_ALL: string;
        CREATE: string;
        UPDATE: (id: string) => string;
        DELETE: (id: string) => string;
    };
    RAW_MATERIALS: {
        GET_ALL: string;
        GET_BY_ID: (id: string) => string;
        CREATE: string;
        UPDATE: (id: string) => string;
        DELETE: (id: string) => string;
    };
    RECIPES: {
        GET_ALL: string;
        GET_BY_ID: (id: number) => string;
        CREATE: string;
        UPDATE: (id: number) => string;
        DELETE: (id: number) => string;
    };
    LABELS: {
        GET_ALL: string;
        GET_BY_ID: (id: string) => string;
        CREATE: string;
        UPDATE: (id: string) => string;
        DELETE: (id: string) => string;
    };
}

export const API_ENDPOINTS: ApiEndpoints = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        REFRESH: '/auth/refresh',
        LOGOUT: '/auth/logout',
        VALIDATE: '/auth/validate',
    },
    COMPANY: {
        REGISTER: '/company/register',
        UPDATE: '/company/update',
        GET_CURRENT: '/company/current',
    },
    USER: {
        PROFILE: '/user/profile',
        UPDATE: '/user/update',
    },
    PRODUCTS: {
        BASE: '/products',
        SEARCH: '/products/search',
        BARCODE: '/products/search-barcode',
        USDA: '/products/search-usda',
    },
    RAW_MATERIAL_BATCH: {
        GET_ALL: '/raw-material-batches',
        GET_BY_ID: (id: string) => `/raw-material-batches/${id}`,
        CREATE: '/raw-material-batches',
        UPDATE: (id: string) => `/raw-material-batches/${id}`,
        DELETE: (id: string) => `/raw-material-batches/${id}`,
    },
    SUPPLIERS: {
        GET_ALL: '/suppliers',
        CREATE: '/suppliers',
        UPDATE: (id: string) => `/suppliers/${id}`,
        DELETE: (id: string) => `/suppliers/${id}`,
    },
    RAW_MATERIALS: {
        GET_ALL: '/raw-materials',
        GET_BY_ID: (id: string) => `/raw-materials/${id}`,
        CREATE: '/raw-materials',
        UPDATE: (id: string) => `/raw-materials/${id}`,
        DELETE: (id: string) => `/raw-materials/${id}`,
    },
    RECIPES: {
        GET_ALL: '/recipes',
        GET_BY_ID: (id: number) => `/recipes/${id}`,
        CREATE: '/recipes',
        UPDATE: (id: number) => `/recipes/${id}`,
        DELETE: (id: number) => `/recipes/${id}`,
    },
    LABELS: {
        GET_ALL: '/labels',
        GET_BY_ID: (id: string) => `/labels/${id}`,
        CREATE: '/labels',
        UPDATE: (id: string) => `/labels/${id}`,
        DELETE: (id: string) => `/labels/${id}`,
    },
};