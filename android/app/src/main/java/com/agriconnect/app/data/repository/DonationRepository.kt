package com.agriconnect.app.data.repository

import com.agriconnect.app.data.model.Donation
import com.agriconnect.app.data.model.DonationRequest
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

class DonationRepository {
    fun fetchDonations(): Flow<Result<List<Donation>>> = flow {
        emit(Result.Loading)
        try {
            val donations = withContext(Dispatchers.IO) {
                supabase.from("donations").select().decodeList<Donation>()
            }
            emit(Result.Success(donations))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }
    fun fetchDonationRequests(): Flow<Result<List<DonationRequest>>> = flow {
        emit(Result.Loading)
        try {
            val requests = withContext(Dispatchers.IO) {
                supabase.from("donation_requests").select().decodeList<DonationRequest>()
            }
            emit(Result.Success(requests))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }
    suspend fun createDonation(donation: Donation): Result<Donation> = try {
        val created = withContext(Dispatchers.IO) {
            supabase.from("donations").insert(donation).decodeSingle<Donation>()
        }
        Result.Success(created)
    } catch (e: Exception) {
        Result.Error(e)
    }
    // Add update/delete methods as needed
} 