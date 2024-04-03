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
      config.headers['Correlation-ID'] = uuidv4();
      config.headers['Cache-Control'] = 'no-cache';
      return config;
    },
    (error: Error) => {
      return Promise.reject(error);
    },
  );
}

export default http;
