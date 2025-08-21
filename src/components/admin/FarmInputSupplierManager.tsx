import React, { useEffect, useState } from 'react';
import { getSuppliers, createSupplier, updateSupplier, likeSupplier, rateSupplier, bookmarkProduct, flagEntity, recommendBan } from '../../services/farmInputService';
const demo_user_id = 'demo-user-id';

const FarmInputSupplierManager: React.FC = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [form, setForm] = useState({
    supplier_name: '',
    contact_phone: '',
    contact_email: '',
    contact_person: '',
    county: '',
    physical_address: '',
    specialization: '',
    user_id: '',
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [likeLoading, setLikeLoading] = useState<string | null>(null);
  const [rateLoading, setRateLoading] = useState<string | null>(null);
  const [bookmarkLoading, setBookmarkLoading] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [flagReason, setFlagReason] = useState('');
  const [flagLoading, setFlagLoading] = useState<string | null>(null);
  const [banLoading, setBanLoading] = useState<string | null>(null);

  const fetchSuppliers = async () => {
    setLoading(true);
    const { data, error } = await getSuppliers();
    if (error) setError(error.message);
    else setSuppliers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleLike = async (supplier_id: string) => {
    setLikeLoading(supplier_id);
    await likeSupplier(supplier_id, demo_user_id);
    await fetchSuppliers();
    setLikeLoading(null);
  };

  const handleRate = async (supplier_id: string, rating: number) => {
    setRateLoading(supplier_id);
    await rateSupplier(supplier_id, demo_user_id, rating, comment);
    setComment('');
    await fetchSuppliers();
    setRateLoading(null);
  };

  const handleFlag = async (supplier_id: string) => {
    setFlagLoading(supplier_id);
    await flagEntity('supplier', supplier_id, demo_user_id, flagReason);
    setFlagReason('');
    setFlagLoading(null);
  };

  const handleBan = async (supplier_id: string) => {
    setBanLoading(supplier_id);
    await recommendBan('supplier', supplier_id, demo_user_id, 'Recommended for ban');
    setBanLoading(null);
  };

  // Example: Bookmark a product (for demo, bookmarks first supplier's first product if exists)
  const handleBookmark = async (product_id: string) => {
    setBookmarkLoading(product_id);
    await bookmarkProduct(product_id, demo_user_id);
    setBookmarkLoading(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Supplier Manager</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div>Loading suppliers...</div>
      ) : (
        <div>
          {suppliers.map(sup => (
            <div key={sup.id} className="border rounded p-4 mb-4">
              <h2 className="text-xl font-semibold">{sup.supplier_name}</h2>
              <div className="text-gray-700">
                {sup.contact_person} | {sup.contact_phone} | {sup.contact_email}
              </div>
              <div className="text-gray-500 text-sm">
                {sup.physical_address}, {sup.county}
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <div className="flex gap-2">
                  <button
                    className="text-red-600 border rounded px-2 py-1"
                    onClick={() => handleLike(sup.id)}
                    disabled={likeLoading === sup.id}
                  >
                    ❤️ Like
                  </button>
                  <button
                    className="text-yellow-600 border rounded px-2 py-1"
                    onClick={() => handleRate(sup.id, 5)}
                    disabled={rateLoading === sup.id}
                  >
                    ⭐ 5-Star
                  </button>
                  {/* Example: Bookmark first product of this supplier if exists */}
                  {sup.products && sup.products.length > 0 && (
                    <button
                      className="text-blue-600 border rounded px-2 py-1"
                      onClick={() => handleBookmark(sup.products[0].id)}
                      disabled={bookmarkLoading === sup.products[0].id}
                    >
                      🔖 Bookmark Product
                    </button>
                  )}
                </div>
                <div className="flex gap-2 items-center mt-1">
                  <input
                    className="border rounded px-2 py-1"
                    placeholder="Add a comment to your rating"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    style={{ minWidth: 180 }}
                  />
                  <button
                    className="text-yellow-700 border rounded px-2 py-1"
                    onClick={() => handleRate(sup.id, 5)}
                    disabled={rateLoading === sup.id || !comment}
                  >
                    Submit Comment
                  </button>
                </div>
                <div className="flex gap-2 items-center mt-1">
                  <input
                    className="border rounded px-2 py-1"
                    placeholder="Flag reason"
                    value={flagReason}
                    onChange={e => setFlagReason(e.target.value)}
                    style={{ minWidth: 180 }}
                  />
                  <button
                    className="text-orange-700 border rounded px-2 py-1"
                    onClick={() => handleFlag(sup.id)}
                    disabled={flagLoading === sup.id || !flagReason}
                  >
                    🚩 Flag Supplier
                  </button>
                  <button
                    className="text-red-800 border rounded px-2 py-1"
                    onClick={() => handleBan(sup.id)}
                    disabled={banLoading === sup.id}
                  >
                    ⛔ Recommend Ban
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FarmInputSupplierManager;


