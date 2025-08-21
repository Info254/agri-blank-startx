import React, { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, getCategories, getSuppliers, likeProduct, rateProduct } from '../../services/farmInputService';

const FarmInputProductManager: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [likeLoading, setLikeLoading] = useState<string | null>(null);
  const [rateLoading, setRateLoading] = useState<string | null>(null);
  const [bookmarkLoading, setBookmarkLoading] = useState<string | null>(null);
  // Dummy user_id for demo; replace with real user context in production
  const user_id = 'demo-user-id';
  const handleLike = async (product_id: string) => {
    setLikeLoading(product_id);
    await likeProduct(product_id, user_id);
    fetchData();
    setLikeLoading(null);
  };

  const handleRate = async (product_id: string, rating: number) => {
    setRateLoading(product_id);
    await rateProduct(product_id, user_id, rating);
    fetchData();
    setRateLoading(null);
  };

  // Bookmarking can be added similarly if service exists
  const [categories, setCategories] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [form, setForm] = useState({
    product_name: '',
    product_description: '',
    supplier_id: '',
    category_id: '',
    price_per_unit: '',
    unit_of_measure: '',
    product_category: '',
    is_available: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    const [{ data: products }, { data: categories }, { data: suppliers }] = await Promise.all([
      getProducts(),
      getCategories(),
      getSuppliers()
    ]);
    setProducts(products || []);
    setCategories(categories || []);
    setSuppliers(suppliers || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // Map form fields to backend fields
    const productData = {
      product_name: form.product_name,
      product_description: form.product_description,
      supplier_id: form.supplier_id,
      category_id: form.category_id,
      price_per_unit: Number(form.price_per_unit),
      unit_of_measure: form.unit_of_measure,
      product_category: form.product_category,
      is_available: form.is_available
    };
    const { error } = await createProduct(productData);
    if (error) setError(error.message);
    else {
      setForm({
        product_name: '',
        product_description: '',
        supplier_id: '',
        category_id: '',
        price_per_unit: '',
        unit_of_measure: '',
        product_category: '',
        is_available: true
      });
      fetchData();
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Manage Farm Input Products</h2>
      <form onSubmit={handleAdd} className="mb-6">
        <input
          className="border rounded px-2 py-1 mr-2 mb-2"
          placeholder="Product name"
          name="product_name"
          value={form.product_name}
          onChange={handleChange}
          required
        />
        <input
          className="border rounded px-2 py-1 mr-2 mb-2"
          placeholder="Description"
          name="product_description"
          value={form.product_description}
          onChange={handleChange}
        />
        <select
          className="border rounded px-2 py-1 mr-2 mb-2"
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat: any) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <select
          className="border rounded px-2 py-1 mr-2 mb-2"
          name="supplier_id"
          value={form.supplier_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Supplier</option>
          {suppliers.map((sup: any) => (
            <option key={sup.id} value={sup.id}>{sup.supplier_name}</option>
          ))}
        </select>
        <input
          className="border rounded px-2 py-1 mr-2 mb-2"
          placeholder="Price per unit"
          name="price_per_unit"
          type="number"
          value={form.price_per_unit}
          onChange={handleChange}
          required
        />
        <input
          className="border rounded px-2 py-1 mr-2 mb-2"
          placeholder="Unit of measure (e.g. kg, L, pcs)"
          name="unit_of_measure"
          value={form.unit_of_measure}
          onChange={handleChange}
          required
        />
        <input
          className="border rounded px-2 py-1 mr-2 mb-2"
          placeholder="Product category (e.g. Fertilizer, Seed)"
          name="product_category"
          value={form.product_category}
          onChange={handleChange}
          required
        />
        <button type="submit" className="bg-green-700 text-white px-4 py-1 rounded" disabled={loading}>
          Add
        </button>
      </form>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <ul className="divide-y">
        {products.map(prod => (
          <li key={prod.id} className="py-2 flex flex-col gap-1">
            <span className="font-semibold">{prod.product_name}</span> - {prod.product_description} | Category: {prod.category?.name} | Supplier: {prod.supplier?.supplier_name} | Price: {prod.price_per_unit}
            <div className="flex gap-2 mt-1">
              <button
                className="text-red-600 border rounded px-2 py-1"
                onClick={() => handleLike(prod.id)}
                disabled={likeLoading === prod.id}
              >
                ❤️ Like
              </button>
              <button
                className="text-yellow-600 border rounded px-2 py-1"
                onClick={() => handleRate(prod.id, 5)}
                disabled={rateLoading === prod.id}
              >
                ⭐ 5-Star
              </button>
              {/* Add bookmark button here if implemented */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FarmInputProductManager;
