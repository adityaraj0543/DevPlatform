import { useAppDispatch, useAppSelector } from '../store';
import { setTheme } from '../store/uiSlice';
export default function SettingsPage() {
  const d = useAppDispatch(); const { theme } = useAppSelector((s)=>s.ui);
  return (
    <div className="card p-6 max-w-xl space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div>
        <label className="block text-sm mb-1">Theme</label>
        <select className="input" value={theme} onChange={(e)=>d(setTheme(e.target.value as any))}>
          <option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option>
        </select>
      </div>
    </div>
  );
}
