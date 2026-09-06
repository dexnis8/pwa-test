import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../lib/axios";

const unwrap = (data) => data?.data ?? null;

export const useNotifications = (page = 1) =>
  useQuery({
    queryKey: ["notifications", page],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/notifications", {
        params: { page, limit: 20 },
      });
      return unwrap(data);
    },
    staleTime: 30 * 1000,
  });

/**
 * Drives the bottom-nav badge, so it is polled as well as pushed: a learner who
 * opens the app after a socket-less spell should still see the right count
 * without waiting for an event that already happened.
 */
export const useUnreadCount = () =>
  useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/notifications/unread-count");
      return unwrap(data)?.unreadCount ?? 0;
    },
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });

export const useMarkRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => axiosInstance.patch(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useMarkAllRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => axiosInstance.post("/notifications/read-all"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
