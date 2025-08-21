package com.agriconnect.app.data.remote

import com.agriconnect.app.data.model.*
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.postgrest.Postgrest
import io.github.jan.supabase.postgrest.query.Columns
import io.github.jan.supabase.postgrest.query.Order
import io.github.jan.supabase.realtime.Realtime
import io.github.jan.supabase.storage.Storage
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.serialization.json.Json
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class SupabaseClient @Inject constructor(
    private val supabase: SupabaseClient
) {
    private val postgrest = supabase.pluginManager.getPlugin(Postgrest)
    private val storage = supabase.pluginManager.getPlugin(Storage)
    private val realtime = supabase.pluginManager.getPlugin(Realtime)

    // Advanced cooperative search with spatial queries and complex filtering
    suspend fun searchCooperatives(
        query: String? = null,
        county: String? = null,
        type: String? = null,
        verificationLevel: String? = null,
        isRecruiting: Boolean? = null,
        minPerformanceScore: Double? = null,
        maxDistance: Double? = null,
        userLocation: Coordinates? = null,
        certifications: List<String>? = null,
        commodities: List<String>? = null,
        limit: Int = 50,
        offset: Int = 0
    ): List<Cooperative> {
        var queryBuilder = postgrest.from("cooperatives").select(
            columns = Columns.raw("""
                id, name, registration_number, type, description, mission_statement, vision_statement,
                county, subcounty, ward, physical_address, postal_address, service_radius_km,
                registration_date, certificate_number, registration_status, renewal_date, compliance_score,
                leadership, board_members, management_team,
                share_capital, minimum_share_value, joining_fee, monthly_contribution, annual_turnover,
                current_members, maximum_members, target_members, member_retention_rate, member_growth_rate,
                activities, services_offered, commodities_handled, certifications,
                performance_score, member_satisfaction_score, financial_health_score, governance_score,
                primary_phone, secondary_phone, email, website, social_media,
                is_active, is_recruiting, is_verified, verification_level, last_audit_date, next_audit_date,
                organic_certified, risk_level, compliance_issues, audit_history,
                technology_adoption_score, digital_literacy_level, innovation_index,
                market_integration_level, value_chain_position, export_capability,
                created_at, updated_at, created_by, updated_by,
                coordinates
            """.trimIndent())
        )

        // Apply filters dynamically
        query?.let { 
            queryBuilder = queryBuilder.textSearch("search_vector", it, config = "english")
        }
        
        county?.let { 
            queryBuilder = queryBuilder.eq("county", it) 
        }
        
        type?.let { 
            queryBuilder = queryBuilder.eq("type", it) 
        }
        
        verificationLevel?.let { 
            queryBuilder = queryBuilder.eq("verification_level", it) 
        }
        
        isRecruiting?.let { 
            queryBuilder = queryBuilder.eq("is_recruiting", it) 
        }
        
        minPerformanceScore?.let { 
            queryBuilder = queryBuilder.gte("performance_score", it) 
        }
        
        certifications?.let { certs ->
            if (certs.isNotEmpty()) {
                queryBuilder = queryBuilder.overlaps("certifications", certs)
            }
        }
        
        commodities?.let { comms ->
            if (comms.isNotEmpty()) {
                queryBuilder = queryBuilder.overlaps("commodities_handled", comms)
            }
        }

        // Spatial query for distance filtering
        if (maxDistance != null && userLocation != null) {
            queryBuilder = queryBuilder.rpc(
                "cooperatives_within_distance",
                mapOf(
                    "user_lat" to userLocation.latitude,
                    "user_lng" to userLocation.longitude,
                    "max_distance_km" to maxDistance
                )
            )
        }

        return queryBuilder
            .eq("is_active", true)
            .order("performance_score", Order.DESCENDING)
            .order("created_at", Order.DESCENDING)
            .limit(limit.toLong())
            .offset(offset.toLong())
            .decodeList<Cooperative>()
    }

    suspend fun getCooperativeById(id: String): Cooperative? {
        return postgrest.from("cooperatives")
            .select(columns = Columns.ALL)
            .eq("id", id)
            .decodeSingleOrNull<Cooperative>()
    }

    suspend fun createCooperative(cooperative: Cooperative): Cooperative {
        return postgrest.from("cooperatives")
            .insert(cooperative)
            .decodeSingle<Cooperative>()
    }

    suspend fun updateCooperative(cooperative: Cooperative): Cooperative {
        return postgrest.from("cooperatives")
            .update(cooperative)
            .eq("id", cooperative.id)
            .decodeSingle<Cooperative>()
    }

    // Advanced membership management
    suspend fun getUserMemberships(userId: String): List<CooperativeMembership> {
        return postgrest.from("cooperative_memberships")
            .select(columns = Columns.raw("""
                id, cooperative_id, member_id, membership_number, member_type, membership_status,
                join_date, probation_end_date, termination_date, termination_reason,
                shares_owned, share_value, total_contributions, outstanding_contributions,
                dividend_earned, loan_balance, roles, committee_memberships, leadership_positions,
                attendance_rate, participation_score, contribution_consistency, leadership_potential,
                last_meeting_attended, last_contribution_date, last_transaction_date,
                total_transactions, transaction_volume, reliability_score, collaboration_score,
                innovation_adoption, created_at, updated_at,
                cooperatives!inner(name, type, county, performance_score, verification_level)
            """.trimIndent()))
            .eq("member_id", userId)
            .eq("membership_status", "active")
            .order("join_date", Order.DESCENDING)
            .decodeList<CooperativeMembership>()
    }

    suspend fun getCooperativeMembers(
        cooperativeId: String,
        status: String? = null,
        role: String? = null
    ): List<CooperativeMembership> {
        var query = postgrest.from("cooperative_memberships")
            .select(columns = Columns.ALL)
            .eq("cooperative_id", cooperativeId)

        status?.let { query = query.eq("membership_status", it) }
        role?.let { query = query.contains("roles", listOf(it)) }

        return query
            .order("join_date", Order.ASCENDING)
            .decodeList<CooperativeMembership>()
    }

    // Application workflow management
    suspend fun submitApplication(application: CooperativeApplication): CooperativeApplication {
        return postgrest.from("cooperative_applications")
            .insert(application)
            .decodeSingle<CooperativeApplication>()
    }

    suspend fun getCooperativeApplications(
        cooperativeId: String,
        status: String? = null
    ): List<CooperativeApplication> {
        var query = postgrest.from("cooperative_applications")
            .select(columns = Columns.ALL)
            .eq("cooperative_id", cooperativeId)

        status?.let { query = query.eq("status", it) }

        return query
            .order("submitted_at", Order.DESCENDING)
            .decodeList<CooperativeApplication>()
    }

    suspend fun processApplication(
        applicationId: String,
        decision: String,
        reviewNotes: String? = null,
        conditions: List<String>? = null
    ): CooperativeApplication {
        val updateData = mutableMapOf<String, Any>(
            "status" to decision,
            "decision_made_at" to "now()",
            "workflow_stage" to if (decision == "approved") 5 else 4
        )

        reviewNotes?.let { updateData["review_notes"] = it }
        conditions?.let { updateData["conditions"] = it }

        return postgrest.from("cooperative_applications")
            .update(updateData)
            .eq("id", applicationId)
            .decodeSingle<CooperativeApplication>()
    }

    // Group formation management
    suspend fun createGroupFormation(group: GroupFormation): GroupFormation {
        return postgrest.from("group_formations")
            .insert(group)
            .decodeSingle<GroupFormation>()
    }

    suspend fun searchGroupFormations(
        query: String? = null,
        location: String? = null,
        type: String? = null,
        status: String? = null,
        limit: Int = 50
    ): List<GroupFormation> {
        var queryBuilder = postgrest.from("group_formations")
            .select(columns = Columns.ALL)

        query?.let { 
            queryBuilder = queryBuilder.or("title.ilike.%$it%,description.ilike.%$it%") 
        }
        
        location?.let { 
            queryBuilder = queryBuilder.ilike("target_location", "%$it%") 
        }
        
        type?.let { 
            queryBuilder = queryBuilder.eq("group_type", it) 
        }
        
        status?.let { 
            queryBuilder = queryBuilder.eq("formation_status", it) 
        }

        return queryBuilder
            .order("created_at", Order.DESCENDING)
            .limit(limit.toLong())
            .decodeList<GroupFormation>()
    }

    suspend fun expressGroupInterest(
        groupId: String,
        userId: String,
        message: String? = null
    ): Boolean {
        return try {
            // Add user to interested members array
            postgrest.from("group_formations")
                .rpc(
                    "add_interested_member",
                    mapOf(
                        "group_id" to groupId,
                        "user_id" to userId,
                        "interest_message" to message
                    )
                )
            true
        } catch (e: Exception) {
            false
        }
    }

    // Regulatory alerts with advanced filtering
    suspend fun searchRegulatoryAlerts(
        query: String? = null,
        category: String? = null,
        severity: String? = null,
        region: String? = null,
        status: String? = null,
        limit: Int = 50,
        offset: Int = 0
    ): List<RegulatoryAlert> {
        var queryBuilder = postgrest.from("regulatory_alerts")
            .select(columns = Columns.raw("""
                id, alert_code, title, category, subcategory, severity, urgency_level,
                description, detailed_impact, scientific_basis, regulatory_reference,
                affected_products, affected_regions, affected_counties, affected_value_chains,
                estimated_affected_farmers, economic_impact_estimate,
                source_organization, source_type, authority_level, verification_status,
                author_name, author_role, author_organization, is_verified_author,
                date_posted, effective_date, expiry_date, last_updated,
                action_required, compliance_deadline, grace_period_days,
                recommended_actions, alternative_solutions, mitigation_strategies,
                attachments, supporting_documents, evidence_links,
                views_count, likes_count, shares_count, comments_count,
                implementation_rate, compliance_rate, effectiveness_score,
                status, workflow_stage, review_status,
                created_at, updated_at
            """.trimIndent()))

        query?.let { 
            queryBuilder = queryBuilder.textSearch("search_vector", it, config = "english")
        }
        
        category?.let { 
            queryBuilder = queryBuilder.eq("category", it) 
        }
        
        severity?.let { 
            queryBuilder = queryBuilder.eq("severity", it) 
        }
        
        region?.let { 
            queryBuilder = queryBuilder.contains("affected_regions", listOf(it)) 
        }
        
        status?.let { 
            queryBuilder = queryBuilder.eq("status", it) 
        }

        return queryBuilder
            .eq("status", "active")
            .order("urgency_level", Order.DESCENDING)
            .order("date_posted", Order.DESCENDING)
            .limit(limit.toLong())
            .offset(offset.toLong())
            .decodeList<RegulatoryAlert>()
    }

    suspend fun createRegulatoryAlert(alert: RegulatoryAlert): RegulatoryAlert {
        return postgrest.from("regulatory_alerts")
            .insert(alert)
            .decodeSingle<RegulatoryAlert>()
    }

    suspend fun updateAlertEngagement(
        alertId: String,
        engagementType: String,
        userId: String
    ): Boolean {
        return try {
            // Insert or update engagement
            postgrest.from("alert_engagements")
                .upsert(
                    mapOf(
                        "alert_id" to alertId,
                        "user_id" to userId,
                        "engagement_type" to engagementType,
                        "engagement_data" to mapOf("timestamp" to "now()")
                    )
                )

            // Update alert counters
            when (engagementType) {
                "view" -> postgrest.from("regulatory_alerts")
                    .rpc("increment_views", mapOf("alert_id" to alertId))
                "like" -> postgrest.from("regulatory_alerts")
                    .rpc("increment_likes", mapOf("alert_id" to alertId))
                "share" -> postgrest.from("regulatory_alerts")
                    .rpc("increment_shares", mapOf("alert_id" to alertId))
            }
            
            true
        } catch (e: Exception) {
            false
        }
    }

    // Behavioral metrics and analytics
    suspend fun submitBehavioralMetric(metric: BehavioralMetric): BehavioralMetric {
        return postgrest.from("behavioral_metrics")
            .insert(metric)
            .decodeSingle<BehavioralMetric>()
    }

    suspend fun getBehavioralMetrics(
        playerId: String? = null,
        playerType: String? = null,
        reporterId: String? = null,
        limit: Int = 50
    ): List<BehavioralMetric> {
        var query = postgrest.from("behavioral_metrics")
            .select(columns = Columns.ALL)

        playerId?.let { query = query.eq("player_id", it) }
        playerType?.let { query = query.eq("player_type", it) }
        reporterId?.let { query = query.eq("reported_by", it) }

        return query
            .order("reporting_period_end", Order.DESCENDING)
            .limit(limit.toLong())
            .decodeList<BehavioralMetric>()
    }

    // Churn prediction and analytics
    suspend fun getChurnPredictions(
        playerType: String? = null,
        riskLevel: String? = null,
        limit: Int = 50
    ): List<ChurnPrediction> {
        var query = postgrest.from("churn_predictions")
            .select(columns = Columns.ALL)

        playerType?.let { query = query.eq("player_type", it) }
        riskLevel?.let { query = query.eq("risk_level", it) }

        return query
            .order("risk_score", Order.DESCENDING)
            .order("prediction_date", Order.DESCENDING)
            .limit(limit.toLong())
            .decodeList<ChurnPrediction>()
    }

    suspend fun updateChurnPrediction(prediction: ChurnPrediction): ChurnPrediction {
        return postgrest.from("churn_predictions")
            .update(prediction)
            .eq("id", prediction.id)
            .decodeSingle<ChurnPrediction>()
    }

    // Supply chain optimizations
    suspend fun getSupplyChainOptimizations(
        type: String? = null,
        status: String? = null,
        minRoi: Double? = null,
        limit: Int = 50
    ): List<SupplyChainOptimization> {
        var query = postgrest.from("supply_chain_optimizations")
            .select(columns = Columns.ALL)

        type?.let { query = query.eq("type", it) }
        status?.let { query = query.eq("status", it) }
        minRoi?.let { query = query.gte("roi_percentage", it) }

        return query
            .order("roi_percentage", Order.DESCENDING)
            .order("priority_score", Order.DESCENDING)
            .limit(limit.toLong())
            .decodeList<SupplyChainOptimization>()
    }

    suspend fun createOptimization(optimization: SupplyChainOptimization): SupplyChainOptimization {
        return postgrest.from("supply_chain_optimizations")
            .insert(optimization)
            .decodeSingle<SupplyChainOptimization>()
    }

    suspend fun updateOptimizationStatus(
        optimizationId: String,
        status: String,
        progressPercentage: Double? = null
    ): SupplyChainOptimization {
        val updateData = mutableMapOf<String, Any>("status" to status)
        progressPercentage?.let { updateData["progress_percentage"] = it }

        return postgrest.from("supply_chain_optimizations")
            .update(updateData)
            .eq("id", optimizationId)
            .decodeSingle<SupplyChainOptimization>()
    }

    // Relationship health monitoring
    suspend fun getRelationshipHealth(
        partnerId: String? = null,
        relationshipType: String? = null,
        minHealthScore: Double? = null,
        limit: Int = 50
    ): List<RelationshipHealth> {
        var query = postgrest.from("relationship_health")
            .select(columns = Columns.ALL)

        partnerId?.let { 
            query = query.or("partner_1_id.eq.$it,partner_2_id.eq.$it") 
        }
        
        relationshipType?.let { 
            query = query.eq("relationship_type", it) 
        }
        
        minHealthScore?.let { 
            query = query.gte("overall_health_score", it) 
        }

        return query
            .order("overall_health_score", Order.ASCENDING) // Show problematic relationships first
            .order("last_assessed", Order.DESCENDING)
            .limit(limit.toLong())
            .decodeList<RelationshipHealth>()
    }

    suspend fun updateRelationshipHealth(relationship: RelationshipHealth): RelationshipHealth {
        return postgrest.from("relationship_health")
            .update(relationship)
            .eq("id", relationship.id)
            .decodeSingle<RelationshipHealth>()
    }

    // Advanced analytics and recommendations
    suspend fun getCooperativeAnalytics(
        cooperativeId: String,
        period: String = "last_12_months"
    ): CooperativeAnalytics {
        return postgrest.rpc(
            "get_cooperative_analytics",
            mapOf(
                "cooperative_id" to cooperativeId,
                "analysis_period" to period
            )
        ).decodeSingle<CooperativeAnalytics>()
    }

    suspend fun getPerformanceBenchmarks(
        type: String,
        county: String? = null
    ): PerformanceBenchmarks {
        return postgrest.rpc(
            "get_performance_benchmarks",
            mapOf(
                "cooperative_type" to type,
                "target_county" to county
            )
        ).decodeSingle<PerformanceBenchmarks>()
    }

    suspend fun getCooperativeRecommendations(
        userId: String,
        limit: Int = 10
    ): List<CooperativeRecommendation> {
        return postgrest.rpc(
            "get_cooperative_recommendations",
            mapOf(
                "user_id" to userId,
                "recommendation_limit" to limit
            )
        ).decodeList<CooperativeRecommendation>()
    }

    // Real-time subscriptions
    fun subscribeToCooperativeUpdates(cooperativeId: String): Flow<Cooperative> = flow {
        val channel = realtime.createChannel("cooperative_updates")
        
        channel.postgresChanges(
            schema = "public",
            table = "cooperatives",
            filter = "id=eq.$cooperativeId"
        ) { payload ->
            // Emit updated cooperative data
            payload.decodeRecord<Cooperative>()?.let { emit(it) }
        }
        
        channel.subscribe()
    }

    fun subscribeToAlertUpdates(): Flow<RegulatoryAlert> = flow {
        val channel = realtime.createChannel("alert_updates")
        
        channel.postgresChanges(
            schema = "public",
            table = "regulatory_alerts",
            filter = "status=eq.active"
        ) { payload ->
            payload.decodeRecord<RegulatoryAlert>()?.let { emit(it) }
        }
        
        channel.subscribe()
    }

    // File upload for documents and attachments
    suspend fun uploadDocument(
        bucket: String,
        path: String,
        file: ByteArray,
        contentType: String = "application/pdf"
    ): String {
        storage.from(bucket).upload(path, file) {
            this.contentType = contentType
        }
        
        return storage.from(bucket).publicUrl(path)
    }

    suspend fun deleteDocument(bucket: String, path: String): Boolean {
        return try {
            storage.from(bucket).delete(path)
            true
        } catch (e: Exception) {
            false
        }
    }
}
