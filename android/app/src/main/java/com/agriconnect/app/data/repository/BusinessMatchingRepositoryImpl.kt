package com.agriconnect.app.data.repository

import com.agriconnect.app.data.model.*
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.postgrest.from
import io.github.jan.supabase.postgrest.query.Columns
import io.github.jan.supabase.realtime.PostgresAction
import io.github.jan.supabase.realtime.channel
import io.github.jan.supabase.realtime.postgresChangeFlow
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.serialization.json.Json
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class BusinessMatchingRepositoryImpl @Inject constructor(
    private val supabaseClient: SupabaseClient
) {

    // Business Profile Operations
    suspend fun createBusinessProfile(profileData: CreateBusinessProfileData, userId: String): Result<BusinessProfile> {
        return try {
            val profile = supabaseClient.from("business_profiles")
                .insert(
                    mapOf(
                        "user_id" to userId,
                        "business_name" to profileData.businessName,
                        "business_type" to profileData.businessType.name.lowercase(),
                        "industry_sector" to profileData.industrySector,
                        "business_size" to profileData.businessSize.name.lowercase(),
                        "country" to profileData.country,
                        "region" to profileData.region,
                        "city" to profileData.city,
                        "address" to profileData.address,
                        "phone" to profileData.phone,
                        "email" to profileData.email,
                        "website" to profileData.website,
                        "description" to profileData.description,
                        "established_year" to profileData.establishedYear,
                        "annual_revenue_range" to profileData.annualRevenueRange,
                        "employee_count_range" to profileData.employeeCountRange,
                        "certifications" to profileData.certifications,
                        "languages_supported" to profileData.languagesSupported,
                        "commodities_handled" to profileData.commoditiesHandled,
                        "services_offered" to profileData.servicesOffered,
                        "target_markets" to profileData.targetMarkets,
                        "preferred_deal_size_min" to profileData.preferredDealSizeMin,
                        "preferred_deal_size_max" to profileData.preferredDealSizeMax,
                        "payment_terms_accepted" to profileData.paymentTermsAccepted,
                        "quality_standards" to profileData.qualityStandards,
                        "business_goals" to profileData.businessGoals,
                        "partnership_preferences" to profileData.partnershipPreferences,
                        "matching_keywords" to generateMatchingKeywords(profileData)
                    )
                )
                .select()
                .decodeSingle<BusinessProfile>()

            Result.success(profile)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun updateBusinessProfile(profileId: String, updates: Map<String, Any>): Result<BusinessProfile> {
        return try {
            val profile = supabaseClient.from("business_profiles")
                .update(updates) {
                    filter {
                        eq("id", profileId)
                    }
                }
                .select()
                .decodeSingle<BusinessProfile>()

            Result.success(profile)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getBusinessProfile(profileId: String): BusinessProfile? {
        return try {
            supabaseClient.from("business_profiles")
                .select()
                .eq("id", profileId)
                .decodeSingleOrNull<BusinessProfile>()
        } catch (e: Exception) {
            null
        }
    }

    suspend fun getUserBusinessProfile(userId: String): BusinessProfile? {
        return try {
            supabaseClient.from("business_profiles")
                .select()
                .eq("user_id", userId)
                .decodeSingleOrNull<BusinessProfile>()
        } catch (e: Exception) {
            null
        }
    }

    fun getBusinessProfiles(filters: BusinessMatchingFilters): Flow<List<BusinessProfile>> {
        return try {
            val query = supabaseClient.from("business_profiles")
                .select()
                .eq("is_active", filters.isActiveOnly)

            // Apply filters
            if (filters.businessTypes.isNotEmpty()) {
                query.`in`("business_type", filters.businessTypes.map { it.name.lowercase() })
            }
            if (filters.businessSizes.isNotEmpty()) {
                query.`in`("business_size", filters.businessSizes.map { it.name.lowercase() })
            }
            if (filters.countries.isNotEmpty()) {
                query.`in`("country", filters.countries)
            }
            if (filters.verificationStatus.isNotEmpty()) {
                query.`in`("verification_status", filters.verificationStatus.map { it.name.lowercase() })
            }
            if (filters.isFeaturedOnly) {
                query.eq("is_featured", true)
            }

            query.postgresChangeFlow<BusinessProfile>(primaryKey = BusinessProfile::id)
                .map { it.map { change -> change.record } }
        } catch (e: Exception) {
            kotlinx.coroutines.flow.flowOf(emptyList())
        }
    }

    suspend fun searchBusinessProfiles(query: String, filters: BusinessMatchingFilters): Flow<List<BusinessProfile>> {
        return try {
            val searchQuery = supabaseClient.from("business_profiles")
                .select()
                .eq("is_active", true)
                .or {
                    ilike("business_name", "%$query%")
                    ilike("description", "%$query%")
                    contains("commodities_handled", listOf(query))
                    contains("services_offered", listOf(query))
                    contains("matching_keywords", listOf(query))
                }

            searchQuery.postgresChangeFlow<BusinessProfile>(primaryKey = BusinessProfile::id)
                .map { it.map { change -> change.record } }
        } catch (e: Exception) {
            kotlinx.coroutines.flow.flowOf(emptyList())
        }
    }

    // Business Matching Operations
    suspend fun getBusinessMatches(profileId: String, filters: BusinessMatchingFilters): Flow<List<BusinessMatchingScore>> {
        return try {
            val query = supabaseClient.from("business_matching_scores")
                .select(
                    columns = Columns.raw("""
                        *,
                        profile_a:business_profiles!profile_a_id(*),
                        profile_b:business_profiles!profile_b_id(*)
                    """.trimIndent())
                )
                .or {
                    eq("profile_a_id", profileId)
                    eq("profile_b_id", profileId)
                }
                .gte("expires_at", "now()")
                .order("overall_compatibility_score", ascending = false)

            // Apply compatibility score filter
            filters.minCompatibilityScore?.let { minScore ->
                query.gte("overall_compatibility_score", minScore)
            }

            query.postgresChangeFlow<BusinessMatchingScore>(primaryKey = BusinessMatchingScore::id)
                .map { it.map { change -> change.record } }
        } catch (e: Exception) {
            kotlinx.coroutines.flow.flowOf(emptyList())
        }
    }

    suspend fun calculateBusinessMatch(profileAId: String, profileBId: String): Result<BusinessMatchingScore> {
        return try {
            // Call the AI matching algorithm function
            val matchScore = supabaseClient.from("rpc")
                .rpc("calculate_business_compatibility", mapOf(
                    "profile_a_id" to profileAId,
                    "profile_b_id" to profileBId
                ))
                .decodeSingle<BusinessMatchingScore>()

            Result.success(matchScore)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun updateMatchStatus(matchId: String, status: MatchStatus): Result<Unit> {
        return try {
            supabaseClient.from("business_matching_scores")
                .update(mapOf(
                    "match_status" to status.name.lowercase(),
                    "last_interaction_at" to "now()"
                )) {
                    filter {
                        eq("id", matchId)
                    }
                }

            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    // Business Interaction Operations
    suspend fun createInteraction(
        initiatorProfileId: String,
        interactionData: CreateInteractionData
    ): Result<BusinessInteraction> {
        return try {
            val interaction = supabaseClient.from("business_interactions")
                .insert(
                    mapOf(
                        "initiator_profile_id" to initiatorProfileId,
                        "recipient_profile_id" to interactionData.recipientProfileId,
                        "interaction_type" to interactionData.interactionType.name.lowercase(),
                        "message" to interactionData.message,
                        "attachments" to interactionData.attachments
                    )
                )
                .select()
                .decodeSingle<BusinessInteraction>()

            Result.success(interaction)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    fun getInteractions(profileId: String): Flow<List<BusinessInteraction>> {
        return try {
            supabaseClient.from("business_interactions")
                .select(
                    columns = Columns.raw("""
                        *,
                        initiator:business_profiles!initiator_profile_id(*),
                        recipient:business_profiles!recipient_profile_id(*)
                    """.trimIndent())
                )
                .or {
                    eq("initiator_profile_id", profileId)
                    eq("recipient_profile_id", profileId)
                }
                .order("created_at", ascending = false)
                .postgresChangeFlow<BusinessInteraction>(primaryKey = BusinessInteraction::id)
                .map { it.map { change -> change.record } }
        } catch (e: Exception) {
            kotlinx.coroutines.flow.flowOf(emptyList())
        }
    }

    suspend fun updateInteractionStatus(interactionId: String, status: InteractionStatus): Result<Unit> {
        return try {
            supabaseClient.from("business_interactions")
                .update(mapOf(
                    "status" to status.name.lowercase(),
                    "responded_at" to if (status == InteractionStatus.RESPONDED) "now()" else null
                )) {
                    filter {
                        eq("id", interactionId)
                    }
                }

            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun markInteractionAsRead(interactionId: String): Result<Unit> {
        return try {
            supabaseClient.from("business_interactions")
                .update(mapOf("is_read" to true)) {
                    filter {
                        eq("id", interactionId)
                    }
                }

            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    // Business Rating Operations
    suspend fun createRating(
        raterProfileId: String,
        ratingData: CreateRatingData
    ): Result<BusinessRating> {
        return try {
            val rating = supabaseClient.from("business_ratings")
                .insert(
                    mapOf(
                        "rater_profile_id" to raterProfileId,
                        "rated_profile_id" to ratingData.ratedProfileId,
                        "interaction_id" to ratingData.interactionId,
                        "overall_rating" to ratingData.overallRating,
                        "communication_rating" to ratingData.communicationRating,
                        "reliability_rating" to ratingData.reliabilityRating,
                        "quality_rating" to ratingData.qualityRating,
                        "timeliness_rating" to ratingData.timelinessRating,
                        "professionalism_rating" to ratingData.professionalismRating,
                        "review_title" to ratingData.reviewTitle,
                        "review_text" to ratingData.reviewText,
                        "partnership_duration" to ratingData.partnershipDuration,
                        "deal_value_range" to ratingData.dealValueRange,
                        "would_recommend" to ratingData.wouldRecommend,
                        "is_anonymous" to ratingData.isAnonymous
                    )
                )
                .select()
                .decodeSingle<BusinessRating>()

            Result.success(rating)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    fun getBusinessRatings(profileId: String): Flow<List<BusinessRating>> {
        return try {
            supabaseClient.from("business_ratings")
                .select(
                    columns = Columns.raw("""
                        *,
                        rater:business_profiles!rater_profile_id(business_name, verification_status)
                    """.trimIndent())
                )
                .eq("rated_profile_id", profileId)
                .order("created_at", ascending = false)
                .postgresChangeFlow<BusinessRating>(primaryKey = BusinessRating::id)
                .map { it.map { change -> change.record } }
        } catch (e: Exception) {
            kotlinx.coroutines.flow.flowOf(emptyList())
        }
    }

    suspend fun getAverageRating(profileId: String): Double {
        return try {
            val result = supabaseClient.from("business_ratings")
                .select(columns = Columns.raw("overall_rating"))
                .eq("rated_profile_id", profileId)
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

    // Business Flag Operations
    suspend fun createFlag(
        flaggerProfileId: String,
        flagData: CreateFlagData
    ): Result<BusinessFlag> {
        return try {
            val flag = supabaseClient.from("business_flags")
                .insert(
                    mapOf(
                        "flagger_profile_id" to flaggerProfileId,
                        "flagged_profile_id" to flagData.flaggedProfileId,
                        "flag_type" to flagData.flagType.name.lowercase(),
                        "flag_reason" to flagData.flagReason,
                        "evidence_urls" to flagData.evidenceUrls,
                        "severity" to flagData.severity.name.lowercase()
                    )
                )
                .select()
                .decodeSingle<BusinessFlag>()

            Result.success(flag)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    // Analytics Operations
    fun getProfileAnalytics(profileId: String, days: Int = 30): Flow<List<BusinessProfileAnalytics>> {
        return try {
            supabaseClient.from("business_profile_analytics")
                .select()
                .eq("profile_id", profileId)
                .gte("date", "now() - interval '$days days'")
                .order("date", ascending = false)
                .postgresChangeFlow<BusinessProfileAnalytics>(primaryKey = BusinessProfileAnalytics::id)
                .map { it.map { change -> change.record } }
        } catch (e: Exception) {
            kotlinx.coroutines.flow.flowOf(emptyList())
        }
    }

    suspend fun getMatchingAlgorithmConfig(): MatchingAlgorithmConfig? {
        return try {
            supabaseClient.from("matching_algorithm_config")
                .select()
                .eq("is_active", true)
                .order("created_at", ascending = false)
                .limit(1)
                .decodeSingleOrNull<MatchingAlgorithmConfig>()
        } catch (e: Exception) {
            null
        }
    }

    // Helper Functions
    private fun generateMatchingKeywords(profileData: CreateBusinessProfileData): List<String> {
        val keywords = mutableSetOf<String>()
        
        // Add business name words
        keywords.addAll(profileData.businessName.split(" ").filter { it.length > 2 })
        
        // Add description words
        keywords.addAll(profileData.description.split(" ").filter { it.length > 3 })
        
        // Add commodities and services
        keywords.addAll(profileData.commoditiesHandled)
        keywords.addAll(profileData.servicesOffered)
        
        // Add business type and sector
        keywords.add(profileData.businessType.name.lowercase())
        keywords.add(profileData.industrySector.lowercase())
        
        // Add location
        keywords.add(profileData.country.lowercase())
        keywords.add(profileData.region.lowercase())
        keywords.add(profileData.city.lowercase())
        
        return keywords.toList()
    }

    suspend fun refreshMatches(profileId: String): Result<Int> {
        return try {
            // Call stored procedure to refresh matches for a profile
            val result = supabaseClient.from("rpc")
                .rpc("refresh_business_matches", mapOf("target_profile_id" to profileId))
                .decode<Map<String, Int>>()

            Result.success(result["matches_generated"] ?: 0)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getRecommendedProfiles(profileId: String, limit: Int = 10): List<BusinessProfile> {
        return try {
            supabaseClient.from("business_profiles")
                .select()
                .neq("id", profileId)
                .eq("is_active", true)
                .order("profile_completeness", ascending = false)
                .order("last_activity_at", ascending = false)
                .limit(limit)
                .decode<List<BusinessProfile>>()
        } catch (e: Exception) {
            emptyList()
        }
    }

    suspend fun getFeaturedProfiles(limit: Int = 20): List<BusinessProfile> {
        return try {
            supabaseClient.from("business_profiles")
                .select()
                .eq("is_featured", true)
                .eq("is_active", true)
                .order("last_activity_at", ascending = false)
                .limit(limit)
                .decode<List<BusinessProfile>>()
        } catch (e: Exception) {
            emptyList()
        }
    }

    suspend fun getProfileStatistics(profileId: String): Map<String, Int> {
        return try {
            val result = supabaseClient.from("rpc")
                .rpc("get_profile_statistics", mapOf("target_profile_id" to profileId))
                .decode<Map<String, Int>>()

            result
        } catch (e: Exception) {
            emptyMap()
        }
    }
}
