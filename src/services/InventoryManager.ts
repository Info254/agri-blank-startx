import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

export interface InventoryBatch {
  id: string;
  item_id: string;
  batch_number: string;
  quantity: number;
  manufacturing_date: string;
  expiry_date: string;
  supplier: string;
  purchase_price: number;
  storage_location: string;
  quality_grade: string;
  notes: string;
}

export interface InventoryTransaction {
  id: string;
  item_id: string;
  transaction_type: 'in' | 'out' | 'adjustment' | 'transfer';
  quantity: number;
  batch_id?: string;
  reference_number: string;
  transaction_date: string;
  reason: string;
  performed_by: string;
}

export class InventoryManager {
  private supabase;

  constructor(supabase: any) {
    this.supabase = supabase;
  }

  async createBatch(batch: Omit<InventoryBatch, 'id'>): Promise<InventoryBatch> {
    const { data, error } = await this.supabase
      .from('inventory_batches')
      .insert(batch)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async recordTransaction(transaction: Omit<InventoryTransaction, 'id'>): Promise<InventoryTransaction> {
    const { data, error } = await this.supabase
      .from('inventory_transactions')
      .insert(transaction)
      .select()
      .single();

    if (error) throw error;

    // Update item quantity
    await this.updateItemQuantity(
      transaction.item_id,
      transaction.transaction_type === 'in' ? transaction.quantity : -transaction.quantity
    );

    return data;
  }

  private async updateItemQuantity(itemId: string, quantityChange: number): Promise<void> {
    const { error } = await this.supabase.rpc('update_inventory_quantity', {
      p_item_id: itemId,
      p_quantity_change: quantityChange
    });

    if (error) throw error;
  }

  async transferStock(
    fromItemId: string,
    toItemId: string,
    quantity: number,
    reason: string
  ): Promise<void> {
    // Start a transaction
    const { error } = await this.supabase.rpc('transfer_inventory', {
      p_from_item_id: fromItemId,
      p_to_item_id: toItemId,
      p_quantity: quantity,
      p_reason: reason
    });

    if (error) throw error;
  }

  async getItemAnalytics(itemId: string): Promise<any> {
    const { data, error } = await this.supabase.rpc('get_inventory_analytics', {
      p_item_id: itemId
    });

    if (error) throw error;
    return data;
  }
}

export function useInventoryBatches(itemId: string) {
  const [batches, setBatches] = useState<InventoryBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabaseClient();

  useEffect(() => {
    fetchBatches();

    const subscription = supabase
      .channel('inventory_batches')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory_batches',
          filter: `item_id=eq.${itemId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBatches(current => [...current, payload.new as InventoryBatch]);
          } else if (payload.eventType === 'UPDATE') {
            setBatches(current =>
              current.map(batch =>
                batch.id === payload.new.id ? { ...batch, ...payload.new } : batch
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setBatches(current =>
              current.filter(batch => batch.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [itemId, supabase]);

  const fetchBatches = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory_batches')
        .select('*')
        .eq('item_id', itemId)
        .order('expiry_date', { ascending: true });

      if (error) throw error;
      setBatches(data || []);
    } catch (error) {
      toast({
        title: 'Error fetching batches',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return { batches, loading };
}
