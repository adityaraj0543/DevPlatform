import { useQuery } from '@tanstack/react-query';
import { issuesApi } from '../api/resources';
import { Link } from 'react-router-dom';
export default function IssuesPage() {
  const q = useQuery({ queryKey:['issues'], queryFn:()=>issuesApi.list() });
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Issues</h1>
      <div className="card divide-y divide-slate-100 dark:divide-slate-700">
        {(q.data?.items||[]).map((i:any)=>(
          <Link key={i._id} to={`/issues/${i._id}`} className="flex justify-between items-center p-4 hover:bg-slate-50 dark:hover:bg-slate-800">
            <div><div className="font-medium">#{i.number} {i.title}</div><div className="text-xs text-slate-500">by {i.author?.name}</div></div>
            <div className="flex gap-2"><span className="badge bg-slate-100 text-slate-700">{i.priority}</span><span className="badge bg-brand-50 text-brand-700">{i.status}</span></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
