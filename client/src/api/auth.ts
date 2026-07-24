import { api } from './http';
export const authApi = {
  signup: (d: any) => api.post('/auth/signup', d).then((r) => r.data),
  login:  (d: any) => api.post('/auth/login', d).then((r) => r.data),
  google: (credential: string) => api.post('/auth/google', { credential }).then((r) => r.data),
  logout: () => api.post('/auth/logout').then((r) => r.data),
  me:     () => api.get('/auth/me').then((r) => r.data),
  forgot: (email: string) => api.post('/auth/forgot-password', { email }).then((r) => r.data),
  reset:  (d: any) => api.post('/auth/reset-password', d).then((r) => r.data),
  verify: (d: any) => api.post('/auth/verify-email', d).then((r) => r.data),
};
