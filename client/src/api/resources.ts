import { api } from './http';

export const projectsApi = {
  list: (params?: any) => api.get('/projects', { params }).then((r) => r.data),
  create: (d: any) => api.post('/projects', d).then((r) => r.data),
  get: (id: string) => api.get(`/projects/${id}`).then((r) => r.data),
  update: (id: string, d: any) => api.patch(`/projects/${id}`, d).then((r) => r.data),
  remove: (id: string) => api.delete(`/projects/${id}`).then((r) => r.data),
  addMember: (id: string, d: any) => api.post(`/projects/${id}/members`, d).then((r) => r.data),
  removeMember: (id: string, uid: string) => api.delete(`/projects/${id}/members/${uid}`).then((r) => r.data),
};

export const reposApi = {
  list: (params?: any) => api.get('/repositories', { params }).then((r) => r.data),
  create: (d: any) => api.post('/repositories', d).then((r) => r.data),
  get: (id: string) => api.get(`/repositories/${id}`).then((r) => r.data),
  update: (id: string, d: any) => api.patch(`/repositories/${id}`, d).then((r) => r.data),
  remove: (id: string) => api.delete(`/repositories/${id}`).then((r) => r.data),
  branches: (id: string) => api.get(`/repositories/${id}/branches`).then((r) => r.data),
  createBranch: (id: string, d: any) => api.post(`/repositories/${id}/branches`, d).then((r) => r.data),
  commits: (id: string, params?: any) => api.get(`/repositories/${id}/commits`, { params }).then((r) => r.data),
  createCommit: (id: string, d: any) => api.post(`/repositories/${id}/commits`, d).then((r) => r.data),
  pulls: (id: string, params?: any) => api.get(`/repositories/${id}/pulls`, { params }).then((r) => r.data),
  createPull: (id: string, d: any) => api.post(`/repositories/${id}/pulls`, d).then((r) => r.data),
  mergePull: (id: string, prId: string) => api.post(`/repositories/${id}/pulls/${prId}/merge`).then((r) => r.data),
  closePull: (id: string, prId: string) => api.post(`/repositories/${id}/pulls/${prId}/close`).then((r) => r.data),
};

export const issuesApi = {
  list: (params?: any) => api.get('/issues', { params }).then((r) => r.data),
  create: (d: any) => api.post('/issues', d).then((r) => r.data),
  get: (id: string) => api.get(`/issues/${id}`).then((r) => r.data),
  update: (id: string, d: any) => api.patch(`/issues/${id}`, d).then((r) => r.data),
  remove: (id: string) => api.delete(`/issues/${id}`).then((r) => r.data),
  move: (id: string, status: string, order = 0) => api.post(`/issues/${id}/kanban`, { status, order }).then((r) => r.data),
};

export const commentsApi = {
  list: (kind: string, id: string) => api.get(`/comments/${kind}/${id}`).then((r) => r.data),
  create: (kind: string, id: string, body: string) => api.post(`/comments/${kind}/${id}`, { body }).then((r) => r.data),
};

export const chatApi = {
  channels: () => api.get('/chat/channels').then((r) => r.data),
  create:   (d: any) => api.post('/chat/channels', d).then((r) => r.data),
  openDM:   (userId: string) => api.post(`/chat/dm/${userId}`).then((r) => r.data),
  messages: (channelId: string, params?: any) => api.get(`/chat/channels/${channelId}/messages`, { params }).then((r) => r.data),
  send:     (channelId: string, body: string) => api.post(`/chat/channels/${channelId}/messages`, { body }).then((r) => r.data),
  react:    (id: string, emoji: string) => api.post(`/chat/messages/${id}/react`, { emoji }).then((r) => r.data),
};

export const notificationsApi = {
  list: () => api.get('/notifications').then((r) => r.data),
  read: (id: string) => api.post(`/notifications/${id}/read`).then((r) => r.data),
  readAll: () => api.post('/notifications/read-all').then((r) => r.data),
};

export const activityApi = { list: (params?: any) => api.get('/activity', { params }).then((r) => r.data) };
export const searchApi   = { global: (q: string) => api.get('/search', { params: { q } }).then((r) => r.data) };
export const usersApi    = {
  list: (params?: any) => api.get('/users', { params }).then((r) => r.data),
  updateMe: (d: any) => api.patch('/users/me', d).then((r) => r.data),
};
export const adminApi = { stats: () => api.get('/admin/stats').then((r) => r.data) };
