import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'http';

let io: Server | null = null;

export const initSocket = (server: HTTPServer) => {
  if (process.env.VERCEL) {
    return null; // Don't initialize real sockets on Vercel
  }

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
    // Provide a dummy mock for Vercel to prevent crashes when controllers call emit
    if (process.env.VERCEL) {
      return {
        emit: (...args: any[]) => {
          // Mock emit, does nothing on Vercel Serverless
        }
      } as unknown as Server;
    }
    throw new Error('Socket.io is not initialized');
  }
  return io;
};
