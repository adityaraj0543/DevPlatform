import { useQuery } from '@tanstack/react-query';
import { activityApi } from '../api/resources';
import { rel } from '../lib/format';
export default function ActivityPage() {
  const q = useQuery({ queryKey:['activity-page'], queryFn:()=>activityApi.list({limit:50}) });
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Activity feed</h1>
      <div className="card divide-y divide-slate-100 dark:divide-slate-700">
        {(q.data?.items||[]).map((a:any)=>(
          <div key={a._id} className="p-4 text-sm"><b>{a.actor?.name||'Someone'}</b> {a.verb} <i>{a.target?.name}</i> <span className="text-xs text-slate-400">· {rel(a.createdAt)}</span></div>
        ))}
      </div>
    </div>
  );
}
