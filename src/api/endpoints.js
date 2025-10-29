export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        REFRESH: '/api/auth/refresh',
        LOGOUT: '/api/auth/logout',
        VALIDATE: '/api/auth/validate'
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
    }
};
