import { Outlet, Link } from 'react-router-dom';
import { Code2 } from 'lucide-react';
export default function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-slate-50 to-brand-50 dark:from-slate-900 dark:to-slate-950">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-brand-700 to-brand-900 text-white">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl"><Code2/> DevPlatform</Link>
        <div>
          <h1 className="text-4xl font-bold leading-tight">Ship faster with your team.</h1>
          <p className="mt-4 text-brand-100 max-w-md">Code, plan, and chat in one place — repositories, Kanban, real-time chat, and analytics for engineering teams.</p>
        </div>
        <p className="text-xs text-brand-200">© {new Date().getFullYear()} DevPlatform</p>
      </div>
      <div className="flex items-center justify-center p-6"><div className="w-full max-w-md"><Outlet /></div></div>
    </div>
  );
}
