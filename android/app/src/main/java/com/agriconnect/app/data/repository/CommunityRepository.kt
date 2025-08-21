package com.agriconnect.app.data.repository

import com.agriconnect.app.data.model.CommunityPost
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

class CommunityRepository {
    fun fetchPosts(): Flow<Result<List<CommunityPost>>> = flow {
        emit(Result.Loading)
        try {
            val posts = withContext(Dispatchers.IO) {
                supabase.from("community_posts").select().decodeList<CommunityPost>()
            }
            emit(Result.Success(posts))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }
    suspend fun createPost(post: CommunityPost): Result<CommunityPost> = try {
        val created = withContext(Dispatchers.IO) {
            supabase.from("community_posts").insert(post).decodeSingle<CommunityPost>()
        }
        Result.Success(created)
    } catch (e: Exception) {
        Result.Error(e)
    }
    // Add update/delete methods as needed
} 