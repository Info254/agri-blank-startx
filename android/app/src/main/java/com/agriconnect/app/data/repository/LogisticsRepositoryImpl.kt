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
class LogisticsRepositoryImpl @Inject constructor(
    private val supabaseClient: SupabaseClient
) {

    // Get logistics providers with filtering
    suspend fun getLogisticsProviders(
        serviceArea: String? = null,
        vehicleType: String? = null,
        specialization: String? = null
    ): Flow<List<LogisticsProvider>> = flow {
        try {
            var query = supabaseClient.client.from("logistics_providers")
                .select {
                    eq("verification_status", "verified")
                    order("rating", ascending = false)
                }

            serviceArea?.let { area ->
                query = query.contains("service_areas", listOf(area))
            }

            vehicleType?.let { type ->
                query = query.contains("vehicle_types", listOf(type))
            }

            specialization?.let { spec ->
                query = query.contains("specializations", listOf(spec))
            }

            val providers = query.decodeList<LogisticsProvider>()
            emit(providers)
        } catch (e: Exception) {
            emit(emptyList())
        }
    }

    suspend fun getLogisticsProviderById(id: String): LogisticsProvider? {
        return try {
            supabaseClient.client.from("logistics_providers")
                .select {
                    eq("id", id)
                }.decodeSingle<LogisticsProvider>()
        } catch (e: Exception) {
            null
        }
    }

    suspend fun createLogisticsProvider(provider: LogisticsProvider): Result<LogisticsProvider> {
        return try {
            val created = supabaseClient.client.from("logistics_providers")
                .insert(provider)
                .decodeSingle<LogisticsProvider>()
            Result.success(created)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun updateLogisticsProvider(id: String, updates: Map<String, Any>): Result<LogisticsProvider> {
        return try {
            val updated = supabaseClient.client.from("logistics_providers")
                .update(updates) {
                    eq("id", id)
                }.decodeSingle<LogisticsProvider>()
            Result.success(updated)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    // Vehicle management
    suspend fun getProviderVehicles(providerId: String): Flow<List<Vehicle>> = flow {
        try {
            val vehicles = supabaseClient.client.from("vehicles")
                .select {
                    eq("provider_id", providerId)
                    order("created_at", ascending = false)
                }.decodeList<Vehicle>()
            emit(vehicles)
        } catch (e: Exception) {
            emit(emptyList())
        }
    }

    suspend fun createVehicle(vehicle: Vehicle): Result<Vehicle> {
        return try {
            val created = supabaseClient.client.from("vehicles")
                .insert(vehicle)
                .decodeSingle<Vehicle>()
            Result.success(created)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun updateVehicleStatus(vehicleId: String, status: VehicleStatus): Result<Boolean> {
        return try {
            supabaseClient.client.from("vehicles")
                .update(mapOf("status" to status.name.lowercase())) {
                    eq("id", vehicleId)
                }
            Result.success(true)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    // Driver management
    suspend fun getProviderDrivers(providerId: String): Flow<List<Driver>> = flow {
        try {
            val drivers = supabaseClient.client.from("drivers")
                .select {
                    eq("provider_id", providerId)
                    order("created_at", ascending = false)
                }.decodeList<Driver>()
            emit(drivers)
        } catch (e: Exception) {
            emit(emptyList())
        }
    }

    suspend fun createDriver(driver: Driver): Result<Driver> {
        return try {
            val created = supabaseClient.client.from("drivers")
                .insert(driver)
                .decodeSingle<Driver>()
            Result.success(created)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun updateDriverStatus(driverId: String, status: DriverStatus): Result<Boolean> {
        return try {
            supabaseClient.client.from("drivers")
                .update(mapOf("status" to status.name.lowercase())) {
                    eq("id", driverId)
                }
            Result.success(true)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    // Shipment management
    suspend fun createShipment(shipmentData: CreateShipmentFormData, shipperId: String): Result<Shipment> {
        return try {
            // Calculate estimated cost using 8-factor algorithm
            val estimatedCost = calculateShippingCost(
                distance = estimateDistance(shipmentData.pickupAddress, shipmentData.deliveryAddress),
                weight = shipmentData.weightKg,
                pickupDate = shipmentData.pickupDate
            )

            val shipment = Shipment(
                id = "",
                shipperId = shipperId,
                providerId = shipmentData.preferredProviderId ?: "",
                title = shipmentData.title,
                commodity = shipmentData.commodity,
                weightKg = shipmentData.weightKg,
                volumeM3 = shipmentData.volumeM3,
                quantity = shipmentData.quantity,
                unit = shipmentData.unit,
                specialRequirements = shipmentData.specialRequirements,
                pickupAddress = shipmentData.pickupAddress,
                deliveryAddress = shipmentData.deliveryAddress,
                pickupDate = shipmentData.pickupDate,
                pickupTimeStart = shipmentData.pickupTimeStart,
                pickupTimeEnd = shipmentData.pickupTimeEnd,
                deliveryDate = shipmentData.deliveryDate,
                deliveryTimeStart = shipmentData.deliveryTimeStart,
                deliveryTimeEnd = shipmentData.deliveryTimeEnd,
                baseCost = estimatedCost.baseCost,
                distanceCost = estimatedCost.distanceCost,
                weightCost = estimatedCost.weightCost,
                fuelCost = estimatedCost.fuelCost,
                totalCost = estimatedCost.totalCost,
                createdAt = "",
                updatedAt = ""
            )

            val created = supabaseClient.client.from("shipments")
                .insert(shipment)
                .decodeSingle<Shipment>()

            Result.success(created)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getShipments(filters: ShipmentFilters? = null): Flow<List<Shipment>> = flow {
        try {
            var query = supabaseClient.client.from("shipments")
                .select(
                    columns = Columns.raw("""
                        *,
                        logistics_providers!inner(*),
                        vehicles(*),
                        drivers(*)
                    """)
                ) {
                    order("created_at", ascending = false)
                }

            filters?.let { filter ->
                filter.status?.let { query = query.eq("status", it.name.lowercase()) }
                filter.commodity?.let { query = query.eq("commodity", it) }
                filter.pickupArea?.let { query = query.ilike("pickup_address", "%$it%") }
                filter.deliveryArea?.let { query = query.ilike("delivery_address", "%$it%") }
                filter.dateFrom?.let { query = query.gte("pickup_date", it) }
                filter.dateTo?.let { query = query.lte("pickup_date", it) }
                filter.minWeight?.let { query = query.gte("weight_kg", it) }
                filter.maxWeight?.let { query = query.lte("weight_kg", it) }
                filter.providerId?.let { query = query.eq("provider_id", it) }
            }

            val shipments = query.decodeList<Shipment>()
            emit(shipments)
        } catch (e: Exception) {
            emit(emptyList())
        }
    }

    suspend fun getShipmentById(id: String): Shipment? {
        return try {
            supabaseClient.client.from("shipments")
                .select(
                    columns = Columns.raw("""
                        *,
                        logistics_providers!inner(*),
                        vehicles(*),
                        drivers(*)
                    """)
                ) {
                    eq("id", id)
                }.decodeSingle<Shipment>()
        } catch (e: Exception) {
            null
        }
    }

    suspend fun updateShipmentStatus(shipmentId: String, status: ShipmentStatus): Result<Boolean> {
        return try {
            val updates = mutableMapOf<String, Any>("status" to status.name.lowercase())
            
            when (status) {
                ShipmentStatus.IN_TRANSIT -> updates["pickup_confirmed_at"] = System.currentTimeMillis().toString()
                ShipmentStatus.DELIVERED -> updates["delivery_confirmed_at"] = System.currentTimeMillis().toString()
                else -> {}
            }

            supabaseClient.client.from("shipments")
                .update(updates) {
                    eq("id", shipmentId)
                }
            Result.success(true)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun assignVehicleAndDriver(shipmentId: String, vehicleId: String, driverId: String): Result<Boolean> {
        return try {
            supabaseClient.client.from("shipments")
                .update(mapOf(
                    "vehicle_id" to vehicleId,
                    "driver_id" to driverId,
                    "status" to ShipmentStatus.PICKUP_SCHEDULED.name.lowercase()
                )) {
                    eq("id", shipmentId)
                }
            Result.success(true)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    // Real-time tracking
    fun getShipmentTracking(shipmentId: String): Flow<List<TrackingEvent>> {
        return supabaseClient.client.channel("tracking_$shipmentId")
            .postgresChangeFlow<TrackingEvent>(schema = "public") {
                table = "tracking_events"
                filter = "shipment_id=eq.$shipmentId"
            }
            .map { change ->
                getTrackingEvents(shipmentId)
            }
    }

    private suspend fun getTrackingEvents(shipmentId: String): List<TrackingEvent> {
        return try {
            supabaseClient.client.from("tracking_events")
                .select {
                    eq("shipment_id", shipmentId)
                    order("timestamp", ascending = false)
                }.decodeList<TrackingEvent>()
        } catch (e: Exception) {
            emptyList()
        }
    }

    suspend fun addTrackingEvent(event: TrackingEvent): Result<TrackingEvent> {
        return try {
            val created = supabaseClient.client.from("tracking_events")
                .insert(event)
                .decodeSingle<TrackingEvent>()
            Result.success(created)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    // GPS tracking
    suspend fun addGPSTrackingPoint(tracking: GPSTracking): Result<Boolean> {
        return try {
            supabaseClient.client.from("gps_tracking")
                .insert(tracking)
            Result.success(true)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getGPSTrackingHistory(shipmentId: String): Flow<List<GPSTracking>> = flow {
        try {
            val trackingPoints = supabaseClient.client.from("gps_tracking")
                .select {
                    eq("shipment_id", shipmentId)
                    order("timestamp", ascending = true)
                }.decodeList<GPSTracking>()
            emit(trackingPoints)
        } catch (e: Exception) {
            emit(emptyList())
        }
    }

    // Route optimization
    suspend fun requestRouteOptimization(
        providerId: String,
        shipmentIds: List<String>,
        vehicleConstraints: Map<String, Any>
    ): Result<RouteOptimization> {
        return try {
            val optimization = RouteOptimization(
                id = "",
                providerId = providerId,
                optimizationDate = System.currentTimeMillis().toString(),
                shipmentIds = shipmentIds,
                vehicleConstraints = vehicleConstraints,
                createdAt = ""
            )

            val created = supabaseClient.client.from("route_optimization")
                .insert(optimization)
                .decodeSingle<RouteOptimization>()

            Result.success(created)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getRouteOptimization(id: String): RouteOptimization? {
        return try {
            supabaseClient.client.from("route_optimization")
                .select {
                    eq("id", id)
                }.decodeSingle<RouteOptimization>()
        } catch (e: Exception) {
            null
        }
    }

    // KPIs and analytics
    suspend fun getLogisticsKPIs(providerId: String, periodStart: String, periodEnd: String): LogisticsKPIs? {
        return try {
            supabaseClient.client.from("logistics_kpis")
                .select {
                    eq("provider_id", providerId)
                    eq("period_start", periodStart)
                    eq("period_end", periodEnd)
                }.decodeSingle<LogisticsKPIs>()
        } catch (e: Exception) {
            null
        }
    }

    suspend fun getProviderKPIsHistory(providerId: String): Flow<List<LogisticsKPIs>> = flow {
        try {
            val kpis = supabaseClient.client.from("logistics_kpis")
                .select {
                    eq("provider_id", providerId)
                    order("period_start", ascending = false)
                    limit(12) // Last 12 months
                }.decodeList<LogisticsKPIs>()
            emit(kpis)
        } catch (e: Exception) {
            emit(emptyList())
        }
    }

    // Cost calculation
    suspend fun calculateShippingQuote(
        providerId: String,
        distance: Double,
        weight: Double,
        pickupDate: String
    ): Result<ShippingCostBreakdown> {
        return try {
            val costBreakdown = calculateShippingCost(distance, weight, pickupDate)
            Result.success(costBreakdown)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    // Cost factors management
    suspend fun getCostFactors(providerId: String): Flow<List<CostFactor>> = flow {
        try {
            val factors = supabaseClient.client.from("cost_factors")
                .select {
                    eq("provider_id", providerId)
                    eq("is_active", true)
                    order("factor_type")
                }.decodeList<CostFactor>()
            emit(factors)
        } catch (e: Exception) {
            emit(emptyList())
        }
    }

    suspend fun updateCostFactor(id: String, updates: Map<String, Any>): Result<CostFactor> {
        return try {
            val updated = supabaseClient.client.from("cost_factors")
                .update(updates) {
                    eq("id", id)
                }.decodeSingle<CostFactor>()
            Result.success(updated)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    // Search functionality
    suspend fun searchShipments(query: String): Flow<List<Shipment>> = flow {
        try {
            val shipments = supabaseClient.client.from("shipments")
                .select(
                    columns = Columns.raw("""
                        *,
                        logistics_providers!inner(*),
                        vehicles(*),
                        drivers(*)
                    """)
                ) {
                    or {
                        ilike("title", "%$query%")
                        ilike("commodity", "%$query%")
                        ilike("pickup_address", "%$query%")
                        ilike("delivery_address", "%$query%")
                    }
                    order("created_at", ascending = false)
                }.decodeList<Shipment>()
            emit(shipments)
        } catch (e: Exception) {
            emit(emptyList())
        }
    }

    // Rating and feedback
    suspend fun rateShipment(
        shipmentId: String,
        rating: Int,
        feedback: String,
        isShipperRating: Boolean
    ): Result<Boolean> {
        return try {
            val updates = if (isShipperRating) {
                mapOf("shipper_rating" to rating, "shipper_feedback" to feedback)
            } else {
                mapOf("provider_rating" to rating, "provider_feedback" to feedback)
            }

            supabaseClient.client.from("shipments")
                .update(updates) {
                    eq("id", shipmentId)
                }
            Result.success(true)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    // Helper functions
    private fun estimateDistance(pickupAddress: String, deliveryAddress: String): Double {
        // This would integrate with OpenRouteService API for actual distance calculation
        // For now, return a placeholder
        return 50.0 // km
    }

    private fun calculateShippingCost(distance: Double, weight: Double, pickupDate: String): ShippingCostBreakdown {
        // 8-factor cost calculation
        val baseCost = 500.0 // Base rate in KES
        val distanceCost = distance * 15.0 // KES per km
        val weightCost = weight * 2.0 // KES per kg
        val fuelCost = distance * 8.0 // Fuel surcharge per km
        val driverCost = if (distance > 100) 1000.0 else 500.0 // Driver allowance
        val tollCost = if (distance > 50) 200.0 else 0.0 // Toll charges
        val insuranceCost = (baseCost + distanceCost + weightCost) * 0.02 // 2% insurance
        val seasonalAdjustment = 0.0 // Would be calculated based on pickup date
        
        val totalCost = baseCost + distanceCost + weightCost + fuelCost + 
                       driverCost + tollCost + insuranceCost + seasonalAdjustment

        return ShippingCostBreakdown(
            baseCost = baseCost,
            distanceCost = distanceCost,
            weightCost = weightCost,
            fuelCost = fuelCost,
            driverCost = driverCost,
            tollCost = tollCost,
            insuranceCost = insuranceCost,
            seasonalAdjustment = seasonalAdjustment,
            totalCost = totalCost
        )
    }
}

data class ShippingCostBreakdown(
    val baseCost: Double,
    val distanceCost: Double,
    val weightCost: Double,
    val fuelCost: Double,
    val driverCost: Double,
    val tollCost: Double,
    val insuranceCost: Double,
    val seasonalAdjustment: Double,
    val totalCost: Double
)
