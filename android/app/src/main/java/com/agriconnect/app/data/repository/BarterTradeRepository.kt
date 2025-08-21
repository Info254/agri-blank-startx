package com.agriconnect.app.data.repository

import com.agriconnect.app.data.model.BarterTrade
import io.github.jan.supabase.postgrest.from
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import com.agriconnect.app.supabase

class BarterTradeRepository {
    suspend fun fetchTrades(): List<BarterTrade> = withContext(Dispatchers.IO) {
        supabase.from("barter_trades").select().decodeList<BarterTrade>()
    }

    suspend fun createTrade(trade: BarterTrade): BarterTrade = withContext(Dispatchers.IO) {
        supabase.from("barter_trades").insert(trade).decodeSingle<BarterTrade>()
    }

    suspend fun updateTrade(trade: BarterTrade): BarterTrade = withContext(Dispatchers.IO) {
        supabase.from("barter_trades").update(trade).eq("id", trade.id).decodeSingle<BarterTrade>()
    }
} 