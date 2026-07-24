import { useNavigate } from 'react-router-dom';
import { Menu, Sun, Moon, Bell, LogOut, Search } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { toggleSidebar, setTheme } from '../../store/uiSlice';
import { doLogout } from '../../features/auth/authSlice';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const nav = useNavigate();
  const { theme } = useAppSelector((s) => s.ui);
  const { user } = useAppSelector((s) => s.auth);

  return (
    <header className="sticky top-0 z-20 h-16 flex items-center gap-3 px-4 md:px-6 glass border-b border-slate-200/60 dark:border-slate-800">
      <button className="btn-ghost !p-2" onClick={() => dispatch(toggleSidebar())}><Menu size={18}/></button>
      <form onSubmit={(e) => { e.preventDefault(); const q = (e.currentTarget.q as any).value; if (q) nav(`/search?q=${encodeURIComponent(q)}`); }} className="flex-1 max-w-xl">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
          <input name="q" className="input pl-9" placeholder="Search projects, repos, issues, users…" />
        </div>
      </form>
      <button className="btn-ghost !p-2" onClick={() => dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'))}>
        {theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}
      </button>
      <button className="btn-ghost !p-2 relative" onClick={() => nav('/notifications')}><Bell size={18}/></button>
      <div className="flex items-center gap-2">
        <img src={user?.avatar?.url || `https://ui-avatars.com/api/?background=2563eb&color=fff&name=${encodeURIComponent(user?.name || 'U')}`} alt="" className="w-8 h-8 rounded-full"/>
        <div className="hidden sm:block text-sm">
          <div className="font-medium">{user?.name}</div>
          <div className="text-xs text-slate-500">@{user?.username}</div>
        </div>
        <button className="btn-ghost !p-2" onClick={() => dispatch(doLogout()).then(() => nav('/login'))}><LogOut size={18}/></button>
      </div>
    </header>
  );
}
