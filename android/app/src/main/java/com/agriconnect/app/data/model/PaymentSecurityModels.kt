package com.agriconnect.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class EscrowTransaction(
    val id: String,
    val buyerId: String,
    val sellerId: String,
    val amount: Double,
    val currency: String = "KES",
    val description: String,
    val status: EscrowStatus,
    val deliveryAddress: String,
    val expectedDeliveryDate: String,
    val actualDeliveryDate: String? = null,
    val createdAt: String,
    val updatedAt: String,
    val releasedAt: String? = null,
    val refundedAt: String? = null,
    val disputeId: String? = null,
    val buyerProfile: UserProfile? = null,
    val sellerProfile: UserProfile? = null
)

@Serializable
enum class EscrowStatus {
    PENDING, FUNDED, DELIVERY_CONFIRMED, RELEASED, DISPUTED, REFUNDED, CANCELLED
}

@Serializable
data class SecureTransaction(
    val id: String,
    val transactionType: TransactionType,
    val buyerId: String,
    val sellerId: String,
    val amount: Double,
    val currency: String = "KES",
    val status: TransactionStatus,
    val paymentMethod: PaymentMethod,
    val escrowTransactionId: String? = null,
    val description: String,
    val createdAt: String,
    val completedAt: String? = null,
    val failedAt: String? = null,
    val failureReason: String? = null
)

@Serializable
enum class TransactionType {
    COMMODITY_PURCHASE, LOGISTICS_PAYMENT, EXPORT_PAYMENT, SERVICE_PAYMENT, AUCTION_PAYMENT
}

@Serializable
enum class TransactionStatus {
    PENDING, PROCESSING, COMPLETED, FAILED, DISPUTED, REFUNDED
}

@Serializable
enum class PaymentMethod {
    MPESA, BANK_TRANSFER, CARD, ESCROW, MOBILE_MONEY
}

@Serializable
data class DeliveryConfirmation(
    val id: String,
    val transactionId: String,
    val buyerId: String,
    val deliveryDate: String,
    val deliveryPhotos: List<String> = emptyList(),
    val qualityRating: Int,
    val notes: String? = null,
    val gpsLocation: String? = null,
    val confirmedAt: String,
    val isDisputed: Boolean = false
)

@Serializable
data class TransactionDispute(
    val id: String,
    val transactionId: String,
    val disputantId: String,
    val respondentId: String,
    val disputeType: DisputeType,
    val status: DisputeStatus,
    val description: String,
    val evidence: List<String> = emptyList(),
    val requestedResolution: String,
    val adminNotes: String? = null,
    val resolution: String? = null,
    val createdAt: String,
    val resolvedAt: String? = null,
    val assignedMediatorId: String? = null
)

@Serializable
enum class DisputeType {
    NON_DELIVERY, QUALITY_ISSUE, WRONG_QUANTITY, DAMAGED_GOODS, LATE_DELIVERY, PAYMENT_ISSUE, OTHER
}

@Serializable
enum class DisputeStatus {
    OPEN, UNDER_REVIEW, MEDIATION, RESOLVED, CLOSED
}

@Serializable
data class PaymentWarning(
    val id: String = "",
    val type: WarningType,
    val title: String,
    val message: String,
    val severity: WarningSeverity,
    val isActive: Boolean = true,
    val createdAt: String = "",
    val updatedAt: String = ""
)

@Serializable
enum class WarningType {
    UNVERIFIED_SELLER, HIGH_VALUE, NEW_SELLER, LOW_RATING, SUSPICIOUS_ACTIVITY, 
    GENERAL_PROTECTION, PAYMENT_OUTSIDE_PLATFORM, DELIVERY_DELAY
}

@Serializable
enum class WarningSeverity {
    INFO, LOW, MEDIUM, HIGH, CRITICAL
}

@Serializable
data class Auction(
    val id: String,
    val sellerId: String,
    val title: String,
    val description: String,
    val commodity: String,
    val quantity: Double,
    val unit: String,
    val startingPrice: Double,
    val currentHighestBid: Double,
    val reservePrice: Double? = null,
    val status: AuctionStatus,
    val startTime: String,
    val endTime: String,
    val deliveryLocation: String,
    val qualityGrade: String? = null,
    val images: List<String> = emptyList(),
    val totalBids: Int = 0,
    val uniqueBidders: Int = 0,
    val winnerId: String? = null,
    val createdAt: String,
    val updatedAt: String,
    val sellerProfile: UserProfile? = null,
    val currentBids: List<AuctionBid> = emptyList()
)

@Serializable
enum class AuctionStatus {
    DRAFT, ACTIVE, ENDED, CANCELLED, COMPLETED
}

