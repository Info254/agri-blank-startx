package com.agriconnect.app.data.repository

import com.agriconnect.app.data.model.*
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

class FarmerPortalRepository {
    // Land Parcels
    fun fetchLandParcels(userId: String): Flow<Result<List<LandParcel>>> = flow {
        emit(Result.Loading)
        try {
            val parcels = withContext(Dispatchers.IO) {
                supabase.from("land_parcels").select().eq("user_id", userId).decodeList<LandParcel>()
            }
            emit(Result.Success(parcels))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }
    suspend fun createLandParcel(parcel: LandParcel): Result<LandParcel> = try {
        val created = withContext(Dispatchers.IO) {
            supabase.from("land_parcels").insert(parcel).decodeSingle<LandParcel>()
        }
        Result.Success(created)
    } catch (e: Exception) {
        Result.Error(e)
    }
    // Repeat similar CRUD for Crops, Animals, Inventory, Finances, Products, Buy Requests...
} 