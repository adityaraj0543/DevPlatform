import { io, Socket } from 'socket.io-client';
let socket: Socket | null = null;
export function getSocket(): Socket {
  if (socket) return socket;
  socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
    auth: { token: localStorage.getItem('access_token') },
    autoConnect: true, transports: ['websocket'],
  });
  return socket;
}
export function disconnectSocket() { socket?.disconnect(); socket = null; }
