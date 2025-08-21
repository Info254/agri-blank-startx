package com.agriconnect.app.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.TypeConverter
import androidx.room.TypeConverters
import androidx.room.Index
import androidx.room.ForeignKey
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.util.Date

@Entity(
    tableName = "cooperatives",
    indices = [
        Index(value = ["type"]),
        Index(value = ["registrationStatus", "isActive"]),
        Index(value = ["verificationLevel", "isVerified"]),
        Index(value = ["performanceScore"], orders = [Index.Order.DESC]),
        Index(value = ["county", "subcounty"])
    ]
)
@TypeConverters(CooperativeConverters::class)
data class Cooperative(
    @PrimaryKey
    val id: String,
    val name: String,
    val registrationNumber: String,
    val type: CooperativeType,
    val description: String,
    val missionStatement: String?,
    val visionStatement: String?,
    
    // Enhanced location with GIS support
    val location: CooperativeLocation,
    val physicalAddress: String?,
    val postalAddress: String?,
    val serviceRadiusKm: Int = 50,
    
    // Advanced registration details
    val registrationDate: Date,
    val certificateNumber: String?,
    val registrationStatus: RegistrationStatus = RegistrationStatus.PENDING,
    val renewalDate: Date?,
    val complianceScore: Double = 0.0,
    
    // Comprehensive leadership structure
    val leadership: CooperativeLeadership,
    val boardMembers: List<BoardMember> = emptyList(),
    val managementTeam: List<ManagementMember> = emptyList(),
    
    // Detailed financial information
    val shareCapital: Double = 0.0,
    val minimumShareValue: Double,
    val joiningFee: Double,
    val monthlyContribution: Double = 0.0,
    val annualTurnover: Double = 0.0,
    
    // Advanced membership metrics
    val currentMembers: Int = 0,
    val maximumMembers: Int?,
    val targetMembers: Int?,
    val memberRetentionRate: Double = 0.0,
    val memberGrowthRate: Double = 0.0,
    
    // Operational capabilities
    val activities: List<String>,
    val servicesOffered: List<String> = emptyList(),
    val commoditiesHandled: List<String> = emptyList(),
    val certifications: List<Certification> = emptyList(),
    val requirements: CooperativeRequirements,
    val benefits: List<String>,
    
    // Advanced performance metrics
    val performance: CooperativePerformance,
    val memberSatisfactionScore: Double = 0.0,
    val financialHealthScore: Double = 0.0,
    val governanceScore: Double = 0.0,
    val sustainabilityScore: Double = 0.0,
    
    // Digital presence and contact
    val contactInfo: ContactInfo,
    val website: String?,
    val socialMedia: SocialMediaLinks = SocialMediaLinks(),
    
    // Advanced operational status
    val isActive: Boolean = true,
    val isRecruiting: Boolean = false,
    val isVerified: Boolean = false,
    val verificationLevel: VerificationLevel = VerificationLevel.UNVERIFIED,
    val lastAuditDate: Date?,
    val nextAuditDate: Date?,
    val organicCertified: Boolean = false,
    
    // Risk and compliance
    val riskLevel: RiskLevel = RiskLevel.LOW,
    val complianceIssues: List<String> = emptyList(),
    val auditHistory: List<AuditRecord> = emptyList(),
    
    // Innovation and technology adoption
    val technologyAdoptionScore: Double = 0.0,
    val digitalLiteracyLevel: DigitalLiteracyLevel = DigitalLiteracyLevel.BASIC,
    val innovationIndex: Double = 0.0,
    
    // Market integration
    val marketIntegrationLevel: MarketIntegrationLevel = MarketIntegrationLevel.LOCAL,
    val valueChainPosition: List<ValueChainPosition> = emptyList(),
    val exportCapability: Boolean = false,
    
    // Metadata
    val createdAt: Date = Date(),
    val updatedAt: Date = Date(),
    val createdBy: String?,
    val updatedBy: String?
)

@Entity(tableName = "group_formations")
@TypeConverters(CooperativeConverters::class)
data class GroupFormation(
    @PrimaryKey
    val id: String,
    val initiatorId: String,
    val initiatorName: String,
    val title: String,
    val description: String,
    val targetMembers: Int,
    val currentMembers: Int,
    val location: String,
    val focus: List<String>,
    val requirements: String,
    val status: GroupFormationStatus,
    val interestedMembers: List<String>,
    val createdAt: Date = Date(),
    val updatedAt: Date = Date()
)

@Entity(tableName = "cooperative_memberships")
data class CooperativeMembership(
    @PrimaryKey
    val id: String,
    val cooperativeId: String,
    val memberId: String,
    val memberName: String,
    val memberType: MemberType,
    val joinDate: Date,
    val status: MembershipStatus,
    val contributionsPaid: Double,
    val sharesOwned: Int,
    val role: MemberRole?,
    val performanceScore: Double,
    val lastActiveDate: Date,
    val createdAt: Date = Date()
)

