package com.agriconnect.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.agriconnect.app.data.model.*
import com.agriconnect.app.data.repository.PaymentSecurityRepository
import com.agriconnect.app.data.repository.Result
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class PaymentSecurityUiState(
    val escrowTransactions: List<EscrowTransaction> = emptyList(),
    val userTransactions: List<SecureTransaction> = emptyList(),
    val selectedTransaction: SecureTransaction? = null,
    val disputes: List<TransactionDispute> = emptyList(),
    val paymentWarnings: List<PaymentWarning> = emptyList(),
    val deliveryConfirmations: List<DeliveryConfirmation> = emptyList(),
    val isLoading: Boolean = false,
    val isProcessing: Boolean = false,
    val error: String? = null,
    val message: String? = null,
    val showPaymentWarning: Boolean = false,
    val warningMessage: String? = null
)

@HiltViewModel
class PaymentSecurityViewModel @Inject constructor(
    private val repository: PaymentSecurityRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(PaymentSecurityUiState())
    val uiState: StateFlow<PaymentSecurityUiState> = _uiState.asStateFlow()

    init {
        loadPaymentWarnings()
    }

    fun loadUserTransactions(userId: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }
            
            repository.getUserTransactions(userId).collect { result ->
                when (result) {
                    is Result.Success -> {
                        _uiState.update { state ->
                            state.copy(
                                userTransactions = result.data,
                                isLoading = false
                            )
                        }
                    }
                    is Result.Error -> {
                        _uiState.update { state ->
                            state.copy(
                                error = result.exception.message,
                                isLoading = false
                            )
                        }
                    }
                    is Result.Loading -> {
                        _uiState.update { it.copy(isLoading = true) }
                    }
                }
            }
        }
    }

    fun createEscrowTransaction(transactionData: CreateEscrowTransactionData): Boolean {
        // CRITICAL: Show payment warning before proceeding
        val warnings = generatePaymentWarnings(transactionData)
        if (warnings.isNotEmpty()) {
            _uiState.update { state ->
                state.copy(
                    showPaymentWarning = true,
                    warningMessage = warnings.joinToString("\n\n"),
                    paymentWarnings = warnings
                )
            }
            return false // Don't proceed without user acknowledgment
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isProcessing = true) }
            
            repository.createEscrowTransaction(transactionData).fold(
                onSuccess = { transaction ->
                    _uiState.update { state ->
                        state.copy(
                            isProcessing = false,
                            message = "Secure escrow transaction created successfully! Your payment is protected until delivery is confirmed.",
                            escrowTransactions = state.escrowTransactions + transaction
                        )
                    }
                },
                onFailure = { error ->
                    _uiState.update { state ->
                        state.copy(
                            isProcessing = false,
                            error = "Failed to create secure transaction: ${error.message}"
                        )
                    }
                }
            )
        }
        return true
    }

    fun confirmDelivery(transactionId: String, confirmationData: DeliveryConfirmationData) {
        viewModelScope.launch {
            _uiState.update { it.copy(isProcessing = true) }
            
            repository.confirmDelivery(transactionId, confirmationData).fold(
                onSuccess = { confirmation ->
                    _uiState.update { state ->
                        state.copy(
                            isProcessing = false,
                            message = "Delivery confirmed! Payment will be released to the seller.",
                            deliveryConfirmations = state.deliveryConfirmations + confirmation
                        )
                    }
                    // Automatically release escrow after confirmation
                    releaseEscrowPayment(transactionId)
                },
                onFailure = { error ->
                    _uiState.update { state ->
                        state.copy(
                            isProcessing = false,
                            error = error.message
                        )
                    }
                }
            )
        }
    }

    fun reportDeliveryIssue(transactionId: String, issueDescription: String, evidence: List<String>) {
        viewModelScope.launch {
            repository.reportDeliveryIssue(transactionId, issueDescription, evidence).fold(
                onSuccess = {
                    _uiState.update { state ->
                        state.copy(
                            message = "Delivery issue reported. Our team will investigate and protect your payment until resolved."
                        )
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

    fun createDispute(transactionId: String, disputeData: CreateDisputeData) {
        viewModelScope.launch {
            _uiState.update { it.copy(isProcessing = true) }
            
            repository.createDispute(transactionId, disputeData).fold(
                onSuccess = { dispute ->
                    _uiState.update { state ->
                        state.copy(
                            isProcessing = false,
                            message = "Dispute created successfully. Your payment is secured until resolution.",
                            disputes = state.disputes + dispute
                        )
                    }
                },
                onFailure = { error ->
                    _uiState.update { state ->
                        state.copy(
                            isProcessing = false,
                            error = error.message
                        )
                    }
                }
            )
        }
    }

    private fun releaseEscrowPayment(transactionId: String) {
        viewModelScope.launch {
            repository.releaseEscrowPayment(transactionId).fold(
                onSuccess = {
                    _uiState.update { state ->
                        state.copy(message = "Payment successfully released to seller.")
                    }
                },
                onFailure = { error ->
                    _uiState.update { state ->
                        state.copy(error = "Failed to release payment: ${error.message}")
                    }
                }
            )
        }
    }

    fun requestRefund(transactionId: String, reason: String) {
        viewModelScope.launch {
            repository.requestRefund(transactionId, reason).fold(
                onSuccess = {
                    _uiState.update { state ->
                        state.copy(message = "Refund request submitted. We'll process it within 24 hours.")
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

    fun acknowledgePaymentWarning() {
        _uiState.update { it.copy(showPaymentWarning = false, warningMessage = null) }
    }

    private fun loadPaymentWarnings() {
        viewModelScope.launch {
            val warnings = repository.getPaymentWarnings()
            _uiState.update { it.copy(paymentWarnings = warnings) }
        }
    }

    private fun generatePaymentWarnings(transactionData: CreateEscrowTransactionData): List<PaymentWarning> {
        val warnings = mutableListOf<PaymentWarning>()

        // Check seller verification status
        if (!transactionData.sellerVerified) {
            warnings.add(
                PaymentWarning(
                    type = WarningType.UNVERIFIED_SELLER,
                    title = "⚠️ UNVERIFIED SELLER",
                    message = "This seller is not verified. Only pay through our secure escrow system. NEVER send money directly!",
                    severity = WarningSeverity.HIGH
                )
            )
        }

        // Check for high-value transactions
        if (transactionData.amount > 100000) { // KES 100,000
            warnings.add(
                PaymentWarning(
                    type = WarningType.HIGH_VALUE,
                    title = "💰 HIGH VALUE TRANSACTION",
                    message = "This is a high-value transaction (KES ${String.format("%,.0f", transactionData.amount)}). Ensure you inspect goods before confirming delivery.",
                    severity = WarningSeverity.MEDIUM
                )
            )
        }

        // Check for new seller
        if (transactionData.sellerAccountAge < 30) { // Less than 30 days
            warnings.add(
                PaymentWarning(
                    type = WarningType.NEW_SELLER,
                    title = "🆕 NEW SELLER ACCOUNT",
                    message = "This seller account is less than 30 days old. Exercise extra caution and use escrow protection.",
                    severity = WarningSeverity.MEDIUM
                )
            )
        }

        // Check seller rating
        if (transactionData.sellerRating < 3.0) {
            warnings.add(
                PaymentWarning(
                    type = WarningType.LOW_RATING,
                    title = "⭐ LOW SELLER RATING",
                    message = "This seller has a rating of ${transactionData.sellerRating}/5.0. Review feedback carefully before proceeding.",
                    severity = WarningSeverity.HIGH
                )
            )
        }

        // Always add general protection warning
        warnings.add(
            PaymentWarning(
                type = WarningType.GENERAL_PROTECTION,
                title = "🛡️ PAYMENT PROTECTION",
                message = """
                    IMPORTANT BUYER PROTECTION:
                    
                    ✅ Your payment is held in secure escrow
                    ✅ Money is only released after delivery confirmation
                    ✅ You can dispute if goods are not delivered
                    ✅ Full refund available for non-delivery
                    
                    🚫 NEVER PAY OUTSIDE THE PLATFORM
                    🚫 Don't send money via M-Pesa directly to sellers
                    🚫 Don't pay before delivery confirmation
                """.trimIndent(),
                severity = WarningSeverity.INFO
            )
        )

        return warnings
    }

    fun clearMessage() {
        _uiState.update { it.copy(message = null) }
    }

    fun clearError() {
        _uiState.update { it.copy(error = null) }
    }
}

@HiltViewModel
class AuctionViewModel @Inject constructor(
    private val repository: AuctionRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(AuctionUiState())
    val uiState: StateFlow<AuctionUiState> = _uiState.asStateFlow()

    fun loadActiveAuctions() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }
            
            repository.getActiveAuctions().collect { result ->
                when (result) {
                    is Result.Success -> {
                        _uiState.update { state ->
                            state.copy(
                                auctions = result.data,
                                isLoading = false
                            )
                        }
                    }
                    is Result.Error -> {
                        _uiState.update { state ->
                            state.copy(
                                error = result.exception.message,
                                isLoading = false
                            )
                        }
                    }
                    is Result.Loading -> {
                        _uiState.update { it.copy(isLoading = true) }
                    }
                }
            }
        }
    }

    fun placeBid(auctionId: String, bidAmount: Double, userId: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isPlacingBid = true) }
            
            repository.placeBid(auctionId, bidAmount, userId).fold(
                onSuccess = { bid ->
                    _uiState.update { state ->
                        state.copy(
                            isPlacingBid = false,
                            message = "Bid placed successfully! Current bid: KES ${String.format("%,.0f", bidAmount)}",
                            userBids = state.userBids + bid
                        )
                    }
                },
                onFailure = { error ->
                    _uiState.update { state ->
                        state.copy(
                            isPlacingBid = false,
                            error = error.message
                        )
                    }
                }
            )
        }
    }

    fun createAuction(auctionData: CreateAuctionData) {
        viewModelScope.launch {
            _uiState.update { it.copy(isCreating = true) }
            
            repository.createAuction(auctionData).fold(
                onSuccess = { auction ->
                    _uiState.update { state ->
                        state.copy(
                            isCreating = false,
                            message = "Auction created successfully!",
                            auctions = state.auctions + auction
                        )
                    }
                },
                onFailure = { error ->
                    _uiState.update { state ->
                        state.copy(
                            isCreating = false,
                            error = error.message
                        )
                    }
                }
            )
        }
    }

    fun clearMessage() {
        _uiState.update { it.copy(message = null) }
    }

    fun clearError() {
        _uiState.update { it.copy(error = null) }
    }
}

// UI State Data Classes
data class AuctionUiState(
    val auctions: List<Auction> = emptyList(),
    val userBids: List<AuctionBid> = emptyList(),
    val selectedAuction: Auction? = null,
    val isLoading: Boolean = false,
    val isPlacingBid: Boolean = false,
    val isCreating: Boolean = false,
    val error: String? = null,
    val message: String? = null
)

// Data Transfer Objects
data class CreateEscrowTransactionData(
    val buyerId: String,
    val sellerId: String,
    val amount: Double,
    val currency: String = "KES",
    val description: String,
    val deliveryAddress: String,
    val expectedDeliveryDate: String,
    val sellerVerified: Boolean,
    val sellerRating: Double,
    val sellerAccountAge: Int // in days
)

data class DeliveryConfirmationData(
    val buyerId: String,
    val deliveryDate: String,
    val deliveryPhotos: List<String> = emptyList(),
    val qualityRating: Int,
    val notes: String? = null
)

data class CreateDisputeData(
    val disputantId: String,
    val disputeType: DisputeType,
    val description: String,
    val evidence: List<String> = emptyList(),
    val requestedResolution: String
)

data class CreateAuctionData(
    val sellerId: String,
    val title: String,
    val description: String,
    val commodity: String,
    val quantity: Double,
    val unit: String,
    val startingPrice: Double,
    val reservePrice: Double? = null,
    val auctionDuration: Int, // in hours
    val deliveryLocation: String,
    val qualityGrade: String? = null,
    val images: List<String> = emptyList()
)
