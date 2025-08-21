package com.agriconnect.app.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.agriconnect.app.data.model.PriceTrend
import com.agriconnect.app.data.repository.PriceTrendsRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class PriceTrendsViewModel(
    private val repository: PriceTrendsRepository = PriceTrendsRepository()
) : ViewModel() {
    private val _trends = MutableStateFlow<List<PriceTrend>>(emptyList())
    val trends: StateFlow<List<PriceTrend>> = _trends

    private val _loading = MutableStateFlow(false)
    val loading: StateFlow<Boolean> = _loading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    init {
        fetchTrends()
    }

    fun fetchTrends() {
        _loading.value = true
        _error.value = null
        viewModelScope.launch {
            try {
                _trends.value = repository.fetchPriceTrends()
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _loading.value = false
            }
        }
    }
} 