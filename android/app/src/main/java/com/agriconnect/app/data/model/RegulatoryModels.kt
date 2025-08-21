package com.agriconnect.app.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.TypeConverter
import androidx.room.TypeConverters
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.util.Date

@Entity(tableName = "regulatory_alerts")
@TypeConverters(RegulatoryConverters::class)
data class RegulatoryAlert(
    @PrimaryKey
    val id: String,
    val title: String,
    val category: AlertCategory,
    val severity: AlertSeverity,
    val description: String,
    val affectedProducts: List<String>,
    val affectedRegions: List<String>,
    val source: String,
    val datePosted: Date,
    val expiryDate: Date?,
    val author: AlertAuthor,
    val attachments: List<String>?,
    val views: Int,
    val likes: Int,
    val comments: Int,
    val status: AlertStatus,
    val actionRequired: String,
    val alternativeRecommendations: List<String>?,
    val createdAt: Date = Date(),
    val updatedAt: Date = Date()
)

@Entity(tableName = "behavioral_metrics")
@TypeConverters(RegulatoryConverters::class)
data class BehavioralMetric(
    @PrimaryKey
    val id: String,
    val playerId: String,
    val playerType: PlayerType,
    val reportedBy: String,
    val reporterRole: ReporterRole,
    val metrics: BehavioralScores,
    val observations: String,
    val concerns: List<String>,
    val recommendations: List<String>,
    val reportDate: Date,
    val nextFollowUp: Date,
    val createdAt: Date = Date()
)

@Entity(tableName = "churn_predictions")
@TypeConverters(RegulatoryConverters::class)
data class ChurnPrediction(
    @PrimaryKey
    val id: String,
    val playerId: String,
    val playerName: String,
    val playerType: PlayerType,
    val riskScore: Double, // 0-100
    val riskLevel: RiskLevel,
    val keyIndicators: ChurnIndicators,
    val predictedChurnDate: Date?,
    val recommendedActions: List<String>,
    val lastUpdated: Date,
    val createdAt: Date = Date()
)

@Entity(tableName = "supply_chain_optimizations")
@TypeConverters(RegulatoryConverters::class)
data class SupplyChainOptimization(
    @PrimaryKey
    val id: String,
    val type: OptimizationType,
    val title: String,
    val description: String,
    val potentialSavings: Double,
    val implementationEffort: ImplementationEffort,
    val affectedPlayers: List<String>,
    val timeline: String,
    val status: OptimizationStatus,
    val roi: Double, // percentage
    val createdAt: Date = Date(),
    val updatedAt: Date = Date()
)

@Entity(tableName = "relationship_health")
@TypeConverters(RegulatoryConverters::class)
data class RelationshipHealth(
    @PrimaryKey
    val id: String,
    val partnerId1: String,
    val partnerId2: String,
    val partnerNames: List<String>, // [name1, name2]
    val relationshipType: RelationshipType,
    val healthScore: Double, // 0-100
    val healthTrend: HealthTrend,
    val keyMetrics: RelationshipMetrics,
    val riskFactors: List<String>,
    val strengthFactors: List<String>,
    val recommendations: List<String>,
    val lastAssessed: Date,
    val createdAt: Date = Date()
)

// Supporting Data Classes
data class AlertAuthor(
    val name: String,
    val role: String,
    val organization: String,
    val verified: Boolean
)

data class BehavioralScores(
    val engagementLevel: Double, // 1-10
    val complianceRate: Double, // percentage
    val responsiveness: Double, // 1-10
    val collaborationScore: Double, // 1-10
    val innovationAdoption: Double, // 1-10
    val riskTolerance: Double // 1-10
)

data class ChurnIndicators(
    val engagementTrend: Trend,
    val transactionFrequency: Trend,
    val complianceRate: Double,
    val satisfactionScore: Double,
    val communicationResponsiveness: Double
)

data class RelationshipMetrics(
    val transactionVolume: Double,
    val paymentTimeliness: Double,
    val qualityCompliance: Double,
    val communicationFrequency: Double
)

// Enums
enum class AlertCategory {
    PESTICIDE_BAN,
    CONTAMINATION,
    RECALL,
    SAFETY_WARNING,
    REGULATION_CHANGE,
    MARKET_REJECTION
}

enum class AlertSeverity {
    CRITICAL,
    HIGH,
    MEDIUM,
    LOW
}

enum class AlertStatus {
    ACTIVE,
    RESOLVED,
    UNDER_INVESTIGATION
}

enum class PlayerType {
    FARMER,
    AGRO_DEALER,
    TRANSPORTER,
    PROCESSOR,
    COOPERATIVE
}

enum class ReporterRole {
    EXTENSION_OFFICER,
    FIELD_AGENT,
    COOPERATIVE_LEADER,
    PEER_FARMER
}

enum class RiskLevel {
    LOW,
    MEDIUM,
    HIGH,
    CRITICAL
}

enum class Trend {
    INCREASING,
    STABLE,
    DECLINING
}

enum class OptimizationType {
    AGGREGATION,
    ROUTE_OPTIMIZATION,
    INVENTORY_BALANCE,
    QUALITY_IMPROVEMENT
}

enum class ImplementationEffort {
    LOW,
    MEDIUM,
    HIGH
}

enum class OptimizationStatus {
    IDENTIFIED,
    PROPOSED,
    IN_PROGRESS,
    COMPLETED
}

enum class RelationshipType {
    BUYER_SELLER,
    COOPERATIVE_MEMBER,
    SUPPLIER_DEALER,
    FARMER_PROCESSOR
}

enum class HealthTrend {
    IMPROVING,
    STABLE,
    DECLINING
}

// Type Converters
class RegulatoryConverters {
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
    fun fromAlertAuthor(author: AlertAuthor): String {
        return gson.toJson(author)
    }

    @TypeConverter
    fun toAlertAuthor(value: String): AlertAuthor {
        return gson.fromJson(value, AlertAuthor::class.java)
    }

    @TypeConverter
    fun fromBehavioralScores(scores: BehavioralScores): String {
        return gson.toJson(scores)
    }

    @TypeConverter
    fun toBehavioralScores(value: String): BehavioralScores {
        return gson.fromJson(value, BehavioralScores::class.java)
    }

    @TypeConverter
    fun fromChurnIndicators(indicators: ChurnIndicators): String {
        return gson.toJson(indicators)
    }

    @TypeConverter
    fun toChurnIndicators(value: String): ChurnIndicators {
        return gson.fromJson(value, ChurnIndicators::class.java)
    }

    @TypeConverter
    fun fromRelationshipMetrics(metrics: RelationshipMetrics): String {
        return gson.toJson(metrics)
    }

    @TypeConverter
    fun toRelationshipMetrics(value: String): RelationshipMetrics {
        return gson.fromJson(value, RelationshipMetrics::class.java)
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
