import axios from 'axios';

const api = axios.create({
  baseURL: 'https://kanban-api-master-ywzdux.free.laravel.cloud/api', // Assuming /api prefix based on Laravel conventions, if not I'll adjust
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export default api;
