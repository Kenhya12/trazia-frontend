// Configuración para alternar entre mock y API real
// Usa automáticamente mock en desarrollo y API real en producción
export const USE_MOCK_SERVICE = import.meta.env.MODE !== 'production';

// URL base del backend (ajustar según tu entorno)
export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090/api';