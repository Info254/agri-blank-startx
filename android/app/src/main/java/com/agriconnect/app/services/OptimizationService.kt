package com.agriconnect.app.services

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.Serializable
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.math.*

@Serializable
data class ResourceData(
    val id: String,
    val name: String,
    val type: String,
    val quantity: Float,
    val unitCost: Float,
    val utilization: Float = 0.8f,
    val quality: Float = 0.8f,
    val cropType: String? = null,
    val seasonality: Float = 0.85f
)

@Serializable
data class OptimizedResource(
    val id: String,
    val name: String,
    val type: String,
    val quantity: Float,
    val unitCost: Float,
    val optimizedQuantity: Float,
    val efficiency: Float,
    val costSaving: Float,
    val recommendation: String,
    val confidenceLevel: Float
)

@Serializable
data class OptimizationResult(
    val resources: List<OptimizedResource>,
    val totalSaving: Float,
    val recommendations: List<String>,
    val efficiency: Float,
    val riskAssessment: RiskAssessment
)

@Serializable
data class RiskAssessment(
    val overallRisk: Float,
    val riskFactors: List<String>,
    val mitigationStrategies: List<String>
)

@Singleton
class OptimizationService @Inject constructor() {

    suspend fun optimizeResourceAllocation(resources: List<ResourceData>): OptimizationResult = withContext(Dispatchers.Default) {
        try {
            println("Running advanced resource optimization algorithms...")
            
            val optimizedResources = resources.map { resource ->
                optimizeIndividualResource(resource)
            }

            val totalOriginalCost = resources.sumOf { (it.quantity * it.unitCost).toDouble() }.toFloat()
            val totalOptimizedCost = optimizedResources.sumOf { (it.optimizedQuantity * it.unitCost).toDouble() }.toFloat()
            val totalSaving = if (totalOriginalCost > 0) (totalOriginalCost - totalOptimizedCost) / totalOriginalCost else 0f

            val efficiency = calculateOverallEfficiency(optimizedResources)
            val recommendations = generateSystemRecommendations(optimizedResources)
            val riskAssessment = assessOptimizationRisk(optimizedResources)

            OptimizationResult(
                resources = optimizedResources,
                totalSaving = totalSaving,
                recommendations = recommendations,
                efficiency = efficiency,
                riskAssessment = riskAssessment
            )
        } catch (e: Exception) {
            println("Resource optimization failed: ${e.message}")
            throw e
        }
    }

    private fun optimizeIndividualResource(resource: ResourceData): OptimizedResource {
        // Multi-factor optimization algorithm
        val efficiency = calculateResourceEfficiency(resource)
        val seasonalFactor = getSeasonalOptimizationFactor(resource.type)
        val cropCompatibility = getCropCompatibilityScore(resource.type, resource.cropType)
        val marketFactor = getMarketPricingFactor(resource.type)
        
        // Advanced optimization using weighted factors
        val optimizationMultiplier = calculateOptimizationMultiplier(
            efficiency, seasonalFactor, cropCompatibility, marketFactor
        )
        
        val optimizedQuantity = maxOf(
            resource.quantity * optimizationMultiplier,
            resource.quantity * 0.3f // Minimum 30% of original
        )
        
        val costSaving = (resource.quantity - optimizedQuantity) * resource.unitCost
        val confidenceLevel = calculateConfidenceLevel(efficiency, seasonalFactor, cropCompatibility)

        return OptimizedResource(
            id = resource.id,
            name = resource.name,
            type = resource.type,
            quantity = resource.quantity,
            unitCost = resource.unitCost,
            optimizedQuantity = optimizedQuantity,
            efficiency = efficiency,
            costSaving = costSaving,
            recommendation = generateResourceRecommendation(resource, efficiency, optimizationMultiplier),
            confidenceLevel = confidenceLevel
        )
    }

    private fun calculateResourceEfficiency(resource: ResourceData): Float {
        val utilizationScore = minOf(resource.utilization, 1.0f)
        val qualityScore = resource.quality / 1.0f
        val costEfficiencyScore = calculateCostEfficiency(resource)
        val applicationEfficiencyScore = getApplicationEfficiency(resource.type)
        
        return (utilizationScore * 0.25f +
                qualityScore * 0.25f +
                costEfficiencyScore * 0.25f +
                applicationEfficiencyScore * 0.25f)
    }

    private fun calculateCostEfficiency(resource: ResourceData): Float {
        // Cost efficiency based on market benchmarks
        val marketBenchmarks = mapOf(
            "fertilizer" to 50f, // KES per kg
            "pesticide" to 200f, // KES per liter
            "seeds" to 100f,     // KES per kg
            "water" to 5f,       // KES per cubic meter
            "fuel" to 150f,      // KES per liter
            "labor" to 500f      // KES per day
        )
        
        val benchmark = marketBenchmarks[resource.type.lowercase()] ?: resource.unitCost
        return maxOf(0f, minOf(1f, benchmark / resource.unitCost))
    }

