import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Proposal } from '../types';

export function useProposals(userId: string) {
  return useQuery({
    queryKey: ['proposals', userId],
    queryFn: () => api.proposals.list(userId),
    enabled: !!userId,
  });
}

export function useCreateProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.proposals.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
    },
  });
}

export function useUpdateProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Proposal> }) =>
      api.proposals.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
    },
  });
}