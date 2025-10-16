export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        REFRESH: '/auth/refresh',
        LOGOUT: '/auth/logout',
        VALIDATE: '/auth/validate'
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
