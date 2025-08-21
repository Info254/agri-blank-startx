import { supabase } from '../integrations/supabase/client';
import { Database } from '../integrations/supabase/types';

type SupplierInsert = Database['public']['Tables']['farm_input_suppliers']['Insert'];
type ProductInsert = Database['public']['Tables']['farm_input_products']['Insert'];

// Types
export type FarmInputSupplier = Database['public']['Tables']['farm_input_suppliers']['Row'];
export type FarmInputProduct = Database['public']['Tables']['farm_input_products']['Row'];
export type FarmInputOrder = Database['public']['Tables']['farm_input_orders']['Row'];
export type FarmInputOrderItem = Database['public']['Tables']['farm_input_order_items']['Row'];
export type FarmInputCategory = Database['public']['Tables']['farm_input_categories']['Row'];

// --- SUPPLIERS ---
export const createSupplier = async (data: SupplierInsert) => {
  // Enforce required fields at runtime (optional, for extra safety)
  const required = ['contact_email', 'contact_person', 'contact_phone', 'county', 'physical_address', 'specialization', 'supplier_name', 'user_id'];
  for (const field of required) {
    if (!(field in data) || data[field as keyof SupplierInsert] === undefined) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  return supabase.from('farm_input_suppliers').insert([data]);
};
export const updateSupplier = async (id: string, data: Partial<FarmInputSupplier>) => {
  return supabase.from('farm_input_suppliers').update(data).eq('id', id);
};
export const getSuppliers = async () => {
  return supabase.from('farm_input_suppliers').select('*');
};

// --- PRODUCTS ---
export const createProduct = async (data: ProductInsert) => {
  // Enforce required fields at runtime (optional, for extra safety)
  const required = ['price_per_unit', 'product_category', 'product_name', 'supplier_id', 'unit_of_measure'];
  for (const field of required) {
    if (!(field in data) || data[field as keyof ProductInsert] === undefined) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  return supabase.from('farm_input_products').insert([data]);
};
export const updateProduct = async (id: string, data: Partial<FarmInputProduct>) => {
  return supabase.from('farm_input_products').update(data).eq('id', id);
};
export const getProducts = async (filters?: any) => {
  let query = supabase.from('farm_input_products').select('*, category:category_id(*), supplier:supplier_id(*)');
  if (filters?.category_id) query = query.eq('category_id', filters.category_id);
  if (filters?.search) query = query.ilike('name', `%${filters.search}%`);
  return query;
};

// --- CATEGORIES ---
export const getCategories = async () => {
  return supabase.from('farm_input_categories').select('*').eq('is_active', true);
};
export const createCategory = async (data: Pick<FarmInputCategory, 'name'> & Partial<Omit<FarmInputCategory, 'name'>>) => {
  // name is required
  const { name, ...optional } = data;
  return supabase.from('farm_input_categories').insert([
    {
      name,
      ...optional
    }
  ]);
};

// --- ORDERS ---
export const createOrder = async (data: Omit<FarmInputOrder, 'id' | 'created_at' | 'updated_at' | 'order_number' | 'order_notes' | 'payment_method' | 'payment_status' | 'requested_delivery_date' | 'special_instructions' | 'actual_delivery_date' | 'buyer_email' | 'delivery_address' | 'delivery_coordinates' | 'delivery_county'> & {
  order_status?: string;
}) => {
  // Provide all required fields for insert
  const {
    buyer_id,
    buyer_name,
    buyer_phone,
    delivery_method,
    order_status = 'pending',
    supplier_id,
    total_amount,
    ...optional
  } = data;
  return supabase.from('farm_input_orders').insert([
    {
      buyer_id,
      buyer_name,
      buyer_phone,
      delivery_method,
      order_status,
      supplier_id,
      total_amount,
      ...optional
    }
  ]);
};
export const getOrders = async (filters?: any) => {
  let query = supabase.from('farm_input_orders').select('*, items:order_items(*)');
  if (filters?.buyer_id) query = query.eq('buyer_id', filters.buyer_id);
  if (filters?.supplier_id) query = query.eq('supplier_id', filters.supplier_id);
  return query;
};
export const updateOrder = async (id: string, data: Partial<FarmInputOrder>) => {
  return supabase.from('farm_input_orders').update(data).eq('id', id);
};

// --- ORDER ITEMS ---
export const createOrderItem = async (data: Omit<FarmInputOrderItem, 'id' | 'created_at'>) => {
  // Required fields: order_id, product_id, quantity, total_price, unit_price
  const { order_id, product_id, quantity, total_price, unit_price, ...optional } = data;
  return supabase.from('farm_input_order_items').insert([
    {
      order_id,
      product_id,
      quantity,
      total_price,
      unit_price,
      ...optional
    }
  ]);
};

// --- DELETE FUNCTIONS ---
export const deleteSupplier = async (id: string) => {
  return supabase.from('farm_input_suppliers').delete().eq('id', id);
};
export const deleteProduct = async (id: string) => {
  return supabase.from('farm_input_products').delete().eq('id', id);
};
export const deleteOrder = async (id: string) => {
  return supabase.from('farm_input_orders').delete().eq('id', id);
};
export const deleteCategory = async (id: string) => {
  return supabase.from('farm_input_categories').delete().eq('id', id);
};

// --- LIKES, RATINGS, BOOKMARKS, FLAGS, BANS ---
export const likeProduct = async (product_id: string, user_id: string) => {
  return supabase.from('farm_input_product_likes').insert([{ product_id, user_id }]);
};
export const bookmarkProduct = async (product_id: string, user_id: string) => {
  return supabase.from('farm_input_product_bookmarks').insert([{ product_id, user_id }]);
};
export const rateProduct = async (product_id: string, user_id: string, rating: number, comment?: string) => {
  return supabase.from('farm_input_product_ratings').insert([{ product_id, user_id, rating, comment }]);
};
export const likeSupplier = async (supplier_id: string, user_id: string) => {
  return supabase.from('farm_input_supplier_likes').insert([{ supplier_id, user_id }]);
};
export const rateSupplier = async (supplier_id: string, user_id: string, rating: number, comment?: string) => {
  return supabase.from('farm_input_supplier_ratings').insert([{ supplier_id, user_id, rating, comment }]);
};
export const flagEntity = async (entity_type: 'supplier' | 'product', entity_id: string, user_id: string, reason: string) => {
  return supabase.from('marketplace_flags').insert([{ entity_type, entity_id, user_id, reason }]);
};
export const recommendBan = async (entity_type: 'supplier' | 'product', entity_id: string, user_id: string, reason: string) => {
  return supabase.from('marketplace_ban_recommendations').insert([{ entity_type, entity_id, user_id, reason }]);
};
export const updateOrderItem = async (id: string, data: Partial<FarmInputOrderItem>) => {
  return supabase.from('farm_input_order_items').update(data).eq('id', id);
};
