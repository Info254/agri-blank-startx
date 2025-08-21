package com.agriconnect.app.data.repository

import com.agriconnect.app.data.model.CityMarket
import io.github.jan.supabase.postgrest.from
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import com.agriconnect.app.supabase

class CityMarketRepository {
    suspend fun fetchMarkets(): List<CityMarket> = withContext(Dispatchers.IO) {
        supabase.from("city_markets").select().decodeList<CityMarket>()
    }

    suspend fun createMarket(market: CityMarket): CityMarket = withContext(Dispatchers.IO) {
        supabase.from("city_markets").insert(market).decodeSingle<CityMarket>()
    }

    suspend fun updateMarket(market: CityMarket): CityMarket = withContext(Dispatchers.IO) {
        supabase.from("city_markets").update(market).eq("id", market.id).decodeSingle<CityMarket>()
    }

    suspend fun deleteMarket(id: String) = withContext(Dispatchers.IO) {
        supabase.from("city_markets").delete().eq("id", id)
    }
} 