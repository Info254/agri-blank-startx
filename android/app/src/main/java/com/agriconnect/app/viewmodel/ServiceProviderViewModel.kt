package com.agriconnect.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.agriconnect.app.data.model.ServiceProvider
import com.agriconnect.app.data.repository.ServiceProviderRepository
import com.agriconnect.app.data.repository.Result
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class ServiceProviderUiState(
    val providers: List<ServiceProvider> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
    val successMessage: String? = null
)

class ServiceProviderViewModel(
    private val repository: ServiceProviderRepository = ServiceProviderRepository()
) : ViewModel() {
    private val _uiState = MutableStateFlow(ServiceProviderUiState())
    val uiState: StateFlow<ServiceProviderUiState> = _uiState.asStateFlow()

    fun loadProviders() {
        viewModelScope.launch {
            repository.fetchServiceProviders().collect { result ->
                when (result) {
                    is Result.Loading -> _uiState.update { it.copy(isLoading = true, error = null) }
                    is Result.Success -> _uiState.update { it.copy(providers = result.data, isLoading = false, error = null) }
                    is Result.Error -> _uiState.update { it.copy(isLoading = false, error = result.exception.message) }
                }
            }
        }
    }
    fun createProvider(provider: ServiceProvider) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null, successMessage = null) }
            when (val result = repository.createServiceProvider(provider)) {
                is Result.Success -> {
                    loadProviders()
                    _uiState.update { it.copy(successMessage = "Provider created successfully", isLoading = false) }
                }
                is Result.Error -> _uiState.update { it.copy(error = result.exception.message, isLoading = false) }
                else -> {}
            }
        }
    }
    fun updateProvider(provider: ServiceProvider) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null, successMessage = null) }
            when (val result = repository.updateServiceProvider(provider)) {
                is Result.Success -> {
                    loadProviders()
                    _uiState.update { it.copy(successMessage = "Provider updated successfully", isLoading = false) }
                }
                is Result.Error -> _uiState.update { it.copy(error = result.exception.message, isLoading = false) }
                else -> {}
            }
        }
    }
    fun deleteProvider(id: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null, successMessage = null) }
            when (val result = repository.deleteServiceProvider(id)) {
                is Result.Success -> {
                    loadProviders()
                    _uiState.update { it.copy(successMessage = "Provider deleted successfully", isLoading = false) }
                }
                is Result.Error -> _uiState.update { it.copy(error = result.exception.message, isLoading = false) }
                else -> {}
            }
        }
    }
} 