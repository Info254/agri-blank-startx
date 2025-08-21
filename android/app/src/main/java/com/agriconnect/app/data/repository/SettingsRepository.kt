package com.agriconnect.app.data.repository

import com.agriconnect.app.data.model.AppSettings
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

class SettingsRepository {
    fun fetchSettings(userId: String): Flow<Result<AppSettings?>> = flow {
        emit(Result.Loading)
        try {
            val settings = withContext(Dispatchers.IO) {
                supabase.from("app_settings").select().eq("user_id", userId).decodeSingleOrNull<AppSettings>()
            }
            emit(Result.Success(settings))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }
    suspend fun updateSettings(userId: String, updates: Map<String, Any>): Result<AppSettings> = try {
        val updated = withContext(Dispatchers.IO) {
            supabase.from("app_settings").update(updates).eq("user_id", userId).decodeSingle<AppSettings>()
        }
        Result.Success(updated)
    } catch (e: Exception) {
        Result.Error(e)
    }
} 