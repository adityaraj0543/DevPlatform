import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppDispatch } from '../store';
import { doSignup } from '../features/auth/authSlice';
export default function SignupPage() {
  const { register, handleSubmit, formState:{isSubmitting} } = useForm<any>();
  const d = useAppDispatch(); const nav = useNavigate();
  const onSubmit = handleSubmit(async (v) => {
    try { await d(doSignup(v)).unwrap(); toast.success('Account created!'); nav('/'); }
    catch (e:any) { toast.error(e?.response?.data?.message || 'Signup failed'); }
  });
  return (
    <div className="card p-8">
      <h2 className="text-2xl font-bold mb-1">Create your account</h2>
      <p className="text-sm text-slate-500 mb-6">Start collaborating in minutes.</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <input className="input" placeholder="Full name" {...register('name',{required:true})}/>
        <input className="input" placeholder="Username" {...register('username',{required:true})}/>
        <input className="input" type="email" placeholder="Email" {...register('email',{required:true})}/>
        <input className="input" type="password" placeholder="Password (min 8)" {...register('password',{required:true,minLength:8})}/>
        <button className="btn-primary w-full justify-center" disabled={isSubmitting}>Sign up</button>
      </form>
      <p className="text-sm mt-4">Have an account? <Link to="/login" className="text-brand-600">Log in</Link></p>
    </div>
  );
}
