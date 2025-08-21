package com.agriconnect.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class LogisticsProvider(
    val id: String,
    val userId: String,
    val companyName: String,
    val businessRegistrationNumber: String? = null,
    val contactPerson: String,
    val phoneNumber: String,
    val email: String,
    val address: String,
    val city: String,
    val region: String,
    val country: String,
    val latitude: Double? = null,
    val longitude: Double? = null,
    val serviceTypes: List<LogisticsServiceType> = emptyList(),
    val vehicleTypes: List<VehicleType> = emptyList(),
    val operatingRegions: List<String> = emptyList(),
    val capacityTons: Double? = null,
    val pricePerKm: Double? = null,
    val pricePerTon: Double? = null,
    val minimumOrder: Double? = null,
    val isVerified: Boolean = false,
    val hasInsurance: Boolean = false,
    val insuranceAmount: Double? = null,
    val licenseNumber: String? = null,
    val rating: Double = 0.0,
    val totalTrips: Int = 0,
    val onTimeDeliveryRate: Double = 0.0,
    val description: String? = null,
    val operatingHours: String? = null,
    val specializations: List<String> = emptyList(),
    val certifications: List<String> = emptyList(),
    val isActive: Boolean = true,
    val createdAt: String,
    val updatedAt: String
)

@Serializable
enum class LogisticsServiceType {
    TRANSPORTATION, WAREHOUSING, COLD_STORAGE, PACKAGING, 
    LOADING_UNLOADING, LAST_MILE_DELIVERY, BULK_TRANSPORT, 
    REFRIGERATED_TRANSPORT, CROSS_DOCKING, DISTRIBUTION
}

@Serializable
enum class VehicleType {
    PICKUP_TRUCK, SMALL_TRUCK, MEDIUM_TRUCK, LARGE_TRUCK,
    REFRIGERATED_TRUCK, FLATBED_TRUCK, CONTAINER_TRUCK,
    MOTORCYCLE, VAN, TRAILER, SEMI_TRAILER
}

@Serializable
data class LogisticsQuoteRequest(
    val id: String = "",
    val requesterId: String,
    val providerId: String,
    val serviceType: LogisticsServiceType,
    val pickupLocation: String,
    val pickupLatitude: Double? = null,
    val pickupLongitude: Double? = null,
    val deliveryLocation: String,
    val deliveryLatitude: Double? = null,
    val deliveryLongitude: Double? = null,
    val commodity: String,
    val weight: Double,
    val volume: Double? = null,
    val specialRequirements: List<String> = emptyList(),
    val preferredPickupDate: String,
    val preferredDeliveryDate: String,
    val isUrgent: Boolean = false,
    val additionalNotes: String? = null,
    val status: QuoteStatus = QuoteStatus.PENDING,
    val createdAt: String,
    val expiresAt: String? = null
)

@Serializable
enum class QuoteStatus {
    PENDING, QUOTED, ACCEPTED, REJECTED, EXPIRED
}

@Serializable
data class LogisticsBookingRequest(
    val id: String = "",
    val quoteId: String,
    val requesterId: String,
    val providerId: String,
    val agreedPrice: Double,
    val paymentTerms: String,
    val specialInstructions: String? = null,
    val contactPersonName: String,
    val contactPersonPhone: String,
    val emergencyContact: String? = null,
    val insuranceRequired: Boolean = false,
    val status: BookingStatus = BookingStatus.CONFIRMED,
    val createdAt: String
)

@Serializable
enum class BookingStatus {
    CONFIRMED, IN_TRANSIT, DELIVERED, CANCELLED
}

@Serializable
data class LogisticsRating(
    val id: String,
    val raterId: String,
    val providerId: String,
    val bookingId: String? = null,
    val overallRating: Int,
    val timelinessRating: Int,
    val communicationRating: Int,
    val vehicleConditionRating: Int,
    val driverBehaviorRating: Int,
    val cargoHandlingRating: Int,
    val reviewTitle: String? = null,
    val reviewText: String? = null,
    val wouldRecommend: Boolean = true,
    val isAnonymous: Boolean = false,
    val createdAt: String,
    val raterProfile: UserProfile? = null
)

@Serializable
data class LogisticsRatingData(
    val providerId: String,
    val bookingId: String? = null,
    val overallRating: Int,
    val timelinessRating: Int,
    val communicationRating: Int,
    val vehicleConditionRating: Int,
    val driverBehaviorRating: Int,
    val cargoHandlingRating: Int,
    val reviewTitle: String? = null,
    val reviewText: String? = null,
    val wouldRecommend: Boolean = true,
    val isAnonymous: Boolean = false
)

@Serializable
data class LogisticsAnalytics(
    val id: String,
    val providerId: String,
    val date: String,
    val totalBookings: Int,
    val completedBookings: Int,
    val cancelledBookings: Int,
    val totalRevenue: Double,
    val averageRating: Double,
    val onTimeDeliveries: Int,
    val lateDeliveries: Int,
    val distanceCovered: Double,
    val fuelCost: Double,
    val maintenanceCost: Double,
    val profitMargin: Double
)

@Serializable
data class LogisticsPerformanceMetrics(
    val providerId: String,
    val totalTrips: Int,
    val onTimeDeliveryRate: Double,
    val averageRating: Double,
    val totalRevenue: Double,
    val averageRevenuePerTrip: Double,
    val customerRetentionRate: Double,
    val complaintRate: Double,
    val averageResponseTime: Double, // in hours
    val fuelEfficiency: Double, // km per liter
    val vehicleUtilizationRate: Double,
    val monthlyGrowthRate: Double,
    val topRoutes: List<String>,
    val topCommodities: List<String>
)

