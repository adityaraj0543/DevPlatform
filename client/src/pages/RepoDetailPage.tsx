import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { reposApi } from '../api/resources';
import ReactMarkdown from 'react-markdown';
export default function RepoDetailPage() {
  const { id='' } = useParams();
  const r = useQuery({ queryKey:['repo',id], queryFn:()=>reposApi.get(id) });
  const commits = useQuery({ queryKey:['repo-commits',id], queryFn:()=>reposApi.commits(id) });
  const pulls   = useQuery({ queryKey:['repo-pulls',id],   queryFn:()=>reposApi.pulls(id) });
  const repo = r.data?.repository; if (!repo) return <div>Loading…</div>;
  return (
    <div className="space-y-4">
      <div className="card p-6"><h1 className="text-2xl font-bold">{repo.name}</h1><p className="text-slate-500">{repo.description}</p></div>
      <div className="card p-6 prose dark:prose-invert max-w-none"><ReactMarkdown>{repo.readme || '# README'}</ReactMarkdown></div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-semibold mb-2">Recent commits</h3>
          <ul className="text-sm space-y-1">{(commits.data?.items||[]).map((c:any)=>(<li key={c._id}><code className="text-xs">{c.sha.slice(0,7)}</code> {c.message}</li>))}</ul>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold mb-2">Pull requests</h3>
          <ul className="text-sm space-y-1">{(pulls.data?.items||[]).map((p:any)=>(<li key={p._id}>#{p.number} {p.title} <span className="text-xs text-slate-500">({p.status})</span></li>))}</ul>
        </div>
      </div>
    </div>
  );
}
