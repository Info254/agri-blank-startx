package com.agriconnect.app.data.repository

import com.agriconnect.app.data.model.Auction
import com.agriconnect.app.data.model.AuctionBid
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

class AuctionRepository {
    fun fetchAuctions(): Flow<Result<List<Auction>>> = flow {
        emit(Result.Loading)
        try {
            val auctions = withContext(Dispatchers.IO) {
                supabase.from("auctions").select().decodeList<Auction>()
            }
            emit(Result.Success(auctions))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }
    fun fetchBids(auctionId: String): Flow<Result<List<AuctionBid>>> = flow {
        emit(Result.Loading)
        try {
            val bids = withContext(Dispatchers.IO) {
                supabase.from("auction_bids").select().eq("auction_id", auctionId).decodeList<AuctionBid>()
            }
            emit(Result.Success(bids))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }
    suspend fun createAuction(auction: Auction): Result<Auction> = try {
        val created = withContext(Dispatchers.IO) {
            supabase.from("auctions").insert(auction).decodeSingle<Auction>()
        }
        Result.Success(created)
    } catch (e: Exception) {
        Result.Error(e)
    }
    // Add update/delete methods as needed
} 