package com.agriconnect.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.agriconnect.app.data.model.FoodRescueListing
import com.agriconnect.app.data.model.FoodRescueMatch
import com.agriconnect.app.data.repository.FoodRescueRepository
import com.agriconnect.app.data.repository.Result
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class FoodRescueUiState(
    val listings: List<FoodRescueListing> = emptyList(),
    val matches: List<FoodRescueMatch> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
    val successMessage: String? = null
)

class FoodRescueViewModel(
    private val repository: FoodRescueRepository = FoodRescueRepository()
) : ViewModel() {
    private val _uiState = MutableStateFlow(FoodRescueUiState())
    val uiState: StateFlow<FoodRescueUiState> = _uiState.asStateFlow()

    fun loadListings() {
        viewModelScope.launch {
            repository.fetchListings().collect { result ->
                when (result) {
                    is Result.Loading -> _uiState.update { it.copy(isLoading = true, error = null) }
                    is Result.Success -> _uiState.update { it.copy(listings = result.data, isLoading = false, error = null) }
                    is Result.Error -> _uiState.update { it.copy(isLoading = false, error = result.exception.message) }
                }
            }
        }
    }
    fun loadMatches() {
        viewModelScope.launch {
            repository.fetchMatches().collect { result ->
                when (result) {
                    is Result.Loading -> _uiState.update { it.copy(isLoading = true, error = null) }
                    is Result.Success -> _uiState.update { it.copy(matches = result.data, isLoading = false, error = null) }
                    is Result.Error -> _uiState.update { it.copy(isLoading = false, error = result.exception.message) }
                }
            }
        }
    }
    fun createListing(listing: FoodRescueListing) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null, successMessage = null) }
            when (val result = repository.createListing(listing)) {
                is Result.Success -> {
                    loadListings()
                    _uiState.update { it.copy(successMessage = "Listing created successfully", isLoading = false) }
                }
                is Result.Error -> _uiState.update { it.copy(error = result.exception.message, isLoading = false) }
                else -> {}
            }
        }
    }
} 