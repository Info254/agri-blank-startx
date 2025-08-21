import React, { useState } from 'react';
import { createRecipe } from '../services/RecipeResourceService';
import { notify } from '../services/notificationService';

const initialState = {
  title: '',
  description: '',
  ingredients: '',
  instructions: '',
};

export default function RecipeForm({ onCreated }) {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data, error } = await createRecipe(form);
      if (error) setError(error.message);
      else {
        setForm(initialState);
        notify({ type: 'recipe_new', title: 'New Recipe Posted', description: `${form.title}` });
        if (onCreated) onCreated(data);
      }
    } catch (err) {
      setError('Failed to submit recipe');
    }
    setLoading(false);
  };

  return (
    <form className="bg-white rounded shadow p-4 max-w-md mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-lg font-bold mb-2">Post a Recipe</h2>
      <div className="mb-2">
        <label className="block text-sm font-medium">Title</label>
        <input name="title" value={form.title} onChange={handleChange} className="input input-bordered w-full" required />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} className="input input-bordered w-full" required />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Ingredients</label>
        <textarea name="ingredients" value={form.ingredients} onChange={handleChange} className="input input-bordered w-full" required />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Instructions</label>
        <textarea name="instructions" value={form.instructions} onChange={handleChange} className="input input-bordered w-full" required />
      </div>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
