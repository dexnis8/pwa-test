import { io } from "socket.io-client";
import tokenManager from "./tokenManager";
import { CLIENT_EVENTS } from "./socketEvents";

/**
 * One socket connection for the whole app.
 *
 * The API base URL already carries the /api/v1 suffix, which Socket.IO must
 * not: it connects to the origin and uses its own /socket.io path. Stripping
 * it here rather than adding a second env var keeps local and production
 * pointing at the same host as the REST client, automatically.
 */
const apiBase = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL
  : import.meta.env.VITE_API_DEV_URL;

export const socketOrigin = (apiBase || "").replace(/\/api\/v1\/?$/, "");

let socket = null;
let heartbeat = null;
let refreshing = false;

/**
 * Connects, or returns the existing connection.
 *
 * Reconnection matters more here than almost anywhere else in the app: a duel
 * on mobile data will drop, and the whole design assumes the client comes back
 * and resumes from server state rather than losing the match.
 */
export const connectSocket = () => {
  const token = tokenManager.getAccessToken();
  if (!token) return null;

  if (socket?.connected || socket?.active) return socket;

  socket = io(socketOrigin, {
    auth: { token },
    // Polling first, then upgrade. School proxies and some mobile networks
    // block the WebSocket upgrade outright; without this the mode simply would
    // not work for those learners.
    transports: ["polling", "websocket"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 800,
    reconnectionDelayMax: 8000,
    timeout: 15000,
  });

  socket.on("connect", () => {
    startHeartbeat();
  });

  socket.on("disconnect", () => {
    stopHeartbeat();
  });

  /**
   * An expired access token looks exactly like a network failure to
   * Socket.IO's reconnect loop, so it would retry the dead token forever.
   * Distinguishing the two and refreshing once is what keeps a duel alive
   * across the one-hour token boundary.
   */
  socket.on("connect_error", async (error) => {
    const reason = String(error?.message || "");

    if (reason !== "token_expired" && reason !== "unauthorized") return;
    if (refreshing) return;

    refreshing = true;
    try {
      const fresh = await tokenManager.refreshAccessToken();
      if (fresh && socket) {
        socket.auth = { token: fresh };
        socket.connect();
      }
    } catch {
      // The axios interceptor owns the redirect to sign-in; nothing to add.
    } finally {
      refreshing = false;
    }
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  stopHeartbeat();
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};

/** Presence TTL on the server is 45s, so 20s leaves room for one lost beat. */
const startHeartbeat = () => {
  stopHeartbeat();
  heartbeat = setInterval(() => {
    socket?.emit(CLIENT_EVENTS.PRESENCE_HEARTBEAT);
  }, 20000);
};

const stopHeartbeat = () => {
  if (heartbeat) {
    clearInterval(heartbeat);
    heartbeat = null;
  }
};

/**
 * Subscribes to an event and returns an unsubscribe function, so effects can
 * clean up without every caller remembering the matching `off`.
 */
export const onSocket = (event, handler) => {
  const active = socket || connectSocket();
  if (!active) return () => {};
  active.on(event, handler);
  return () => active.off(event, handler);
};

export const emitSocket = (event, payload, ack) => {
  const active = socket || connectSocket();
  if (!active) return false;
  active.emit(event, payload, ack);
  return true;
};
