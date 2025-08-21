import React, { useEffect, useState } from 'react';
import { getOrders, updateOrder, getSuppliers } from '../../services/farmInputService';

const FarmInputOrderManager: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    const [{ data: orders }, { data: suppliers }] = await Promise.all([
      getOrders(),
      getSuppliers()
    ]);
    setOrders(orders || []);
    setSuppliers(suppliers || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (orderId: string, order_status: string) => {
    setLoading(true);
    setError('');
    const { error } = await updateOrder(orderId, { order_status });
    if (error) setError(error.message);
    fetchData();
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Manage Farm Input Orders</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <ul className="divide-y">
        {orders.map(order => (
          <li key={order.id} className="py-2">
            <div className="font-semibold">Order #{order.id}</div>
            <div>Supplier: {suppliers.find(s => s.id === order.supplier_id)?.supplier_name || order.supplier_id}</div>
            <div>Buyer: {order.buyer_id}</div>
            <div>Status: {order.status || 'N/A'}</div>
            <div>Created: {order.created_at}</div>
            <div>
              <button
                className="bg-green-700 text-white px-2 py-1 rounded mr-2"
                onClick={() => handleStatusChange(order.id, 'approved')}
                disabled={loading}
              >
                Approve
              </button>
              <button
                className="bg-gray-500 text-white px-2 py-1 rounded"
                onClick={() => handleStatusChange(order.id, 'rejected')}
                disabled={loading}
              >
                Reject
              </button>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Items:
              <ul className="list-disc ml-6">
                {(order.items || []).map((item: any) => (
                  <li key={item.id}>{item.product_id} x {item.quantity}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FarmInputOrderManager;
