import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { authApi } from '../api/auth';
export default function ResetPasswordPage() {
  const [sp] = useSearchParams(); const nav = useNavigate();
  const [password,setPassword] = useState('');
  return (
    <div className="card p-8">
      <h2 className="text-2xl font-bold mb-6">Reset password</h2>
      <form onSubmit={async(e)=>{e.preventDefault(); try{ await authApi.reset({token:sp.get('token'), email:sp.get('email'), password}); toast.success('Password reset'); nav('/login'); }catch(err:any){toast.error(err?.response?.data?.message||'Failed')}}} className="space-y-4">
        <input className="input" type="password" minLength={8} required value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="New password"/>
        <button className="btn-primary w-full justify-center">Reset</button>
      </form>
    </div>
  );
}
