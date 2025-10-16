import axios from 'axios';

const BASE_URL = 'http://localhost:9090';

// Crear instancia de axios
const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor de REQUEST - Agregar token automáticamente
client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de RESPONSE - Manejar errores y refresh token
client.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Si el error es 401 (token expirado) y no es el refresh endpoint
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Intentar renovar el token
                const refreshToken = localStorage.getItem('refreshToken');

                if (refreshToken) {
                    const { data } = await axios.post(
                        `${BASE_URL}/auth/refresh`,
                        { refreshToken }
                    );

                    // Guardar nuevo token
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('refreshToken', data.refreshToken);

                    // Reintentar la petición original
                    originalRequest.headers.Authorization = `Bearer ${data.token}`;
                    return client(originalRequest);
                }
            } catch (refreshError) {
                // Si el refresh falla, limpiar todo y redirigir
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default client;
