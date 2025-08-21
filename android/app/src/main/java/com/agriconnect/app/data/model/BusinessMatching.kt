package com.agriconnect.app.data.model

import kotlinx.serialization.Serializable

// Business Profile Data Models
@Serializable
data class BusinessProfile(
    val id: String = "",
    val userId: String = "",
    val businessName: String = "",
    val businessType: BusinessType = BusinessType.FARMER,
    val industrySector: String = "",
    val businessSize: BusinessSize = BusinessSize.SMALL,
    
    // Location and Contact
    val country: String = "",
    val region: String = "",
    val city: String = "",
    val address: String = "",
    val coordinates: LocationPoint? = null,
    val phone: String = "",
    val email: String = "",
    val website: String = "",
    
    // Business Details
    val description: String = "",
    val establishedYear: Int? = null,
    val annualRevenueRange: String = "",
    val employeeCountRange: String = "",
    val certifications: List<String> = emptyList(),
    val languagesSupported: List<String> = emptyList(),
    
    // Capabilities and Preferences
    val commoditiesHandled: List<String> = emptyList(),
    val servicesOffered: List<String> = emptyList(),
    val targetMarkets: List<String> = emptyList(),
    val preferredDealSizeMin: Double? = null,
    val preferredDealSizeMax: Double? = null,
    val paymentTermsAccepted: List<String> = emptyList(),
    val qualityStandards: List<String> = emptyList(),
    
    // AI Matching Attributes
    val matchingKeywords: List<String> = emptyList(),
    val businessGoals: List<String> = emptyList(),
    val partnershipPreferences: List<String> = emptyList(),
    val seasonalPatterns: Map<String, Any> = emptyMap(),
    val capacityUtilization: Double = 0.0,
    
    // Profile Status
    val verificationStatus: VerificationStatus = VerificationStatus.PENDING,
    val profileCompleteness: Double = 0.0,
    val isActive: Boolean = true,
    val isFeatured: Boolean = false,
    
    // Timestamps
    val createdAt: String = "",
    val updatedAt: String = "",
    val lastActivityAt: String = ""
)

@Serializable
data class BusinessMatchingScore(
    val id: String = "",
    val profileAId: String = "",
    val profileBId: String = "",
    
    // Score Components (0-100)
    val commodityCompatibilityScore: Double = 0.0,
    val geographicProximityScore: Double = 0.0,
    val businessSizeCompatibilityScore: Double = 0.0,
    val qualityStandardsAlignmentScore: Double = 0.0,
    val paymentTermsCompatibilityScore: Double = 0.0,
    val capacityComplementarityScore: Double = 0.0,
    val seasonalAlignmentScore: Double = 0.0,
    val historicalSuccessScore: Double = 0.0,
    
    // Overall Scores
    val overallCompatibilityScore: Double = 0.0,
    val aiConfidenceScore: Double = 0.0,
    
    // Matching Metadata
    val matchReason: String = "",
    val potentialSynergies: List<String> = emptyList(),
    val riskFactors: List<String> = emptyList(),
    val recommendedPartnershipTypes: List<String> = emptyList(),
    
    // Status
    val isMutualInterest: Boolean = false,
    val matchStatus: MatchStatus = MatchStatus.SUGGESTED,
    
    // Timestamps
    val calculatedAt: String = "",
    val expiresAt: String = "",
    val lastInteractionAt: String? = null
)

@Serializable
data class BusinessInteraction(
    val id: String = "",
    val initiatorProfileId: String = "",
    val recipientProfileId: String = "",
    val matchingScoreId: String? = null,
    
    // Interaction Details
    val interactionType: InteractionType = InteractionType.PROFILE_VIEW,
    val message: String = "",
    val attachments: Map<String, Any> = emptyMap(),
    
    // Status
    val status: InteractionStatus = InteractionStatus.PENDING,
    val isRead: Boolean = false,
    
    // Timestamps
    val createdAt: String = "",
    val respondedAt: String? = null,
    val expiresAt: String = ""
)

@Serializable
data class BusinessRating(
    val id: String = "",
    val raterProfileId: String = "",
    val ratedProfileId: String = "",
    val interactionId: String? = null,
    
    // Rating Categories (1-5)
    val overallRating: Double = 0.0,
    val communicationRating: Double? = null,
    val reliabilityRating: Double? = null,
    val qualityRating: Double? = null,
    val timelinessRating: Double? = null,
    val professionalismRating: Double? = null,
    
    // Review Details
    val reviewTitle: String = "",
    val reviewText: String = "",
    val partnershipDuration: String = "",
    val dealValueRange: String = "",
    val wouldRecommend: Boolean? = null,
    
    // Status
    val isVerified: Boolean = false,
    val isFeatured: Boolean = false,
    val isAnonymous: Boolean = false,
    
    // Timestamps
    val createdAt: String = "",
    val updatedAt: String = ""
)

