import { notify } from '../services/notificationService';
import React, { useEffect, useState } from 'react';
import { getRecipes } from '../services/RecipeResourceService';

export default function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [prevRecipes, setPrevRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let intervalId;
    const fetchRecipes = async () => {
      setLoading(true);
      const { data } = await getRecipes();
      setRecipes(data || []);
      setLoading(false);
      // Notify on new recipes or updates
      if (prevRecipes.length > 0 && data) {
        data.forEach(recipe => {
          const prev = prevRecipes.find(r => r.id === recipe.id);
          if (!prev) {
            notify({ type: 'recipe_new', title: 'New Recipe Posted', description: `${recipe.title}` });
          } else if (prev.updated_at !== recipe.updated_at) {
            notify({ type: 'recipe_new', title: 'Recipe Updated', description: `${recipe.title}` });
          }
        });
      }
      setPrevRecipes(data || []);
    };
    fetchRecipes();
    intervalId = setInterval(fetchRecipes, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-white rounded shadow p-4 max-w-2xl mx-auto mt-4">
      <h2 className="text-lg font-bold mb-2">Recipes</h2>
      {loading ? (
        <div>Loading...</div>
      ) : recipes.length === 0 ? (
        <div className="text-gray-500">No recipes found.</div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {recipes.map(recipe => (
            <li key={recipe.id} className="py-2 flex justify-between items-center">
              <div>
                <span className="font-semibold">{recipe.title}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
