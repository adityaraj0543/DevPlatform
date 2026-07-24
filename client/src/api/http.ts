import axios from 'axios';
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem('access_token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

let refreshing: Promise<string | null> | null = null;
async function refreshToken(): Promise<string | null> {
  if (refreshing) return refreshing;
  refreshing = axios
    .post(`${import.meta.env.VITE_API_URL || '/api'}/auth/refresh`, {}, { withCredentials: true })
    .then((r) => { localStorage.setItem('access_token', r.data.access); return r.data.access as string; })
    .catch(() => null)
    .finally(() => { refreshing = null; });
  return refreshing;
}

api.interceptors.response.use(
  (r) => r,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry && !original.url?.includes('/auth/')) {
      original._retry = true;
      const t = await refreshToken();
      if (t) { original.headers.Authorization = `Bearer ${t}`; return api(original); }
    }
    return Promise.reject(err);
  },
);
