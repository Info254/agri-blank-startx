// @ts-nocheck
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { CommunityPost } from '@/types/database';

export const useCommunityPosts = (category?: string) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        let query = supabase
          .from('community_posts')
          .select(`
            *,
            profiles!community_posts_user_id_fkey (
              id,
              full_name,
              avatar_url
            )
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (category) {
          query = query.eq('category', category);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        
        const postsWithUser = (data || []).map(post => ({
          ...post,
          user: post.profiles ? {
            id: post.profiles.id,
            full_name: post.profiles.full_name,
            avatar_url: post.profiles.avatar_url
          } : undefined
        }));

        setPosts(postsWithUser);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [category]);

  const createPost = async (post: Omit<CommunityPost, 'id' | 'user_id' | 'likes_count' | 'comments_count' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('community_posts')
        .insert({ ...post, user_id: user.id })
        .select(`
          *,
          profiles!community_posts_user_id_fkey (
            id,
            full_name,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;
      
      const newPost = {
        ...data,
        user: data.profiles ? {
          id: data.profiles.id,
          full_name: data.profiles.full_name,
          avatar_url: data.profiles.avatar_url
        } : undefined
      };

      setPosts(prev => [newPost, ...prev]);
      return newPost;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
      throw err;
    }
  };

  const likePost = async (postId: string) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const { data, error } = await supabase
        .from('community_posts')
        .update({ likes_count: post.likes_count + 1 })
        .eq('id', postId)
        .select()
        .single();

      if (error) throw error;
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes_count: data.likes_count } : p));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to like post');
    }
  };

  return {
    posts,
    isLoading,
    error,
    createPost,
    likePost,
    refetch: () => {
      setIsLoading(true);
      const fetchPosts = async () => {
        try {
          let query = supabase
            .from('community_posts')
            .select(`
              *,
              profiles!community_posts_user_id_fkey (
                id,
                full_name,
                avatar_url
              )
            `)
            .eq('is_active', true)
            .order('created_at', { ascending: false });

          if (category) {
            query = query.eq('category', category);
          }

          const { data, error: fetchError } = await query;
          if (fetchError) throw fetchError;
          
          const postsWithUser = (data || []).map(post => ({
            ...post,
            user: post.profiles ? {
              id: post.profiles.id,
              full_name: post.profiles.full_name,
              avatar_url: post.profiles.avatar_url
            } : undefined
          }));

          setPosts(postsWithUser);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch posts');
        } finally {
          setIsLoading(false);
        }
      };
      fetchPosts();
    }
  };
};