@Entity(tableName = "cooperative_applications")
@TypeConverters(CooperativeConverters::class)
data class CooperativeApplication(
    @PrimaryKey
    val id: String,
    val cooperativeId: String,
    val applicantId: String,
    val applicantName: String,
    val applicationData: ApplicationData,
    val status: ApplicationStatus,
    val submittedAt: Date,
    val reviewedAt: Date?,
    val reviewedBy: String?,
    val reviewNotes: String?,
    val createdAt: Date = Date()
)

// Advanced Supporting Data Classes
data class CooperativeLocation(
    val county: String,
    val subcounty: String,
    val ward: String,
    val coordinates: Coordinates?,
    val elevation: Double? = null,
    val climateZone: String? = null,
    val soilType: String? = null,
    val waterSources: List<String> = emptyList(),
    val nearestMarket: String? = null,
    val distanceToMarketKm: Double? = null
)

data class Coordinates(
    val latitude: Double,
    val longitude: Double,
    val accuracy: Double? = null,
    val altitude: Double? = null
)

data class CooperativeLeadership(
    val chairperson: LeadershipMember,
    val secretary: LeadershipMember,
    val treasurer: LeadershipMember,
    val viceChairperson: LeadershipMember? = null,
    val assistantSecretary: LeadershipMember? = null,
    val assistantTreasurer: LeadershipMember? = null
)

data class LeadershipMember(
    val name: String,
    val memberId: String,
    val phone: String,
    val email: String? = null,
    val experience: String,
    val qualifications: List<String> = emptyList(),
    val termStart: Date,
    val termEnd: Date,
    val performanceScore: Double = 0.0
)

data class BoardMember(
    val name: String,
    val memberId: String,
    val position: String,
    val expertise: List<String>,
    val termStart: Date,
    val termEnd: Date,
    val attendanceRate: Double = 0.0,
    val contributionScore: Double = 0.0
)

data class ManagementMember(
    val name: String,
    val position: String,
    val department: String,
    val qualifications: List<String>,
    val experience: String,
    val performanceRating: Double = 0.0,
    val responsibilities: List<String>
)

data class CooperativeRequirements(
    val minimumShare: Double,
    val monthlyContribution: Double,
    val joiningFee: Double,
    val minimumAge: Int = 18,
    val maximumAge: Int? = null,
    val residencyRequirement: String? = null,
    val farmSizeRequirement: Double? = null,
    val experienceRequirement: String? = null,
    val guarantorRequirement: Int = 0,
    val documentRequirements: List<String> = emptyList()
)

data class ContactInfo(
    val primaryPhone: String,
    val secondaryPhone: String? = null,
    val email: String,
    val alternativeEmail: String? = null,
    val physicalAddress: String,
    val postalAddress: String? = null,
    val emergencyContact: String? = null,
    val businessHours: String? = null
)

data class CooperativePerformance(
    val overallRating: Double,
    val financialPerformance: Double,
    val operationalEfficiency: Double,
    val memberSatisfaction: Double,
    val marketPerformance: Double,
    val socialImpact: Double,
    val environmentalImpact: Double,
    val activeProjects: Int,
    val completedProjects: Int,
    val totalRevenue: Double,
    val profitMargin: Double,
    val memberGrowthRate: Double,
    val marketShare: Double? = null,
    val innovationScore: Double = 0.0,
    val sustainabilityScore: Double = 0.0
)

data class Certification(
    val name: String,
    val issuingBody: String,
    val certificateNumber: String,
    val issueDate: Date,
    val expiryDate: Date,
    val status: CertificationStatus,
    val scope: String,
    val verificationLevel: String,
    val renewalCost: Double? = null,
    val benefits: List<String> = emptyList()
)

data class SocialMediaLinks(
    val facebook: String? = null,
    val twitter: String? = null,
    val instagram: String? = null,
    val linkedin: String? = null,
    val youtube: String? = null,
    val whatsapp: String? = null,
    val telegram: String? = null
)

data class AuditRecord(
    val auditDate: Date,
    val auditorName: String,
    val auditType: String,
    val findings: List<String>,
    val recommendations: List<String>,
    val complianceScore: Double,
    val followUpRequired: Boolean,
    val followUpDate: Date? = null,
    val status: AuditStatus
)

data class ApplicationData(
    val farmSize: Double?,
    val cropTypes: List<String>,
    val experience: String,
    val references: List<String>,
    val additionalInfo: String?
)

// Advanced Enums
enum class CooperativeType {
    FARMING,
    PROCESSING,
    MARKETING,
    SAVINGS,
    MULTIPURPOSE,
    TRANSPORT,
    HOUSING,
    CONSUMER,
    WORKER,
    SERVICE,
    CREDIT_UNION,
    INSURANCE,
    ENERGY,
    TECHNOLOGY
}

