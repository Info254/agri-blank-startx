package com.agriconnect.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.agriconnect.app.data.model.Warehouse
import com.agriconnect.app.data.model.WarehouseBooking
import com.agriconnect.app.data.repository.WarehouseRepository
import com.agriconnect.app.data.repository.Result
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class WarehouseUiState(
    val warehouses: List<Warehouse> = emptyList(),
    val bookings: List<WarehouseBooking> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
    val successMessage: String? = null
)

class WarehouseViewModel(
    private val repository: WarehouseRepository = WarehouseRepository()
) : ViewModel() {
    private val _uiState = MutableStateFlow(WarehouseUiState())
    val uiState: StateFlow<WarehouseUiState> = _uiState.asStateFlow()

    fun loadWarehouses() {
        viewModelScope.launch {
            repository.fetchWarehouses().collect { result ->
                when (result) {
                    is Result.Loading -> _uiState.update { it.copy(isLoading = true, error = null) }
                    is Result.Success -> _uiState.update { it.copy(warehouses = result.data, isLoading = false, error = null) }
                    is Result.Error -> _uiState.update { it.copy(isLoading = false, error = result.exception.message) }
                }
            }
        }
    }
    fun loadBookings(userId: String) {
        viewModelScope.launch {
            repository.fetchWarehouseBookings(userId).collect { result ->
                when (result) {
                    is Result.Loading -> _uiState.update { it.copy(isLoading = true, error = null) }
                    is Result.Success -> _uiState.update { it.copy(bookings = result.data, isLoading = false, error = null) }
                    is Result.Error -> _uiState.update { it.copy(isLoading = false, error = result.exception.message) }
                }
            }
        }
    }
    fun createBooking(booking: WarehouseBooking) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null, successMessage = null) }
            when (val result = repository.createWarehouseBooking(booking)) {
                is Result.Success -> {
                    // Optionally reload bookings
                    _uiState.update { it.copy(successMessage = "Booking created successfully", isLoading = false) }
                }
                is Result.Error -> _uiState.update { it.copy(error = result.exception.message, isLoading = false) }
                else -> {}
            }
        }
    }
} 