package com.agriconnect.app.data.repository

import com.agriconnect.app.data.model.Review
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

class ReviewRepository {
    fun fetchReviews(): Flow<Result<List<Review>>> = flow {
        emit(Result.Loading)
        try {
            val reviews = withContext(Dispatchers.IO) {
                supabase.from("reviews").select().decodeList<Review>()
            }
            emit(Result.Success(reviews))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }
    suspend fun createReview(review: Review): Result<Review> = try {
        val created = withContext(Dispatchers.IO) {
            supabase.from("reviews").insert(review).decodeSingle<Review>()
        }
        Result.Success(created)
    } catch (e: Exception) {
        Result.Error(e)
    }
    // Add update/delete methods as needed
} 