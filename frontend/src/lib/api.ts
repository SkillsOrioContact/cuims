import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5228/api', // Match ASP.NET default URL
  withCredentials: true, // Crucial for sending the HTTP-Only cookie automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;