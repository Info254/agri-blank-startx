package com.agriconnect.app.data.repository

import com.agriconnect.app.data.model.*
import com.agriconnect.app.supabase
import dagger.hilt.android.scopes.ViewModelScoped
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.postgrest.from
import io.github.jan.supabase.postgrest.query.Columns
import io.github.jan.supabase.realtime.postgresChangeFlow
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import javax.inject.Inject
import javax.inject.Singleton

sealed class Result<out T> {
    data class Success<out T>(val data: T) : Result<T>()
    data class Error(val exception: Exception) : Result<Nothing>()
    object Loading : Result<Nothing>()
}

@Singleton
class LogisticsRepository @Inject constructor(
    private val supabaseClient: SupabaseClient
) {
    fun fetchLogisticsProviders(): Flow<Result<List<LogisticsProvider>>> = flow {
        emit(Result.Loading)
        try {
            supabaseClient.from("logistics_providers")
                .select()
                .eq("is_active", true)
                .order("rating", ascending = false)
                .postgresChangeFlow<LogisticsProvider>(primaryKey = LogisticsProvider::id)
                .map { changes -> 
                    Result.Success(changes.map { it.record })
                }.collect { emit(it) }
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }

    fun fetchAggregators(): Flow<Result<List<Aggregator>>> = flow {
        emit(Result.Loading)
        try {
            supabaseClient.from("aggregators")
                .select()
                .eq("is_active", true)
                .order("rating", ascending = false)
                .postgresChangeFlow<Aggregator>(primaryKey = Aggregator::id)
                .map { changes -> 
                    Result.Success(changes.map { it.record })
                }.collect { emit(it) }
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }

    fun fetchProcessors(): Flow<Result<List<Processor>>> = flow {
        emit(Result.Loading)
        try {
            supabaseClient.from("processors")
                .select()
                .eq("is_active", true)
                .order("rating", ascending = false)
                .postgresChangeFlow<Processor>(primaryKey = Processor::id)
                .map { changes -> 
                    Result.Success(changes.map { it.record })
                }.collect { emit(it) }
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }

    fun searchLogisticsProviders(query: String, filters: LogisticsFilters): Flow<Result<List<LogisticsProvider>>> = flow {
        emit(Result.Loading)
        try {
            val searchQuery = supabaseClient.from("logistics_providers")
                .select()
                .eq("is_active", true)
                .or {
                    ilike("company_name", "%$query%")
                    ilike("description", "%$query%")
                    contains("specializations", listOf(query))
                    contains("operating_regions", listOf(query))
                }

            // Apply filters
            if (filters.serviceTypes.isNotEmpty()) {
                searchQuery.contains("service_types", filters.serviceTypes.map { it.name.lowercase() })
            }
            if (filters.vehicleTypes.isNotEmpty()) {
                searchQuery.contains("vehicle_types", filters.vehicleTypes.map { it.name.lowercase() })
            }
            if (filters.isVerifiedOnly) {
                searchQuery.eq("is_verified", true)
            }
            if (filters.hasInsurance) {
                searchQuery.eq("has_insurance", true)
            }
            if (filters.operatesInRegions.isNotEmpty()) {
                searchQuery.contains("operating_regions", filters.operatesInRegions)
            }

            val providers = searchQuery.decode<List<LogisticsProvider>>()
            emit(Result.Success(providers))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }

    suspend fun getLogisticsProvider(providerId: String): LogisticsProvider? {
        return try {
            supabaseClient.from("logistics_providers")
                .select()
                .eq("id", providerId)
                .decodeSingleOrNull<LogisticsProvider>()
        } catch (e: Exception) {
            null
        }
    }

    fun getNearbyProviders(latitude: Double, longitude: Double, radiusKm: Double): Flow<Result<List<LogisticsProvider>>> = flow {
        emit(Result.Loading)
        try {
            // Using PostGIS function for distance calculation
            val providers = supabaseClient.from("logistics_providers")
                .select()
                .eq("is_active", true)
                .not("latitude", "is", null)
                .not("longitude", "is", null)
                .rpc("providers_within_radius", mapOf(
                    "center_lat" to latitude,
                    "center_lng" to longitude,
                    "radius_km" to radiusKm
                ))
                .decode<List<LogisticsProvider>>()
            
            emit(Result.Success(providers))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }

    suspend fun requestQuote(providerId: String, quoteRequest: LogisticsQuoteRequest): Result<LogisticsQuoteRequest> {
        return try {
            val quote = supabaseClient.from("logistics_quote_requests")
                .insert(
                    mapOf(
                        "requester_id" to quoteRequest.requesterId,
                        "provider_id" to providerId,
                        "service_type" to quoteRequest.serviceType.name.lowercase(),
                        "pickup_location" to quoteRequest.pickupLocation,
                        "pickup_latitude" to quoteRequest.pickupLatitude,
                        "pickup_longitude" to quoteRequest.pickupLongitude,
                        "delivery_location" to quoteRequest.deliveryLocation,
                        "delivery_latitude" to quoteRequest.deliveryLatitude,
                        "delivery_longitude" to quoteRequest.deliveryLongitude,
                        "commodity" to quoteRequest.commodity,
                        "weight" to quoteRequest.weight,
                        "volume" to quoteRequest.volume,
                        "special_requirements" to quoteRequest.specialRequirements,
                        "preferred_pickup_date" to quoteRequest.preferredPickupDate,
                        "preferred_delivery_date" to quoteRequest.preferredDeliveryDate,
                        "is_urgent" to quoteRequest.isUrgent,
                        "additional_notes" to quoteRequest.additionalNotes
                    )
                )
                .select()
                .decodeSingle<LogisticsQuoteRequest>()

            Result.Success(quote)
        } catch (e: Exception) {
            Result.Error(e)
        }
    }

    suspend fun bookLogisticsService(providerId: String, bookingRequest: LogisticsBookingRequest): Result<LogisticsBookingRequest> {
        return try {
            val booking = supabaseClient.from("logistics_bookings")
                .insert(
                    mapOf(
                        "quote_id" to bookingRequest.quoteId,
                        "requester_id" to bookingRequest.requesterId,
                        "provider_id" to providerId,
                        "agreed_price" to bookingRequest.agreedPrice,
                        "payment_terms" to bookingRequest.paymentTerms,
                        "special_instructions" to bookingRequest.specialInstructions,
                        "contact_person_name" to bookingRequest.contactPersonName,
                        "contact_person_phone" to bookingRequest.contactPersonPhone,
                        "emergency_contact" to bookingRequest.emergencyContact,
                        "insurance_required" to bookingRequest.insuranceRequired
                    )
                )
                .select()
                .decodeSingle<LogisticsBookingRequest>()

            Result.Success(booking)
        } catch (e: Exception) {
            Result.Error(e)
        }
    }

    suspend fun getProviderAverageRating(providerId: String): Double {
        return try {
            val result = supabaseClient.from("logistics_ratings")
                .select(columns = Columns.raw("overall_rating"))
                .eq("provider_id", providerId)
                .decode<List<Map<String, Double>>>()

            if (result.isNotEmpty()) {
                result.map { it["overall_rating"] ?: 0.0 }.average()
            } else {
                0.0
            }
        } catch (e: Exception) {
            0.0
        }
    }

    fun getProviderRatings(providerId: String): Flow<Result<List<LogisticsRating>>> = flow {
        emit(Result.Loading)
        try {
            val ratings = supabaseClient.from("logistics_ratings")
                .select(
                    columns = Columns.raw("""
                        *,
                        rater:user_profiles!rater_id(full_name, profile_image_url)
                    """.trimIndent())
                )
                .eq("provider_id", providerId)
                .order("created_at", ascending = false)
                .decode<List<LogisticsRating>>()
            
            emit(Result.Success(ratings))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }

    suspend fun submitProviderRating(providerId: String, ratingData: LogisticsRatingData): Result<LogisticsRating> {
        return try {
            val rating = supabaseClient.from("logistics_ratings")
                .insert(
                    mapOf(
                        "provider_id" to providerId,
                        "booking_id" to ratingData.bookingId,
                        "overall_rating" to ratingData.overallRating,
                        "timeliness_rating" to ratingData.timelinessRating,
                        "communication_rating" to ratingData.communicationRating,
                        "vehicle_condition_rating" to ratingData.vehicleConditionRating,
                        "driver_behavior_rating" to ratingData.driverBehaviorRating,
                        "cargo_handling_rating" to ratingData.cargoHandlingRating,
                        "review_title" to ratingData.reviewTitle,
                        "review_text" to ratingData.reviewText,
                        "would_recommend" to ratingData.wouldRecommend,
                        "is_anonymous" to ratingData.isAnonymous
                    )
                )
                .select()
                .decodeSingle<LogisticsRating>()

            Result.Success(rating)
        } catch (e: Exception) {
            Result.Error(e)
        }
    }

    fun getProviderAnalytics(providerId: String, days: Int): Flow<Result<List<LogisticsAnalytics>>> = flow {
        emit(Result.Loading)
        try {
            val analytics = supabaseClient.from("logistics_analytics")
                .select()
                .eq("provider_id", providerId)
                .gte("date", "now() - interval '$days days'")
                .order("date", ascending = false)
                .decode<List<LogisticsAnalytics>>()
            
            emit(Result.Success(analytics))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }

    suspend fun getProviderPerformanceMetrics(providerId: String): LogisticsPerformanceMetrics? {
        return try {
            supabaseClient.from("logistics_performance_metrics")
                .select()
                .eq("provider_id", providerId)
                .order("updated_at", ascending = false)
                .limit(1)
                .decodeSingleOrNull<LogisticsPerformanceMetrics>()
        } catch (e: Exception) {
            null
        }
    }

    fun getShipmentTracking(trackingId: String): Flow<Result<ShipmentTracking>> = flow {
        emit(Result.Loading)
        try {
            val tracking = supabaseClient.from("shipment_tracking")
                .select(
                    columns = Columns.raw("""
                        *,
                        tracking_events:tracking_events(*),
                        shipment_details:shipments(*)
                    """.trimIndent())
                )
                .eq("tracking_number", trackingId)
                .decodeSingle<ShipmentTracking>()
            
            emit(Result.Success(tracking))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }

    fun getUserShipments(userId: String): Flow<Result<List<Shipment>>> = flow {
        emit(Result.Loading)
        try {
            val shipments = supabaseClient.from("shipments")
                .select()
                .or {
                    eq("sender_id", userId)
                    eq("receiver_id", userId)
                }
                .order("created_at", ascending = false)
                .decode<List<Shipment>>()
            
            emit(Result.Success(shipments))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }

    suspend fun updateShipmentStatus(shipmentId: String, status: ShipmentStatus, location: Location?): Result<Unit> {
        return try {
            val updates = mutableMapOf<String, Any?>(
                "status" to status.name.lowercase(),
                "updated_at" to "now()"
            )
            
            location?.let {
                updates["current_location"] = it.address
                updates["current_latitude"] = it.latitude
                updates["current_longitude"] = it.longitude
            }
            
            if (status == ShipmentStatus.PICKED_UP) {
                updates["actual_pickup_time"] = "now()"
            } else if (status == ShipmentStatus.DELIVERED) {
                updates["actual_delivery_time"] = "now()"
            }

            supabaseClient.from("shipments")
                .update(updates) {
                    filter {
                        eq("id", shipmentId)
                    }
                }

            // Create tracking event
            location?.let {
                supabaseClient.from("tracking_events")
                    .insert(
                        mapOf(
                            "shipment_id" to shipmentId,
                            "status" to status.name.lowercase(),
                            "location" to it.address,
                            "latitude" to it.latitude,
                            "longitude" to it.longitude,
                            "description" to "Status updated to ${status.name.replace('_', ' ').lowercase()}"
                        )
                    )
            }

            Result.Success(Unit)
        } catch (e: Exception) {
            Result.Error(e)
        }
    }
}