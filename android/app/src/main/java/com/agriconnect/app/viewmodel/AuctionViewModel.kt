package com.agriconnect.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.agriconnect.app.data.model.Auction
import com.agriconnect.app.data.model.AuctionBid
import com.agriconnect.app.data.repository.AuctionRepository
import com.agriconnect.app.data.repository.Result
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class AuctionUiState(
    val auctions: List<Auction> = emptyList(),
    val bids: List<AuctionBid> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
    val successMessage: String? = null
)

class AuctionViewModel(
    private val repository: AuctionRepository = AuctionRepository()
) : ViewModel() {
    private val _uiState = MutableStateFlow(AuctionUiState())
    val uiState: StateFlow<AuctionUiState> = _uiState.asStateFlow()

    fun loadAuctions() {
        viewModelScope.launch {
            repository.fetchAuctions().collect { result ->
                when (result) {
                    is Result.Loading -> _uiState.update { it.copy(isLoading = true, error = null) }
                    is Result.Success -> _uiState.update { it.copy(auctions = result.data, isLoading = false, error = null) }
                    is Result.Error -> _uiState.update { it.copy(isLoading = false, error = result.exception.message) }
                }
            }
        }
    }
    fun loadBids(auctionId: String) {
        viewModelScope.launch {
            repository.fetchBids(auctionId).collect { result ->
                when (result) {
                    is Result.Loading -> _uiState.update { it.copy(isLoading = true, error = null) }
                    is Result.Success -> _uiState.update { it.copy(bids = result.data, isLoading = false, error = null) }
                    is Result.Error -> _uiState.update { it.copy(isLoading = false, error = result.exception.message) }
                }
            }
        }
    }
    fun createAuction(auction: Auction) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null, successMessage = null) }
            when (val result = repository.createAuction(auction)) {
                is Result.Success -> {
                    loadAuctions()
                    _uiState.update { it.copy(successMessage = "Auction created successfully", isLoading = false) }
                }
                is Result.Error -> _uiState.update { it.copy(error = result.exception.message, isLoading = false) }
                else -> {}
            }
        }
    }
} 