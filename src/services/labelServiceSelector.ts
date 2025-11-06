import { labelService } from './labelService';
import { USE_MOCK_SERVICE, API_BASE_URL } from './labelServiceConfig';

// info sobre el servicio usado
export const serviceInfo = {
    isMock: USE_MOCK_SERVICE,
    type: USE_MOCK_SERVICE ? 'Mock Service' : 'API Real',
    baseURL: API_BASE_URL,
};

// exportar labelService como labelServiceAPI
export const labelServiceAPI = labelService;