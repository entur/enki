import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export const API_BASE =
  import.meta.env.NODE_ENV !== 'test'
    ? window.location.origin + import.meta.env.PUBLIC_URL + '/api'
    : import.meta.env.API_PROXY;

const http = axios.create({ baseURL: API_BASE });

if (import.meta.env.NODE_ENV !== 'test') {
  http.interceptors.request.use(
    (config) => {
      return {
        ...config,
        headers: {
          ...config.headers,
          'Correlation-ID': uuidv4,
          'Cache-Control': 'no-cache',
        },
      };
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

export default http;
