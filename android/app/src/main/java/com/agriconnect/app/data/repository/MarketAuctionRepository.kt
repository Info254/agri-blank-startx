package com.agriconnect.app.data.repository

import com.agriconnect.app.data.model.MarketAuction
import com.agriconnect.app.data.model.MarketBid
import io.github.jan.supabase.postgrest.from
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import com.agriconnect.app.supabase

class MarketAuctionRepository {
    suspend fun fetchAuctions(): List<MarketAuction> = withContext(Dispatchers.IO) {
        supabase.from("city_market_auctions").select().decodeList<MarketAuction>()
    }

    suspend fun createAuction(auction: MarketAuction): MarketAuction = withContext(Dispatchers.IO) {
        supabase.from("city_market_auctions").insert(auction).decodeSingle<MarketAuction>()
    }

    suspend fun updateAuction(auction: MarketAuction): MarketAuction = withContext(Dispatchers.IO) {
        supabase.from("city_market_auctions").update(auction).eq("id", auction.id).decodeSingle<MarketAuction>()
    }

    suspend fun deleteAuction(id: String) = withContext(Dispatchers.IO) {
        supabase.from("city_market_auctions").delete().eq("id", id)
    }

    suspend fun fetchBids(auctionId: String): List<MarketBid> = withContext(Dispatchers.IO) {
        supabase.from("city_market_bids").select().eq("auction_id", auctionId).decodeList<MarketBid>()
    }

    suspend fun createBid(bid: MarketBid): MarketBid = withContext(Dispatchers.IO) {
        supabase.from("city_market_bids").insert(bid).decodeSingle<MarketBid>()
    }

    suspend fun updateBid(bid: MarketBid): MarketBid = withContext(Dispatchers.IO) {
        supabase.from("city_market_bids").update(bid).eq("id", bid.id).decodeSingle<MarketBid>()
    }

    suspend fun deleteBid(id: String) = withContext(Dispatchers.IO) {
        supabase.from("city_market_bids").delete().eq("id", id)
    }
} 