import { useAuth } from '@/hooks/useAuth';

export const useUser = () => {
  const { user } = useAuth();
  return { user };
};