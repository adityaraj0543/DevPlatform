import { useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../api/resources';
import { rel } from '../lib/format';
export default function NotificationsPage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey:['notifs'], queryFn:()=>notificationsApi.list() });
  const readAll = async () => { await notificationsApi.readAll(); qc.invalidateQueries({queryKey:['notifs']}); };
  return (
    <div className="space-y-4">
      <div className="flex justify-between"><h1 className="text-2xl font-bold">Notifications</h1><button className="btn-ghost" onClick={readAll}>Mark all read</button></div>
      <div className="card divide-y divide-slate-100 dark:divide-slate-700">
        {(q.data?.items||[]).map((n:any)=>(
          <div key={n._id} className={`p-4 ${!n.read?'bg-brand-50/50 dark:bg-brand-900/10':''}`}>
            <div className="font-medium">{n.title}</div>
            <div className="text-sm text-slate-500">{n.body}</div>
            <div className="text-xs text-slate-400 mt-1">{rel(n.createdAt)}</div>
          </div>
        ))}
        {!q.data?.items?.length && <div className="p-6 text-center text-slate-500">No notifications</div>}
      </div>
    </div>
  );
}
