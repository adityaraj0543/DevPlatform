import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Theme } from '../lib/theme';
type State = { theme: Theme; sidebarOpen: boolean };
const initial: State = { theme: (localStorage.getItem('theme') as Theme) || 'system', sidebarOpen: true };
const slice = createSlice({
  name: 'ui', initialState: initial,
  reducers: {
    setTheme(s, a: PayloadAction<Theme>) { s.theme = a.payload; localStorage.setItem('theme', a.payload); },
    toggleSidebar(s) { s.sidebarOpen = !s.sidebarOpen; },
  },
});
export const { setTheme, toggleSidebar } = slice.actions;
export default slice.reducer;
