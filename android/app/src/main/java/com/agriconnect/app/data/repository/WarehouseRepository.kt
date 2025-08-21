package com.agriconnect.app.data.repository

import com.agriconnect.app.data.model.Warehouse
import com.agriconnect.app.data.model.WarehouseBooking
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

class WarehouseRepository {
    fun fetchWarehouses(): Flow<Result<List<Warehouse>>> = flow {
        emit(Result.Loading)
        try {
            val warehouses = withContext(Dispatchers.IO) {
                supabase.from("warehouses").select().decodeList<Warehouse>()
            }
            emit(Result.Success(warehouses))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }
    fun fetchWarehouseBookings(userId: String): Flow<Result<List<WarehouseBooking>>> = flow {
        emit(Result.Loading)
        try {
            val bookings = withContext(Dispatchers.IO) {
                supabase.from("warehouse_bookings").select().eq("user_id", userId).decodeList<WarehouseBooking>()
            }
            emit(Result.Success(bookings))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }
    suspend fun createWarehouseBooking(booking: WarehouseBooking): Result<WarehouseBooking> = try {
        val created = withContext(Dispatchers.IO) {
            supabase.from("warehouse_bookings").insert(booking).decodeSingle<WarehouseBooking>()
        }
        Result.Success(created)
    } catch (e: Exception) {
        Result.Error(e)
    }
    // Add update/delete methods as needed
} 