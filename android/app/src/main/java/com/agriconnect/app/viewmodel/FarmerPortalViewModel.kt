package com.agriconnect.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.agriconnect.app.data.model.*
import com.agriconnect.app.data.repository.FarmerPortalRepository
import com.agriconnect.app.data.repository.Result
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class FarmerPortalUiState(
    val landParcels: List<LandParcel> = emptyList(),
    val crops: List<Crop> = emptyList(),
    val animals: List<Animal> = emptyList(),
    val inventory: List<InventoryItem> = emptyList(),
    val finances: List<FinanceRecord> = emptyList(),
    val products: List<Product> = emptyList(),
    val buyRequests: List<BuyRequest> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
    val successMessage: String? = null,
    val selectedTab: Int = 0
)

class FarmerPortalViewModel(
    private val repository: FarmerPortalRepository = FarmerPortalRepository()
) : ViewModel() {
    private val _uiState = MutableStateFlow(FarmerPortalUiState())
    val uiState: StateFlow<FarmerPortalUiState> = _uiState.asStateFlow()

    fun loadLandParcels(userId: String) {
        viewModelScope.launch {
            repository.fetchLandParcels(userId).collect { result ->
                when (result) {
                    is Result.Loading -> _uiState.update { it.copy(isLoading = true, error = null) }
                    is Result.Success -> _uiState.update { it.copy(landParcels = result.data, isLoading = false, error = null) }
                    is Result.Error -> _uiState.update { it.copy(isLoading = false, error = result.exception.message) }
                }
            }
        }
    }
    // Repeat for crops, animals, inventory, finances, products, buy requests...
} 