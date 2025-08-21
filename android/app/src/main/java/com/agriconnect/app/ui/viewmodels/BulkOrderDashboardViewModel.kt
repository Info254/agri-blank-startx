package com.agriconnect.app.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.agriconnect.app.data.model.BulkOrder
import com.agriconnect.app.data.model.BulkOrderBid
import com.agriconnect.app.data.repository.BulkOrderRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class BulkOrderDashboardViewModel(
    private val bulkOrderRepository: BulkOrderRepository = BulkOrderRepository()
) : ViewModel() {
    private val _orders = MutableStateFlow<List<BulkOrder>>(emptyList())
    val orders: StateFlow<List<BulkOrder>> = _orders

    private val _bids = MutableStateFlow<List<BulkOrderBid>>(emptyList())
    val bids: StateFlow<List<BulkOrderBid>> = _bids

    private val _loading = MutableStateFlow(false)
    val loading: StateFlow<Boolean> = _loading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    init {
        loadBulkOrders()
    }

    fun loadBulkOrders() {
        _loading.value = true
        viewModelScope.launch {
            try {
                _orders.value = bulkOrderRepository.fetchBulkOrders()
                _error.value = null
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _loading.value = false
            }
        }
    }

    fun loadBids(orderId: String) {
        _loading.value = true
        viewModelScope.launch {
            try {
                _bids.value = bulkOrderRepository.fetchBulkOrderBids(orderId)
                _error.value = null
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _loading.value = false
            }
        }
    }
} 