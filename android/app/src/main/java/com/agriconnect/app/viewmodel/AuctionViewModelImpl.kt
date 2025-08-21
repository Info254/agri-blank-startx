package com.agriconnect.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.agriconnect.app.data.model.*
import com.agriconnect.app.data.repository.AuctionRepositoryImpl
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class AuctionViewModelImpl @Inject constructor(
    private val auctionRepository: AuctionRepositoryImpl
) : ViewModel() {

    private val _uiState = MutableStateFlow(AuctionUiState())
    val uiState: StateFlow<AuctionUiState> = _uiState.asStateFlow()

    private val _filters = MutableStateFlow(AuctionFilters())
    val filters: StateFlow<AuctionFilters> = _filters.asStateFlow()

    private val _selectedAuctionId = MutableStateFlow<String?>(null)
    
    // Real-time auction updates
    val selectedAuctionUpdates: StateFlow<Auction?> = _selectedAuctionId
        .filterNotNull()
        .flatMapLatest { auctionId ->
            auctionRepository.getAuctionUpdates(auctionId)
        }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(), null)

    // Real-time bid updates
    val bidUpdates: StateFlow<List<Bid>> = _selectedAuctionId
        .filterNotNull()
        .flatMapLatest { auctionId ->
            auctionRepository.getBidUpdates(auctionId)
        }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(), emptyList())

    init {
        loadAuctions()
    }

    fun loadAuctions() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            
            auctionRepository.getAuctions(_filters.value).collect { auctions ->
                _uiState.value = _uiState.value.copy(
                    auctions = auctions,
                    isLoading = false
                )
            }
        }
    }

    fun searchAuctions(query: String) {
        if (query.isBlank()) {
            loadAuctions()
            return
        }

        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            
            auctionRepository.searchAuctions(query).collect { auctions ->
                _uiState.value = _uiState.value.copy(
                    auctions = auctions,
                    isLoading = false
                )
            }
        }
    }

    fun applyFilters(filters: AuctionFilters) {
        _filters.value = filters
        loadAuctions()
    }

    fun clearFilters() {
        _filters.value = AuctionFilters()
        loadAuctions()
    }

    fun loadAuctionDetails(auctionId: String, userId: String? = null) {
        _selectedAuctionId.value = auctionId
        
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoadingDetails = true)
            
            val auction = auctionRepository.getAuctionById(auctionId, userId)
            _uiState.value = _uiState.value.copy(
                selectedAuction = auction,
                isLoadingDetails = false
            )
        }
    }

    fun placeBid(auctionId: String, bidData: PlaceBidFormData, bidderId: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isSubmitting = true)
            
            auctionRepository.placeBid(auctionId, bidData, bidderId).fold(
                onSuccess = { bid ->
                    _uiState.value = _uiState.value.copy(
                        isSubmitting = false,
                        message = "Bid placed successfully!",
                        lastPlacedBid = bid
                    )
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(
                        isSubmitting = false,
                        error = error.message
                    )
                }
            )
        }
    }

    fun watchAuction(auctionId: String, userId: String) {
        viewModelScope.launch {
            auctionRepository.watchAuction(auctionId, userId).fold(
                onSuccess = {
                    _uiState.value = _uiState.value.copy(
                        message = "Added to watchlist"
                    )
                    // Refresh auction details to update watch status
                    loadAuctionDetails(auctionId, userId)
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(error = error.message)
                }
            )
        }
    }

    fun unwatchAuction(auctionId: String, userId: String) {
        viewModelScope.launch {
            auctionRepository.unwatchAuction(auctionId, userId).fold(
                onSuccess = {
                    _uiState.value = _uiState.value.copy(
                        message = "Removed from watchlist"
                    )
                    // Refresh auction details to update watch status
                    loadAuctionDetails(auctionId, userId)
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(error = error.message)
                }
            )
        }
    }

    fun setupAutoBidding(auctionId: String, userId: String, maxAmount: Double, increment: Double) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isSubmitting = true)
            
            auctionRepository.setupAutoBidding(auctionId, userId, maxAmount, increment).fold(
                onSuccess = {
                    _uiState.value = _uiState.value.copy(
                        isSubmitting = false,
                        message = "Auto-bidding activated"
                    )
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(
                        isSubmitting = false,
                        error = error.message
                    )
                }
            )
        }
    }

    fun cancelAutoBidding(auctionId: String, userId: String) {
        viewModelScope.launch {
            auctionRepository.cancelAutoBidding(auctionId, userId).fold(
                onSuccess = {
                    _uiState.value = _uiState.value.copy(
                        message = "Auto-bidding cancelled"
                    )
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(error = error.message)
                }
            )
        }
    }

    fun loadEndingSoonAuctions() {
        viewModelScope.launch {
            auctionRepository.getEndingSoonAuctions().collect { auctions ->
                _uiState.value = _uiState.value.copy(endingSoonAuctions = auctions)
            }
        }
    }

    fun clearMessage() {
        _uiState.value = _uiState.value.copy(message = null)
    }

    fun clearError() {
        _uiState.value = _uiState.value.copy(error = null)
    }
}

