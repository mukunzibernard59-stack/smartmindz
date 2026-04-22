import { supabase } from '@/integrations/supabase/client';

export interface AITaskOptions {
  system?: string;
  prompt: string;
  model?: string;
  json?: boolean;
}

export async function runAITask(opts: AITaskOptions, retries = 3): Promise<string> {
  let lastErr: any;
  for (let i = 1; i <= retries; i++) {
    try {
      const { data, error } = await supabase.functions.invoke('ai-task', { body: opts });
      if (error) throw error;
      if (!data?.content) throw new Error('Empty response');
      return data.content as string;
    } catch (e) {
      lastErr = e;
      if (i < retries) await new Promise(r => setTimeout(r, i * 800));
    }
  }
  throw lastErr;
}
