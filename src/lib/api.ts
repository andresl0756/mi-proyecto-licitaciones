import { supabase } from './supabase';
import type { Tender, Proposal, Report, Notification } from '../types';

export const api = {
  tenders: {
    async list(filters?: {
      status?: string;
      category?: string;
      location?: string;
      minAmount?: number;
      maxAmount?: number;
    }) {
      let query = supabase
        .from('tenders')
        .select('*');

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.category) {
        query = query.contains('categories', [filters.category]);
      }
      // Add more filters as needed

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('tenders')
        .select('*, tender_awards(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    }
  },

  proposals: {
    async create(proposal: Omit<Proposal, 'id' | 'createdAt' | 'updatedAt'>) {
      const { data, error } = await supabase
        .from('proposals')
        .insert([proposal])
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async update(id: string, updates: Partial<Proposal>) {
      const { data, error } = await supabase
        .from('proposals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async list(userId: string) {
      const { data, error } = await supabase
        .from('proposals')
        .select('*, tender:tenders(*)')
        .eq('user_id', userId);

      if (error) throw error;
      return data;
    }
  },

  reports: {
    async generate(type: string, parameters: Record<string, any>) {
      const { data, error } = await supabase
        .from('reports')
        .insert([
          {
            type,
            parameters,
            results: {}, // This would be populated by a backend function
            format: 'pdf'
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async list(userId: string) {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data;
    }
  },

  notifications: {
    async list(userId: string) {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },

    async markAsRead(notificationId: string) {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) throw error;
    }
  }
};