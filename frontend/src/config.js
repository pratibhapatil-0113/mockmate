// API base URL — if no env value is provided, use relative API paths for local development.
// Example remote deployment URL: https://mockmate-api.onrender.com
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export default API_BASE_URL;