    private fun getApplicationEfficiency(resourceType: String): Float {
        // Application efficiency based on resource type
        val efficiencyMap = mapOf(
            "fertilizer" to 0.75f,
            "pesticide" to 0.80f,
            "seeds" to 0.90f,
            "water" to 0.70f,
            "fuel" to 0.85f,
            "labor" to 0.85f
        )
        
        return efficiencyMap[resourceType.lowercase()] ?: 0.75f
    }

    private fun getSeasonalOptimizationFactor(resourceType: String): Float {
        val currentMonth = java.util.Calendar.getInstance().get(java.util.Calendar.MONTH)
        val seasonalFactors = mapOf(
            "fertilizer" to listOf(0.9f, 0.9f, 1.0f, 1.0f, 0.8f, 0.7f, 0.7f, 0.8f, 0.9f, 1.0f, 0.9f, 0.9f),
            "pesticide" to listOf(0.8f, 0.8f, 0.9f, 1.0f, 1.0f, 0.9f, 0.8f, 0.8f, 0.9f, 0.9f, 0.8f, 0.8f),
            "water" to listOf(0.7f, 0.7f, 0.8f, 0.9f, 1.0f, 1.0f, 1.0f, 1.0f, 0.9f, 0.8f, 0.7f, 0.7f),
            "seeds" to listOf(1.0f, 0.9f, 1.0f, 0.9f, 0.8f, 0.7f, 0.7f, 0.8f, 0.9f, 1.0f, 1.0f, 1.0f),
            "fuel" to listOf(0.9f, 0.9f, 0.9f, 0.9f, 0.9f, 0.9f, 0.9f, 0.9f, 0.9f, 0.9f, 0.9f, 0.9f),
            "labor" to listOf(0.8f, 0.8f, 1.0f, 1.0f, 0.9f, 0.8f, 0.8f, 0.8f, 0.9f, 1.0f, 0.9f, 0.8f)
        )
        
        val factors = seasonalFactors[resourceType.lowercase()]
        return factors?.get(currentMonth) ?: 0.85f
    }

    private fun getCropCompatibilityScore(resourceType: String, cropType: String?): Float {
        if (cropType == null) return 0.8f
        
        val compatibility = mapOf(
            "fertilizer" to mapOf(
                "maize" to 0.95f, "beans" to 0.85f, "tomatoes" to 0.90f, "potatoes" to 0.88f,
                "cabbage" to 0.85f, "onions" to 0.82f, "carrots" to 0.80f, "default" to 0.80f
            ),
            "pesticide" to mapOf(
                "maize" to 0.85f, "beans" to 0.90f, "tomatoes" to 0.95f, "potatoes" to 0.92f,
                "cabbage" to 0.88f, "onions" to 0.85f, "carrots" to 0.83f, "default" to 0.80f
            ),
            "water" to mapOf(
                "maize" to 0.80f, "beans" to 0.75f, "tomatoes" to 0.95f, "potatoes" to 0.90f,
                "cabbage" to 0.85f, "onions" to 0.80f, "carrots" to 0.85f, "default" to 0.80f
            ),
            "seeds" to mapOf(
                "maize" to 0.95f, "beans" to 0.95f, "tomatoes" to 0.90f, "potatoes" to 0.90f,
                "cabbage" to 0.85f, "onions" to 0.85f, "carrots" to 0.85f, "default" to 0.85f
            )
        )
        
        val resourceCompatibility = compatibility[resourceType.lowercase()]
        return resourceCompatibility?.get(cropType.lowercase()) ?: resourceCompatibility?.get("default") ?: 0.80f
    }

    private fun getMarketPricingFactor(resourceType: String): Float {
        // Simulate market pricing analysis
        val marketVolatility = mapOf(
            "fertilizer" to 0.15f, // 15% volatility
            "pesticide" to 0.10f,
            "seeds" to 0.08f,
            "water" to 0.05f,
            "fuel" to 0.20f,
            "labor" to 0.12f
        )
        
        val volatility = marketVolatility[resourceType.lowercase()] ?: 0.10f
        val marketTrend = ((-0.5f..0.5f).random()) * volatility * 2f
        
        return maxOf(0.7f, minOf(1.3f, 1f + marketTrend))
    }

    private fun calculateOptimizationMultiplier(
        efficiency: Float,
        seasonalFactor: Float,
        cropCompatibility: Float,
        marketFactor: Float
    ): Float {
        val baseMultiplier = 0.6f + (efficiency * 0.4f) // Base range: 0.6 - 1.0
        val seasonalAdjustment = seasonalFactor * 0.2f // ±20% seasonal adjustment
        val compatibilityAdjustment = (cropCompatibility - 0.8f) * 0.5f // Compatibility bonus/penalty
        val marketAdjustment = (marketFactor - 1.0f) * 0.3f // Market price adjustment
        
        return maxOf(0.3f, minOf(1.2f, 
            baseMultiplier + seasonalAdjustment + compatibilityAdjustment + marketAdjustment
        ))
    }

