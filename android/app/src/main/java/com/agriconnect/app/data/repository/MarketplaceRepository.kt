package com.agriconnect.app.data.repository

import com.agriconnect.app.data.model.MarketplaceListing
import io.github.jan.supabase.postgrest.from
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import com.agriconnect.app.supabase

class MarketplaceRepository {
    suspend fun fetchListings(): List<MarketplaceListing> = withContext(Dispatchers.IO) {
        supabase.from("marketplace_listings").select().decodeList<MarketplaceListing>()
    }

    suspend fun createListing(listing: MarketplaceListing): MarketplaceListing = withContext(Dispatchers.IO) {
        supabase.from("marketplace_listings").insert(listing).decodeSingle<MarketplaceListing>()
    }
} 