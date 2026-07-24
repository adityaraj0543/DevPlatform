import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchApi } from '../api/resources';
export default function SearchPage() {
  const [sp] = useSearchParams(); const q = sp.get('q') || '';
  const r = useQuery({ queryKey:['search',q], queryFn:()=>searchApi.global(q), enabled: !!q });
  const res = r.data?.results || {};
  const Section = ({title,items,render}:any) => items?.length? (
    <div className="card p-5"><h3 className="font-semibold mb-2">{title}</h3><ul className="space-y-1">{items.map(render)}</ul></div>
  ) : null;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Search: {q}</h1>
      {!q && <p className="text-slate-500">Type a search from the top bar.</p>}
      <div className="grid md:grid-cols-2 gap-4">
        <Section title="Projects" items={res.projects} render={(p:any)=><li key={p._id}>{p.name}</li>}/>
        <Section title="Repositories" items={res.repos} render={(p:any)=><li key={p._id}>{p.name}</li>}/>
        <Section title="Issues" items={res.issues} render={(p:any)=><li key={p._id}>#{p.number} {p.title}</li>}/>
        <Section title="Users" items={res.users} render={(p:any)=><li key={p._id}>{p.name} · @{p.username}</li>}/>
      </div>
    </div>
  );
}