@HiltViewModel
class MyAuctionsViewModel @Inject constructor(
    private val auctionRepository: AuctionRepositoryImpl
) : ViewModel() {

    private val _uiState = MutableStateFlow(MyAuctionsUiState())
    val uiState: StateFlow<MyAuctionsUiState> = _uiState.asStateFlow()

    fun loadMyAuctions(sellerId: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            
            auctionRepository.getMyAuctions(sellerId).collect { auctions ->
                _uiState.value = _uiState.value.copy(
                    myAuctions = auctions,
                    isLoading = false
                )
            }
        }
    }

    fun loadMyBids(bidderId: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            
            auctionRepository.getMyBids(bidderId).collect { bids ->
                _uiState.value = _uiState.value.copy(
                    myBids = bids,
                    isLoading = false
                )
            }
        }
    }

    fun createAuction(auctionData: CreateAuctionFormData, sellerId: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isSubmitting = true)
            
            auctionRepository.createAuction(auctionData, sellerId).fold(
                onSuccess = { auction ->
                    _uiState.value = _uiState.value.copy(
                        isSubmitting = false,
                        message = "Auction created successfully!",
                        createdAuction = auction
                    )
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(
                        isSubmitting = false,
                        error = error.message
                    )
                }
            )
        }
    }

    fun updateAuctionStatus(auctionId: String, status: AuctionStatus) {
        viewModelScope.launch {
            auctionRepository.updateAuctionStatus(auctionId, status).fold(
                onSuccess = {
                    _uiState.value = _uiState.value.copy(
                        message = "Auction status updated"
                    )
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(error = error.message)
                }
            )
        }
    }

    fun clearMessage() {
        _uiState.value = _uiState.value.copy(message = null)
    }

    fun clearError() {
        _uiState.value = _uiState.value.copy(error = null)
    }
}

@HiltViewModel
class AuctionPaymentViewModel @Inject constructor(
    private val auctionRepository: AuctionRepositoryImpl
) : ViewModel() {

    private val _uiState = MutableStateFlow(AuctionPaymentUiState())
    val uiState: StateFlow<AuctionPaymentUiState> = _uiState.asStateFlow()

    fun loadAuctionPayment(auctionId: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            
            val payment = auctionRepository.getAuctionPayment(auctionId)
            _uiState.value = _uiState.value.copy(
                payment = payment,
                isLoading = false
            )
        }
    }

    fun createPayment(payment: AuctionPayment) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isSubmitting = true)
            
            auctionRepository.createAuctionPayment(payment).fold(
                onSuccess = { createdPayment ->
                    _uiState.value = _uiState.value.copy(
                        isSubmitting = false,
                        payment = createdPayment,
                        message = "Payment initiated successfully"
                    )
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(
                        isSubmitting = false,
                        error = error.message
                    )
                }
            )
        }
    }

    fun updatePaymentStatus(paymentId: String, escrowStatus: EscrowStatus, paymentStatus: PaymentStatus) {
        viewModelScope.launch {
            auctionRepository.updatePaymentStatus(paymentId, escrowStatus, paymentStatus).fold(
                onSuccess = {
                    _uiState.value = _uiState.value.copy(
                        message = "Payment status updated"
                    )
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(error = error.message)
                }
            )
        }
    }

    fun clearMessage() {
        _uiState.value = _uiState.value.copy(message = null)
    }

    fun clearError() {
        _uiState.value = _uiState.value.copy(error = null)
    }
}

// UI State Data Classes
data class AuctionUiState(
    val auctions: List<Auction> = emptyList(),
    val selectedAuction: Auction? = null,
    val endingSoonAuctions: List<Auction> = emptyList(),
    val lastPlacedBid: Bid? = null,
    val isLoading: Boolean = false,
    val isLoadingDetails: Boolean = false,
    val isSubmitting: Boolean = false,
    val error: String? = null,
    val message: String? = null
)

data class MyAuctionsUiState(
    val myAuctions: List<Auction> = emptyList(),
    val myBids: List<Bid> = emptyList(),
    val createdAuction: Auction? = null,
    val isLoading: Boolean = false,
    val isSubmitting: Boolean = false,
    val error: String? = null,
    val message: String? = null
)

data class AuctionPaymentUiState(
    val payment: AuctionPayment? = null,
    val isLoading: Boolean = false,
    val isSubmitting: Boolean = false,
    val error: String? = null,
    val message: String? = null
)
