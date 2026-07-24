import { useQuery } from '@tanstack/react-query';
import { reposApi } from '../api/resources';
import { Link } from 'react-router-dom';
import { GitBranch } from 'lucide-react';
export default function RepositoriesPage() {
  const q = useQuery({ queryKey:['repos'], queryFn:()=>reposApi.list() });
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Repositories</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {(q.data?.items||[]).map((r:any)=>(
          <Link key={r._id} to={`/repositories/${r._id}`} className="card p-5 hover:shadow-md">
            <div className="flex items-center gap-2 font-semibold"><GitBranch size={16}/> {r.name}</div>
            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{r.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
