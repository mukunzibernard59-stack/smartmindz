import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    loading: true,
  });

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (!error && data) {
      setAuthState(prev => ({ ...prev, profile: data as Profile }));
    }
  }, []);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthState(prev => ({
          ...prev,
          user: session?.user ?? null,
          session,
          loading: false,
          profile: session?.user ? prev.profile : null,
        }));
        
        // Fetch profile after auth state change
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState(prev => ({
        ...prev,
        user: session?.user ?? null,
        session,
        loading: false,
      }));
      
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signUp = useCallback(async (email: string, password: string, name?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: name ? { full_name: name } : undefined,
      },
    });
    
    return { data, error };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { data, error };
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  }, []);

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  }, []);

  const updateProfile = useCallback(async (updates: Partial<Pick<Profile, 'full_name' | 'avatar_url'>>) => {
    if (!authState.user) return { error: new Error('Not authenticated') };
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', authState.user.id)
      .select()
      .single();
    
    if (!error && data) {
      setAuthState(prev => ({ ...prev, profile: data as Profile }));
    }
    
    return { data, error };
  }, [authState.user]);

  const uploadAvatar = useCallback(async (file: File) => {
    if (!authState.user) return { error: new Error('Not authenticated') };
    
    const fileExt = file.name.split('.').pop();
    const filePath = `${authState.user.id}/avatar.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });
    
    if (uploadError) return { error: uploadError };
    
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
    
    // Update profile with new avatar URL
    return updateProfile({ avatar_url: publicUrl });
  }, [authState.user, updateProfile]);

  const refreshProfile = useCallback(() => {
    if (authState.user) {
      fetchProfile(authState.user.id);
    }
  }, [authState.user, fetchProfile]);

  return {
    user: authState.user,
    session: authState.session,
    profile: authState.profile,
    loading: authState.loading,
    isAuthenticated: !!authState.user,
    signUp,
    signIn,
    signOut,
    getAccessToken,
    updateProfile,
    uploadAvatar,
    refreshProfile,
  };
};