    private fun calculateConfidenceLevel(
        efficiency: Float,
        seasonalFactor: Float,
        cropCompatibility: Float
    ): Float {
        val efficiencyConfidence = if (efficiency > 0.8f) 0.9f else if (efficiency > 0.6f) 0.7f else 0.5f
        val seasonalConfidence = if (abs(seasonalFactor - 0.85f) < 0.1f) 0.9f else 0.7f
        val compatibilityConfidence = if (cropCompatibility > 0.85f) 0.9f else 0.7f
        
        return (efficiencyConfidence + seasonalConfidence + compatibilityConfidence) / 3f
    }

    private fun generateResourceRecommendation(
        resource: ResourceData,
        efficiency: Float,
        optimizationMultiplier: Float
    ): String {
        return when {
            efficiency > 0.85f && optimizationMultiplier > 0.9f -> 
                "Excellent utilization of ${resource.name}. Current usage is optimal."
            efficiency > 0.7f -> 
                "Good utilization of ${resource.name}. Minor optimization possible."
            optimizationMultiplier < 0.7f -> 
                "Significant optimization potential for ${resource.name}. Consider reducing usage by ${((1 - optimizationMultiplier) * 100).roundToInt()}%."
            else -> 
                "Review ${resource.name} application methods and timing for better efficiency."
        }
    }

    private fun calculateOverallEfficiency(resources: List<OptimizedResource>): Float {
        if (resources.isEmpty()) return 0f
        
        val weightedEfficiency = resources.sumOf { resource ->
            val weight = resource.quantity * resource.unitCost
            (resource.efficiency * weight).toDouble()
        }.toFloat()
        
        val totalWeight = resources.sumOf { resource -> 
            (resource.quantity * resource.unitCost).toDouble()
        }.toFloat()
        
        return if (totalWeight > 0) weightedEfficiency / totalWeight else 0f
    }

    private fun generateSystemRecommendations(resources: List<OptimizedResource>): List<String> {
        val recommendations = mutableListOf<String>()
        
        val lowEfficiencyResources = resources.filter { it.efficiency < 0.6f }
        val highSavingResources = resources.filter { it.costSaving > 1000f }
        val lowConfidenceResources = resources.filter { it.confidenceLevel < 0.6f }
        
        if (lowEfficiencyResources.isNotEmpty()) {
            recommendations.add(
                "Priority optimization needed for: ${lowEfficiencyResources.joinToString(", ") { it.name }}"
            )
        }
        
        if (highSavingResources.isNotEmpty()) {
            recommendations.add(
                "High cost-saving potential (>KES 1,000) in: ${highSavingResources.joinToString(", ") { it.name }}"
            )
        }
        
        if (lowConfidenceResources.isNotEmpty()) {
            recommendations.add(
                "Collect more data for better optimization of: ${lowConfidenceResources.joinToString(", ") { it.name }}"
            )
        }
        
        recommendations.add("Implement precision agriculture techniques for better resource management")
        recommendations.add("Consider soil testing for targeted fertilizer application")
        recommendations.add("Monitor weather patterns for optimal resource timing")
        
        return recommendations
    }

    private fun assessOptimizationRisk(resources: List<OptimizedResource>): RiskAssessment {
        val risks = mutableListOf<String>()
        val mitigations = mutableListOf<String>()
        var overallRisk = 0f
        
        val highOptimizationResources = resources.filter { 
            (it.quantity - it.optimizedQuantity) / it.quantity > 0.4f
        }
        
        if (highOptimizationResources.isNotEmpty()) {
            risks.add("Aggressive optimization may impact yield")
            mitigations.add("Implement gradual optimization over multiple seasons")
            overallRisk += 0.3f
        }
        
        val lowConfidenceOptimizations = resources.filter { it.confidenceLevel < 0.6f }
        if (lowConfidenceOptimizations.isNotEmpty()) {
            risks.add("Low confidence in some optimization recommendations")
            mitigations.add("Collect additional field data before implementing changes")
            overallRisk += 0.2f
        }
        
        val criticalResources = resources.filter { 
            listOf("water", "seeds", "fertilizer").contains(it.type.lowercase())
        }
        if (criticalResources.any { (it.quantity - it.optimizedQuantity) / it.quantity > 0.3f }) {
            risks.add("Optimization of critical resources may affect crop survival")
            mitigations.add("Maintain safety margins for critical resources")
            overallRisk += 0.4f
        }
        
        return RiskAssessment(
            overallRisk = minOf(1.0f, overallRisk),
            riskFactors = risks,
            mitigationStrategies = mitigations
        )
    }
}
