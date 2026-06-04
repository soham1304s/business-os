import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_URL } from '../config';

// Global socket singleton to prevent multiple connections per user
let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(API_URL);
  }
  return socket;
}

/**
 * Hook to listen to specific socket events and trigger a callback
 * @param events Array of event names to listen for (e.g., ['new-request', 'metrics-updated'])
 * @param callback Function to execute when any of the specified events occur
 */
export function useLiveUpdate(events: string[], callback: (payload?: any) => void) {
  useEffect(() => {
    const s = getSocket();

    // Register listeners for all requested events
    events.forEach((event) => {
      s.on(event, callback);
    });

    // Cleanup listeners on unmount
    return () => {
      events.forEach((event) => {
        s.off(event, callback);
      });
    };
  }, [events, callback]);
}
