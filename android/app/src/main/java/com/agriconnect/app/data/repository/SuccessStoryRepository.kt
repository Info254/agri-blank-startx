package com.agriconnect.app.data.repository

import com.agriconnect.app.data.model.SuccessStory
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

class SuccessStoryRepository {
    fun fetchStories(): Flow<Result<List<SuccessStory>>> = flow {
        emit(Result.Loading)
        try {
            val stories = withContext(Dispatchers.IO) {
                supabase.from("success_stories").select().decodeList<SuccessStory>()
            }
            emit(Result.Success(stories))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }
    suspend fun createStory(story: SuccessStory): Result<SuccessStory> = try {
        val created = withContext(Dispatchers.IO) {
            supabase.from("success_stories").insert(story).decodeSingle<SuccessStory>()
        }
        Result.Success(created)
    } catch (e: Exception) {
        Result.Error(e)
    }
    // Add update/delete methods as needed
} 