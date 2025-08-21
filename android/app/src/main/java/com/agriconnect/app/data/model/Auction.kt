package com.agriconnect.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class Auction(
    val id: String,
    val sellerId: String,
    val title: String,
    val commodity: String,
    val quantity: Double,
    val unit: String = "kg",
    val qualityGrade: String? = null,
    val location: String? = null,
    val description: String? = null,
    val startingPrice: Double,
    val reservePrice: Double? = null,
    val currentHighestBid: Double = 0.0,
    val currentWinnerId: String? = null,
    val bidIncrement: Double = 10.0,
    val currency: String = "KES",
    val auctionType: AuctionType = AuctionType.STANDARD,
    val startTime: String,
    val endTime: String,
    val autoExtendMinutes: Int = 5,
    val status: AuctionStatus = AuctionStatus.SCHEDULED,
    val images: List<String> = emptyList(),
    val qualityCertificates: List<String> = emptyList(),
    val shippingTerms: String? = null,
    val paymentTerms: String? = null,
    val inspectionPeriodHours: Int = 24,
    val totalBids: Int = 0,
    val uniqueBidders: Int = 0,
    val createdAt: String,
    val updatedAt: String,
    val endedAt: String? = null,
    val sellerProfile: UserProfile? = null,
    val currentUserBid: Bid? = null,
    val isWatching: Boolean = false
)

@Serializable
enum class AuctionType {
    STANDARD, DUTCH, SEALED_BID, REVERSE
}

@Serializable
enum class AuctionStatus {
    SCHEDULED, ACTIVE, EXTENDED, ENDED, CANCELLED, COMPLETED
}

@Serializable
data class Bid(
    val id: String,
    val auctionId: String,
    val bidderId: String,
    val amount: Double,
    val bidType: BidType = BidType.STANDARD,
    val maxAmount: Double? = null,
    val status: BidStatus = BidStatus.ACTIVE,
    val placedAt: String,
    val ipAddress: String? = null,
    val userAgent: String? = null,
    val bidderProfile: UserProfile? = null
)

@Serializable
enum class BidType {
    STANDARD, AUTO, PROXY
}

@Serializable
enum class BidStatus {
    ACTIVE, OUTBID, WINNING, WON, LOST
}

@Serializable
data class AuctionPayment(
    val id: String,
    val auctionId: String,
    val winningBidId: String? = null,
    val buyerId: String,
    val sellerId: String,
    val amount: Double,
    val currency: String = "KES",
    val paymentMethod: String? = null,
    val escrowStatus: EscrowStatus = EscrowStatus.PENDING,
    val paymentStatus: PaymentStatus = PaymentStatus.PENDING,
    val escrowReleaseConditions: List<String> = emptyList(),
    val milestonePayments: Map<String, Any> = emptyMap(),
    val disputeReason: String? = null,
    val createdAt: String,
    val updatedAt: String,
    val depositedAt: String? = null,
    val releasedAt: String? = null,
    val refundedAt: String? = null
)

@Serializable
enum class EscrowStatus {
    PENDING, DEPOSITED, RELEASED, REFUNDED, DISPUTED
}

@Serializable
enum class PaymentStatus {
    PENDING, PROCESSING, COMPLETED, FAILED, REFUNDED
}

@Serializable
data class AuctionWatcher(
    val id: String,
    val auctionId: String,
    val userId: String,
    val notificationPreferences: NotificationPreferences,
    val createdAt: String
)

@Serializable
data class NotificationPreferences(
    val bidUpdates: Boolean = true,
    val endingSoon: Boolean = true,
    val outbidAlerts: Boolean = true
)

@Serializable
data class AuctionEvent(
    val id: String,
    val auctionId: String,
    val eventType: AuctionEventType,
    val userId: String? = null,
    val eventData: Map<String, Any> = emptyMap(),
    val createdAt: String
)

