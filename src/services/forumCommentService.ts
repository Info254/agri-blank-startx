import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export async function createComment(comment) {
  return supabase.from('carbon_forum_comments').insert([comment]);
}
export async function listComments(postId) {
  return supabase.from('carbon_forum_comments').select('*').eq('postId', postId).order('createdAt', { ascending: true });
}
export async function deleteComment(id) {
  return supabase.from('carbon_forum_comments').delete().eq('id', id);
}
export async function updateComment(id, updates) {
  return supabase.from('carbon_forum_comments').update(updates).eq('id', id);
}
