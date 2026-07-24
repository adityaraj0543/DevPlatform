import { Link } from 'react-router-dom';
export default function NotFoundPage() {
  return (
    <div className="min-h-screen grid place-items-center bg-slate-50 dark:bg-slate-950 text-center p-6">
      <div><div className="text-6xl font-bold text-brand-600">404</div><p className="mt-2 text-slate-500">Page not found</p><Link to="/" className="btn-primary mt-4">Go home</Link></div>
    </div>
  );
}