@Serializable
enum class AuctionEventType {
    CREATED, STARTED, BID_PLACED, EXTENDED, ENDED, CANCELLED, PAYMENT_MADE, DISPUTE_RAISED
}

@Serializable
data class AutoBidding(
    val id: String,
    val auctionId: String,
    val bidderId: String,
    val maxBidAmount: Double,
    val bidIncrement: Double = 10.0,
    val isActive: Boolean = true,
    val createdAt: String,
    val updatedAt: String
)

@Serializable
data class AuctionAnalytics(
    val id: String,
    val auctionId: String,
    val totalViews: Int = 0,
    val uniqueViewers: Int = 0,
    val totalWatchers: Int = 0,
    val bidFrequency: Map<String, Any> = emptyMap(),
    val priceProgression: Map<String, Any> = emptyMap(),
    val geographicDistribution: Map<String, Any> = emptyMap(),
    val createdAt: String,
    val updatedAt: String
)

@Serializable
data class AuctionFilters(
    val commodity: String? = null,
    val location: String? = null,
    val minPrice: Double? = null,
    val maxPrice: Double? = null,
    val minQuantity: Double? = null,
    val maxQuantity: Double? = null,
    val auctionType: AuctionType? = null,
    val status: AuctionStatus? = null,
    val qualityGrade: String? = null,
    val endingWithin: String? = null, // "1h", "6h", "24h", "7d"
    val hasReservePrice: Boolean? = null
)

@Serializable
data class UserProfile(
    val id: String,
    val userId: String,
    val displayName: String,
    val location: String? = null,
    val rating: Double = 0.0,
    val totalTransactions: Int = 0,
    val verificationLevel: String = "unverified"
)

// Form Data Classes
@Serializable
data class CreateAuctionFormData(
    val title: String,
    val commodity: String,
    val quantity: Double,
    val unit: String = "kg",
    val qualityGrade: String? = null,
    val location: String? = null,
    val description: String? = null,
    val startingPrice: Double,
    val reservePrice: Double? = null,
    val bidIncrement: Double = 10.0,
    val auctionType: AuctionType = AuctionType.STANDARD,
    val startTime: String,
    val endTime: String,
    val images: List<String> = emptyList(),
    val qualityCertificates: List<String> = emptyList(),
    val shippingTerms: String? = null,
    val paymentTerms: String? = null,
    val inspectionPeriodHours: Int = 24
)

@Serializable
data class PlaceBidFormData(
    val amount: Double,
    val bidType: BidType = BidType.STANDARD,
    val maxAmount: Double? = null
)

// Constants
object AuctionConstants {
    val COMMODITIES = listOf(
        "Coffee", "Tea", "Maize", "Wheat", "Rice", "Beans", "Avocados",
        "Mangoes", "Bananas", "Tomatoes", "Onions", "Potatoes", "Carrots",
        "Cabbage", "Spinach", "Kale", "Flowers", "Herbs", "Spices", "Other"
    )

    val QUALITY_GRADES = listOf(
        "Premium", "Grade A", "Grade B", "Grade C", "Organic", "Fair Trade"
    )

    val UNITS = listOf(
        "kg", "tonnes", "bags", "crates", "boxes", "pieces", "bunches"
    )

    val AUCTION_DURATIONS = mapOf(
        "1 Hour" to 1,
        "3 Hours" to 3,
        "6 Hours" to 6,
        "12 Hours" to 12,
        "1 Day" to 24,
        "3 Days" to 72,
        "7 Days" to 168
    )

    val BID_INCREMENTS = listOf(
        1.0, 5.0, 10.0, 25.0, 50.0, 100.0, 250.0, 500.0, 1000.0
    )

    val ENDING_WITHIN_OPTIONS = mapOf(
        "Next Hour" to "1h",
        "Next 6 Hours" to "6h",
        "Next 24 Hours" to "24h",
        "Next 7 Days" to "7d"
    )
}
