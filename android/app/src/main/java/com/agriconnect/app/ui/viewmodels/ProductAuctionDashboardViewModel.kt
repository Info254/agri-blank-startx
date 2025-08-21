package com.agriconnect.app.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.agriconnect.app.data.model.MarketAuction
import com.agriconnect.app.data.model.MarketBid
import com.agriconnect.app.data.repository.MarketAuctionRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class ProductAuctionDashboardViewModel(
    private val auctionRepository: MarketAuctionRepository = MarketAuctionRepository()
) : ViewModel() {
    private val _auctions = MutableStateFlow<List<MarketAuction>>(emptyList())
    val auctions: StateFlow<List<MarketAuction>> = _auctions

    private val _bids = MutableStateFlow<List<MarketBid>>(emptyList())
    val bids: StateFlow<List<MarketBid>> = _bids

    private val _loading = MutableStateFlow(false)
    val loading: StateFlow<Boolean> = _loading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    init {
        loadAuctions()
    }

    fun loadAuctions() {
        _loading.value = true
        viewModelScope.launch {
            try {
                _auctions.value = auctionRepository.fetchAuctions()
                _error.value = null
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _loading.value = false
            }
        }
    }

    fun loadBids(auctionId: String) {
        _loading.value = true
        viewModelScope.launch {
            try {
                _bids.value = auctionRepository.fetchBids(auctionId)
                _error.value = null
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _loading.value = false
            }
        }
    }
} 