@Serializable
data class AuctionBid(
    val id: String,
    val auctionId: String,
    val bidderId: String,
    val bidAmount: Double,
    val bidTime: String,
    val isWinning: Boolean = false,
    val isAutoBid: Boolean = false,
    val maxAutoBidAmount: Double? = null,
    val bidderProfile: UserProfile? = null
)

@Serializable
data class RefundRequest(
    val id: String,
    val transactionId: String,
    val requesterId: String,
    val reason: String,
    val amount: Double,
    val status: RefundStatus,
    val evidence: List<String> = emptyList(),
    val adminNotes: String? = null,
    val processedAt: String? = null,
    val createdAt: String
)

@Serializable
enum class RefundStatus {
    PENDING, APPROVED, REJECTED, PROCESSED, FAILED
}

@Serializable
data class FraudAlert(
    val id: String,
    val userId: String,
    val alertType: FraudAlertType,
    val severity: AlertSeverity,
    val description: String,
    val evidence: Map<String, Any> = emptyMap(),
    val status: AlertStatus,
    val createdAt: String,
    val reviewedAt: String? = null,
    val reviewedBy: String? = null
)

@Serializable
enum class FraudAlertType {
    SUSPICIOUS_PAYMENT, FAKE_SELLER, DUPLICATE_LISTING, PRICE_MANIPULATION, 
    IDENTITY_THEFT, MONEY_LAUNDERING, FAKE_REVIEWS
}

@Serializable
enum class AlertSeverity {
    LOW, MEDIUM, HIGH, CRITICAL
}

@Serializable
enum class AlertStatus {
    ACTIVE, INVESTIGATING, RESOLVED, FALSE_POSITIVE
}

// Buyer Protection Constants
object BuyerProtectionConstants {
    const val ESCROW_HOLD_PERIOD_DAYS = 7
    const val DISPUTE_RESOLUTION_DAYS = 14
    const val REFUND_PROCESSING_DAYS = 3
    const val HIGH_VALUE_THRESHOLD = 100000.0 // KES
    const val NEW_SELLER_THRESHOLD_DAYS = 30
    const val MIN_SELLER_RATING = 3.0
    
    val PAYMENT_PROTECTION_TIPS = listOf(
        "✅ Always use our secure escrow system",
        "✅ Never pay outside the platform",
        "✅ Inspect goods before confirming delivery",
        "✅ Report issues immediately",
        "✅ Keep all communication on the platform",
        "🚫 Don't send M-Pesa directly to sellers",
        "🚫 Don't pay before delivery confirmation",
        "🚫 Don't share personal payment details"
    )
    
    val COMMON_SCAM_WARNINGS = listOf(
        "⚠️ Seller asks for payment outside platform",
        "⚠️ Prices significantly below market rate",
        "⚠️ Seller refuses to use escrow protection",
        "⚠️ Urgent payment requests with time pressure",
        "⚠️ Poor quality photos or generic descriptions",
        "⚠️ Seller has no reviews or very new account",
        "⚠️ Requests for advance payments or deposits"
    )
    
    val DISPUTE_CATEGORIES = mapOf(
        DisputeType.NON_DELIVERY to "Goods were not delivered",
        DisputeType.QUALITY_ISSUE to "Quality doesn't match description",
        DisputeType.WRONG_QUANTITY to "Incorrect quantity delivered",
        DisputeType.DAMAGED_GOODS to "Goods arrived damaged",
        DisputeType.LATE_DELIVERY to "Delivery was significantly delayed",
        DisputeType.PAYMENT_ISSUE to "Payment processing problems",
        DisputeType.OTHER to "Other issues not listed above"
    )
    
    val REFUND_ELIGIBILITY_CRITERIA = listOf(
        "Non-delivery of goods after payment",
        "Significant quality issues not disclosed",
        "Wrong or damaged items received",
        "Seller fraud or misrepresentation",
        "Platform system errors in payment"
    )
}

// Security and Verification Models
@Serializable
data class SellerVerification(
    val sellerId: String,
    val verificationLevel: VerificationLevel,
    val documentsVerified: List<String> = emptyList(),
    val businessLicenseVerified: Boolean = false,
    val identityVerified: Boolean = false,
    val addressVerified: Boolean = false,
    val bankAccountVerified: Boolean = false,
    val verifiedAt: String? = null,
    val expiresAt: String? = null,
    val verificationScore: Double = 0.0
)

@Serializable
enum class VerificationLevel {
    UNVERIFIED, BASIC, STANDARD, PREMIUM, ENTERPRISE
}

@Serializable
data class TrustScore(
    val userId: String,
    val overallScore: Double,
    val transactionHistory: Double,
    val deliveryPerformance: Double,
    val customerFeedback: Double,
    val verificationStatus: Double,
    val accountAge: Double,
    val disputeHistory: Double,
    val lastUpdated: String
)
