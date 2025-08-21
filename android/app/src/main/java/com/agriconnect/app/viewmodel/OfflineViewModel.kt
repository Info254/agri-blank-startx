package com.agriconnect.app.viewmodel

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.agriconnect.app.data.model.OfflineData
import com.agriconnect.app.data.repository.OfflineRepository
import com.agriconnect.app.data.repository.Result
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class OfflineUiState(
    val offlineData: OfflineData? = null,
    val isLoading: Boolean = false,
    val error: String? = null,
    val successMessage: String? = null
)

class OfflineViewModel(context: Context) : ViewModel() {
    private val repository = OfflineRepository(context)
    private val _uiState = MutableStateFlow(OfflineUiState())
    val uiState: StateFlow<OfflineUiState> = _uiState.asStateFlow()

    fun saveData(data: OfflineData) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null, successMessage = null) }
            when (val result = repository.saveData(data)) {
                is Result.Success -> _uiState.update { it.copy(isLoading = false, successMessage = "Data saved for offline use!") }
                is Result.Error -> _uiState.update { it.copy(error = result.exception.message, isLoading = false) }
                else -> {}
            }
        }
    }
    fun loadData() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            when (val result = repository.loadData()) {
                is Result.Success -> _uiState.update { it.copy(offlineData = result.data, isLoading = false) }
                is Result.Error -> _uiState.update { it.copy(error = result.exception.message, isLoading = false) }
                else -> {}
            }
        }
    }
    fun clearCache() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null, successMessage = null) }
            when (val result = repository.clearCache()) {
                is Result.Success -> _uiState.update { it.copy(isLoading = false, successMessage = "Offline cache cleared!") }
                is Result.Error -> _uiState.update { it.copy(error = result.exception.message, isLoading = false) }
                else -> {}
            }
        }
    }
    // Add sync logic as needed
} 