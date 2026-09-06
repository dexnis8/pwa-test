/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  connectSocket,
  disconnectSocket,
  getSocket,
  onSocket,
  emitSocket,
} from "../lib/socket";
import { SERVER_EVENTS } from "../lib/socketEvents";
import tokenManager from "../lib/tokenManager";
import { showToast } from "../lib/toast";

const SocketContext = createContext({
  connected: false,
  socket: null,
  emit: () => false,
  subscribe: () => () => {},
});

export const useSocket = () => useContext(SocketContext);

/**
 * Owns the socket's lifecycle and the handful of events that matter no matter
 * which screen the learner is on.
 *
 * Components never subscribe to the socket for data. Events land here, patch
 * the React Query cache, and the UI re-renders from the cache — so a screen
 * that was opened over plain HTTP behaves identically to one that was updated
 * by a live event, and there is only ever one copy of the truth on the client.
 */
export const SocketProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!tokenManager.getAccessToken()) return undefined;

    const socket = connectSocket();
    if (!socket) return undefined;

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    if (socket.connected) setConnected(true);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  // Disconnect when the learner signs out, so the next account does not
  // inherit a socket authenticated as the previous one.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === "token" && !event.newValue) {
        disconnectSocket();
        setConnected(false);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Global cache invalidation. Kept here rather than in each screen so an
  // event that arrives while the relevant page is closed still leaves the
  // cache correct for when it opens.
  useEffect(() => {
    if (!connected) return undefined;

    const unsubs = [
      onSocket(SERVER_EVENTS.NOTIFICATION_NEW, (notification) => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
        if (notification?.title) {
          showToast.success(notification.title);
        }
      }),

      onSocket(SERVER_EVENTS.CHALLENGE_CLAIMED, () => {
        queryClient.invalidateQueries({ queryKey: ["challenges"] });
      }),

      onSocket(SERVER_EVENTS.CHALLENGE_EXPIRED, () => {
        queryClient.invalidateQueries({ queryKey: ["challenges"] });
      }),

      onSocket(SERVER_EVENTS.CHALLENGE_DECLINED, () => {
        queryClient.invalidateQueries({ queryKey: ["challenges"] });
      }),

      onSocket(SERVER_EVENTS.DUEL_COMPLETED, () => {
        queryClient.invalidateQueries({ queryKey: ["challenges"] });
        queryClient.invalidateQueries({ queryKey: ["duel", "profile"] });
        queryClient.invalidateQueries({ queryKey: ["duel", "leaderboard"] });
      }),

      onSocket(SERVER_EVENTS.LOBBY_UPDATED, () => {
        queryClient.invalidateQueries({ queryKey: ["challenges", "lobby"] });
      }),
    ];

    return () => unsubs.forEach((off) => off());
  }, [connected, queryClient]);

  const subscribe = useCallback((event, handler) => onSocket(event, handler), []);
  const emit = useCallback((event, payload, ack) => emitSocket(event, payload, ack), []);

  return (
    <SocketContext.Provider
      value={{ connected, socket: getSocket(), emit, subscribe }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
