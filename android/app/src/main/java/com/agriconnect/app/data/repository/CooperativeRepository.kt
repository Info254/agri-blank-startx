package com.agriconnect.app.data.repository

import com.agriconnect.app.data.model.*
import com.agriconnect.app.data.remote.SupabaseClient
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.catch
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class CooperativeRepository @Inject constructor(
    private val supabaseClient: SupabaseClient
) {
    
    // Advanced cooperative search with multiple filters
    suspend fun searchCooperatives(
        query: String? = null,
        county: String? = null,
        type: CooperativeType? = null,
        verificationLevel: VerificationLevel? = null,
        isRecruiting: Boolean? = null,
        minPerformanceScore: Double? = null,
        maxDistance: Double? = null,
        userLocation: Coordinates? = null,
        certifications: List<String>? = null,
        commodities: List<String>? = null,
        limit: Int = 50,
        offset: Int = 0
    ): Flow<Result<List<Cooperative>>> = flow {
        try {
            val cooperatives = supabaseClient.searchCooperatives(
                query = query,
                county = county,
                type = type?.name?.lowercase(),
                verificationLevel = verificationLevel?.name?.lowercase(),
                isRecruiting = isRecruiting,
                minPerformanceScore = minPerformanceScore,
                maxDistance = maxDistance,
                userLocation = userLocation,
                certifications = certifications,
                commodities = commodities,
                limit = limit,
                offset = offset
            )
            emit(Result.success(cooperatives))
        } catch (e: Exception) {
            emit(Result.failure(e))
        }
    }.catch { e ->
        emit(Result.failure(e))
    }
    
    // Get cooperative by ID with full details
    suspend fun getCooperativeById(id: String): Flow<Result<Cooperative?>> = flow {
        try {
            val cooperative = supabaseClient.getCooperativeById(id)
            emit(Result.success(cooperative))
        } catch (e: Exception) {
            emit(Result.failure(e))
        }
    }
    
    // Register new cooperative with validation
    suspend fun registerCooperative(cooperative: Cooperative): Flow<Result<Cooperative>> = flow {
        try {
            // Validate cooperative data
            validateCooperativeData(cooperative)
            
            val registeredCooperative = supabaseClient.createCooperative(cooperative)
            emit(Result.success(registeredCooperative))
        } catch (e: Exception) {
            emit(Result.failure(e))
        }
    }
    
    // Update cooperative information
    suspend fun updateCooperative(cooperative: Cooperative): Flow<Result<Cooperative>> = flow {
        try {
            validateCooperativeData(cooperative)
            
            val updatedCooperative = supabaseClient.updateCooperative(cooperative)
            emit(Result.success(updatedCooperative))
        } catch (e: Exception) {
            emit(Result.failure(e))
        }
    }
    
    // Get cooperative memberships for a user
    suspend fun getUserMemberships(userId: String): Flow<Result<List<CooperativeMembership>>> = flow {
        try {
            val memberships = supabaseClient.getUserMemberships(userId)
            emit(Result.success(memberships))
        } catch (e: Exception) {
            emit(Result.failure(e))
        }
    }
    
    // Get cooperative members
    suspend fun getCooperativeMembers(
        cooperativeId: String,
        status: MembershipStatus? = null,
        role: MemberRole? = null
    ): Flow<Result<List<CooperativeMembership>>> = flow {
        try {
            val members = supabaseClient.getCooperativeMembers(
                cooperativeId = cooperativeId,
                status = status?.name?.lowercase(),
                role = role?.name?.lowercase()
            )
            emit(Result.success(members))
        } catch (e: Exception) {
            emit(Result.failure(e))
        }
    }
    
    // Submit membership application
    suspend fun submitMembershipApplication(
        application: CooperativeApplication
    ): Flow<Result<CooperativeApplication>> = flow {
        try {
            validateApplicationData(application)
            
            val submittedApplication = supabaseClient.submitApplication(application)
            emit(Result.success(submittedApplication))
        } catch (e: Exception) {
            emit(Result.failure(e))
        }
    }
    
    // Get applications for a cooperative
    suspend fun getCooperativeApplications(
        cooperativeId: String,
        status: ApplicationStatus? = null
    ): Flow<Result<List<CooperativeApplication>>> = flow {
        try {
            val applications = supabaseClient.getCooperativeApplications(
                cooperativeId = cooperativeId,
                status = status?.name?.lowercase()
            )
            emit(Result.success(applications))
        } catch (e: Exception) {
            emit(Result.failure(e))
        }
    }
    
    // Process application (approve/reject)
    suspend fun processApplication(
        applicationId: String,
        decision: ApplicationStatus,
        reviewNotes: String? = null,
        conditions: List<String>? = null
    ): Flow<Result<CooperativeApplication>> = flow {
        try {
            val processedApplication = supabaseClient.processApplication(
                applicationId = applicationId,
                decision = decision.name.lowercase(),
                reviewNotes = reviewNotes,
                conditions = conditions
            )
            emit(Result.success(processedApplication))
        } catch (e: Exception) {
            emit(Result.failure(e))
        }
    }
    
    // Group formation operations
    suspend fun createGroupFormation(group: GroupFormation): Flow<Result<GroupFormation>> = flow {
        try {
            validateGroupFormationData(group)
            
            val createdGroup = supabaseClient.createGroupFormation(group)
            emit(Result.success(createdGroup))
        } catch (e: Exception) {
            emit(Result.failure(e))
        }
    }
    
    suspend fun searchGroupFormations(
        query: String? = null,
        location: String? = null,
        type: GroupType? = null,
        status: GroupFormationStatus? = null,
        limit: Int = 50
    ): Flow<Result<List<GroupFormation>>> = flow {
        try {
            val groups = supabaseClient.searchGroupFormations(
                query = query,
                location = location,
                type = type?.name?.lowercase(),
                status = status?.name?.lowercase(),
                limit = limit
            )
            emit(Result.success(groups))
        } catch (e: Exception) {
            emit(Result.failure(e))
        }
    }
    
    suspend fun expressInterestInGroup(
        groupId: String,
        userId: String,
        message: String? = null
    ): Flow<Result<Boolean>> = flow {
        try {
            val success = supabaseClient.expressGroupInterest(
                groupId = groupId,
                userId = userId,
                message = message
            )
            emit(Result.success(success))
        } catch (e: Exception) {
            emit(Result.failure(e))
        }
    }
    
    // Advanced analytics and insights
    suspend fun getCooperativeAnalytics(
        cooperativeId: String,
        period: String = "last_12_months"
    ): Flow<Result<CooperativeAnalytics>> = flow {
        try {
            val analytics = supabaseClient.getCooperativeAnalytics(cooperativeId, period)
            emit(Result.success(analytics))
        } catch (e: Exception) {
            emit(Result.failure(e))
        }
    }
    
    suspend fun getPerformanceBenchmarks(
        type: CooperativeType,
        county: String? = null
    ): Flow<Result<PerformanceBenchmarks>> = flow {
        try {
            val benchmarks = supabaseClient.getPerformanceBenchmarks(
                type = type.name.lowercase(),
                county = county
            )
            emit(Result.success(benchmarks))
        } catch (e: Exception) {
            emit(Result.failure(e))
        }
    }
    
    // Recommendation engine
    suspend fun getRecommendedCooperatives(
        userId: String,
        limit: Int = 10
    ): Flow<Result<List<CooperativeRecommendation>>> = flow {
        try {
            val recommendations = supabaseClient.getCooperativeRecommendations(userId, limit)
            emit(Result.success(recommendations))
        } catch (e: Exception) {
            emit(Result.failure(e))
        }
    }
    
    // Validation functions
    private fun validateCooperativeData(cooperative: Cooperative) {
        require(cooperative.name.isNotBlank()) { "Cooperative name cannot be blank" }
        require(cooperative.registrationNumber.isNotBlank()) { "Registration number is required" }
        require(cooperative.minimumShareValue > 0) { "Minimum share value must be positive" }
        require(cooperative.joiningFee >= 0) { "Joining fee cannot be negative" }
        require(cooperative.contactInfo.primaryPhone.isNotBlank()) { "Primary phone is required" }
        require(cooperative.contactInfo.email.contains("@")) { "Valid email is required" }
        
        // Validate leadership structure
        require(cooperative.leadership.chairperson.name.isNotBlank()) { "Chairperson name is required" }
        require(cooperative.leadership.secretary.name.isNotBlank()) { "Secretary name is required" }
        require(cooperative.leadership.treasurer.name.isNotBlank()) { "Treasurer name is required" }
        
        // Validate location
        require(cooperative.location.county.isNotBlank()) { "County is required" }
        require(cooperative.location.subcounty.isNotBlank()) { "Subcounty is required" }
        require(cooperative.location.ward.isNotBlank()) { "Ward is required" }
    }
    
    private fun validateApplicationData(application: CooperativeApplication) {
        require(application.cooperativeId.isNotBlank()) { "Cooperative ID is required" }
        require(application.applicantId.isNotBlank()) { "Applicant ID is required" }
        require(application.applicantName.isNotBlank()) { "Applicant name is required" }
    }
    
    private fun validateGroupFormationData(group: GroupFormation) {
        require(group.title.isNotBlank()) { "Group title is required" }
        require(group.description.isNotBlank()) { "Group description is required" }
        require(group.targetMembers > 0) { "Target members must be positive" }
        require(group.targetLocation.isNotBlank()) { "Target location is required" }
    }
}

