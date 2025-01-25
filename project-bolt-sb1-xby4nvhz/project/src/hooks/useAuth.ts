import { useQuery, useMutation } from '@tanstack/react-query';
import { auth } from '../lib/auth';
import type { User } from '../types';

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: auth.getCurrentUser,
  });
}

export function useSignIn() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      auth.signIn(email, password),
  });
}

export function useSignUp() {
  return useMutation({
    mutationFn: ({
      email,
      password,
      userData,
    }: {
      email: string;
      password: string;
      userData: Omit<User, 'id' | 'createdAt' | 'lastActive'>;
    }) => auth.signUp(email, password, userData),
  });
}

export function useSignOut() {
  return useMutation({
    mutationFn: auth.signOut,
  });
}