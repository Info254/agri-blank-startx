package com.agriconnect.app.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.agriconnect.app.data.model.MarketplaceListing
import com.agriconnect.app.data.repository.MarketplaceRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class MarketplaceViewModel(
    private val repository: MarketplaceRepository = MarketplaceRepository()
) : ViewModel() {
    private val _listings = MutableStateFlow<List<MarketplaceListing>>(emptyList())
    val listings: StateFlow<List<MarketplaceListing>> = _listings

    private val _loading = MutableStateFlow(false)
    val loading: StateFlow<Boolean> = _loading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    init {
        fetchListings()
    }

    fun fetchListings() {
        _loading.value = true
        _error.value = null
        viewModelScope.launch {
            try {
                _listings.value = repository.fetchListings()
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _loading.value = false
            }
        }
    }

    fun createListing(listing: MarketplaceListing) {
        _loading.value = true
        _error.value = null
        viewModelScope.launch {
            try {
                val newListing = repository.createListing(listing)
                _listings.value = _listings.value + newListing
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _loading.value = false
            }
        }
    }
} 