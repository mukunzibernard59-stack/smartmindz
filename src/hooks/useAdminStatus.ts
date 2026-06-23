import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

export const useAdminStatus = (user: User | null) => {
  return useQuery({
    queryKey: ['auth', 'admin-status', user?.id],
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000,
    queryFn: async ({ signal }) => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', user!.id)
        .eq('role', 'admin')
        .maybeSingle();
      if (error) throw error;
      return !!data;
    },
  });
};
