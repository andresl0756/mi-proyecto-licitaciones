import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Tender } from '../types';

export function useTenders(filters?: Parameters<typeof api.tenders.list>[0]) {
  return useQuery({
    queryKey: ['tenders', filters],
    queryFn: () => api.tenders.list(filters),
  });
}

export function useTender(id: string) {
  return useQuery({
    queryKey: ['tenders', id],
    queryFn: () => api.tenders.getById(id),
    enabled: !!id,
  });
}