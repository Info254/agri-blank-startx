package com.agriconnect.app.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.agriconnect.app.data.model.BarterTrade
import com.agriconnect.app.data.repository.BarterTradeRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class BarterExchangeViewModel(
    private val repository: BarterTradeRepository = BarterTradeRepository()
) : ViewModel() {
    private val _trades = MutableStateFlow<List<BarterTrade>>(emptyList())
    val trades: StateFlow<List<BarterTrade>> = _trades

    private val _loading = MutableStateFlow(false)
    val loading: StateFlow<Boolean> = _loading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    init {
        fetchTrades()
    }

    fun fetchTrades() {
        _loading.value = true
        _error.value = null
        viewModelScope.launch {
            try {
                _trades.value = repository.fetchTrades()
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _loading.value = false
            }
        }
    }

    fun createTrade(trade: BarterTrade) {
        _loading.value = true
        _error.value = null
        viewModelScope.launch {
            try {
                val newTrade = repository.createTrade(trade)
                _trades.value = _trades.value + newTrade
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _loading.value = false
            }
        }
    }

    fun updateTrade(trade: BarterTrade) {
        _loading.value = true
        _error.value = null
        viewModelScope.launch {
            try {
                val updated = repository.updateTrade(trade)
                _trades.value = _trades.value.map { if (it.id == updated.id) updated else it }
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _loading.value = false
            }
        }
    }
} 