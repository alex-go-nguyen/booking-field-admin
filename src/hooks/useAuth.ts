import { useMutation, useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as io from 'socket.io-client';
import { LoginInput } from '@/services/auth/auth.dto';
import authService from '@/services/auth/auth.service';
import { userKeys } from '@/services/user/user.query';

export const useAuth = () => {
  const [accessToken, setAccessToken] = useState<string | undefined>(Cookies.get('access_token'));

  const userInstance = userKeys.profile();
  const { data: profile, isLoading, refetch } = useQuery({ ...userInstance, staleTime: Infinity });

  const [socket, setSocket] = useState<io.Socket>();

  const {
    mutate: loginMutation,
    isLoading: loginLoading,
    isError: loginError,
  } = useMutation({
    mutationFn: authService.login,
    onSuccess: ({ data }) => {
      toast.success('Login successfully');
      refetch();
      setAccessToken(data.accessToken);
    },
  });

  async function login(payload: LoginInput) {
    loginMutation(payload);
  }

  function logout() {
    authService.logout();
    socket?.disconnect();
    refetch();
    toast.success('Logout successfully');
  }

  useEffect(() => {
    if (accessToken) {
      const newSocket = io.connect(`${import.meta.env.VITE_SOCKET_API_URL}`, {
        extraHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      setSocket(newSocket);
    }
  }, [accessToken]);

  return { profile, login, logout, isLoading, loginLoading, loginError, refetch, socket };
};