@Serializable
data class Shipment(
    val id: String,
    val trackingNumber: String,
    val bookingId: String,
    val providerId: String,
    val senderId: String,
    val receiverId: String,
    val pickupLocation: String,
    val deliveryLocation: String,
    val commodity: String,
    val weight: Double,
    val status: ShipmentStatus,
    val estimatedPickupTime: String,
    val actualPickupTime: String? = null,
    val estimatedDeliveryTime: String,
    val actualDeliveryTime: String? = null,
    val currentLocation: String? = null,
    val currentLatitude: Double? = null,
    val currentLongitude: Double? = null,
    val driverName: String? = null,
    val driverPhone: String? = null,
    val vehicleNumber: String? = null,
    val createdAt: String,
    val updatedAt: String
)

@Serializable
enum class ShipmentStatus {
    PENDING_PICKUP, PICKED_UP, IN_TRANSIT, OUT_FOR_DELIVERY, 
    DELIVERED, DELAYED, CANCELLED, RETURNED
}

@Serializable
data class ShipmentTracking(
    val shipmentId: String,
    val trackingNumber: String,
    val currentStatus: ShipmentStatus,
    val currentLocation: String? = null,
    val estimatedDelivery: String? = null,
    val trackingEvents: List<TrackingEvent> = emptyList(),
    val shipmentDetails: Shipment? = null
)

@Serializable
data class TrackingEvent(
    val id: String,
    val shipmentId: String,
    val status: ShipmentStatus,
    val location: String,
    val latitude: Double? = null,
    val longitude: Double? = null,
    val description: String,
    val timestamp: String,
    val updatedBy: String? = null
)

@Serializable
data class Aggregator(
    val id: String,
    val userId: String,
    val businessName: String,
    val registrationNumber: String? = null,
    val contactPerson: String,
    val phoneNumber: String,
    val email: String,
    val address: String,
    val city: String,
    val region: String,
    val country: String,
    val commoditiesHandled: List<String> = emptyList(),
    val storageCapacity: Double? = null,
    val hasColdStorage: Boolean = false,
    val coldStorageCapacity: Double? = null,
    val processingCapabilities: List<String> = emptyList(),
    val certifications: List<String> = emptyList(),
    val operatingRegions: List<String> = emptyList(),
    val minimumPurchaseQuantity: Double? = null,
    val paymentTerms: List<String> = emptyList(),
    val qualityStandards: List<String> = emptyList(),
    val isVerified: Boolean = false,
    val rating: Double = 0.0,
    val totalTransactions: Int = 0,
    val description: String? = null,
    val operatingHours: String? = null,
    val seasonalOperations: String? = null,
    val isActive: Boolean = true,
    val createdAt: String,
    val updatedAt: String
)

@Serializable
data class Processor(
    val id: String,
    val userId: String,
    val companyName: String,
    val registrationNumber: String? = null,
    val contactPerson: String,
    val phoneNumber: String,
    val email: String,
    val address: String,
    val city: String,
    val region: String,
    val country: String,
    val processingTypes: List<ProcessingType> = emptyList(),
    val inputCommodities: List<String> = emptyList(),
    val outputProducts: List<String> = emptyList(),
    val processingCapacity: Double? = null,
    val capacityUnit: String = "tons/day",
    val qualityCertifications: List<String> = emptyList(),
    val exportCapability: Boolean = false,
    val exportMarkets: List<String> = emptyList(),
    val minimumOrderQuantity: Double? = null,
    val leadTime: Int? = null, // in days
    val paymentTerms: List<String> = emptyList(),
    val packagingOptions: List<String> = emptyList(),
    val isVerified: Boolean = false,
    val rating: Double = 0.0,
    val totalOrders: Int = 0,
    val description: String? = null,
    val operatingHours: String? = null,
    val seasonalCapacity: String? = null,
    val isActive: Boolean = true,
    val createdAt: String,
    val updatedAt: String
)

@Serializable
enum class ProcessingType {
    CLEANING, SORTING, GRADING, PACKAGING, DRYING, 
    MILLING, GRINDING, EXTRACTION, PRESERVATION, 
    FREEZING, CANNING, JUICING, VALUE_ADDITION
}

// Constants
object LogisticsConstants {
    val KENYAN_REGIONS = listOf(
        "Nairobi", "Central", "Coast", "Eastern", "North Eastern",
        "Nyanza", "Rift Valley", "Western"
    )

    val VEHICLE_CAPACITY_RANGES = mapOf(
        VehicleType.PICKUP_TRUCK to Pair(0.5, 2.0),
        VehicleType.SMALL_TRUCK to Pair(2.0, 5.0),
        VehicleType.MEDIUM_TRUCK to Pair(5.0, 10.0),
        VehicleType.LARGE_TRUCK to Pair(10.0, 30.0),
        VehicleType.TRAILER to Pair(30.0, 50.0)
    )

    val COMMON_COMMODITIES = listOf(
        "Maize", "Wheat", "Rice", "Beans", "Potatoes", "Tomatoes",
        "Onions", "Carrots", "Cabbage", "Bananas", "Mangoes",
        "Avocados", "Coffee", "Tea", "Sugarcane", "Cotton",
        "Flowers", "Milk", "Eggs", "Chicken", "Beef", "Fish"
    )

    val PROCESSING_CAPABILITIES = listOf(
        "Cleaning", "Sorting", "Grading", "Packaging", "Labeling",
        "Drying", "Milling", "Grinding", "Extraction", "Preservation",
        "Quality Testing", "Certification", "Storage", "Distribution"
    )

    val QUALITY_CERTIFICATIONS = listOf(
        "HACCP", "ISO 22000", "GlobalGAP", "Organic", "Fair Trade",
        "Rainforest Alliance", "UTZ", "BRC", "IFS", "Halal", "Kosher"
    )
}
