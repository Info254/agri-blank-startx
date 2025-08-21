package com.agriconnect.app.data.repository

import com.agriconnect.app.data.model.*
import com.agriconnect.app.viewmodel.CreateExportApplicationData
import com.agriconnect.app.viewmodel.CreateExportOpportunityData
import com.agriconnect.app.viewmodel.ExportDocumentUploadData
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.postgrest.from
import io.github.jan.supabase.postgrest.query.Columns
import io.github.jan.supabase.realtime.postgresChangeFlow
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ExportOpportunitiesRepository @Inject constructor(
    private val supabaseClient: SupabaseClient
) {

    // Export Opportunities Operations
    fun getExportOpportunities(filters: ExportFilters): Flow<Result<List<ExportOpportunity>>> = flow {
        emit(Result.Loading)
        try {
            val query = supabaseClient.from("export_opportunities")
                .select(
                    columns = Columns.raw("""
                        *,
                        exporter_profile:exporter_profiles(*)
                    """.trimIndent())
                )
                .eq("status", ExportStatus.ACTIVE.name.lowercase())
                .eq("verification_status", VerificationStatus.VERIFIED.name.lowercase())
                .order("created_at", ascending = false)

            // Apply filters
            filters.commodity?.let { commodity ->
                query.ilike("commodity", "%$commodity%")
            }
            filters.destinationCountry?.let { country ->
                query.eq("destination_country", country)
            }
            filters.minVolume?.let { minVol ->
                query.gte("volume_required", minVol)
            }
            filters.maxVolume?.let { maxVol ->
                query.lte("volume_required", maxVol)
            }
            filters.minPrice?.let { minPrice ->
                query.gte("price_per_unit", minPrice)
            }
            filters.maxPrice?.let { maxPrice ->
                query.lte("price_per_unit", maxPrice)
            }
            if (filters.certificationRequirements.isNotEmpty()) {
                query.contains("certification_requirements", filters.certificationRequirements)
            }
            filters.shippingTerms?.let { terms ->
                query.eq("shipping_terms", terms)
            }
            filters.deadlineFrom?.let { fromDate ->
                query.gte("deadline", fromDate)
            }
            filters.deadlineTo?.let { toDate ->
                query.lte("deadline", toDate)
            }
            filters.verificationStatus?.let { status ->
                query.eq("verification_status", status.name.lowercase())
            }

            query.postgresChangeFlow<ExportOpportunity>(primaryKey = ExportOpportunity::id)
                .map { changes -> 
                    Result.Success(changes.map { it.record })
                }.collect { emit(it) }
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }

    fun searchExportOpportunities(query: String, filters: ExportFilters): Flow<Result<List<ExportOpportunity>>> = flow {
        emit(Result.Loading)
        try {
            val searchQuery = supabaseClient.from("export_opportunities")
                .select(
                    columns = Columns.raw("""
                        *,
                        exporter_profile:exporter_profiles(*)
                    """.trimIndent())
                )
                .eq("status", ExportStatus.ACTIVE.name.lowercase())
                .or {
                    ilike("title", "%$query%")
                    ilike("commodity", "%$query%")
                    ilike("destination_country", "%$query%")
                    ilike("description", "%$query%")
                    contains("quality_requirements", listOf(query))
                    contains("certification_requirements", listOf(query))
                }

            val opportunities = searchQuery.decode<List<ExportOpportunity>>()
            emit(Result.Success(opportunities))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }

    suspend fun getExportOpportunity(opportunityId: String): ExportOpportunity? {
        return try {
            supabaseClient.from("export_opportunities")
                .select(
                    columns = Columns.raw("""
                        *,
                        exporter_profile:exporter_profiles(*)
                    """.trimIndent())
                )
                .eq("id", opportunityId)
                .decodeSingleOrNull<ExportOpportunity>()
        } catch (e: Exception) {
            null
        }
    }

    suspend fun getFeaturedOpportunities(limit: Int = 10): List<ExportOpportunity> {
        return try {
            supabaseClient.from("export_opportunities")
                .select(
                    columns = Columns.raw("""
                        *,
                        exporter_profile:exporter_profiles(*)
                    """.trimIndent())
                )
                .eq("status", ExportStatus.ACTIVE.name.lowercase())
                .eq("verification_status", VerificationStatus.VERIFIED.name.lowercase())
                .order("created_at", ascending = false)
                .limit(limit)
                .decode<List<ExportOpportunity>>()
        } catch (e: Exception) {
            emptyList()
        }
    }

    suspend fun createExportOpportunity(exporterId: String, opportunityData: CreateExportOpportunityData): Result<ExportOpportunity> {
        return try {
            val opportunity = supabaseClient.from("export_opportunities")
                .insert(
                    mapOf(
                        "exporter_id" to exporterId,
                        "title" to opportunityData.title,
                        "commodity" to opportunityData.commodity,
                        "destination_country" to opportunityData.destinationCountry,
                        "destination_city" to opportunityData.destinationCity,
                        "volume_required" to opportunityData.volumeRequired,
                        "unit" to opportunityData.unit,
                        "price_per_unit" to opportunityData.pricePerUnit,
                        "currency" to opportunityData.currency,
                        "quality_requirements" to opportunityData.qualityRequirements,
                        "certification_requirements" to opportunityData.certificationRequirements,
                        "shipping_terms" to opportunityData.shippingTerms,
                        "payment_terms" to opportunityData.paymentTerms,
                        "deadline" to opportunityData.deadline,
                        "description" to opportunityData.description
                    )
                )
                .select()
                .decodeSingle<ExportOpportunity>()

            Result.Success(opportunity)
        } catch (e: Exception) {
            Result.Error(e)
        }
    }

    suspend fun bookmarkOpportunity(opportunityId: String, userId: String): Result<Unit> {
        return try {
            supabaseClient.from("export_bookmarks")
                .insert(
                    mapOf(
                        "user_id" to userId,
                        "opportunity_id" to opportunityId
                    )
                )

            Result.Success(Unit)
        } catch (e: Exception) {
            Result.Error(e)
        }
    }

    // Export Applications Operations
    suspend fun createExportApplication(opportunityId: String, applicationData: CreateExportApplicationData): Result<ExportApplication> {
        return try {
            val application = supabaseClient.from("export_applications")
                .insert(
                    mapOf(
                        "opportunity_id" to opportunityId,
                        "farmer_id" to applicationData.farmerId,
                        "proposed_volume" to applicationData.proposedVolume,
                        "proposed_price" to applicationData.proposedPrice,
                        "delivery_timeline" to applicationData.deliveryTimeline,
                        "quality_certifications" to applicationData.qualityCertifications,
                        "sample_images" to applicationData.sampleImages,
                        "cover_letter" to applicationData.coverLetter
                    )
                )
                .select(
                    columns = Columns.raw("""
                        *,
                        opportunity:export_opportunities(*)
                    """.trimIndent())
                )
                .decodeSingle<ExportApplication>()

            // Create initial workflow stage
            supabaseClient.from("export_workflow_status")
                .insert(
                    mapOf(
                        "application_id" to application.id,
                        "stage" to WorkflowStage.INQUIRY.name.lowercase(),
                        "status" to WorkflowStatus.PENDING.name.lowercase(),
                        "started_at" to "now()"
                    )
                )

            Result.Success(application)
        } catch (e: Exception) {
            Result.Error(e)
        }
    }

    fun getUserExportApplications(userId: String): Flow<Result<List<ExportApplication>>> = flow {
        emit(Result.Loading)
        try {
            supabaseClient.from("export_applications")
                .select(
                    columns = Columns.raw("""
                        *,
                        opportunity:export_opportunities(*),
                        workflow_stages:export_workflow_status(*),
                        documents:export_document_links(*)
                    """.trimIndent())
                )
                .eq("farmer_id", userId)
                .order("created_at", ascending = false)
                .postgresChangeFlow<ExportApplication>(primaryKey = ExportApplication::id)
                .map { changes -> 
                    Result.Success(changes.map { it.record })
                }.collect { emit(it) }
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }

    suspend fun getExportApplication(applicationId: String): ExportApplication? {
        return try {
            supabaseClient.from("export_applications")
                .select(
                    columns = Columns.raw("""
                        *,
                        opportunity:export_opportunities(*),
                        workflow_stages:export_workflow_status(*),
                        documents:export_document_links(*)
                    """.trimIndent())
                )
                .eq("id", applicationId)
                .decodeSingleOrNull<ExportApplication>()
        } catch (e: Exception) {
            null
        }
    }

    suspend fun updateApplicationStatus(applicationId: String, status: ApplicationStatus): Result<Unit> {
        return try {
            supabaseClient.from("export_applications")
                .update(
                    mapOf(
                        "status" to status.name.lowercase(),
                        "updated_at" to "now()"
                    )
                ) {
                    filter {
                        eq("id", applicationId)
                    }
                }

            Result.Success(Unit)
        } catch (e: Exception) {
            Result.Error(e)
        }
    }

    // Workflow Operations
    suspend fun getApplicationWorkflowStages(applicationId: String): List<ExportWorkflowStatus> {
        return try {
            supabaseClient.from("export_workflow_status")
                .select()
                .eq("application_id", applicationId)
                .order("started_at", ascending = true)
                .decode<List<ExportWorkflowStatus>>()
        } catch (e: Exception) {
            emptyList()
        }
    }

    suspend fun updateWorkflowStage(applicationId: String, stage: WorkflowStage, status: WorkflowStatus, notes: String?): Result<Unit> {
        return try {
            val updates = mutableMapOf<String, Any?>(
                "status" to status.name.lowercase(),
                "notes" to notes
            )
            
            if (status == WorkflowStatus.COMPLETED) {
                updates["completed_at"] = "now()"
            }

            supabaseClient.from("export_workflow_status")
                .update(updates) {
                    filter {
                        eq("application_id", applicationId)
                        eq("stage", stage.name.lowercase())
                    }
                }

            Result.Success(Unit)
        } catch (e: Exception) {
            Result.Error(e)
        }
    }

    // Document Operations
    suspend fun getApplicationDocuments(applicationId: String): List<ExportDocumentLink> {
        return try {
            supabaseClient.from("export_document_links")
                .select()
                .eq("application_id", applicationId)
                .order("created_at", ascending = false)
                .decode<List<ExportDocumentLink>>()
        } catch (e: Exception) {
            emptyList()
        }
    }

    suspend fun uploadApplicationDocument(applicationId: String, documentData: ExportDocumentUploadData): Result<ExportDocumentLink> {
        return try {
            val document = supabaseClient.from("export_document_links")
                .insert(
                    mapOf(
                        "application_id" to applicationId,
                        "document_type" to documentData.documentType,
                        "document_name" to documentData.documentName,
                        "external_url" to documentData.externalUrl,
                        "uploaded_by" to documentData.uploadedBy
                    )
                )
                .select()
                .decodeSingle<ExportDocumentLink>()

            Result.Success(document)
        } catch (e: Exception) {
            Result.Error(e)
        }
    }

    // Exporter Profile Operations
    suspend fun getExporterProfile(exporterId: String): ExporterProfile? {
        return try {
            supabaseClient.from("exporter_profiles")
                .select()
                .eq("id", exporterId)
                .decodeSingleOrNull<ExporterProfile>()
        } catch (e: Exception) {
            null
        }
    }

    suspend fun updateExporterProfile(exporterId: String, updates: Map<String, Any>): Result<ExporterProfile> {
        return try {
            val profile = supabaseClient.from("exporter_profiles")
                .update(updates) {
                    filter {
                        eq("id", exporterId)
                    }
                }
                .select()
                .decodeSingle<ExporterProfile>()

            Result.Success(profile)
        } catch (e: Exception) {
            Result.Error(e)
        }
    }

    suspend fun getExporterOpportunities(exporterId: String): List<ExportOpportunity> {
        return try {
            supabaseClient.from("export_opportunities")
                .select()
                .eq("exporter_id", exporterId)
                .order("created_at", ascending = false)
                .decode<List<ExportOpportunity>>()
        } catch (e: Exception) {
            emptyList()
        }
    }

    // Verification Operations
    suspend fun getExporterVerifications(exporterId: String): List<ExportVerification> {
        return try {
            supabaseClient.from("export_verifications")
                .select()
                .eq("opportunity_id", exporterId) // This might need adjustment based on your schema
                .order("created_at", ascending = false)
                .decode<List<ExportVerification>>()
        } catch (e: Exception) {
            emptyList()
        }
    }

    suspend fun requestExporterVerification(exporterId: String, verificationType: VerificationType, evidence: List<String>): Result<Unit> {
        return try {
            supabaseClient.from("export_verifications")
                .insert(
                    mapOf(
                        "opportunity_id" to exporterId, // This might need adjustment
                        "verifier_id" to exporterId,
                        "verification_type" to verificationType.name.lowercase(),
                        "status" to VerificationDecision.NEEDS_INFO.name.lowercase(),
                        "evidence_links" to evidence
                    )
                )

            Result.Success(Unit)
        } catch (e: Exception) {
            Result.Error(e)
        }
    }

    // Analytics and Statistics
    suspend fun getExportStatistics(exporterId: String): Map<String, Int> {
        return try {
            val result = supabaseClient.from("rpc")
                .rpc("get_exporter_statistics", mapOf("exporter_id" to exporterId))
                .decode<Map<String, Int>>()

            result
        } catch (e: Exception) {
            emptyMap()
        }
    }

    suspend fun getMarketTrends(commodity: String, country: String): List<Map<String, Any>> {
        return try {
            supabaseClient.from("market_trends")
                .select()
                .eq("commodity", commodity)
                .eq("country", country)
                .order("date", ascending = false)
                .limit(30)
                .decode<List<Map<String, Any>>>()
        } catch (e: Exception) {
            emptyList()
        }
    }
}
