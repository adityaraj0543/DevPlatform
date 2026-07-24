import { useAppSelector } from '../store';
import { useForm } from 'react-hook-form';
import { usersApi } from '../api/resources';
import toast from 'react-hot-toast';
export default function ProfilePage() {
  const user = useAppSelector((s)=>s.auth.user);
  const { register, handleSubmit } = useForm({ defaultValues: { name:user?.name, bio:user?.bio||'', skills:(user?.skills||[]).join(','), links: user?.links || {} } });
  const save = handleSubmit(async(v:any)=>{ await usersApi.updateMe({...v, skills: v.skills.split(',').map((s:string)=>s.trim()).filter(Boolean)}); toast.success('Saved'); });
  return (
    <div className="card p-6 max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Profile</h1>
      <form onSubmit={save} className="space-y-3">
        <input className="input" {...register('name')} placeholder="Name"/>
        <textarea className="input" {...register('bio')} placeholder="Bio"/>
        <input className="input" {...register('skills')} placeholder="Skills, comma separated"/>
        <input className="input" {...register('links.github')} placeholder="GitHub URL"/>
        <input className="input" {...register('links.linkedin')} placeholder="LinkedIn URL"/>
        <input className="input" {...register('links.twitter')} placeholder="Twitter URL"/>
        <button className="btn-primary">Save changes</button>
      </form>
    </div>
  );
}
