package com.agriconnect.app.data.repository

import com.agriconnect.app.data.model.AdminUser
import com.agriconnect.app.data.model.AdminLog
import com.agriconnect.app.data.model.SystemStatus
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

class AdminRepository {
    fun fetchUsers(): Flow<Result<List<AdminUser>>> = flow {
        emit(Result.Loading)
        try {
            val users = withContext(Dispatchers.IO) {
                supabase.from("users").select().decodeList<AdminUser>()
            }
            emit(Result.Success(users))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }
    fun fetchLogs(): Flow<Result<List<AdminLog>>> = flow {
        emit(Result.Loading)
        try {
            val logs = withContext(Dispatchers.IO) {
                supabase.from("admin_logs").select().decodeList<AdminLog>()
            }
            emit(Result.Success(logs))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }
    fun fetchSystemStatus(): Flow<Result<SystemStatus>> = flow {
        emit(Result.Loading)
        try {
            val status = withContext(Dispatchers.IO) {
                supabase.from("system_status").select().single().decodeSingle<SystemStatus>()
            }
            emit(Result.Success(status))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }
    // Add moderation, analytics, and other admin methods as needed
} 