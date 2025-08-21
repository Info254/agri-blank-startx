package com.agriconnect.app.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.agriconnect.app.data.model.SupplierReview
import com.agriconnect.app.data.repository.SupplierReviewRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class SupplierReviewDashboardViewModel(
    private val reviewRepository: SupplierReviewRepository = SupplierReviewRepository()
) : ViewModel() {
    private val _reviews = MutableStateFlow<List<SupplierReview>>(emptyList())
    val reviews: StateFlow<List<SupplierReview>> = _reviews

    private val _loading = MutableStateFlow(false)
    val loading: StateFlow<Boolean> = _loading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    init {
        loadReviews()
    }

    fun loadReviews() {
        _loading.value = true
        viewModelScope.launch {
            try {
                _reviews.value = reviewRepository.fetchReviews()
                _error.value = null
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _loading.value = false
            }
        }
    }
} 