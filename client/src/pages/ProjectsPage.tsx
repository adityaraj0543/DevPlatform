import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '../api/resources';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
export default function ProjectsPage() {
  const qc = useQueryClient();
  const [open,setOpen] = useState(false);
  const [name,setName] = useState(''); const [desc,setDesc] = useState(''); const [vis,setVis] = useState('private');
  const q = useQuery({ queryKey:['projects'], queryFn:()=>projectsApi.list() });
  const create = useMutation({ mutationFn:()=>projectsApi.create({name,description:desc,visibility:vis}), onSuccess:()=>{ toast.success('Project created'); setOpen(false); setName(''); setDesc(''); qc.invalidateQueries({queryKey:['projects']}); }});
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center"><h1 className="text-2xl font-bold">Projects</h1><button className="btn-primary" onClick={()=>setOpen(true)}><Plus size={16}/> New project</button></div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(q.data?.items||[]).map((p:any)=>(
          <Link key={p._id} to={`/projects/${p._id}`} className="card p-5 hover:shadow-md transition">
            <div className="flex justify-between"><h3 className="font-semibold">{p.name}</h3><span className={`badge ${p.visibility==='public'?'bg-emerald-100 text-emerald-700':'bg-slate-100 text-slate-600'}`}>{p.visibility}</span></div>
            <p className="text-sm text-slate-500 mt-2 line-clamp-2">{p.description}</p>
          </Link>
        ))}
      </div>
      {open && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center z-50" onClick={()=>setOpen(false)}>
          <div className="card p-6 w-full max-w-md" onClick={(e)=>e.stopPropagation()}>
            <h3 className="font-semibold mb-4">New project</h3>
            <div className="space-y-3">
              <input className="input" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)}/>
              <textarea className="input" placeholder="Description" value={desc} onChange={(e)=>setDesc(e.target.value)}/>
              <select className="input" value={vis} onChange={(e)=>setVis(e.target.value)}><option value="private">Private</option><option value="public">Public</option></select>
              <button className="btn-primary w-full justify-center" onClick={()=>create.mutate()} disabled={!name}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
