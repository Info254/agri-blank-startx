import { PostgrestError } from '@supabase/supabase-js';

export type ServiceResponse<T> = {
  data: T | null;
  error: PostgrestError | Error | null;
};
