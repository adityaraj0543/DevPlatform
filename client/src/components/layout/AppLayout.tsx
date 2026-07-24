import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { getSocket, disconnectSocket } from '../../sockets/socket';
import { useAppSelector } from '../../store';

export default function AppLayout() {
  const open = useAppSelector((s) => s.ui.sidebarOpen);
  useEffect(() => { getSocket(); return () => disconnectSocket(); }, []);
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      <Sidebar />
      <div className={`transition-all ${open ? 'lg:pl-64' : 'lg:pl-16'}`}>
        <Navbar />
        <main className="p-4 md:p-6 max-w-7xl mx-auto"><Outlet /></main>
      </div>
    </div>
  );
}
