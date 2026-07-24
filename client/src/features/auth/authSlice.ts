import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../../api/auth';

type User = { _id: string; name: string; username: string; email: string; role: string; avatar?: { url?: string }; bio?: string; skills?: string[]; links?: any; settings?: any };
type State = { user: User | null; loading: boolean; ready: boolean; error?: string };
const initial: State = { user: null, loading: false, ready: false };

export const fetchMe = createAsyncThunk('auth/me', async () => (await authApi.me()).user);
export const doLogin = createAsyncThunk('auth/login', async (d: { email: string; password: string }) => {
  const r = await authApi.login(d);
  if (r.access) localStorage.setItem('access_token', r.access);
  return r.user;
});
export const doSignup = createAsyncThunk('auth/signup', async (d: any) => {
  const r = await authApi.signup(d);
  if (r.access) localStorage.setItem('access_token', r.access);
  return r.user;
});
export const doLogout = createAsyncThunk('auth/logout', async () => { await authApi.logout(); localStorage.removeItem('access_token'); });

const slice = createSlice({
  name: 'auth',
  initialState: initial,
  reducers: { setUser(s, a: PayloadAction<User>) { s.user = a.payload; } },
  extraReducers: (b) => {
    b.addCase(fetchMe.fulfilled, (s, a) => { s.user = a.payload; s.ready = true; });
    b.addCase(fetchMe.rejected, (s) => { s.user = null; s.ready = true; });
    b.addCase(doLogin.pending, (s) => { s.loading = true; s.error = undefined; });
    b.addCase(doLogin.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; });
    b.addCase(doLogin.rejected, (s, a) => { s.loading = false; s.error = a.error.message; });
    b.addCase(doSignup.fulfilled, (s, a) => { s.user = a.payload; });
    b.addCase(doLogout.fulfilled, (s) => { s.user = null; });
  },
});
export const { setUser } = slice.actions;
export default slice.reducer;
