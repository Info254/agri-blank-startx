package com.agriconnect.app.data.repository

import com.agriconnect.app.data.model.MyTrade
import io.github.jan.supabase.postgrest.from
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import com.agriconnect.app.supabase

class MyTradesRepository {
    suspend fun fetchTrades(): List<MyTrade> = withContext(Dispatchers.IO) {
        supabase.from("my_trades").select().decodeList<MyTrade>()
    }

    suspend fun createTrade(trade: MyTrade): MyTrade = withContext(Dispatchers.IO) {
        supabase.from("my_trades").insert(trade).decodeSingle<MyTrade>()
    }

    suspend fun updateTrade(trade: MyTrade): MyTrade = withContext(Dispatchers.IO) {
        supabase.from("my_trades").update(trade).eq("id", trade.id).decodeSingle<MyTrade>()
    }
} 