import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { projectsApi, issuesApi } from '../api/resources';
export default function ProjectDetailPage() {
  const { id='' } = useParams();
  const p = useQuery({ queryKey:['project',id], queryFn:()=>projectsApi.get(id) });
  const is = useQuery({ queryKey:['project-issues',id], queryFn:()=>issuesApi.list({project:id}) });
  const project = p.data?.project;
  if (!project) return <div>Loading…</div>;
  return (
    <div className="space-y-4">
      <div className="card p-6">
        <h1 className="text-2xl font-bold">{project.name}</h1>
        <p className="text-slate-500 mt-1">{project.description}</p>
        <div className="mt-3 flex gap-2 text-sm">
          <span className="badge bg-slate-100 text-slate-700">{project.visibility}</span>
          <span className="badge bg-brand-50 text-brand-700">{project.members?.length||0} members</span>
        </div>
      </div>
      <div className="card p-6">
        <div className="flex justify-between items-center mb-3"><h2 className="font-semibold">Issues</h2><Link to="/kanban" className="text-brand-600 text-sm">Open Kanban →</Link></div>
        <ul className="space-y-2">
          {(is.data?.items||[]).map((i:any)=>(
            <li key={i._id} className="flex justify-between p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800">
              <Link to={`/issues/${i._id}`} className="font-medium">#{i.number} {i.title}</Link>
              <span className="badge bg-slate-100 text-slate-700">{i.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
