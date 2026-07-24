import { useState } from 'react';
import toast from 'react-hot-toast';
import { authApi } from '../api/auth';
export default function ForgotPasswordPage() {
  const [email,setEmail] = useState('');
  return (
    <div className="card p-8">
      <h2 className="text-2xl font-bold mb-6">Forgot password</h2>
      <form onSubmit={async(e)=>{e.preventDefault(); await authApi.forgot(email); toast.success('Check your email');}} className="space-y-4">
        <input className="input" type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email"/>
        <button className="btn-primary w-full justify-center">Send reset link</button>
      </form>
    </div>
  );
}
