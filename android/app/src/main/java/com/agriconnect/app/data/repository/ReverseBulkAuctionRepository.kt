package com.agriconnect.app.data.repository

import com.agriconnect.app.data.model.ReverseBulkAuction
import io.github.jan.supabase.postgrest.from
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import com.agriconnect.app.supabase

class ReverseBulkAuctionRepository {
    suspend fun fetchAuctions(): List<ReverseBulkAuction> = withContext(Dispatchers.IO) {
        supabase.from("reverse_bulk_auctions").select().decodeList<ReverseBulkAuction>()
    }

    suspend fun createAuction(auction: ReverseBulkAuction): ReverseBulkAuction = withContext(Dispatchers.IO) {
        supabase.from("reverse_bulk_auctions").insert(auction).decodeSingle<ReverseBulkAuction>()
    }

    suspend fun updateAuction(auction: ReverseBulkAuction): ReverseBulkAuction = withContext(Dispatchers.IO) {
        supabase.from("reverse_bulk_auctions").update(auction).eq("id", auction.id).decodeSingle<ReverseBulkAuction>()
    }
} 