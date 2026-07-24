import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { issuesApi } from '../api/resources';
import { getSocket } from '../sockets/socket';
const COLS = [{k:'todo',t:'Todo'},{k:'in_progress',t:'In Progress'},{k:'review',t:'Review'},{k:'done',t:'Done'}];
export default function KanbanPage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey:['kanban-issues'], queryFn:()=>issuesApi.list({limit:100}) });
  useEffect(()=>{ const s=getSocket(); const h=()=>qc.invalidateQueries({queryKey:['kanban-issues']}); s.on('kanban',h); s.on('issue',h); return ()=>{s.off('kanban',h); s.off('issue',h);}; },[qc]);
  const onDragStart = (e: React.DragEvent, id: string) => e.dataTransfer.setData('id', id);
  const onDrop = async (e: React.DragEvent, status: string) => { const id = e.dataTransfer.getData('id'); if (id) { await issuesApi.move(id, status); qc.invalidateQueries({queryKey:['kanban-issues']}); } };
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Kanban board</h1>
      <div className="grid md:grid-cols-4 gap-4">
        {COLS.map((c)=>(
          <div key={c.k} className="card p-3 min-h-[300px]" onDragOver={(e)=>e.preventDefault()} onDrop={(e)=>onDrop(e,c.k)}>
            <h3 className="font-semibold text-sm mb-2 text-slate-500 uppercase">{c.t}</h3>
            <div className="space-y-2">
              {(q.data?.items||[]).filter((i:any)=>i.status===c.k).map((i:any)=>(
                <div key={i._id} draggable onDragStart={(e)=>onDragStart(e, i._id)} className="p-3 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-sm cursor-grab">
                  <div className="text-sm font-medium">#{i.number} {i.title}</div>
                  <div className="text-xs text-slate-500 mt-1">{i.priority}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
