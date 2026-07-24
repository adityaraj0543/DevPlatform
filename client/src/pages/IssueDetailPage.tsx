import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { commentsApi, issuesApi } from '../api/resources';
import { useState } from 'react';
import { rel } from '../lib/format';
export default function IssueDetailPage() {
  const { id='' } = useParams(); const qc = useQueryClient();
  const iq = useQuery({ queryKey:['issue',id], queryFn:()=>issuesApi.get(id) });
  const cq = useQuery({ queryKey:['issue-comments',id], queryFn:()=>commentsApi.list('issue', id) });
  const [body,setBody] = useState('');
  const add = useMutation({ mutationFn:()=>commentsApi.create('issue', id, body), onSuccess:()=>{ setBody(''); qc.invalidateQueries({queryKey:['issue-comments',id]}); } });
  const issue = iq.data?.issue; if (!issue) return <div>Loading…</div>;
  return (
    <div className="space-y-4">
      <div className="card p-6"><h1 className="text-2xl font-bold">#{issue.number} {issue.title}</h1><p className="text-slate-500 mt-2 whitespace-pre-wrap">{issue.body}</p></div>
      <div className="card p-6 space-y-3">
        <h2 className="font-semibold">Comments</h2>
        {(cq.data?.comments||[]).map((c:any)=>(
          <div key={c._id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
            <div className="text-xs text-slate-500">{c.author?.name} · {rel(c.createdAt)}</div>
            <div className="mt-1 whitespace-pre-wrap">{c.body}</div>
          </div>
        ))}
        <div className="flex gap-2">
          <textarea className="input" placeholder="Write a comment… (use @username to mention)" value={body} onChange={(e)=>setBody(e.target.value)}/>
          <button className="btn-primary" onClick={()=>add.mutate()} disabled={!body.trim()}>Post</button>
        </div>
      </div>
    </div>
  );
}
