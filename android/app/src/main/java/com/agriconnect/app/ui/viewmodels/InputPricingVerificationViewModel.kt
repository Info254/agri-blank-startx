package com.agriconnect.app.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.agriconnect.app.data.model.InputPricingVerification
import com.agriconnect.app.data.repository.InputPricingVerificationRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class InputPricingVerificationViewModel(
    private val repository: InputPricingVerificationRepository = InputPricingVerificationRepository()
) : ViewModel() {
    private val _verifications = MutableStateFlow<List<InputPricingVerification>>(emptyList())
    val verifications: StateFlow<List<InputPricingVerification>> = _verifications

    private val _loading = MutableStateFlow(false)
    val loading: StateFlow<Boolean> = _loading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    init {
        fetchVerifications()
    }

    fun fetchVerifications() {
        _loading.value = true
        _error.value = null
        viewModelScope.launch {
            try {
                _verifications.value = repository.fetchVerifications()
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _loading.value = false
            }
        }
    }

    fun submitVerification(verification: InputPricingVerification) {
        _loading.value = true
        _error.value = null
        viewModelScope.launch {
            try {
                val newVerification = repository.submitVerification(verification)
                _verifications.value = _verifications.value + newVerification
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _loading.value = false
            }
        }
    }

    fun verifyPrice(id: String) {
        _loading.value = true
        _error.value = null
        viewModelScope.launch {
            try {
                val updated = repository.verifyPrice(id)
                _verifications.value = _verifications.value.map { if (it.id == updated.id) updated else it }
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _loading.value = false
            }
        }
    }
} 