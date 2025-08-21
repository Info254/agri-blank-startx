package com.agriconnect.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class LogisticsProvider(
    val id: String,
    val userId: String,
    val companyName: String,
    val businessRegistration: String? = null,
    val contactPerson: String,
    val phoneNumber: String,
    val email: String,
    val businessAddress: String,
    val serviceAreas: List<String> = emptyList(),
    val vehicleTypes: List<String> = emptyList(),
    val capacityRanges: Map<String, String> = emptyMap(),
    val specializations: List<String> = emptyList(),
    val operatingHours: Map<String, Map<String, String>> = emptyMap(),
    val pricingModel: PricingModel = PricingModel.PER_KM,
    val baseRate: Double,
    val perKmRate: Double? = null,
    val perKgRate: Double? = null,
    val fuelSurchargeRate: Double = 0.0,
    val insuranceCoverage: Double? = null,
    val verificationStatus: VerificationStatus = VerificationStatus.PENDING,
    val rating: Double = 0.0,
    val totalDeliveries: Int = 0,
    val onTimePercentage: Double = 0.0,
    val createdAt: String,
    val updatedAt: String
)

@Serializable
enum class PricingModel {
    PER_KM, PER_KG, FLAT_RATE, TIME_BASED
}

@Serializable
enum class VerificationStatus {
    PENDING, VERIFIED, SUSPENDED
}

@Serializable
data class Vehicle(
    val id: String,
    val providerId: String,
    val vehicleType: String,
    val makeModel: String,
    val registrationNumber: String,
    val capacityKg: Double,
    val capacityVolume: Double? = null,
    val fuelType: FuelType = FuelType.PETROL,
    val fuelConsumptionPer100km: Double? = null,
    val insuranceExpiry: String? = null,
    val inspectionExpiry: String? = null,
    val gpsDeviceId: String? = null,
    val features: List<String> = emptyList(),
    val status: VehicleStatus = VehicleStatus.AVAILABLE,
    val currentLocation: LocationPoint? = null,
    val lastLocationUpdate: String? = null,
    val createdAt: String,
    val updatedAt: String
)

@Serializable
enum class FuelType {
    PETROL, DIESEL, ELECTRIC, HYBRID
}

@Serializable
enum class VehicleStatus {
    AVAILABLE, IN_USE, MAINTENANCE, RETIRED
}

@Serializable
data class Driver(
    val id: String,
    val providerId: String,
    val userId: String? = null,
    val fullName: String,
    val phoneNumber: String,
    val licenseNumber: String,
    val licenseExpiry: String,
    val experienceYears: Int = 0,
    val specializations: List<String> = emptyList(),
    val rating: Double = 0.0,
    val totalTrips: Int = 0,
    val status: DriverStatus = DriverStatus.AVAILABLE,
    val currentVehicleId: String? = null,
    val emergencyContactName: String? = null,
    val emergencyContactPhone: String? = null,
    val createdAt: String,
    val updatedAt: String
)

@Serializable
enum class DriverStatus {
    AVAILABLE, ON_TRIP, OFF_DUTY, SUSPENDED
}

@Serializable
data class Shipment(
    val id: String,
    val shipperId: String,
    val providerId: String,
    val vehicleId: String? = null,
    val driverId: String? = null,
    val title: String,
    val commodity: String,
    val weightKg: Double,
    val volumeM3: Double? = null,
    val quantity: Int = 1,
    val unit: String = "kg",
    val specialRequirements: List<String> = emptyList(),
    val pickupAddress: String,
    val pickupCoordinates: LocationPoint? = null,
    val deliveryAddress: String,
    val deliveryCoordinates: LocationPoint? = null,
    val pickupDate: String,
    val pickupTimeStart: String? = null,
    val pickupTimeEnd: String? = null,
    val deliveryDate: String? = null,
    val deliveryTimeStart: String? = null,
    val deliveryTimeEnd: String? = null,
    val plannedRoute: Map<String, Any> = emptyMap(),
    val actualRoute: Map<String, Any> = emptyMap(),
    val distanceKm: Double? = null,
    val estimatedDurationMinutes: Int? = null,
    val actualDurationMinutes: Int? = null,
    val baseCost: Double,
    val distanceCost: Double = 0.0,
    val weightCost: Double = 0.0,
    val fuelCost: Double = 0.0,
    val driverCost: Double = 0.0,
    val tollCost: Double = 0.0,
    val insuranceCost: Double = 0.0,
    val seasonalAdjustment: Double = 0.0,
    val totalCost: Double,
    val currency: String = "KES",
    val status: ShipmentStatus = ShipmentStatus.REQUESTED,
    val pickupConfirmedAt: String? = null,
    val deliveryConfirmedAt: String? = null,
    val shipperRating: Int? = null,
    val shipperFeedback: String? = null,
    val providerRating: Int? = null,
    val providerFeedback: String? = null,
    val createdAt: String,
    val updatedAt: String,
    val provider: LogisticsProvider? = null,
    val vehicle: Vehicle? = null,
    val driver: Driver? = null,
    val trackingEvents: List<TrackingEvent> = emptyList()
)

@Serializable
enum class ShipmentStatus {
    REQUESTED, ACCEPTED, PICKUP_SCHEDULED, IN_TRANSIT, DELIVERED, CANCELLED, FAILED
}

@Serializable
data class TrackingEvent(
    val id: String,
    val shipmentId: String,
    val eventType: TrackingEventType,
    val location: LocationPoint? = null,
    val address: String? = null,
    val timestamp: String,
    val notes: String? = null,
    val photoUrls: List<String> = emptyList(),
    val createdBy: String? = null
)

