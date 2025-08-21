package com.agriconnect.app.data.repository

import com.agriconnect.app.data.model.*
import com.agriconnect.app.data.remote.SupabaseClient
import io.github.jan.supabase.postgrest.from
import io.github.jan.supabase.postgrest.query.Columns
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ExportRepository @Inject constructor(
    private val supabaseClient: SupabaseClient
) {
    
    // Export Opportunities
    suspend fun getExportOpportunities(filters: ExportFilters? = null): Flow<List<ExportOpportunity>> = flow {
        try {
            var query = supabaseClient.client.from("export_opportunities")
                .select(
                    columns = Columns.raw("""
                        *,
                        exporter_profiles!inner(*)
                    """)
                ) {
                    eq("verification_status", "verified")
                    eq("status", "active")
                }

            filters?.let { filter ->
                filter.commodity?.let { query = query.eq("commodity", it) }
                filter.destinationCountry?.let { query = query.eq("destination_country", it) }
                filter.minVolume?.let { query = query.gte("volume_required", it) }
                filter.maxVolume?.let { query = query.lte("volume_required", it) }
                filter.minPrice?.let { query = query.gte("price_per_unit", it) }
                filter.maxPrice?.let { query = query.lte("price_per_unit", it) }
                filter.deadlineFrom?.let { query = query.gte("deadline", it) }
                filter.deadlineTo?.let { query = query.lte("deadline", it) }
            }

            val opportunities = query.decodeList<ExportOpportunity>()
            emit(opportunities)
        } catch (e: Exception) {
            emit(emptyList())
        }
    }

    suspend fun getExportOpportunityById(id: String): ExportOpportunity? {
        return try {
            supabaseClient.client.from("export_opportunities")
                .select(
                    columns = Columns.raw("""
                        *,
                        exporter_profiles!inner(*)
                    """)
                ) {
                    eq("id", id)
                }.decodeSingle<ExportOpportunity>()
        } catch (e: Exception) {
            null
        }
    }

    suspend fun createExportOpportunity(opportunity: ExportOpportunity): Result<ExportOpportunity> {
        return try {
            val created = supabaseClient.client.from("export_opportunities")
                .insert(opportunity)
                .decodeSingle<ExportOpportunity>()
            Result.success(created)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun updateExportOpportunity(id: String, updates: Map<String, Any>): Result<ExportOpportunity> {
        return try {
            val updated = supabaseClient.client.from("export_opportunities")
                .update(updates) {
                    eq("id", id)
                }.decodeSingle<ExportOpportunity>()
            Result.success(updated)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    // Farmer Verification
    suspend fun verifyExportOpportunity(
        opportunityId: String,
        farmerId: String,
        verificationType: VerificationType,
        decision: VerificationDecision,
        comments: String? = null
    ): Result<Boolean> {
        return try {
            // Create verification record
            val verification = ExportVerification(
                id = "",
                opportunityId = opportunityId,
                verifierId = farmerId,
                verificationType = verificationType,
                status = decision,
                comments = comments,
                createdAt = ""
            )
            
            supabaseClient.client.from("export_verifications")
                .insert(verification)

            // Update opportunity with farmer verifier
            val opportunity = getExportOpportunityById(opportunityId)
            opportunity?.let { opp ->
                val updates = when {
                    opp.farmerVerifier1 == null -> mapOf("farmer_verifier_1" to farmerId, "verification_date_1" to System.currentTimeMillis().toString())
                    opp.farmerVerifier2 == null && opp.farmerVerifier1 != farmerId -> mapOf("farmer_verifier_2" to farmerId, "verification_date_2" to System.currentTimeMillis().toString())
                    else -> emptyMap()
                }
                
                if (updates.isNotEmpty()) {
                    updateExportOpportunity(opportunityId, updates)
                }
            }

            Result.success(true)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    // Export Applications
    suspend fun getMyExportApplications(farmerId: String): Flow<List<ExportApplication>> = flow {
        try {
            val applications = supabaseClient.client.from("export_applications")
                .select(
                    columns = Columns.raw("""
                        *,
                        export_opportunities!inner(*),
                        export_workflow_status(*),
                        export_document_links(*)
                    """)
                ) {
                    eq("farmer_id", farmerId)
                }.decodeList<ExportApplication>()
            emit(applications)
        } catch (e: Exception) {
            emit(emptyList())
        }
    }

    suspend fun createExportApplication(application: ExportApplication): Result<ExportApplication> {
        return try {
            val created = supabaseClient.client.from("export_applications")
                .insert(application)
                .decodeSingle<ExportApplication>()
            Result.success(created)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun updateApplicationStatus(
        applicationId: String, 
        status: ApplicationStatus,
        exporterNotes: String? = null
    ): Result<Boolean> {
        return try {
            val updates = mutableMapOf<String, Any>("status" to status.name.lowercase())
            exporterNotes?.let { updates["exporter_notes"] = it }
            
            supabaseClient.client.from("export_applications")
                .update(updates) {
                    eq("id", applicationId)
                }
            Result.success(true)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    // Document Management
    suspend fun addDocumentLink(documentLink: ExportDocumentLink): Result<ExportDocumentLink> {
        return try {
            val created = supabaseClient.client.from("export_document_links")
                .insert(documentLink)
                .decodeSingle<ExportDocumentLink>()
            Result.success(created)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getApplicationDocuments(applicationId: String): Flow<List<ExportDocumentLink>> = flow {
        try {
            val documents = supabaseClient.client.from("export_document_links")
                .select {
                    eq("application_id", applicationId)
                }.decodeList<ExportDocumentLink>()
            emit(documents)
        } catch (e: Exception) {
            emit(emptyList())
        }
    }

    // Workflow Management
    suspend fun updateWorkflowStage(
        applicationId: String,
        stage: WorkflowStage,
        status: WorkflowStatus,
        notes: String? = null
    ): Result<Boolean> {
        return try {
            val updates = mapOf(
                "status" to status.name.lowercase(),
                "notes" to notes,
                "completed_at" to if (status == WorkflowStatus.COMPLETED) System.currentTimeMillis().toString() else null
            ).filterValues { it != null }

            supabaseClient.client.from("export_workflow_status")
                .update(updates) {
                    eq("application_id", applicationId)
                    eq("stage", stage.name.lowercase())
                }
            Result.success(true)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getWorkflowStatus(applicationId: String): Flow<List<ExportWorkflowStatus>> = flow {
        try {
            val stages = supabaseClient.client.from("export_workflow_status")
                .select {
                    eq("application_id", applicationId)
                    order("stage")
                }.decodeList<ExportWorkflowStatus>()
            emit(stages)
        } catch (e: Exception) {
            emit(emptyList())
        }
    }

    // Exporter Profile Management
    suspend fun getExporterProfile(userId: String): ExporterProfile? {
        return try {
            supabaseClient.client.from("exporter_profiles")
                .select {
                    eq("user_id", userId)
                }.decodeSingle<ExporterProfile>()
        } catch (e: Exception) {
            null
        }
    }

    suspend fun createExporterProfile(profile: ExporterProfile): Result<ExporterProfile> {
        return try {
            val created = supabaseClient.client.from("exporter_profiles")
                .insert(profile)
                .decodeSingle<ExporterProfile>()
            Result.success(created)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun updateExporterProfile(userId: String, updates: Map<String, Any>): Result<ExporterProfile> {
        return try {
            val updated = supabaseClient.client.from("exporter_profiles")
                .update(updates) {
                    eq("user_id", userId)
                }.decodeSingle<ExporterProfile>()
            Result.success(updated)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    // Search and Filter
    suspend fun searchExportOpportunities(query: String): Flow<List<ExportOpportunity>> = flow {
        try {
            val opportunities = supabaseClient.client.from("export_opportunities")
                .select(
                    columns = Columns.raw("""
                        *,
                        exporter_profiles!inner(*)
                    """)
                ) {
                    eq("verification_status", "verified")
                    eq("status", "active")
                    or {
                        ilike("title", "%$query%")
                        ilike("commodity", "%$query%")
                        ilike("destination_country", "%$query%")
                        ilike("description", "%$query%")
                    }
                }.decodeList<ExportOpportunity>()
            emit(opportunities)
        } catch (e: Exception) {
            emit(emptyList())
        }
    }

    // Statistics
    suspend fun getExportStats(userId: String): Map<String, Int> {
        return try {
            val applications = supabaseClient.client.from("export_applications")
                .select {
                    eq("farmer_id", userId)
                }.decodeList<ExportApplication>()

            mapOf(
                "total_applications" to applications.size,
                "accepted_applications" to applications.count { it.status == ApplicationStatus.ACCEPTED },
                "pending_applications" to applications.count { it.status == ApplicationStatus.SUBMITTED },
                "under_review" to applications.count { it.status == ApplicationStatus.UNDER_REVIEW }
            )
        } catch (e: Exception) {
            emptyMap()
        }
    }
}
