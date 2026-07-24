import { NavLink } from 'react-router-dom';
import { Home, FolderKanban, GitBranch, Bug, KanbanSquare, MessagesSquare, Bell, Activity, Search, User as UserIcon, Settings, Shield, Code2 } from 'lucide-react';
import { useAppSelector } from '../../store';

const items = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/repositories', label: 'Repositories', icon: GitBranch },
  { to: '/issues', label: 'Issues', icon: Bug },
  { to: '/kanban', label: 'Kanban', icon: KanbanSquare },
  { to: '/chat', label: 'Chat', icon: MessagesSquare },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/activity', label: 'Activity', icon: Activity },
  { to: '/search', label: 'Search', icon: Search },
];
const footer = [
  { to: '/profile', label: 'Profile', icon: UserIcon },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const open = useAppSelector((s) => s.ui.sidebarOpen);
  const user = useAppSelector((s) => s.auth.user);
  return (
    <aside className={`hidden lg:flex fixed inset-y-0 left-0 z-30 flex-col glass border-r border-slate-200/60 dark:border-slate-800 transition-all ${open ? 'w-64' : 'w-16'}`}>
      <div className="h-16 flex items-center gap-2 px-4 border-b border-slate-200/60 dark:border-slate-800">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 grid place-items-center text-white"><Code2 size={18}/></div>
        {open && <span className="font-bold">DevPlatform</span>}
      </div>
      <nav className="flex-1 py-3 space-y-1 px-2">
        {items.map((i) => (
          <NavLink key={i.to} to={i.to} end={i.to === '/'}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium ${isActive ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            <i.icon size={18}/> {open && i.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-2 border-t border-slate-200/60 dark:border-slate-800 space-y-1">
        {footer.map((i) => (
          <NavLink key={i.to} to={i.to}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-xl text-sm ${isActive ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            <i.icon size={18}/> {open && i.label}
          </NavLink>
        ))}
        {user?.role === 'admin' && (
          <NavLink to="/admin" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-xl text-sm ${isActive ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            <Shield size={18}/> {open && 'Admin'}
          </NavLink>
        )}
      </div>
    </aside>
  );
}
