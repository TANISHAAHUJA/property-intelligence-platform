import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  login: async (email: string, password: string) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Property Service
export const propertyService = {
  getProperties: async (params: any = {}) => {
    const response = await api.get('/properties', { params });
    return response.data;
  },

  getProperty: async (id: string) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  createProperty: async (propertyData: any) => {
    const response = await api.post('/properties', propertyData);
    return response.data;
  },

  updateProperty: async (id: string, propertyData: any) => {
    const response = await api.put(`/properties/${id}`, propertyData);
    return response.data;
  },

  deleteProperty: async (id: string) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },

  searchProperties: async (searchData: any) => {
    const response = await api.post('/properties/search', searchData);
    return response.data;
  },

  getNearbyProperties: async (id: string, radius: number = 1.0) => {
    const response = await api.get(`/properties/${id}/nearby`, {
      params: { radius_km: radius }
    });
    return response.data;
  },

  getSatelliteImage: async (id: string, options: any = {}) => {
    const response = await api.get(`/properties/${id}/satellite-image`, {
      params: options
    });
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  startAnalysis: async (propertyId: string) => {
    const response = await api.post(`/analysis/${propertyId}/start`, {
      analysis_type: 'full'
    });
    return response.data;
  },

  getAnalysis: async (analysisId: string) => {
    const response = await api.get(`/analysis/${analysisId}`);
    return response.data;
  },
};

// Analysis Service
export const analysisService = {
  startAnalysis: async (propertyId: string, analysisData: any = {}) => {
    const response = await api.post(`/analysis/${propertyId}/start`, analysisData);
    return response.data;
  },

  getAnalysis: async (analysisId: string) => {
    const response = await api.get(`/analysis/${analysisId}`);
    return response.data;
  },

  getAnalysisStatus: async (analysisId: string) => {
    const response = await api.get(`/analysis/${analysisId}/status`);
    return response.data;
  },

  getPropertyAnalyses: async (propertyId: string) => {
    const response = await api.get(`/analysis/property/${propertyId}`);
    return response.data;
  },

  cancelAnalysis: async (analysisId: string) => {
    const response = await api.delete(`/analysis/${analysisId}`);
    return response.data;
  },

  generateReport: async (analysisId: string, format: string = 'json') => {
    const response = await api.get(`/analysis/${analysisId}/report`, {
      params: { format }
    });
    return response.data;
  },
};

export default api;