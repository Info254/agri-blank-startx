package com.agriconnect.app.data.repository

import com.agriconnect.app.data.model.*
import com.agriconnect.app.data.remote.SupabaseClient
import io.github.jan.supabase.postgrest.from
import io.github.jan.supabase.postgrest.query.Columns
import io.github.jan.supabase.realtime.PostgresAction
import io.github.jan.supabase.realtime.channel
import io.github.jan.supabase.realtime.postgresChangeFlow
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuctionRepositoryImpl @Inject constructor(
    private val supabaseClient: SupabaseClient
) {

    // Get auctions with real-time updates
    suspend fun getAuctions(filters: AuctionFilters? = null): Flow<List<Auction>> = flow {
        try {
            var query = supabaseClient.client.from("auctions")
                .select(
                    columns = Columns.raw("""
                        *,
                        profiles!seller_id(display_name, location, rating)
                    """)
                ) {
                    eq("status", "active")
                    order("created_at", ascending = false)
                }

            filters?.let { filter ->
                filter.commodity?.let { query = query.eq("commodity", it) }
                filter.location?.let { query = query.ilike("location", "%$it%") }
                filter.minPrice?.let { query = query.gte("starting_price", it) }
                filter.maxPrice?.let { query = query.lte("starting_price", it) }
                filter.minQuantity?.let { query = query.gte("quantity", it) }
                filter.maxQuantity?.let { query = query.lte("quantity", it) }
                filter.auctionType?.let { query = query.eq("auction_type", it.name.lowercase()) }
                filter.qualityGrade?.let { query = query.eq("quality_grade", it) }
            }

            val auctions = query.decodeList<Auction>()
            emit(auctions)
        } catch (e: Exception) {
            emit(emptyList())
        }
    }

    // Real-time auction updates
    fun getAuctionUpdates(auctionId: String): Flow<Auction?> {
        return supabaseClient.client.channel("auction_$auctionId")
            .postgresChangeFlow<Auction>(schema = "public") {
                table = "auctions"
                filter = "id=eq.$auctionId"
            }
            .map { change ->
                when (change.action) {
                    PostgresAction.UPDATE, PostgresAction.INSERT -> change.record
                    else -> null
                }
            }
    }

    // Real-time bid updates
    fun getBidUpdates(auctionId: String): Flow<List<Bid>> {
        return supabaseClient.client.channel("bids_$auctionId")
            .postgresChangeFlow<Bid>(schema = "public") {
                table = "bids"
                filter = "auction_id=eq.$auctionId"
            }
            .map { change ->
                // Fetch all bids for the auction
                getBidsForAuction(auctionId)
            }
    }

    private suspend fun getBidsForAuction(auctionId: String): List<Bid> {
        return try {
            supabaseClient.client.from("bids")
                .select(
                    columns = Columns.raw("""
                        *,
                        profiles!bidder_id(display_name, rating)
                    """)
                ) {
                    eq("auction_id", auctionId)
                    order("placed_at", ascending = false)
                }.decodeList<Bid>()
        } catch (e: Exception) {
            emptyList()
        }
    }

    suspend fun getAuctionById(id: String, userId: String? = null): Auction? {
        return try {
            val auction = supabaseClient.client.from("auctions")
                .select(
                    columns = Columns.raw("""
                        *,
                        profiles!seller_id(display_name, location, rating)
                    """)
                ) {
                    eq("id", id)
                }.decodeSingle<Auction>()

            // Get user's current bid if logged in
            val userBid = userId?.let { getUserBidForAuction(id, it) }
            
            // Check if user is watching
            val isWatching = userId?.let { isUserWatchingAuction(id, it) } ?: false

            auction.copy(
                currentUserBid = userBid,
                isWatching = isWatching
            )
        } catch (e: Exception) {
            null
        }
    }

    suspend fun createAuction(auctionData: CreateAuctionFormData, sellerId: String): Result<Auction> {
        return try {
            val auction = Auction(
                id = "",
                sellerId = sellerId,
                title = auctionData.title,
                commodity = auctionData.commodity,
                quantity = auctionData.quantity,
                unit = auctionData.unit,
                qualityGrade = auctionData.qualityGrade,
                location = auctionData.location,
                description = auctionData.description,
                startingPrice = auctionData.startingPrice,
                reservePrice = auctionData.reservePrice,
                bidIncrement = auctionData.bidIncrement,
                auctionType = auctionData.auctionType,
                startTime = auctionData.startTime,
                endTime = auctionData.endTime,
                images = auctionData.images,
                qualityCertificates = auctionData.qualityCertificates,
                shippingTerms = auctionData.shippingTerms,
                paymentTerms = auctionData.paymentTerms,
                inspectionPeriodHours = auctionData.inspectionPeriodHours,
                createdAt = "",
                updatedAt = ""
            )

            val created = supabaseClient.client.from("auctions")
                .insert(auction)
                .decodeSingle<Auction>()

            Result.success(created)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun placeBid(auctionId: String, bidData: PlaceBidFormData, bidderId: String): Result<Bid> {
        return try {
            val bid = Bid(
                id = "",
                auctionId = auctionId,
                bidderId = bidderId,
                amount = bidData.amount,
                bidType = bidData.bidType,
                maxAmount = bidData.maxAmount,
                placedAt = ""
            )

            val created = supabaseClient.client.from("bids")
                .insert(bid)
                .decodeSingle<Bid>()

            Result.success(created)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getUserBidForAuction(auctionId: String, userId: String): Bid? {
        return try {
            supabaseClient.client.from("bids")
                .select {
                    eq("auction_id", auctionId)
                    eq("bidder_id", userId)
                    order("placed_at", ascending = false)
                    limit(1)
                }.decodeSingle<Bid>()
        } catch (e: Exception) {
            null
        }
    }

    suspend fun getMyAuctions(sellerId: String): Flow<List<Auction>> = flow {
        try {
            val auctions = supabaseClient.client.from("auctions")
                .select {
                    eq("seller_id", sellerId)
                    order("created_at", ascending = false)
                }.decodeList<Auction>()
            emit(auctions)
        } catch (e: Exception) {
            emit(emptyList())
        }
    }

    suspend fun getMyBids(bidderId: String): Flow<List<Bid>> = flow {
        try {
            val bids = supabaseClient.client.from("bids")
                .select(
                    columns = Columns.raw("""
                        *,
                        auctions!inner(title, commodity, status, end_time)
                    """)
                ) {
                    eq("bidder_id", bidderId)
                    order("placed_at", ascending = false)
                }.decodeList<Bid>()
            emit(bids)
        } catch (e: Exception) {
            emit(emptyList())
        }
    }

    suspend fun watchAuction(auctionId: String, userId: String): Result<Boolean> {
        return try {
            val watcher = AuctionWatcher(
                id = "",
                auctionId = auctionId,
                userId = userId,
                notificationPreferences = NotificationPreferences(),
                createdAt = ""
            )

            supabaseClient.client.from("auction_watchers")
                .insert(watcher)

            Result.success(true)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun unwatchAuction(auctionId: String, userId: String): Result<Boolean> {
        return try {
            supabaseClient.client.from("auction_watchers")
                .delete {
                    eq("auction_id", auctionId)
                    eq("user_id", userId)
                }

            Result.success(true)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    private suspend fun isUserWatchingAuction(auctionId: String, userId: String): Boolean {
        return try {
            val count = supabaseClient.client.from("auction_watchers")
                .select {
                    eq("auction_id", auctionId)
                    eq("user_id", userId)
                }.decodeList<AuctionWatcher>().size
            count > 0
        } catch (e: Exception) {
            false
        }
    }

    suspend fun setupAutoBidding(auctionId: String, userId: String, maxAmount: Double, increment: Double): Result<Boolean> {
        return try {
            val autoBid = AutoBidding(
                id = "",
                auctionId = auctionId,
                bidderId = userId,
                maxBidAmount = maxAmount,
                bidIncrement = increment,
                createdAt = "",
                updatedAt = ""
            )

            supabaseClient.client.from("auto_bidding")
                .upsert(autoBid)

            Result.success(true)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun cancelAutoBidding(auctionId: String, userId: String): Result<Boolean> {
        return try {
            supabaseClient.client.from("auto_bidding")
                .update(mapOf("is_active" to false)) {
                    eq("auction_id", auctionId)
                    eq("bidder_id", userId)
                }

            Result.success(true)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getAuctionEvents(auctionId: String): Flow<List<AuctionEvent>> = flow {
        try {
            val events = supabaseClient.client.from("auction_events")
                .select {
                    eq("auction_id", auctionId)
                    order("created_at", ascending = false)
                    limit(50)
                }.decodeList<AuctionEvent>()
            emit(events)
        } catch (e: Exception) {
            emit(emptyList())
        }
    }

    suspend fun searchAuctions(query: String): Flow<List<Auction>> = flow {
        try {
            val auctions = supabaseClient.client.from("auctions")
                .select(
                    columns = Columns.raw("""
                        *,
                        profiles!seller_id(display_name, location, rating)
                    """)
                ) {
                    eq("status", "active")
                    or {
                        ilike("title", "%$query%")
                        ilike("commodity", "%$query%")
                        ilike("description", "%$query%")
                        ilike("location", "%$query%")
                    }
                    order("created_at", ascending = false)
                }.decodeList<Auction>()
            emit(auctions)
        } catch (e: Exception) {
            emit(emptyList())
        }
    }

    suspend fun getEndingSoonAuctions(): Flow<List<Auction>> = flow {
        try {
            val auctions = supabaseClient.client.from("auctions")
                .select(
                    columns = Columns.raw("""
                        *,
                        profiles!seller_id(display_name, location, rating)
                    """)
                ) {
                    eq("status", "active")
                    lte("end_time", "NOW() + INTERVAL '24 hours'")
                    order("end_time", ascending = true)
                }.decodeList<Auction>()
            emit(auctions)
        } catch (e: Exception) {
            emit(emptyList())
        }
    }

    suspend fun getAuctionAnalytics(auctionId: String): AuctionAnalytics? {
        return try {
            supabaseClient.client.from("auction_analytics")
                .select {
                    eq("auction_id", auctionId)
                }.decodeSingle<AuctionAnalytics>()
        } catch (e: Exception) {
            null
        }
    }

    suspend fun updateAuctionStatus(auctionId: String, status: AuctionStatus): Result<Boolean> {
        return try {
            supabaseClient.client.from("auctions")
                .update(mapOf("status" to status.name.lowercase())) {
                    eq("id", auctionId)
                }
            Result.success(true)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getAuctionPayment(auctionId: String): AuctionPayment? {
        return try {
            supabaseClient.client.from("auction_payments")
                .select {
                    eq("auction_id", auctionId)
                }.decodeSingle<AuctionPayment>()
        } catch (e: Exception) {
            null
        }
    }

    suspend fun createAuctionPayment(payment: AuctionPayment): Result<AuctionPayment> {
        return try {
            val created = supabaseClient.client.from("auction_payments")
                .insert(payment)
                .decodeSingle<AuctionPayment>()
            Result.success(created)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun updatePaymentStatus(paymentId: String, escrowStatus: EscrowStatus, paymentStatus: PaymentStatus): Result<Boolean> {
        return try {
            supabaseClient.client.from("auction_payments")
                .update(mapOf(
                    "escrow_status" to escrowStatus.name.lowercase(),
                    "payment_status" to paymentStatus.name.lowercase()
                )) {
                    eq("id", paymentId)
                }
            Result.success(true)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
