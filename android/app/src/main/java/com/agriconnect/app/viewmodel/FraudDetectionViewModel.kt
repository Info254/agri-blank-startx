package com.agriconnect.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.agriconnect.app.data.model.*
import com.agriconnect.app.data.repository.FraudDetectionRepository
import com.agriconnect.app.data.repository.Result
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class FraudDetectionUiState(
    val fraudAlerts: List<FraudAlert> = emptyList(),
    val userTrustScore: TrustScore? = null,
    val sellerVerifications: List<SellerVerification> = emptyList(),
    val suspiciousActivities: List<SuspiciousActivity> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
    val message: String? = null
)

@HiltViewModel
class FraudDetectionViewModel @Inject constructor(
    private val repository: FraudDetectionRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(FraudDetectionUiState())
    val uiState: StateFlow<FraudDetectionUiState> = _uiState.asStateFlow()

    fun loadUserTrustScore(userId: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }
            
            val trustScore = repository.getUserTrustScore(userId)
            val fraudAlerts = repository.getUserFraudAlerts(userId)
            
            _uiState.update { state ->
                state.copy(
                    userTrustScore = trustScore,
                    fraudAlerts = fraudAlerts,
                    isLoading = false
                )
            }
        }
    }

    fun reportSuspiciousActivity(activityData: ReportSuspiciousActivityData) {
        viewModelScope.launch {
            repository.reportSuspiciousActivity(activityData).fold(
                onSuccess = {
                    _uiState.update { state ->
                        state.copy(message = "Suspicious activity reported. Our security team will investigate.")
                    }
                },
                onFailure = { error ->
                    _uiState.update { state ->
                        state.copy(error = error.message)
                    }
                }
            )
        }
    }

    fun validateSellerSafety(sellerId: String): SellerSafetyReport {
        // Real-time seller safety validation
        val seller = repository.getSellerSafetyData(sellerId)
        
        return SellerSafetyReport(
            sellerId = sellerId,
            safetyScore = calculateSafetyScore(seller),
            warnings = generateSellerWarnings(seller),
            recommendations = generateSafetyRecommendations(seller),
            isRecommended = seller.trustScore > 3.5 && seller.verificationLevel != VerificationLevel.UNVERIFIED
        )
    }

    private fun calculateSafetyScore(seller: SellerSafetyData): Double {
        var score = 5.0
        
        // Deduct for unverified status
        if (seller.verificationLevel == VerificationLevel.UNVERIFIED) score -= 2.0
        
        // Deduct for low rating
        if (seller.rating < 3.0) score -= 1.5
        
        // Deduct for new account
        if (seller.accountAgeDays < 30) score -= 1.0
        
        // Deduct for disputes
        score -= (seller.disputeCount * 0.5)
        
        // Deduct for fraud alerts
        score -= (seller.fraudAlertCount * 1.0)
        
        return maxOf(0.0, score)
    }

    private fun generateSellerWarnings(seller: SellerSafetyData): List<String> {
        val warnings = mutableListOf<String>()
        
        if (seller.verificationLevel == VerificationLevel.UNVERIFIED) {
            warnings.add("🚨 UNVERIFIED SELLER - High risk of fraud")
        }
        
        if (seller.rating < 2.0) {
            warnings.add("⭐ VERY LOW RATING - Poor customer satisfaction")
        }
        
        if (seller.accountAgeDays < 7) {
            warnings.add("🆕 BRAND NEW ACCOUNT - Created less than a week ago")
        }
        
        if (seller.disputeCount > 3) {
            warnings.add("⚖️ MULTIPLE DISPUTES - History of transaction problems")
        }
        
        if (seller.fraudAlertCount > 0) {
            warnings.add("🚩 FRAUD ALERTS - Previous suspicious activity reported")
        }
        
        if (seller.pricesBelowMarket > 50) {
            warnings.add("💰 SUSPICIOUSLY LOW PRICES - Prices significantly below market rate")
        }
        
        return warnings
    }

    private fun generateSafetyRecommendations(seller: SellerSafetyData): List<String> {
        val recommendations = mutableListOf<String>()
        
        if (seller.verificationLevel == VerificationLevel.UNVERIFIED) {
            recommendations.add("✅ Only use escrow payment system")
            recommendations.add("✅ Request additional verification before purchase")
            recommendations.add("✅ Start with small test orders")
        }
        
        if (seller.rating < 3.0) {
            recommendations.add("✅ Read all reviews carefully")
            recommendations.add("✅ Contact previous buyers if possible")
            recommendations.add("✅ Consider alternative sellers")
        }
        
        recommendations.add("✅ Always use platform messaging")
        recommendations.add("✅ Never pay outside the platform")
        recommendations.add("✅ Document all communications")
        
        return recommendations
    }

    fun clearMessage() {
        _uiState.update { it.copy(message = null) }
    }

    fun clearError() {
        _uiState.update { it.copy(error = null) }
    }
}

// Supporting Data Classes
data class SellerSafetyReport(
    val sellerId: String,
    val safetyScore: Double,
    val warnings: List<String>,
    val recommendations: List<String>,
    val isRecommended: Boolean
)

data class SellerSafetyData(
    val sellerId: String,
    val verificationLevel: VerificationLevel,
    val rating: Double,
    val accountAgeDays: Int,
    val disputeCount: Int,
    val fraudAlertCount: Int,
    val trustScore: Double,
    val pricesBelowMarket: Int // percentage
)

data class ReportSuspiciousActivityData(
    val reporterId: String,
    val suspectedUserId: String,
    val activityType: SuspiciousActivityType,
    val description: String,
    val evidence: List<String> = emptyList()
)

data class SuspiciousActivity(
    val id: String,
    val userId: String,
    val activityType: SuspiciousActivityType,
    val description: String,
    val severity: AlertSeverity,
    val status: AlertStatus,
    val createdAt: String
)

enum class SuspiciousActivityType {
    FAKE_LISTINGS, PRICE_MANIPULATION, IDENTITY_THEFT, 
    PAYMENT_FRAUD, REVIEW_MANIPULATION, SPAM_MESSAGES,
    DUPLICATE_ACCOUNTS, MONEY_LAUNDERING
}
