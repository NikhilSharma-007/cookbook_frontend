import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  registerUser,
  login,
  logoutUser,
  getCurrentUser,
} from "../services/api.user";
import toast from "react-hot-toast";

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("Registered successfully!");
      // Invalidate and refetch current user after successful registration
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error) => toast.error(error?.message || "Registration failed"),
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      toast.success("Login successful!");
      // Invalidate and refetch current user after successful login
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error) => toast.error(error?.message || "Login failed"),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      toast.success("Logged out successfully!");
      // Clear the current user query cache and invalidate
      queryClient.setQueryData(["currentUser"], null);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error) => toast.error(error?.message || "Logout failed"),
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      // Don't retry on 401 (unauthorized) errors
      if (error?.response?.status === 401 || error?.status === 401) {
        return false;
      }
      // Only retry 2 times for other errors
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    onError: (error) => {
      // Only show toast for non-401 errors to avoid spam
      if (error?.response?.status !== 401 && error?.status !== 401) {
        toast.error(error?.message || "Failed to fetch user");
      }
    },
  });
};
