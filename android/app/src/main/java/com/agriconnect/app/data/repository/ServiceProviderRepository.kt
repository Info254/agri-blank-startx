package com.agriconnect.app.data.repository

import com.agriconnect.app.data.model.ServiceProvider
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

class ServiceProviderRepository {
    fun fetchServiceProviders(): Flow<Result<List<ServiceProvider>>> = flow {
        emit(Result.Loading)
        try {
            val providers = withContext(Dispatchers.IO) {
                supabase.from("service_providers").select().decodeList<ServiceProvider>()
            }
            emit(Result.Success(providers))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }
    suspend fun createServiceProvider(provider: ServiceProvider): Result<ServiceProvider> = try {
        val created = withContext(Dispatchers.IO) {
            supabase.from("service_providers").insert(provider).decodeSingle<ServiceProvider>()
        }
        Result.Success(created)
    } catch (e: Exception) {
        Result.Error(e)
    }
    suspend fun updateServiceProvider(provider: ServiceProvider): Result<ServiceProvider> = try {
        val updated = withContext(Dispatchers.IO) {
            supabase.from("service_providers").update(provider).eq("id", provider.id).decodeSingle<ServiceProvider>()
        }
        Result.Success(updated)
    } catch (e: Exception) {
        Result.Error(e)
    }
    suspend fun deleteServiceProvider(id: String): Result<Unit> = try {
        withContext(Dispatchers.IO) {
            supabase.from("service_providers").delete().eq("id", id)
        }
        Result.Success(Unit)
    } catch (e: Exception) {
        Result.Error(e)
    }
} 