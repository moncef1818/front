// // src/utils/axiosConfig.js
// import axios from 'axios';

// // Create axios instance with base URL for REMOTE backend
// const api = axios.create({
//   baseURL: 'https://cic-opening-day-backend.onrender.com/api/', // REMOTE backend
//   timeout: 10000, // 10 seconds timeout
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor - add token to every request
// api.interceptors.request.use(
//   (config) => {
//     console.log('🌐 Making request to:', config.url);
//     console.log('🔑 Has token?', !!localStorage.getItem('access_token'));
//     const token = localStorage.getItem('access_token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor - handle token refresh
// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;
    
//     // If error is 401 and we haven't tried refreshing yet
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
      
//       try {
//         const refreshToken = localStorage.getItem('refresh_token');
        
//         if (!refreshToken) {
//           throw new Error('No refresh token');
//         }
        
//         // Try to refresh the token - USE REMOTE URL
//         const response = await axios.post('https://cic-opening-day-backend.onrender.com/api/token/refresh/', {
//           refresh: refreshToken
//         });
        
//         const { access } = response.data;
        
//         // Update the access token
//         localStorage.setItem('access_token', access);
        
//         // Retry the original request with new token
//         originalRequest.headers.Authorization = `Bearer ${access}`;
//         return api(originalRequest);
        
//       } catch (refreshError) {
//         console.error('Token refresh failed:', refreshError);
        
//         // Clear all auth data and redirect to login
//         localStorage.removeItem('access_token');
//         localStorage.removeItem('refresh_token');
//         localStorage.removeItem('team_id');
        
//         // Only redirect if we're not already on login page
//         if (!window.location.pathname.includes('/login')) {
//           window.location.href = '/login';
//         }
        
//         return Promise.reject(refreshError);
//       }
//     }
    
//     return Promise.reject(error);
//   }
// );

// export default api;

// src/utils/axiosConfig.js
import axios from 'axios';

// Base URL from environment or fallback
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://cic-opening-day-backend.onrender.com/api/';

// --- Main Axios instance for API calls ---
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Separate Axios instance for refresh requests (no interceptors) ---
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// --- Attach access token to requests ---
api.interceptors.request.use(
  (config) => {
    const access = localStorage.getItem('access_token');
    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Token refresh queue to handle multiple simultaneous requests ---
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// --- Response interceptor handles 401 errors (expired access token) ---
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!error.response) return Promise.reject(error);

    // Only try refresh if 401 and not retried yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem('refresh_token');
      if (!refresh) {
        console.warn("No refresh token — redirecting to login");
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // If a refresh is already in progress, queue the request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (newToken) => {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        // --- Only refresh when access token is expired ---
        const refreshResponse = await refreshClient.post('/token/refresh/', {
          refresh,
        });

        const newAccess = refreshResponse.data?.access;
        if (!newAccess) throw new Error("No access token returned from refresh");

        // Save new access token
        localStorage.setItem('access_token', newAccess);

        // Update default header for future requests
        api.defaults.headers.Authorization = `Bearer ${newAccess}`;

        // Retry all queued requests
        processQueue(null, newAccess);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);

      } catch (refreshError) {
        console.error("Refresh failed:", refreshError);

        processQueue(refreshError, null);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }

    // Optional: log server errors
    if (error.response.status === 500) {
      console.error("Server error:", originalRequest.url, error.response.data);
    }

    return Promise.reject(error);
  }
);

export default api;
