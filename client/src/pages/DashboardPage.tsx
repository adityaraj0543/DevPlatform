import { useQuery } from '@tanstack/react-query';
import { activityApi, issuesApi, projectsApi, notificationsApi } from '../api/resources';
import { rel } from '../lib/format';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GitBranch, Bug, Bell, FolderKanban } from 'lucide-react';

const Stat = ({icon:Icon,label,value,to}:any) => (
  <Link to={to} className="card p-5 flex items-center gap-4 hover:shadow-md transition">
    <div className="w-12 h-12 grid place-items-center rounded-xl bg-brand-50 dark:bg-brand-900/30 text-brand-600"><Icon/></div>
    <div><div className="text-2xl font-bold">{value}</div><div className="text-sm text-slate-500">{label}</div></div>
  </Link>
);

export default function DashboardPage() {
  const projects = useQuery({ queryKey:['projects','mine'], queryFn:()=>projectsApi.list({limit:5}) });
  const issues   = useQuery({ queryKey:['issues','mine'],   queryFn:()=>issuesApi.list({limit:5}) });
  const acts     = useQuery({ queryKey:['activity'],        queryFn:()=>activityApi.list({limit:10}) });
  const notifs   = useQuery({ queryKey:['notifs'],          queryFn:()=>notificationsApi.list() });
  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={FolderKanban} label="Projects" value={projects.data?.total ?? '—'} to="/projects"/>
        <Stat icon={GitBranch}    label="Repositories" value={'—'} to="/repositories"/>
        <Stat icon={Bug}          label="Issues" value={issues.data?.total ?? '—'} to="/issues"/>
        <Stat icon={Bell}         label="Unread notifs" value={notifs.data?.unread ?? 0} to="/notifications"/>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <section className="card p-5">
          <h3 className="font-semibold mb-3">Recent projects</h3>
          <ul className="space-y-2">
            {(projects.data?.items||[]).map((p:any)=>(
              <li key={p._id}><Link to={`/projects/${p._id}`} className="flex justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"><span className="font-medium">{p.name}</span><span className="text-xs text-slate-500">{rel(p.updatedAt)}</span></Link></li>
            ))}
            {!projects.data?.items?.length && <li className="text-sm text-slate-500">No projects yet.</li>}
          </ul>
        </section>
        <section className="card p-5">
          <h3 className="font-semibold mb-3">Live activity</h3>
          <ul className="space-y-2">
            {(acts.data?.items||[]).map((a:any)=>(
              <li key={a._id} className="text-sm text-slate-600 dark:text-slate-300"><b>{a.actor?.name||'Someone'}</b> {a.verb} <i>{a.target?.name}</i> · <span className="text-xs text-slate-400">{rel(a.createdAt)}</span></li>
            ))}
            {!acts.data?.items?.length && <li className="text-sm text-slate-500">No activity yet.</li>}
          </ul>
        </section>
      </div>
    </motion.div>
  );
}
