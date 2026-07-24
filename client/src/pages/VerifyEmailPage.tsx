import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { authApi } from '../api/auth';
export default function VerifyEmailPage() {
  const [sp] = useSearchParams();
  const [status,setStatus] = useState('Verifying…');
  useEffect(()=>{ authApi.verify({token:sp.get('token'), email:sp.get('email')}).then(()=>setStatus('Email verified! You can close this tab.')).catch((e)=>setStatus(e?.response?.data?.message||'Verification failed')); },[sp]);
  return <div className="card p-8 text-center">{status}</div>;
}
