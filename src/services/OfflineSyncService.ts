// @ts-nocheck
import { createClient } from '@supabase/supabase-js';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { v4 as uuidv4 } from 'uuid';
import { FarmStatistics, YieldTracking, ResourceUsage, FarmBudget, RevenueTracking, FarmAnalytics } from '@/types/farm-statistics';

interface OfflineDB extends DBSchema {
  pending_operations: {
    key: string;
    value: {
      id: string;
      operation: 'create' | 'update' | 'delete';
      table: string;
      data: any;
      timestamp: number;
      retryCount: number;
    };
    indexes: { 'by-timestamp': number };
  };
  farm_statistics: {
    key: string;
    value: FarmStatistics;
  };
  yield_tracking: {
    key: string;
    value: YieldTracking;
    indexes: { 'by-date': string };
  };
  resource_usage: {
    key: string;
    value: ResourceUsage;
    indexes: { 'by-date': string };
  };
  farm_budget: {
    key: string;
    value: FarmBudget;
    indexes: { 'by-year': number };
  };
  revenue_tracking: {
    key: string;
    value: RevenueTracking;
    indexes: { 'by-date': string };
  };
  farm_analytics: {
    key: string;
    value: FarmAnalytics;
    indexes: { 'by-date': string };
  };
}

export class OfflineSyncService {
  private db: IDBPDatabase<OfflineDB>;
  private supabase;
  private syncInProgress: boolean = false;
  private lastSyncTimestamp: number = 0;
  private readonly DB_NAME = 'farm_statistics_offline';
  private readonly DB_VERSION = 1;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    this.initializeDB();
  }

  private async initializeDB() {
    this.db = await openDB<OfflineDB>(this.DB_NAME, this.DB_VERSION, {
      upgrade(db) {
        // Create stores with indexes
        const pendingOps = db.createObjectStore('pending_operations', { keyPath: 'id' });
        pendingOps.createIndex('by-timestamp', 'timestamp');

        const yieldTracking = db.createObjectStore('yield_tracking', { keyPath: 'id' });
        yieldTracking.createIndex('by-date', 'planting_date');

        const resourceUsage = db.createObjectStore('resource_usage', { keyPath: 'id' });
        resourceUsage.createIndex('by-date', 'usage_date');

        const farmBudget = db.createObjectStore('farm_budget', { keyPath: 'id' });
        farmBudget.createIndex('by-year', 'fiscal_year');

        const revenueTracking = db.createObjectStore('revenue_tracking', { keyPath: 'id' });
        revenueTracking.createIndex('by-date', 'date');

        const farmAnalytics = db.createObjectStore('farm_analytics', { keyPath: 'id' });
        farmAnalytics.createIndex('by-date', 'date');

        db.createObjectStore('farm_statistics', { keyPath: 'id' });
      },
    });
  }

  public async queueOperation(operation: 'create' | 'update' | 'delete', table: string, data: any) {
    const pendingOp = {
      id: uuidv4(),
      operation,
      table,
      data,
      timestamp: Date.now(),
      retryCount: 0,
    };

    await this.db.add('pending_operations', pendingOp);
    this.attemptSync();
  }

  private async attemptSync() {
    if (this.syncInProgress || !navigator.onLine) {
      return;
    }

    this.syncInProgress = true;

    try {
      const pendingOps = await this.db.getAllFromIndex(
        'pending_operations',
        'by-timestamp'
      );

      for (const op of pendingOps) {
        try {
          await this.processPendingOperation(op);
          await this.db.delete('pending_operations', op.id);
        } catch (error) {
          console.error(`Sync error for operation ${op.id}:`, error);
          
          // Update retry count and timestamp
          op.retryCount += 1;
          op.timestamp = Date.now() + (op.retryCount * 5 * 60 * 1000); // Exponential backoff
          
          if (op.retryCount < 5) {
            await this.db.put('pending_operations', op);
          } else {
            // Mark as failed after 5 retries
            await this.queueOperation('create', 'sync_failures', {
              operation_id: op.id,
              error: error.message,
              timestamp: new Date().toISOString()
            });
            await this.db.delete('pending_operations', op.id);
          }
        }
      }

      // Update local data with server changes
      await this.pullServerChanges();
      
      this.lastSyncTimestamp = Date.now();
    } finally {
      this.syncInProgress = false;
    }
  }

  private async processPendingOperation(op: any) {
    const { operation, table, data } = op;

    switch (operation) {
      case 'create':
        await this.supabase.from(table).insert(data);
        break;

      case 'update':
        await this.supabase
          .from(table)
          .update(data)
          .eq('id', data.id);
        break;

      case 'delete':
        await this.supabase
          .from(table)
          .delete()
          .eq('id', data.id);
        break;

      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  }

  private async pullServerChanges() {
    const tables = [
      'farm_statistics',
      'yield_tracking',
      'resource_usage',
      'farm_budget',
      'revenue_tracking',
      'farm_analytics'
    ];

    for (const table of tables) {
      const { data, error } = await this.supabase
        .from(table)
        .select('*')
        .gt('updated_at', new Date(this.lastSyncTimestamp).toISOString());

      if (error) {
        console.error(`Error pulling changes for ${table}:`, error);
        continue;
      }

      if (data && data.length > 0) {
        const tx = this.db.transaction(table, 'readwrite');
        const store = tx.objectStore(table);

        for (const record of data) {
          await store.put(record);
        }

        await tx.done;
      }
    }
  }

  public async getOfflineData<T>(table: keyof OfflineDB, query?: {
    index?: string;
    range?: IDBKeyRange;
    limit?: number;
  }): Promise<T[]> {
    let results: T[] = [];

    if (query?.index) {
      results = await this.db.getAllFromIndex(table, query.index, query.range);
    } else {
      results = await this.db.getAll(table);
    }

    if (query?.limit) {
      results = results.slice(0, query.limit);
    }

    return results;
  }

  public isOnline(): boolean {
    return navigator.onLine;
  }

  public getLastSyncTime(): Date {
    return new Date(this.lastSyncTimestamp);
  }

  // Event listeners
  public initializeEventListeners() {
    window.addEventListener('online', () => this.attemptSync());
    
    window.addEventListener('offline', () => {
      console.log('Device is offline, operations will be queued');
    });
  }

  // Clear all offline data
  public async clearOfflineData() {
    const tx = this.db.transaction(
      [
        'pending_operations',
        'farm_statistics',
        'yield_tracking',
        'resource_usage',
        'farm_budget',
        'revenue_tracking',
        'farm_analytics'
      ],
      'readwrite'
    );

    await Promise.all([
      tx.objectStore('pending_operations').clear(),
      tx.objectStore('farm_statistics').clear(),
      tx.objectStore('yield_tracking').clear(),
      tx.objectStore('resource_usage').clear(),
      tx.objectStore('farm_budget').clear(),
      tx.objectStore('revenue_tracking').clear(),
      tx.objectStore('farm_analytics').clear(),
      tx.done
    ]);
  }
}
