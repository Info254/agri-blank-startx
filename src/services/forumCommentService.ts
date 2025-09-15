// @ts-nocheck
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export async function createComment(comment: any) {
  return supabase.from('carbon_forum_comments').insert([comment]);
}
export async function listComments(postId: string) {
  return supabase.from('carbon_forum_comments').select('*').eq('postId', postId).order('createdAt', { ascending: true });
}
export async function deleteComment(id: string) {
  return supabase.from('carbon_forum_comments').delete().eq('id', id);
}
export async function updateComment(id: string, updates: any) {
  return supabase.from('carbon_forum_comments').update(updates).eq('id', id);
}
