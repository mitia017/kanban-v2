import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Assuming /api prefix based on Laravel conventions, if not I'll adjust
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export default api;
