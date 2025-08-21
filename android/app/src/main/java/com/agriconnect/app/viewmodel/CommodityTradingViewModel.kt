package com.agriconnect.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.agriconnect.app.data.model.MarketplaceListing
import com.agriconnect.app.data.model.BarterTrade
import com.agriconnect.app.data.model.MyTrade
import com.agriconnect.app.data.repository.CommodityTradingRepository
import com.agriconnect.app.data.repository.Result
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class CommodityTradingUiState(
    val marketplace: List<MarketplaceListing> = emptyList(),
    val barterTrades: List<BarterTrade> = emptyList(),
    val myTrades: List<MyTrade> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
    val successMessage: String? = null,
    val selectedTab: Int = 0
)

class CommodityTradingViewModel(
    private val repository: CommodityTradingRepository = CommodityTradingRepository()
) : ViewModel() {

    private val _uiState = MutableStateFlow(CommodityTradingUiState())
    val uiState: StateFlow<CommodityTradingUiState> = _uiState.asStateFlow()

    fun loadMarketplace() {
        viewModelScope.launch {
            repository.fetchMarketplaceListings().collect { result ->
                when (result) {
                    is Result.Loading -> _uiState.update { it.copy(isLoading = true, error = null) }
                    is Result.Success -> _uiState.update { it.copy(marketplace = result.data, isLoading = false, error = null) }
                    is Result.Error -> _uiState.update { it.copy(isLoading = false, error = result.exception.message) }
                }
            }
        }
    }

    fun loadBarterTrades() {
        viewModelScope.launch {
            repository.fetchBarterTrades().collect { result ->
                when (result) {
                    is Result.Loading -> _uiState.update { it.copy(isLoading = true, error = null) }
                    is Result.Success -> _uiState.update { it.copy(barterTrades = result.data, isLoading = false, error = null) }
                    is Result.Error -> _uiState.update { it.copy(isLoading = false, error = result.exception.message) }
                }
            }
        }
    }

    fun loadMyTrades() {
        viewModelScope.launch {
            repository.fetchMyTrades().collect { result ->
                when (result) {
                    is Result.Loading -> _uiState.update { it.copy(isLoading = true, error = null) }
                    is Result.Success -> _uiState.update { it.copy(myTrades = result.data, isLoading = false, error = null) }
                    is Result.Error -> _uiState.update { it.copy(isLoading = false, error = result.exception.message) }
                }
            }
        }
    }

    // Add create/update/delete methods for each entity as needed, similar to BulkOrderViewModel
} 