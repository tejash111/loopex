import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    socket = io(apiUrl, {
      withCredentials: true,
      autoConnect: false
    });
  }
  return socket;
};

export const connectSocket = (userId: string) => {
  const socket = getSocket();
  if (!socket.connected) {
    socket.connect();
    // Wait for connection before emitting join
    socket.once('connect', () => {
      console.log('Socket connected, joining with userId:', userId);
      socket.emit('join', userId);
    });
  } else {
    // Already connected, just emit join
    socket.emit('join', userId);
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