@Serializable
enum class TrackingEventType {
    PICKUP_STARTED, PICKUP_COMPLETED, IN_TRANSIT, DELIVERY_STARTED, DELIVERY_COMPLETED, DELAY, ISSUE
}

@Serializable
data class GPSTracking(
    val id: String,
    val shipmentId: String,
    val vehicleId: String? = null,
    val location: LocationPoint,
    val speedKmh: Double? = null,
    val headingDegrees: Double? = null,
    val altitudeM: Double? = null,
    val accuracyM: Double? = null,
    val timestamp: String
)

@Serializable
data class LocationPoint(
    val latitude: Double,
    val longitude: Double
)

@Serializable
data class RouteOptimization(
    val id: String,
    val providerId: String,
    val optimizationDate: String,
    val shipmentIds: List<String>,
    val vehicleConstraints: Map<String, Any> = emptyMap(),
    val optimizationResult: Map<String, Any> = emptyMap(),
    val totalDistanceKm: Double? = null,
    val totalDurationMinutes: Int? = null,
    val fuelSavingsPercentage: Double? = null,
    val costSavings: Double? = null,
    val status: OptimizationStatus = OptimizationStatus.PENDING,
    val createdAt: String,
    val completedAt: String? = null
)

@Serializable
enum class OptimizationStatus {
    PENDING, PROCESSING, COMPLETED, FAILED
}

@Serializable
data class LogisticsKPIs(
    val id: String,
    val providerId: String? = null,
    val periodStart: String,
    val periodEnd: String,
    val totalDeliveries: Int = 0,
    val onTimeDeliveries: Int = 0,
    val onTimePercentage: Double = 0.0,
    val averageDelayMinutes: Int = 0,
    val totalDistanceKm: Double = 0.0,
    val totalFuelConsumption: Double = 0.0,
    val fuelEfficiencyKmPerLiter: Double = 0.0,
    val costPerKm: Double = 0.0,
    val costPerKg: Double = 0.0,
    val averageRating: Double = 0.0,
    val totalRatings: Int = 0,
    val complaintRate: Double = 0.0,
    val vehicleUtilizationPercentage: Double = 0.0,
    val averageLoadFactor: Double = 0.0,
    val createdAt: String,
    val updatedAt: String
)

@Serializable
data class CostFactor(
    val id: String,
    val providerId: String? = null,
    val factorName: String,
    val factorType: CostFactorType,
    val calculationMethod: CalculationMethod,
    val rate: Double,
    val minimumCharge: Double = 0.0,
    val maximumCharge: Double? = null,
    val isActive: Boolean = true,
    val effectiveFrom: String,
    val effectiveTo: String? = null,
    val createdAt: String,
    val updatedAt: String
)

@Serializable
enum class CostFactorType {
    DISTANCE, WEIGHT, FUEL, DRIVER, TOLLS, INSURANCE, SEASONAL, BASE
}

@Serializable
enum class CalculationMethod {
    FIXED, PER_KM, PER_KG, PERCENTAGE, TIME_BASED
}

@Serializable
data class ShipmentFilters(
    val status: ShipmentStatus? = null,
    val commodity: String? = null,
    val pickupArea: String? = null,
    val deliveryArea: String? = null,
    val dateFrom: String? = null,
    val dateTo: String? = null,
    val minWeight: Double? = null,
    val maxWeight: Double? = null,
    val providerId: String? = null,
    val vehicleType: String? = null
)

@Serializable
data class CreateShipmentFormData(
    val title: String,
    val commodity: String,
    val weightKg: Double,
    val volumeM3: Double? = null,
    val quantity: Int = 1,
    val unit: String = "kg",
    val specialRequirements: List<String> = emptyList(),
    val pickupAddress: String,
    val deliveryAddress: String,
    val pickupDate: String,
    val pickupTimeStart: String? = null,
    val pickupTimeEnd: String? = null,
    val deliveryDate: String? = null,
    val deliveryTimeStart: String? = null,
    val deliveryTimeEnd: String? = null,
    val preferredProviderId: String? = null
)

// Constants
object LogisticsConstants {
    val VEHICLE_TYPES = listOf(
        "Pickup Truck", "Van", "Small Truck", "Medium Truck", "Large Truck",
        "Refrigerated Truck", "Flatbed", "Container Truck", "Motorcycle", "Bicycle"
    )

    val SPECIALIZATIONS = listOf(
        "Refrigerated Transport", "Bulk Cargo", "Fragile Items", "Livestock",
        "Hazardous Materials", "Oversized Cargo", "Express Delivery", "Long Distance"
    )

    val SPECIAL_REQUIREMENTS = listOf(
        "Temperature Controlled", "Fragile Handling", "Live Animals", "Perishable",
        "Hazardous", "Oversized", "High Value", "Express", "Insurance Required"
    )

    val SERVICE_AREAS = listOf(
        "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Machakos",
        "Meru", "Nyeri", "Embu", "Kitale", "Kakamega", "Bungoma", "Kericho",
        "Bomet", "Narok", "Kajiado", "Kiambu", "Murang'a", "Kirinyaga"
    )

    val COMMODITIES = listOf(
        "Fresh Produce", "Grains", "Dairy Products", "Meat & Poultry", "Fish",
        "Processed Foods", "Agricultural Inputs", "Equipment", "General Cargo"
    )
}