@Serializable
data class BusinessFlag(
    val id: String = "",
    val flaggerProfileId: String = "",
    val flaggedProfileId: String = "",
    
    // Flag Details
    val flagType: FlagType = FlagType.SPAM,
    val flagReason: String = "",
    val evidenceUrls: List<String> = emptyList(),
    val severity: FlagSeverity = FlagSeverity.MEDIUM,
    
    // Status
    val status: FlagStatus = FlagStatus.PENDING,
    val moderatorNotes: String = "",
    val resolutionAction: String = "",
    
    // Timestamps
    val createdAt: String = "",
    val reviewedAt: String? = null,
    val resolvedAt: String? = null
)

@Serializable
data class MatchingAlgorithmConfig(
    val id: String = "",
    val algorithmVersion: String = "1.0",
    
    // Scoring Weights (must sum to 100)
    val commodityWeight: Double = 25.0,
    val geographicWeight: Double = 20.0,
    val businessSizeWeight: Double = 15.0,
    val qualityStandardsWeight: Double = 15.0,
    val paymentTermsWeight: Double = 10.0,
    val capacityWeight: Double = 10.0,
    val seasonalWeight: Double = 5.0,
    
    // Algorithm Parameters
    val minMatchThreshold: Double = 60.0,
    val maxDistanceKm: Int = 1000,
    val maxMatchesPerProfile: Int = 50,
    val refreshIntervalHours: Int = 24,
    
    // Status
    val isActive: Boolean = true,
    val createdAt: String = ""
)

@Serializable
data class BusinessProfileAnalytics(
    val id: String = "",
    val profileId: String = "",
    val date: String = "",
    
    // Engagement Metrics
    val profileViews: Int = 0,
    val uniqueViewers: Int = 0,
    val interestsReceived: Int = 0,
    val interestsSent: Int = 0,
    val messagesReceived: Int = 0,
    val messagesSent: Int = 0,
    
    // Matching Metrics
    val newMatchesSuggested: Int = 0,
    val matchesViewed: Int = 0,
    val matchesContacted: Int = 0,
    val successfulPartnerships: Int = 0,
    
    // Rating Metrics
    val newRatingsReceived: Int = 0,
    val averageRatingReceived: Double? = null,
    val ratingsGiven: Int = 0,
    
    val createdAt: String = ""
)

// Enums
enum class BusinessType {
    FARMER, BUYER, PROCESSOR, DISTRIBUTOR, RETAILER,
    LOGISTICS_PROVIDER, INPUT_SUPPLIER, COOPERATIVE, EXPORTER
}

enum class BusinessSize {
    MICRO, SMALL, MEDIUM, LARGE, ENTERPRISE
}

enum class VerificationStatus {
    PENDING, VERIFIED, PREMIUM_VERIFIED, REJECTED
}

enum class MatchStatus {
    SUGGESTED, VIEWED, INTERESTED, CONTACTED, NEGOTIATING,
    PARTNERED, DECLINED, EXPIRED
}

enum class InteractionType {
    PROFILE_VIEW, INTEREST_EXPRESSED, MESSAGE_SENT, MEETING_REQUESTED,
    PROPOSAL_SENT, CONTRACT_SHARED, PARTNERSHIP_FORMED, FEEDBACK_GIVEN
}

enum class InteractionStatus {
    PENDING, ACKNOWLEDGED, RESPONDED, ACCEPTED, DECLINED, EXPIRED
}

enum class FlagType {
    SPAM, FRAUD, INAPPROPRIATE_CONTENT, FAKE_PROFILE,
    HARASSMENT, BREACH_OF_CONTRACT, POOR_BUSINESS_PRACTICES,
    MISLEADING_INFORMATION, OTHER
}

enum class FlagSeverity {
    LOW, MEDIUM, HIGH, CRITICAL
}

enum class FlagStatus {
    PENDING, UNDER_REVIEW, RESOLVED, DISMISSED, ESCALATED
}

// Filter and Form Data Classes
@Serializable
data class BusinessMatchingFilters(
    val businessTypes: List<BusinessType> = emptyList(),
    val businessSizes: List<BusinessSize> = emptyList(),
    val countries: List<String> = emptyList(),
    val commodities: List<String> = emptyList(),
    val services: List<String> = emptyList(),
    val verificationStatus: List<VerificationStatus> = emptyList(),
    val minCompatibilityScore: Double? = null,
    val maxDistanceKm: Int? = null,
    val dealSizeMin: Double? = null,
    val dealSizeMax: Double? = null,
    val certifications: List<String> = emptyList(),
    val paymentTerms: List<String> = emptyList(),
    val qualityStandards: List<String> = emptyList(),
    val partnershipTypes: List<String> = emptyList(),
    val isActiveOnly: Boolean = true,
    val isFeaturedOnly: Boolean = false
)

@Serializable
data class CreateBusinessProfileData(
    val businessName: String = "",
    val businessType: BusinessType = BusinessType.FARMER,
    val industrySector: String = "",
    val businessSize: BusinessSize = BusinessSize.SMALL,
    val country: String = "",
    val region: String = "",
    val city: String = "",
    val address: String = "",
    val phone: String = "",
    val email: String = "",
    val website: String = "",
    val description: String = "",
    val establishedYear: Int? = null,
    val annualRevenueRange: String = "",
    val employeeCountRange: String = "",
    val certifications: List<String> = emptyList(),
    val languagesSupported: List<String> = emptyList(),
    val commoditiesHandled: List<String> = emptyList(),
    val servicesOffered: List<String> = emptyList(),
    val targetMarkets: List<String> = emptyList(),
    val preferredDealSizeMin: Double? = null,
    val preferredDealSizeMax: Double? = null,
    val paymentTermsAccepted: List<String> = emptyList(),
    val qualityStandards: List<String> = emptyList(),
    val businessGoals: List<String> = emptyList(),
    val partnershipPreferences: List<String> = emptyList()
)

