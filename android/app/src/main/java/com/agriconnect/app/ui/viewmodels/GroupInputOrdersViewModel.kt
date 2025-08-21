package com.agriconnect.app.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.agriconnect.app.data.model.GroupInputOrder
import com.agriconnect.app.data.repository.GroupInputOrderRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class GroupInputOrdersViewModel(
    private val repository: GroupInputOrderRepository = GroupInputOrderRepository()
) : ViewModel() {
    private val _orders = MutableStateFlow<List<GroupInputOrder>>(emptyList())
    val orders: StateFlow<List<GroupInputOrder>> = _orders

    private val _loading = MutableStateFlow(false)
    val loading: StateFlow<Boolean> = _loading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    init {
        fetchOrders()
    }

    fun fetchOrders() {
        _loading.value = true
        _error.value = null
        viewModelScope.launch {
            try {
                _orders.value = repository.fetchGroupOrders()
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _loading.value = false
            }
        }
    }

    fun createOrder(order: GroupInputOrder) {
        _loading.value = true
        _error.value = null
        viewModelScope.launch {
            try {
                val newOrder = repository.createGroupOrder(order)
                _orders.value = _orders.value + newOrder
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _loading.value = false
            }
        }
    }

    fun updateOrder(order: GroupInputOrder) {
        _loading.value = true
        _error.value = null
        viewModelScope.launch {
            try {
                val updated = repository.updateGroupOrder(order)
                _orders.value = _orders.value.map { if (it.id == updated.id) updated else it }
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _loading.value = false
            }
        }
    }
} 