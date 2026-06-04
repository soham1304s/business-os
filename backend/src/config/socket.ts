import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'http';

let io: Server;

export const initSocket = (server: HTTPServer) => {
  io = new Server(server, {
    cors: {
      origin: '*', // For development, allow all
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io is not initialized');
  }
  return io;
};
