import { supabase } from './supabase';
import type { User } from '../types';

export const auth = {
  async signUp(email: string, password: string, userData: Omit<User, 'id' | 'createdAt' | 'lastActive'>) {
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) throw signUpError;

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            auth_id: authData.user.id,
            email: userData.email,
            name: userData.name,
            phone: userData.phone,
            company_rut: userData.companyRut,
            company_address: userData.companyAddress,
            position: userData.position,
            role: userData.role,
            notification_preferences: userData.notificationPreferences,
            preferences: userData.preferences,
          }
        ]);

      if (profileError) throw profileError;
    }

    return authData;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single();

    return profile;
  },

  async updateProfile(userId: string, updates: Partial<User>) {
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId);

    if (error) throw error;
  },

  onAuthStateChange(callback: (event: 'SIGNED_IN' | 'SIGNED_OUT', session: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event as 'SIGNED_IN' | 'SIGNED_OUT', session);
    });
  }
};