// Supporting data classes for analytics
data class CooperativeAnalytics(
    val membershipGrowth: List<MonthlyMetric>,
    val financialPerformance: FinancialMetrics,
    val operationalMetrics: OperationalMetrics,
    val memberSatisfactionTrends: List<SatisfactionMetric>,
    val marketPerformance: MarketMetrics,
    val benchmarkComparison: BenchmarkComparison
)

data class MonthlyMetric(
    val month: String,
    val value: Double,
    val change: Double
)

data class FinancialMetrics(
    val totalRevenue: Double,
    val totalExpenses: Double,
    val netIncome: Double,
    val profitMargin: Double,
    val memberContributions: Double,
    val shareCapital: Double,
    val returnOnAssets: Double
)

data class OperationalMetrics(
    val activeProjects: Int,
    val completedProjects: Int,
    val projectSuccessRate: Double,
    val memberEngagementRate: Double,
    val meetingAttendanceRate: Double,
    val serviceUtilizationRate: Double
)

data class SatisfactionMetric(
    val period: String,
    val overallSatisfaction: Double,
    val serviceQuality: Double,
    val leadership: Double,
    val communication: Double,
    val benefits: Double
)

data class MarketMetrics(
    val marketShare: Double,
    val customerRetentionRate: Double,
    val newCustomerAcquisition: Int,
    val averageTransactionValue: Double,
    val salesGrowthRate: Double
)

data class BenchmarkComparison(
    val performanceRanking: Int,
    val totalCooperatives: Int,
    val percentile: Double,
    val strengthAreas: List<String>,
    val improvementAreas: List<String>
)

data class PerformanceBenchmarks(
    val averagePerformanceScore: Double,
    val topPerformers: List<CooperativeBenchmark>,
    val industryAverages: Map<String, Double>,
    val regionalComparison: Map<String, Double>
)

data class CooperativeBenchmark(
    val name: String,
    val performanceScore: Double,
    val keySuccessFactors: List<String>
)

data class CooperativeRecommendation(
    val cooperative: Cooperative,
    val matchScore: Double,
    val matchReasons: List<String>,
    val potentialBenefits: List<String>
)