enum class RegistrationStatus {
    PENDING,
    ACTIVE,
    SUSPENDED,
    EXPIRED,
    CANCELLED,
    UNDER_REVIEW,
    PROVISIONAL
}

enum class VerificationLevel {
    UNVERIFIED,
    BASIC,
    VERIFIED,
    PREMIUM,
    GOLD,
    PLATINUM
}

enum class RiskLevel {
    VERY_LOW,
    LOW,
    MEDIUM,
    HIGH,
    VERY_HIGH,
    CRITICAL
}

enum class DigitalLiteracyLevel {
    NONE,
    BASIC,
    INTERMEDIATE,
    ADVANCED,
    EXPERT
}

enum class MarketIntegrationLevel {
    LOCAL,
    REGIONAL,
    NATIONAL,
    INTERNATIONAL,
    GLOBAL
}

enum class ValueChainPosition {
    INPUT_SUPPLIER,
    PRODUCER,
    AGGREGATOR,
    PROCESSOR,
    DISTRIBUTOR,
    RETAILER,
    EXPORTER,
    SERVICE_PROVIDER
}

enum class CertificationStatus {
    ACTIVE,
    EXPIRED,
    SUSPENDED,
    PENDING_RENEWAL,
    REVOKED
}

enum class AuditStatus {
    COMPLETED,
    IN_PROGRESS,
    SCHEDULED,
    OVERDUE,
    CANCELLED
}

enum class GroupFormationStatus {
    FORMING,
    ACTIVE,
    DISSOLVED
}

enum class MemberType {
    FARMER,
    AGRO_DEALER,
    PROCESSOR,
    TRANSPORTER,
    OTHER
}

enum class MembershipStatus {
    ACTIVE,
    INACTIVE,
    SUSPENDED,
    TERMINATED
}

enum class MemberRole {
    MEMBER,
    COMMITTEE_MEMBER,
    SECRETARY,
    TREASURER,
    CHAIRPERSON
}

enum class ApplicationStatus {
    PENDING,
    UNDER_REVIEW,
    APPROVED,
    REJECTED,
    WITHDRAWN
}

enum class RegistrationStatus {
    ACTIVE,
    PENDING,
    SUSPENDED,
    EXPIRED
}

// Type Converters
class CooperativeConverters {
    private val gson = Gson()

    @TypeConverter
    fun fromStringList(value: List<String>): String {
        return gson.toJson(value)
    }

    @TypeConverter
    fun toStringList(value: String): List<String> {
        return gson.fromJson(value, object : TypeToken<List<String>>() {}.type)
    }

    @TypeConverter
    fun fromCooperativeLocation(location: CooperativeLocation): String {
        return gson.toJson(location)
    }

    @TypeConverter
    fun toCooperativeLocation(value: String): CooperativeLocation {
        return gson.fromJson(value, CooperativeLocation::class.java)
    }

    @TypeConverter
    fun fromCooperativeRegistration(registration: CooperativeRegistration): String {
        return gson.toJson(registration)
    }

    @TypeConverter
    fun toCooperativeRegistration(value: String): CooperativeRegistration {
        return gson.fromJson(value, CooperativeRegistration::class.java)
    }

    @TypeConverter
    fun fromCooperativeLeadership(leadership: CooperativeLeadership): String {
        return gson.toJson(leadership)
    }

    @TypeConverter
    fun toCooperativeLeadership(value: String): CooperativeLeadership {
        return gson.fromJson(value, CooperativeLeadership::class.java)
    }

    @TypeConverter
    fun fromCooperativeRequirements(requirements: CooperativeRequirements): String {
        return gson.toJson(requirements)
    }

    @TypeConverter
    fun toCooperativeRequirements(value: String): CooperativeRequirements {
        return gson.fromJson(value, CooperativeRequirements::class.java)
    }

    @TypeConverter
    fun fromContactInfo(contactInfo: ContactInfo): String {
        return gson.toJson(contactInfo)
    }

    @TypeConverter
    fun toContactInfo(value: String): ContactInfo {
        return gson.fromJson(value, ContactInfo::class.java)
    }

    @TypeConverter
    fun fromCooperativePerformance(performance: CooperativePerformance): String {
        return gson.toJson(performance)
    }

    @TypeConverter
    fun toCooperativePerformance(value: String): CooperativePerformance {
        return gson.fromJson(value, CooperativePerformance::class.java)
    }

    @TypeConverter
    fun fromApplicationData(applicationData: ApplicationData): String {
        return gson.toJson(applicationData)
    }

    @TypeConverter
    fun toApplicationData(value: String): ApplicationData {
        return gson.fromJson(value, ApplicationData::class.java)
    }

    @TypeConverter
    fun fromDate(date: Date): Long {
        return date.time
    }

    @TypeConverter
    fun toDate(timestamp: Long): Date {
        return Date(timestamp)
    }
}
