import { formatDistanceToNow, format } from 'date-fns';
export const rel = (d: string | Date) => formatDistanceToNow(new Date(d), { addSuffix: true });
export const fmt = (d: string | Date, f = 'PP') => format(new Date(d), f);
