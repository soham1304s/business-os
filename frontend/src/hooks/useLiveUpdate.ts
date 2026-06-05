import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_URL } from '../config';

// Global socket singleton to prevent multiple connections per user
let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(API_URL, {
      transports: ['websocket', 'polling'], // Fallback to polling
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socket;
}

/**
 * Hook to listen to specific socket events and trigger a callback
 * Includes a polling fallback for serverless environments (like Vercel) where WebSockets may fail
 * @param events Array of event names to listen for (e.g., ['new-request', 'metrics-updated'])
 * @param callback Function to execute when any of the specified events occur
 */
export function useLiveUpdate(events: string[], callback: (payload?: any) => void) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const s = getSocket();

    const handleEvent = (payload?: any) => {
      savedCallback.current(payload);
    };

    // Register listeners for all requested events
    events.forEach((event) => {
      s.on(event, handleEvent);
    });

    // Fallback Polling Mechanism for Vercel/Serverless
    // Trigger generic updates periodically to simulate "live" feed if WebSockets fail
    const pollInterval = setInterval(() => {
      // If socket is not connected or we are using polling, trigger a silent update
      if (!s.connected) {
        // Trigger a generic event without payload to force re-fetch
        savedCallback.current(null);
      }
    }, 15000); // Poll every 15 seconds as fallback

    // Cleanup listeners on unmount
    return () => {
      events.forEach((event) => {
        s.off(event, handleEvent);
      });
      clearInterval(pollInterval);
    };
  }, [events]);
}
