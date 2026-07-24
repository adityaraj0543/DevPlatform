import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store';
export default function RequireAuth() {
  const { user, ready } = useAppSelector((s) => s.auth);
  const loc = useLocation();
  if (!ready) return <div className="grid place-items-center h-screen text-slate-500">Loading…</div>;
  if (!user)  return <Navigate to="/login" replace state={{ from: loc }} />;
  return <Outlet />;
}
