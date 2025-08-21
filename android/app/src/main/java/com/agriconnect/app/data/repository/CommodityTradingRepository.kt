package com.agriconnect.app.data.repository

import com.agriconnect.app.data.model.MarketplaceListing
import com.agriconnect.app.data.model.BarterTrade
import com.agriconnect.app.data.model.MyTrade
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

class CommodityTradingRepository {
    // Marketplace Listings
    fun fetchMarketplaceListings(): Flow<Result<List<MarketplaceListing>>> = flow {
        emit(Result.Loading)
        try {
            val listings = withContext(Dispatchers.IO) {
                supabase.from("marketplace_listings").select().decodeList<MarketplaceListing>()
            }
            emit(Result.Success(listings))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }
    suspend fun createMarketplaceListing(listing: MarketplaceListing): Result<MarketplaceListing> = try {
        val created = withContext(Dispatchers.IO) {
            supabase.from("marketplace_listings").insert(listing).decodeSingle<MarketplaceListing>()
        }
        Result.Success(created)
    } catch (e: Exception) {
        Result.Error(e)
    }
    suspend fun updateMarketplaceListing(listing: MarketplaceListing): Result<MarketplaceListing> = try {
        val updated = withContext(Dispatchers.IO) {
            supabase.from("marketplace_listings").update(listing).eq("id", listing.id).decodeSingle<MarketplaceListing>()
        }
        Result.Success(updated)
    } catch (e: Exception) {
        Result.Error(e)
    }
    suspend fun deleteMarketplaceListing(id: String): Result<Unit> = try {
        withContext(Dispatchers.IO) {
            supabase.from("marketplace_listings").delete().eq("id", id)
        }
        Result.Success(Unit)
    } catch (e: Exception) {
        Result.Error(e)
    }

    // Barter Trades
    fun fetchBarterTrades(): Flow<Result<List<BarterTrade>>> = flow {
        emit(Result.Loading)
        try {
            val trades = withContext(Dispatchers.IO) {
                supabase.from("barter_trades").select().decodeList<BarterTrade>()
            }
            emit(Result.Success(trades))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }
    suspend fun createBarterTrade(trade: BarterTrade): Result<BarterTrade> = try {
        val created = withContext(Dispatchers.IO) {
            supabase.from("barter_trades").insert(trade).decodeSingle<BarterTrade>()
        }
        Result.Success(created)
    } catch (e: Exception) {
        Result.Error(e)
    }
    suspend fun updateBarterTrade(trade: BarterTrade): Result<BarterTrade> = try {
        val updated = withContext(Dispatchers.IO) {
            supabase.from("barter_trades").update(trade).eq("id", trade.id).decodeSingle<BarterTrade>()
        }
        Result.Success(updated)
    } catch (e: Exception) {
        Result.Error(e)
    }
    suspend fun deleteBarterTrade(id: String): Result<Unit> = try {
        withContext(Dispatchers.IO) {
            supabase.from("barter_trades").delete().eq("id", id)
        }
        Result.Success(Unit)
    } catch (e: Exception) {
        Result.Error(e)
    }

    // My Trades
    fun fetchMyTrades(): Flow<Result<List<MyTrade>>> = flow {
        emit(Result.Loading)
        try {
            val trades = withContext(Dispatchers.IO) {
                supabase.from("my_trades").select().decodeList<MyTrade>()
            }
            emit(Result.Success(trades))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }
    suspend fun createMyTrade(trade: MyTrade): Result<MyTrade> = try {
        val created = withContext(Dispatchers.IO) {
            supabase.from("my_trades").insert(trade).decodeSingle<MyTrade>()
        }
        Result.Success(created)
    } catch (e: Exception) {
        Result.Error(e)
    }
    suspend fun updateMyTrade(trade: MyTrade): Result<MyTrade> = try {
        val updated = withContext(Dispatchers.IO) {
            supabase.from("my_trades").update(trade).eq("id", trade.id).decodeSingle<MyTrade>()
        }
        Result.Success(updated)
    } catch (e: Exception) {
        Result.Error(e)
    }
    suspend fun deleteMyTrade(id: String): Result<Unit> = try {
        withContext(Dispatchers.IO) {
            supabase.from("my_trades").delete().eq("id", id)
        }
        Result.Success(Unit)
    } catch (e: Exception) {
        Result.Error(e)
    }
} 