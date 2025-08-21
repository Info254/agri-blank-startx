package com.agriconnect.app.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.agriconnect.app.data.model.ReverseBulkAuction
import com.agriconnect.app.data.repository.ReverseBulkAuctionRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class ReverseBulkAuctionsViewModel(
    private val repository: ReverseBulkAuctionRepository = ReverseBulkAuctionRepository()
) : ViewModel() {
    private val _auctions = MutableStateFlow<List<ReverseBulkAuction>>(emptyList())
    val auctions: StateFlow<List<ReverseBulkAuction>> = _auctions

    private val _loading = MutableStateFlow(false)
    val loading: StateFlow<Boolean> = _loading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    init {
        fetchAuctions()
    }

    fun fetchAuctions() {
        _loading.value = true
        _error.value = null
        viewModelScope.launch {
            try {
                _auctions.value = repository.fetchAuctions()
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _loading.value = false
            }
        }
    }

    fun createAuction(auction: ReverseBulkAuction) {
        _loading.value = true
        _error.value = null
        viewModelScope.launch {
            try {
                val newAuction = repository.createAuction(auction)
                _auctions.value = _auctions.value + newAuction
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _loading.value = false
            }
        }
    }

    fun updateAuction(auction: ReverseBulkAuction) {
        _loading.value = true
        _error.value = null
        viewModelScope.launch {
            try {
                val updated = repository.updateAuction(auction)
                _auctions.value = _auctions.value.map { if (it.id == updated.id) updated else it }
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _loading.value = false
            }
        }
    }
} 