package com.agriconnect.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.agriconnect.app.data.model.BulkOrder
import com.agriconnect.app.data.model.BulkOrderBid
import com.agriconnect.app.data.repository.BulkOrderRepository
import com.agriconnect.app.data.repository.Result
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class BulkOrderUiState(
    val orders: List<BulkOrder> = emptyList(),
    val bids: List<BulkOrderBid> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
    val successMessage: String? = null,
    val selectedOrder: BulkOrder? = null
)

class BulkOrderViewModel(
    private val repository: BulkOrderRepository = BulkOrderRepository()
) : ViewModel() {

    private val _uiState = MutableStateFlow(BulkOrderUiState())
    val uiState: StateFlow<BulkOrderUiState> = _uiState.asStateFlow()

    fun loadOrders() {
        viewModelScope.launch {
            repository.fetchBulkOrders().collect { result ->
                when (result) {
                    is Result.Loading -> _uiState.update { it.copy(isLoading = true, error = null) }
                    is Result.Success -> _uiState.update { it.copy(orders = result.data, isLoading = false, error = null) }
                    is Result.Error -> _uiState.update { it.copy(isLoading = false, error = result.exception.message) }
                }
            }
        }
    }

    fun selectOrder(order: BulkOrder) {
        _uiState.update { it.copy(selectedOrder = order) }
        loadBids(order.id)
    }

    fun loadBids(orderId: String) {
        viewModelScope.launch {
            repository.fetchBulkOrderBids(orderId).collect { result ->
                when (result) {
                    is Result.Loading -> _uiState.update { it.copy(isLoading = true, error = null) }
                    is Result.Success -> _uiState.update { it.copy(bids = result.data, isLoading = false, error = null) }
                    is Result.Error -> _uiState.update { it.copy(isLoading = false, error = result.exception.message) }
                }
            }
        }
    }

    fun createOrder(order: BulkOrder) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null, successMessage = null) }
            when (val result = repository.createBulkOrder(order)) {
                is Result.Success -> {
                    loadOrders()
                    _uiState.update { it.copy(successMessage = "Order created successfully", isLoading = false) }
                }
                is Result.Error -> _uiState.update { it.copy(error = result.exception.message, isLoading = false) }
                else -> {}
            }
        }
    }

    fun updateOrder(order: BulkOrder) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null, successMessage = null) }
            when (val result = repository.updateBulkOrder(order)) {
                is Result.Success -> {
                    loadOrders()
                    _uiState.update { it.copy(successMessage = "Order updated successfully", isLoading = false) }
                }
                is Result.Error -> _uiState.update { it.copy(error = result.exception.message, isLoading = false) }
                else -> {}
            }
        }
    }

    fun deleteOrder(orderId: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null, successMessage = null) }
            when (val result = repository.deleteBulkOrder(orderId)) {
                is Result.Success -> {
                    loadOrders()
                    _uiState.update { it.copy(successMessage = "Order deleted successfully", isLoading = false) }
                }
                is Result.Error -> _uiState.update { it.copy(error = result.exception.message, isLoading = false) }
                else -> {}
            }
        }
    }

    // Similar methods for bids (createBid, updateBid, deleteBid) can be added here
} 