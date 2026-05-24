import axios from 'axios';

// We use a relative path so the browser sends requests to the Next.js server itself.
// Next.js `rewrites` in next.config.mjs will proxy these requests securely to the backend container.
const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial for sending the HTTP-Only cookie automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;