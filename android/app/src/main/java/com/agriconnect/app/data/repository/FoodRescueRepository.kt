package com.agriconnect.app.data.repository

import com.agriconnect.app.data.model.FoodRescueListing
import com.agriconnect.app.data.model.FoodRescueMatch
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

class FoodRescueRepository {
    fun fetchListings(): Flow<Result<List<FoodRescueListing>>> = flow {
        emit(Result.Loading)
        try {
            val listings = withContext(Dispatchers.IO) {
                supabase.from("food_rescue_listings").select().decodeList<FoodRescueListing>()
            }
            emit(Result.Success(listings))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }
    fun fetchMatches(): Flow<Result<List<FoodRescueMatch>>> = flow {
        emit(Result.Loading)
        try {
            val matches = withContext(Dispatchers.IO) {
                supabase.from("food_rescue_matches").select().decodeList<FoodRescueMatch>()
            }
            emit(Result.Success(matches))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }
    suspend fun createListing(listing: FoodRescueListing): Result<FoodRescueListing> = try {
        val created = withContext(Dispatchers.IO) {
            supabase.from("food_rescue_listings").insert(listing).decodeSingle<FoodRescueListing>()
        }
        Result.Success(created)
    } catch (e: Exception) {
        Result.Error(e)
    }
    // Add update/delete methods as needed
} 