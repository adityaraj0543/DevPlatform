import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '../api/resources';
import { getSocket } from '../sockets/socket';
import { Send } from 'lucide-react';
import { rel } from '../lib/format';

export default function ChatPage() {
  const { channelId } = useParams();
  const nav = useNavigate(); const qc = useQueryClient();
  const [body,setBody] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const chans = useQuery({ queryKey:['channels'], queryFn:()=>chatApi.channels() });
  const msgs  = useQuery({ queryKey:['messages',channelId], queryFn:()=>chatApi.messages(channelId!), enabled: !!channelId });

  useEffect(()=>{ if (!channelId && chans.data?.channels?.[0]) nav(`/chat/${chans.data.channels[0]._id}`); },[channelId, chans.data, nav]);
  useEffect(()=>{ if (!channelId) return; const s=getSocket(); s.emit('channel:join', channelId); const h=(m:any)=>{ if(String(m.channel)===String(channelId)) qc.invalidateQueries({queryKey:['messages',channelId]}); }; s.on('chat',h); return ()=>{ s.emit('channel:leave',channelId); s.off('chat',h); }; },[channelId,qc]);
  useEffect(()=>{ scrollRef.current?.scrollTo({top: scrollRef.current.scrollHeight}); },[msgs.data]);

  const send = async () => { if (!body.trim() || !channelId) return; await chatApi.send(channelId, body); setBody(''); qc.invalidateQueries({queryKey:['messages',channelId]}); };

  return (
    <div className="grid md:grid-cols-[260px_1fr] gap-4 h-[calc(100vh-8rem)]">
      <aside className="card p-3 overflow-auto">
        <h3 className="font-semibold px-2 mb-2 text-sm text-slate-500">Channels</h3>
        {(chans.data?.channels||[]).map((c:any)=>(
          <button key={c._id} onClick={()=>nav(`/chat/${c._id}`)} className={`w-full text-left px-3 py-2 rounded-lg text-sm ${channelId===c._id?'bg-brand-600 text-white':'hover:bg-slate-100 dark:hover:bg-slate-800'}`}># {c.name}</button>
        ))}
      </aside>
      <div className="card flex flex-col">
        <div ref={scrollRef} className="flex-1 overflow-auto p-4 space-y-3">
          {(msgs.data?.messages||[]).map((m:any)=>(
            <div key={m._id} className="flex gap-3">
              <img src={m.author?.avatar?.url || `https://ui-avatars.com/api/?background=2563eb&color=fff&name=${encodeURIComponent(m.author?.name||'U')}`} className="w-8 h-8 rounded-full"/>
              <div><div className="text-sm"><b>{m.author?.name}</b> <span className="text-xs text-slate-500">{rel(m.createdAt)}</span></div><div className="text-sm">{m.body}</div></div>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-slate-200 dark:border-slate-700 flex gap-2">
          <input className="input" placeholder="Message…" value={body} onChange={(e)=>setBody(e.target.value)} onKeyDown={(e)=>{ if(e.key==='Enter') send(); }}/>
          <button className="btn-primary" onClick={send}><Send size={16}/></button>
        </div>
      </div>
    </div>
  );
}
