package com.agriconnect.app.data.repository

import com.agriconnect.app.data.model.BulkOrder
import com.agriconnect.app.data.model.BulkOrderBid
import com.agriconnect.app.supabase
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

sealed class Result<out T> {
    data class Success<out T>(val data: T) : Result<T>()
    data class Error(val exception: Exception) : Result<Nothing>()
    object Loading : Result<Nothing>()
}

class BulkOrderRepository {

    fun fetchBulkOrders(): Flow<Result<List<BulkOrder>>> = flow {
        emit(Result.Loading)
        try {
            val orders = withContext(Dispatchers.IO) {
                supabase.from("bulk_orders").select().decodeList<BulkOrder>()
            }
            emit(Result.Success(orders))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }

    suspend fun createBulkOrder(order: BulkOrder): Result<BulkOrder> = try {
        val created = withContext(Dispatchers.IO) {
            supabase.from("bulk_orders").insert(order).decodeSingle<BulkOrder>()
        }
        Result.Success(created)
    } catch (e: Exception) {
        Result.Error(e)
    }

    suspend fun updateBulkOrder(order: BulkOrder): Result<BulkOrder> = try {
        val updated = withContext(Dispatchers.IO) {
            supabase.from("bulk_orders").update(order).eq("id", order.id).decodeSingle<BulkOrder>()
        }
        Result.Success(updated)
    } catch (e: Exception) {
        Result.Error(e)
    }

    suspend fun deleteBulkOrder(id: String): Result<Unit> = try {
        withContext(Dispatchers.IO) {
            supabase.from("bulk_orders").delete().eq("id", id)
        }
        Result.Success(Unit)
    } catch (e: Exception) {
        Result.Error(e)
    }

    fun fetchBulkOrderBids(orderId: String): Flow<Result<List<BulkOrderBid>>> = flow {
        emit(Result.Loading)
        try {
            val bids = withContext(Dispatchers.IO) {
                supabase.from("bulk_order_bids").select().eq("order_id", orderId).decodeList<BulkOrderBid>()
            }
            emit(Result.Success(bids))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }

    suspend fun createBulkOrderBid(bid: BulkOrderBid): Result<BulkOrderBid> = try {
        val created = withContext(Dispatchers.IO) {
            supabase.from("bulk_order_bids").insert(bid).decodeSingle<BulkOrderBid>()
        }
        Result.Success(created)
    } catch (e: Exception) {
        Result.Error(e)
    }

    suspend fun updateBulkOrderBid(bid: BulkOrderBid): Result<BulkOrderBid> = try {
        val updated = withContext(Dispatchers.IO) {
            supabase.from("bulk_order_bids").update(bid).eq("id", bid.id).decodeSingle<BulkOrderBid>()
        }
        Result.Success(updated)
    } catch (e: Exception) {
        Result.Error(e)
    }

    suspend fun deleteBulkOrderBid(id: String): Result<Unit> = try {
        withContext(Dispatchers.IO) {
            supabase.from("bulk_order_bids").delete().eq("id", id)
        }
        Result.Success(Unit)
    } catch (e: Exception) {
        Result.Error(e)
    }
} 