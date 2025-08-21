package com.agriconnect.app.data.repository

import android.content.Context
import com.agriconnect.app.data.model.OfflineData
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.io.File

sealed class Result<out T> {
    data class Success<out T>(val data: T) : Result<T>()
    data class Error(val exception: Exception) : Result<Nothing>()
    object Loading : Result<Nothing>()
}

class OfflineRepository(private val context: Context) {
    private val cacheFile = File(context.cacheDir, "offline_data.json")

    suspend fun saveData(data: OfflineData): Result<Unit> = try {
        withContext(Dispatchers.IO) {
            cacheFile.writeText(Json.encodeToString(data))
        }
        Result.Success(Unit)
    } catch (e: Exception) {
        Result.Error(e)
    }

    suspend fun loadData(): Result<OfflineData?> = try {
        val data = withContext(Dispatchers.IO) {
            if (cacheFile.exists()) {
                Json.decodeFromString<OfflineData>(cacheFile.readText())
            } else null
        }
        Result.Success(data)
    } catch (e: Exception) {
        Result.Error(e)
    }

    suspend fun clearCache(): Result<Unit> = try {
        withContext(Dispatchers.IO) {
            if (cacheFile.exists()) cacheFile.delete()
        }
        Result.Success(Unit)
    } catch (e: Exception) {
        Result.Error(e)
    }
} 