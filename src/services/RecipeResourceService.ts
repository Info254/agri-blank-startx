// RecipeResourceService: Handles CRUD for recipes, resources, and workshops
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Recipes
export async function createRecipe(recipe) {
  return supabase.from('recipes').insert(recipe).select();
}
export async function getRecipes(filter = {}) {
  return supabase.from('recipes').select('*').match(filter);
}
export async function updateRecipe(id, updates) {
  return supabase.from('recipes').update(updates).eq('id', id).select();
}
export async function deleteRecipe(id) {
  return supabase.from('recipes').delete().eq('id', id);
}

// Resources
export async function createResource(resource) {
  return supabase.from('resources').insert(resource).select();
}
export async function getResources(filter = {}) {
  return supabase.from('resources').select('*').match(filter);
}
export async function updateResource(id, updates) {
  return supabase.from('resources').update(updates).eq('id', id).select();
}
export async function deleteResource(id) {
  return supabase.from('resources').delete().eq('id', id);
}

// Workshops
export async function createWorkshop(workshop) {
  return supabase.from('workshops').insert(workshop).select();
}
export async function getWorkshops(filter = {}) {
  return supabase.from('workshops').select('*').match(filter);
}
export async function updateWorkshop(id, updates) {
  return supabase.from('workshops').update(updates).eq('id', id).select();
}
export async function deleteWorkshop(id) {
  return supabase.from('workshops').delete().eq('id', id);
}
