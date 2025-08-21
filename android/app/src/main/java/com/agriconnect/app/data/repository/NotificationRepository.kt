package com.agriconnect.app.data.repository

import com.agriconnect.app.data.model.Notification
import com.agriconnect.app.data.model.NotificationPreference
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

class NotificationRepository {
    fun fetchNotifications(userId: String): Flow<Result<List<Notification>>> = flow {
        emit(Result.Loading)
        try {
            val notifications = withContext(Dispatchers.IO) {
                supabase.from("notifications").select().eq("user_id", userId).decodeList<Notification>()
            }
            emit(Result.Success(notifications))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }
    suspend fun markAsRead(notificationId: String): Result<Unit> = try {
        withContext(Dispatchers.IO) {
            supabase.from("notifications").update(mapOf("is_read" to true)).eq("id", notificationId)
        }
        Result.Success(Unit)
    } catch (e: Exception) {
        Result.Error(e)
    }
    fun fetchUnreadCount(userId: String): Flow<Result<Int>> = flow {
        emit(Result.Loading)
        try {
            val count = withContext(Dispatchers.IO) {
                supabase.from("notifications").select().eq("user_id", userId).eq("is_read", false).count()
            }
            emit(Result.Success(count))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }
    fun fetchPreferences(userId: String): Flow<Result<NotificationPreference?>> = flow {
        emit(Result.Loading)
        try {
            val prefs = withContext(Dispatchers.IO) {
                supabase.from("notification_preferences").select().eq("user_id", userId).decodeSingleOrNull<NotificationPreference>()
            }
            emit(Result.Success(prefs))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }
    suspend fun updatePreferences(userId: String, updates: Map<String, Any>): Result<NotificationPreference> = try {
        val updated = withContext(Dispatchers.IO) {
            supabase.from("notification_preferences").update(updates).eq("user_id", userId).decodeSingle<NotificationPreference>()
        }
        Result.Success(updated)
    } catch (e: Exception) {
        Result.Error(e)
    }
} 