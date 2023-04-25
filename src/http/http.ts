import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export const API_BASE =
  process.env.NODE_ENV !== 'test'
    ? window.location.origin + process.env.PUBLIC_URL + '/api'
    : process.env.API_PROXY;

const http = axios.create({ baseURL: API_BASE });

if (process.env.NODE_ENV !== 'test') {
  http.interceptors.request.use(
    (config) => {
      config.headers['Correlation-ID'] = uuidv4();
      config.headers['Cache-Control'] = 'no-cache';
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

export default http;
