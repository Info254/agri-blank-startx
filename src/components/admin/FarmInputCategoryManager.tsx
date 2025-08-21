import React, { useEffect, useState } from 'react';
import { getCategories, createCategory } from '../../services/farmInputService';

const FarmInputCategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await getCategories();
    if (error) setError(error.message);
    else setCategories(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await createCategory({ name, description });
    if (error) setError(error.message);
    else {
      setName('');
      setDescription('');
      fetchCategories();
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Manage Farm Input Categories</h2>
      <form onSubmit={handleAdd} className="mb-6">
        <input
          className="border rounded px-2 py-1 mr-2"
          placeholder="Category name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          className="border rounded px-2 py-1 mr-2"
          placeholder="Description (optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button type="submit" className="bg-green-700 text-white px-4 py-1 rounded" disabled={loading}>
          Add
        </button>
      </form>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <ul className="divide-y">
        {categories.map(cat => (
          <li key={cat.id} className="py-2">
            <span className="font-semibold">{cat.name}</span> - {cat.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FarmInputCategoryManager;
