import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/resources';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
const COLORS = ['#2563eb','#22c55e','#f59e0b','#ef4444','#8b5cf6'];
export default function AdminPage() {
  const q = useQuery({ queryKey:['admin-stats'], queryFn:()=>adminApi.stats() });
  const d = q.data || {} as any;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Admin dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {['users','projects','repos','issues','commits'].map((k)=>(
          <div key={k} className="card p-4"><div className="text-xs text-slate-500 uppercase">{k}</div><div className="text-2xl font-bold">{d.totals?.[k] ?? '—'}</div></div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card p-4"><h3 className="font-semibold mb-2">Commits per day</h3>
          <div style={{width:'100%',height:260}}><ResponsiveContainer><BarChart data={d.commitsPerDay||[]}><XAxis dataKey="_id" hide/><YAxis/><Tooltip/><Bar dataKey="count" fill="#2563eb"/></BarChart></ResponsiveContainer></div>
        </div>
        <div className="card p-4"><h3 className="font-semibold mb-2">Issues by status</h3>
          <div style={{width:'100%',height:260}}><ResponsiveContainer><PieChart><Pie data={d.issuesByStatus||[]} dataKey="count" nameKey="_id" outerRadius={90} label>{(d.issuesByStatus||[]).map((_e:any,i:number)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div>
        </div>
      </div>
      <div className="card p-4">
        <h3 className="font-semibold mb-2">Most active users</h3>
        <ul className="space-y-1 text-sm">{(d.mostActive||[]).map((u:any)=>(<li key={u._id} className="flex justify-between"><span>{u.user?.name}</span><span className="text-slate-500">{u.count} commits</span></li>))}</ul>
      </div>
    </div>
  );
}
