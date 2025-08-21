package com.agriconnect.app.data.repository

import com.agriconnect.app.data.model.*
import com.agriconnect.app.viewmodel.CreateDisputeData
import com.agriconnect.app.viewmodel.CreateEscrowTransactionData
import com.agriconnect.app.viewmodel.DeliveryConfirmationData
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.postgrest.from
import io.github.jan.supabase.postgrest.query.Columns
import io.github.jan.supabase.realtime.postgresChangeFlow
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class PaymentSecurityRepository @Inject constructor(
    private val supabaseClient: SupabaseClient
) {

    // Escrow Transaction Operations
    suspend fun createEscrowTransaction(transactionData: CreateEscrowTransactionData): Result<EscrowTransaction> {
        return try {
            // First, validate seller and create fraud alerts if necessary
            validateTransactionSecurity(transactionData)
            
            val transaction = supabaseClient.from("escrow_transactions")
                .insert(
                    mapOf(
                        "buyer_id" to transactionData.buyerId,
                        "seller_id" to transactionData.sellerId,
                        "amount" to transactionData.amount,
                        "currency" to transactionData.currency,
                        "description" to transactionData.description,
                        "delivery_address" to transactionData.deliveryAddress,
                        "expected_delivery_date" to transactionData.expectedDeliveryDate,
                        "status" to EscrowStatus.PENDING.name.lowercase()
                    )
                )
                .select(
                    columns = Columns.raw("""
                        *,
                        buyer_profile:user_profiles!buyer_id(*),
                        seller_profile:user_profiles!seller_id(*)
                    """.trimIndent())
                )
                .decodeSingle<EscrowTransaction>()

            // Create payment protection record
            createPaymentProtectionRecord(transaction.id, transactionData)
            
            Result.Success(transaction)
        } catch (e: Exception) {
            Result.Error(e)
        }
    }

    fun getUserTransactions(userId: String): Flow<Result<List<SecureTransaction>>> = flow {
        emit(Result.Loading)
        try {
            supabaseClient.from("secure_transactions")
                .select()
                .or {
                    eq("buyer_id", userId)
                    eq("seller_id", userId)
                }
                .order("created_at", ascending = false)
                .postgresChangeFlow<SecureTransaction>(primaryKey = SecureTransaction::id)
                .map { changes -> 
                    Result.Success(changes.map { it.record })
                }.collect { emit(it) }
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }

    suspend fun confirmDelivery(transactionId: String, confirmationData: DeliveryConfirmationData): Result<DeliveryConfirmation> {
        return try {
            val confirmation = supabaseClient.from("delivery_confirmations")
                .insert(
                    mapOf(
                        "transaction_id" to transactionId,
                        "buyer_id" to confirmationData.buyerId,
                        "delivery_date" to confirmationData.deliveryDate,
                        "delivery_photos" to confirmationData.deliveryPhotos,
                        "quality_rating" to confirmationData.qualityRating,
                        "notes" to confirmationData.notes,
                        "confirmed_at" to "now()"
                    )
                )
                .select()
                .decodeSingle<DeliveryConfirmation>()

            // Update escrow status to delivery confirmed
            supabaseClient.from("escrow_transactions")
                .update(
                    mapOf(
                        "status" to EscrowStatus.DELIVERY_CONFIRMED.name.lowercase(),
                        "actual_delivery_date" to confirmationData.deliveryDate,
                        "updated_at" to "now()"
                    )
                ) {
                    filter { eq("id", transactionId) }
                }

            Result.Success(confirmation)
        } catch (e: Exception) {
            Result.Error(e)
        }
    }

    suspend fun releaseEscrowPayment(transactionId: String): Result<Unit> {
        return try {
            // Update escrow status to released
            supabaseClient.from("escrow_transactions")
                .update(
                    mapOf(
                        "status" to EscrowStatus.RELEASED.name.lowercase(),
                        "released_at" to "now()",
                        "updated_at" to "now()"
                    )
                ) {
                    filter { eq("id", transactionId) }
                }

            // Create secure transaction record for payment release
            supabaseClient.from("secure_transactions")
                .insert(
                    mapOf(
                        "transaction_type" to TransactionType.COMMODITY_PURCHASE.name.lowercase(),
                        "escrow_transaction_id" to transactionId,
                        "status" to TransactionStatus.COMPLETED.name.lowercase(),
                        "completed_at" to "now()"
                    )
                )

            Result.Success(Unit)
        } catch (e: Exception) {
            Result.Error(e)
        }
    }

    suspend fun reportDeliveryIssue(transactionId: String, issueDescription: String, evidence: List<String>): Result<Unit> {
        return try {
            // Create fraud alert for delivery issue
            supabaseClient.from("fraud_alerts")
                .insert(
                    mapOf(
                        "transaction_id" to transactionId,
                        "alert_type" to FraudAlertType.SUSPICIOUS_PAYMENT.name.lowercase(),
                        "severity" to AlertSeverity.MEDIUM.name.lowercase(),
                        "description" to issueDescription,
                        "evidence" to mapOf("files" to evidence),
                        "status" to AlertStatus.ACTIVE.name.lowercase()
                    )
                )

            // Hold escrow payment
            supabaseClient.from("escrow_transactions")
                .update(
                    mapOf(
                        "status" to EscrowStatus.DISPUTED.name.lowercase(),
                        "updated_at" to "now()"
                    )
                ) {
                    filter { eq("id", transactionId) }
                }

            Result.Success(Unit)
        } catch (e: Exception) {
            Result.Error(e)
        }
    }

    suspend fun createDispute(transactionId: String, disputeData: CreateDisputeData): Result<TransactionDispute> {
        return try {
            val dispute = supabaseClient.from("transaction_disputes")
                .insert(
                    mapOf(
                        "transaction_id" to transactionId,
                        "disputant_id" to disputeData.disputantId,
                        "dispute_type" to disputeData.disputeType.name.lowercase(),
                        "description" to disputeData.description,
                        "evidence" to disputeData.evidence,
                        "requested_resolution" to disputeData.requestedResolution,
                        "status" to DisputeStatus.OPEN.name.lowercase()
                    )
                )
                .select()
                .decodeSingle<TransactionDispute>()

            // Update escrow to disputed status
            supabaseClient.from("escrow_transactions")
                .update(
                    mapOf(
                        "status" to EscrowStatus.DISPUTED.name.lowercase(),
                        "dispute_id" to dispute.id,
                        "updated_at" to "now()"
                    )
                ) {
                    filter { eq("id", transactionId) }
                }

            Result.Success(dispute)
        } catch (e: Exception) {
            Result.Error(e)
        }
    }

    suspend fun requestRefund(transactionId: String, reason: String): Result<Unit> {
        return try {
            supabaseClient.from("refund_requests")
                .insert(
                    mapOf(
                        "transaction_id" to transactionId,
                        "reason" to reason,
                        "status" to RefundStatus.PENDING.name.lowercase()
                    )
                )

            Result.Success(Unit)
        } catch (e: Exception) {
            Result.Error(e)
        }
    }

    suspend fun getPaymentWarnings(): List<PaymentWarning> {
        return try {
            supabaseClient.from("payment_warnings")
                .select()
                .eq("is_active", true)
                .order("severity", ascending = false)
                .decode<List<PaymentWarning>>()
        } catch (e: Exception) {
            // Return default warnings if database fails
            getDefaultPaymentWarnings()
        }
    }

    private suspend fun validateTransactionSecurity(transactionData: CreateEscrowTransactionData) {
        // Check seller verification status
        val sellerVerification = supabaseClient.from("seller_verifications")
            .select()
            .eq("seller_id", transactionData.sellerId)
            .decodeSingleOrNull<SellerVerification>()

        // Create fraud alert for unverified high-value transactions
        if (!transactionData.sellerVerified && transactionData.amount > BuyerProtectionConstants.HIGH_VALUE_THRESHOLD) {
            supabaseClient.from("fraud_alerts")
                .insert(
                    mapOf(
                        "user_id" to transactionData.sellerId,
                        "alert_type" to FraudAlertType.SUSPICIOUS_PAYMENT.name.lowercase(),
                        "severity" to AlertSeverity.HIGH.name.lowercase(),
                        "description" to "High-value transaction with unverified seller",
                        "evidence" to mapOf(
                            "amount" to transactionData.amount,
                            "seller_verified" to transactionData.sellerVerified,
                            "seller_rating" to transactionData.sellerRating
                        ),
                        "status" to AlertStatus.ACTIVE.name.lowercase()
                    )
                )
        }
    }

    private suspend fun createPaymentProtectionRecord(transactionId: String, transactionData: CreateEscrowTransactionData) {
        supabaseClient.from("payment_protections")
            .insert(
                mapOf(
                    "transaction_id" to transactionId,
                    "buyer_id" to transactionData.buyerId,
                    "protection_type" to "ESCROW",
                    "coverage_amount" to transactionData.amount,
                    "is_active" to true,
                    "expires_at" to "now() + interval '${BuyerProtectionConstants.ESCROW_HOLD_PERIOD_DAYS} days'"
                )
            )
    }

    private fun getDefaultPaymentWarnings(): List<PaymentWarning> {
        return listOf(
            PaymentWarning(
                type = WarningType.GENERAL_PROTECTION,
                title = "🛡️ BUYER PROTECTION ACTIVE",
                message = "Your payments are protected by our secure escrow system. Never pay outside the platform!",
                severity = WarningSeverity.INFO
            ),
            PaymentWarning(
                type = WarningType.PAYMENT_OUTSIDE_PLATFORM,
                title = "🚫 NEVER PAY DIRECTLY",
                message = "SCAM ALERT: Never send M-Pesa or bank transfers directly to sellers. Always use our secure payment system!",
                severity = WarningSeverity.CRITICAL
            ),
            PaymentWarning(
                type = WarningType.UNVERIFIED_SELLER,
                title = "⚠️ VERIFY BEFORE BUYING",
                message = "Only buy from verified sellers. Check ratings and reviews before making any payment.",
                severity = WarningSeverity.HIGH
            )
        )
    }
}

@Singleton
class AuctionRepository @Inject constructor(
    private val supabaseClient: SupabaseClient
) {

    fun getActiveAuctions(): Flow<Result<List<Auction>>> = flow {
        emit(Result.Loading)
        try {
            supabaseClient.from("auctions")
                .select(
                    columns = Columns.raw("""
                        *,
                        seller_profile:user_profiles!seller_id(*),
                        current_bids:auction_bids(*)
                    """.trimIndent())
                )
                .eq("status", AuctionStatus.ACTIVE.name.lowercase())
                .gte("end_time", "now()")
                .order("end_time", ascending = true)
                .postgresChangeFlow<Auction>(primaryKey = Auction::id)
                .map { changes -> 
                    Result.Success(changes.map { it.record })
                }.collect { emit(it) }
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }

    suspend fun placeBid(auctionId: String, bidAmount: Double, userId: String): Result<AuctionBid> {
        return try {
            // Validate bid amount
            val auction = supabaseClient.from("auctions")
                .select()
                .eq("id", auctionId)
                .decodeSingle<Auction>()

            if (bidAmount <= auction.currentHighestBid) {
                throw Exception("Bid must be higher than current highest bid of KES ${String.format("%,.0f", auction.currentHighestBid)}")
            }

            val bid = supabaseClient.from("auction_bids")
                .insert(
                    mapOf(
                        "auction_id" to auctionId,
                        "bidder_id" to userId,
                        "bid_amount" to bidAmount,
                        "bid_time" to "now()",
                        "is_winning" to true
                    )
                )
                .select(
                    columns = Columns.raw("""
                        *,
                        bidder_profile:user_profiles!bidder_id(*)
                    """.trimIndent())
                )
                .decodeSingle<AuctionBid>()

            // Update auction with new highest bid
            supabaseClient.from("auctions")
                .update(
                    mapOf(
                        "current_highest_bid" to bidAmount,
                        "total_bids" to auction.totalBids + 1,
                        "updated_at" to "now()"
                    )
                ) {
                    filter { eq("id", auctionId) }
                }

            // Mark previous winning bids as not winning
            supabaseClient.from("auction_bids")
                .update(mapOf("is_winning" to false)) {
                    filter {
                        eq("auction_id", auctionId)
                        neq("id", bid.id)
                    }
                }

            Result.Success(bid)
        } catch (e: Exception) {
            Result.Error(e)
        }
    }

    suspend fun createAuction(auctionData: com.agriconnect.app.viewmodel.CreateAuctionData): Result<Auction> {
        return try {
            val endTime = "now() + interval '${auctionData.auctionDuration} hours'"
            
            val auction = supabaseClient.from("auctions")
                .insert(
                    mapOf(
                        "seller_id" to auctionData.sellerId,
                        "title" to auctionData.title,
                        "description" to auctionData.description,
                        "commodity" to auctionData.commodity,
                        "quantity" to auctionData.quantity,
                        "unit" to auctionData.unit,
                        "starting_price" to auctionData.startingPrice,
                        "current_highest_bid" to auctionData.startingPrice,
                        "reserve_price" to auctionData.reservePrice,
                        "status" to AuctionStatus.ACTIVE.name.lowercase(),
                        "start_time" to "now()",
                        "end_time" to endTime,
                        "delivery_location" to auctionData.deliveryLocation,
                        "quality_grade" to auctionData.qualityGrade,
                        "images" to auctionData.images
                    )
                )
                .select(
                    columns = Columns.raw("""
                        *,
                        seller_profile:user_profiles!seller_id(*)
                    """.trimIndent())
                )
                .decodeSingle<Auction>()

            Result.Success(auction)
        } catch (e: Exception) {
            Result.Error(e)
        }
    }
}
