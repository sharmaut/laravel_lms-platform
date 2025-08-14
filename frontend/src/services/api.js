import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true, // Important for authentication later
});

export default apiClient;