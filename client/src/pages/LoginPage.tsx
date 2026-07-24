import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppDispatch } from '../store';
import { doLogin } from '../features/auth/authSlice';
export default function LoginPage() {
  const { register, handleSubmit, formState:{isSubmitting} } = useForm<{email:string;password:string}>();
  const d = useAppDispatch(); const nav = useNavigate();
  const onSubmit = handleSubmit(async (v) => {
    try { await d(doLogin(v)).unwrap(); nav('/'); }
    catch (e:any) { toast.error(e?.response?.data?.message || 'Login failed'); }
  });
  return (
    <div className="card p-8">
      <h2 className="text-2xl font-bold mb-1">Welcome back</h2>
      <p className="text-sm text-slate-500 mb-6">Log in to your DevPlatform account.</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <input className="input" type="email" placeholder="Email" {...register('email',{required:true})}/>
        <input className="input" type="password" placeholder="Password" {...register('password',{required:true})}/>
        <button className="btn-primary w-full justify-center" disabled={isSubmitting}>Log in</button>
      </form>
      <div className="text-sm mt-4 flex justify-between">
        <Link to="/forgot-password" className="text-brand-600">Forgot password?</Link>
        <Link to="/signup" className="text-brand-600">Create account</Link>
      </div>
    </div>
  );
}