@Serializable
data class CreateInteractionData(
    val recipientProfileId: String = "",
    val interactionType: InteractionType = InteractionType.MESSAGE_SENT,
    val message: String = "",
    val attachments: Map<String, Any> = emptyMap()
)

@Serializable
data class CreateRatingData(
    val ratedProfileId: String = "",
    val interactionId: String? = null,
    val overallRating: Double = 0.0,
    val communicationRating: Double? = null,
    val reliabilityRating: Double? = null,
    val qualityRating: Double? = null,
    val timelinessRating: Double? = null,
    val professionalismRating: Double? = null,
    val reviewTitle: String = "",
    val reviewText: String = "",
    val partnershipDuration: String = "",
    val dealValueRange: String = "",
    val wouldRecommend: Boolean? = null,
    val isAnonymous: Boolean = false
)

@Serializable
data class CreateFlagData(
    val flaggedProfileId: String = "",
    val flagType: FlagType = FlagType.SPAM,
    val flagReason: String = "",
    val evidenceUrls: List<String> = emptyList(),
    val severity: FlagSeverity = FlagSeverity.MEDIUM
)

// Constants
object BusinessMatchingConstants {
    val BUSINESS_TYPES = listOf(
        "Farmer", "Buyer", "Processor", "Distributor", "Retailer",
        "Logistics Provider", "Input Supplier", "Cooperative", "Exporter"
    )
    
    val BUSINESS_SIZES = listOf(
        "Micro (1-10 employees)", "Small (11-50 employees)", 
        "Medium (51-250 employees)", "Large (251-1000 employees)", 
        "Enterprise (1000+ employees)"
    )
    
    val INDUSTRY_SECTORS = listOf(
        "Crop Production", "Livestock", "Aquaculture", "Forestry",
        "Food Processing", "Beverage Manufacturing", "Packaging",
        "Agricultural Equipment", "Seeds & Genetics", "Fertilizers",
        "Pesticides", "Animal Feed", "Veterinary Services",
        "Agricultural Finance", "Insurance", "Technology",
        "Logistics & Transportation", "Cold Storage", "Retail",
        "Export/Import", "Consulting", "Research & Development"
    )
    
    val REVENUE_RANGES = listOf(
        "Under $10K", "$10K - $50K", "$50K - $100K", "$100K - $500K",
        "$500K - $1M", "$1M - $5M", "$5M - $10M", "$10M - $50M", "Over $50M"
    )
    
    val EMPLOYEE_RANGES = listOf(
        "1-5", "6-10", "11-25", "26-50", "51-100", 
        "101-250", "251-500", "501-1000", "1000+"
    )
    
    val CERTIFICATIONS = listOf(
        "GlobalGAP", "Organic", "Fair Trade", "Rainforest Alliance",
        "UTZ", "BRC", "SQF", "IFS", "HACCP", "ISO 22000",
        "ISO 9001", "ISO 14001", "FSSC 22000", "Halal", "Kosher"
    )
    
    val PAYMENT_TERMS = listOf(
        "Cash on Delivery", "Net 15", "Net 30", "Net 60", "Net 90",
        "Letter of Credit", "Bank Guarantee", "Advance Payment",
        "Installments", "Seasonal Payment", "Consignment"
    )
    
    val QUALITY_STANDARDS = listOf(
        "Grade A", "Grade B", "Premium", "Standard", "Organic",
        "Non-GMO", "Pesticide-Free", "Fair Trade", "Sustainably Grown",
        "Locally Sourced", "Traceable", "Fresh", "Frozen", "Dried"
    )
    
    val PARTNERSHIP_TYPES = listOf(
        "Supplier Partnership", "Buyer Partnership", "Joint Venture",
        "Distribution Agreement", "Licensing", "Franchise",
        "Strategic Alliance", "Contract Farming", "Cooperative Membership",
        "Technology Partnership", "Marketing Partnership", "Export Partnership"
    )
    
    val BUSINESS_GOALS = listOf(
        "Increase Sales", "Expand Market Reach", "Improve Quality",
        "Reduce Costs", "Access New Technology", "Gain Certifications",
        "Improve Sustainability", "Access Finance", "Build Brand",
        "Enter Export Markets", "Develop New Products", "Scale Operations"
    )
    
    val SERVICES = listOf(
        "Production", "Processing", "Packaging", "Storage", "Transportation",
        "Quality Testing", "Certification", "Marketing", "Sales",
        "Distribution", "Export Services", "Finance", "Insurance",
        "Consulting", "Training", "Technology Solutions", "Equipment Rental"
    )
}
