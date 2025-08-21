package com.agriconnect.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.agriconnect.app.data.model.*
import com.agriconnect.app.data.repository.LogisticsRepository
import com.agriconnect.app.data.repository.Result
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class LogisticsUiState(
    val providers: List<LogisticsProvider> = emptyList(),
    val aggregators: List<Aggregator> = emptyList(),
    val processors: List<Processor> = emptyList(),
    val filteredProviders: List<LogisticsProvider> = emptyList(),
    val nearbyProviders: List<LogisticsProvider> = emptyList(),
    val selectedProvider: LogisticsProvider? = null,
    val providerRatings: Map<String, Double> = emptyMap(),
    val searchQuery: String = "",
    val activeFilters: LogisticsFilters = LogisticsFilters(),
    val userLocation: Location? = null,
    val isLoading: Boolean = false,
    val isLoadingDetails: Boolean = false,
    val isSearching: Boolean = false,
    val error: String? = null,
    val message: String? = null
)

data class LogisticsFilters(
    val serviceTypes: List<LogisticsServiceType> = emptyList(),
    val vehicleTypes: List<VehicleType> = emptyList(),
    val maxDistance: Double? = null,
    val minRating: Double? = null,
    val priceRange: Pair<Double, Double>? = null,
    val isVerifiedOnly: Boolean = false,
    val hasInsurance: Boolean = false,
    val operatesInRegions: List<String> = emptyList()
)

data class Location(
    val latitude: Double,
    val longitude: Double,
    val address: String? = null
)

@HiltViewModel
class LogisticsViewModel @Inject constructor(
    private val repository: LogisticsRepository
) : ViewModel() {
    private val _uiState = MutableStateFlow(LogisticsUiState())
    val uiState: StateFlow<LogisticsUiState> = _uiState.asStateFlow()

    init {
        loadProviders()
        loadAggregators()
        loadProcessors()
    }

    fun loadProviders() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            
            repository.fetchLogisticsProviders().collect { result ->
                when (result) {
                    is Result.Loading -> _uiState.update { it.copy(isLoading = true) }
                    is Result.Success -> {
                        val providers = result.data
                        _uiState.update { state ->
                            state.copy(
                                providers = providers,
                                filteredProviders = applyFiltersToProviders(providers, state.activeFilters),
                                isLoading = false,
                                error = null
                            )
                        }
                        loadProviderRatings(providers.map { it.id })
                    }
                    is Result.Error -> _uiState.update { it.copy(isLoading = false, error = result.exception.message) }
                }
            }
        }
    }

    fun loadAggregators() {
        viewModelScope.launch {
            repository.fetchAggregators().collect { result ->
                when (result) {
                    is Result.Loading -> _uiState.update { it.copy(isLoading = true, error = null) }
                    is Result.Success -> _uiState.update { it.copy(aggregators = result.data, isLoading = false, error = null) }
                    is Result.Error -> _uiState.update { it.copy(isLoading = false, error = result.exception.message) }
                }
            }
        }
    }

    fun loadProcessors() {
        viewModelScope.launch {
            repository.fetchProcessors().collect { result ->
                when (result) {
                    is Result.Loading -> _uiState.update { it.copy(isLoading = true, error = null) }
                    is Result.Success -> _uiState.update { it.copy(processors = result.data, isLoading = false, error = null) }
                    is Result.Error -> _uiState.update { it.copy(isLoading = false, error = result.exception.message) }
                }
            }
        }
    }

    fun searchProviders(query: String) {
        _uiState.update { it.copy(searchQuery = query, isSearching = true) }
        
        if (query.isBlank()) {
            _uiState.update { state ->
                state.copy(
                    filteredProviders = applyFiltersToProviders(state.providers, state.activeFilters),
                    isSearching = false
                )
            }
            return
        }

        viewModelScope.launch {
            repository.searchLogisticsProviders(query, _uiState.value.activeFilters).collect { result ->
                when (result) {
                    is Result.Success -> {
                        _uiState.update { state ->
                            state.copy(
                                filteredProviders = result.data,
                                isSearching = false
                            )
                        }
                    }
                    is Result.Error -> {
                        _uiState.update { state ->
                            state.copy(
                                error = result.exception.message,
                                isSearching = false
                            )
                        }
                    }
                    is Result.Loading -> {
                        _uiState.update { it.copy(isSearching = true) }
                    }
                }
            }
        }
    }

    fun applyFilters(filters: LogisticsFilters) {
        _uiState.update { state ->
            state.copy(
                activeFilters = filters,
                filteredProviders = applyFiltersToProviders(state.providers, filters)
            )
        }
    }

    fun clearFilters() {
        val emptyFilters = LogisticsFilters()
        _uiState.update { state ->
            state.copy(
                activeFilters = emptyFilters,
                filteredProviders = state.providers
            )
        }
    }

    fun loadProviderDetails(providerId: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoadingDetails = true) }
            
            val provider = repository.getLogisticsProvider(providerId)
            _uiState.update { state ->
                state.copy(
                    selectedProvider = provider,
                    isLoadingDetails = false
                )
            }
        }
    }

    fun loadNearbyProviders(location: Location, radiusKm: Double = 50.0) {
        viewModelScope.launch {
            _uiState.update { it.copy(userLocation = location, isLoading = true) }
            
            repository.getNearbyProviders(location.latitude, location.longitude, radiusKm).collect { result ->
                when (result) {
                    is Result.Success -> {
                        _uiState.update { state ->
                            state.copy(
                                nearbyProviders = result.data,
                                isLoading = false
                            )
                        }
                    }
                    is Result.Error -> {
                        _uiState.update { state ->
                            state.copy(
                                error = result.exception.message,
                                isLoading = false
                            )
                        }
                    }
                    is Result.Loading -> {
                        _uiState.update { it.copy(isLoading = true) }
                    }
                }
            }
        }
    }

    fun requestQuote(providerId: String, quoteRequest: LogisticsQuoteRequest) {
        viewModelScope.launch {
            repository.requestQuote(providerId, quoteRequest).fold(
                onSuccess = {
                    _uiState.update { state ->
                        state.copy(message = "Quote request sent successfully!")
                    }
                },
                onFailure = { error ->
                    _uiState.update { state ->
                        state.copy(error = error.message)
                    }
                }
            )
        }
    }

    fun bookService(providerId: String, bookingRequest: LogisticsBookingRequest) {
        viewModelScope.launch {
            repository.bookLogisticsService(providerId, bookingRequest).fold(
                onSuccess = { booking ->
                    _uiState.update { state ->
                        state.copy(message = "Service booked successfully! Booking ID: ${booking.id}")
                    }
                },
                onFailure = { error ->
                    _uiState.update { state ->
                        state.copy(error = error.message)
                    }
                }
            )
        }
    }

    private fun loadProviderRatings(providerIds: List<String>) {
        viewModelScope.launch {
            val ratings = mutableMapOf<String, Double>()
            providerIds.forEach { providerId ->
                val rating = repository.getProviderAverageRating(providerId)
                ratings[providerId] = rating
            }
            _uiState.update { it.copy(providerRatings = ratings) }
        }
    }

    private fun applyFiltersToProviders(providers: List<LogisticsProvider>, filters: LogisticsFilters): List<LogisticsProvider> {
        return providers.filter { provider ->
            // Service type filter
            if (filters.serviceTypes.isNotEmpty()) {
                filters.serviceTypes.any { it in provider.serviceTypes }
            } else true
        }.filter { provider ->
            // Vehicle type filter
            if (filters.vehicleTypes.isNotEmpty()) {
                filters.vehicleTypes.any { it in provider.vehicleTypes }
            } else true
        }.filter { provider ->
            // Rating filter
            filters.minRating?.let { minRating ->
                (_uiState.value.providerRatings[provider.id] ?: 0.0) >= minRating
            } ?: true
        }.filter { provider ->
            // Verification filter
            if (filters.isVerifiedOnly) provider.isVerified else true
        }.filter { provider ->
            // Insurance filter
            if (filters.hasInsurance) provider.hasInsurance else true
        }.filter { provider ->
            // Region filter
            if (filters.operatesInRegions.isNotEmpty()) {
                filters.operatesInRegions.any { region ->
                    provider.operatingRegions.contains(region)
                }
            } else true
        }
    }

    fun clearMessage() {
        _uiState.update { it.copy(message = null) }
    }

    fun clearError() {
        _uiState.update { it.copy(error = null) }
    }
}

@HiltViewModel
class LogisticsRatingViewModel @Inject constructor(
    private val repository: LogisticsRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(LogisticsRatingUiState())
    val uiState: StateFlow<LogisticsRatingUiState> = _uiState.asStateFlow()

    fun loadProviderRatings(providerId: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }
            
            repository.getProviderRatings(providerId).collect { result ->
                when (result) {
                    is Result.Success -> {
                        _uiState.update { state ->
                            state.copy(
                                ratings = result.data,
                                isLoading = false
                            )
                        }
                    }
                    is Result.Error -> {
                        _uiState.update { state ->
                            state.copy(
                                error = result.exception.message,
                                isLoading = false
                            )
                        }
                    }
                    is Result.Loading -> {
                        _uiState.update { it.copy(isLoading = true) }
                    }
                }
            }
        }
    }

    fun submitRating(providerId: String, ratingData: LogisticsRatingData) {
        viewModelScope.launch {
            _uiState.update { it.copy(isSubmitting = true) }
            
            repository.submitProviderRating(providerId, ratingData).fold(
                onSuccess = { rating ->
                    _uiState.update { state ->
                        state.copy(
                            isSubmitting = false,
                            message = "Rating submitted successfully!",
                            submittedRating = rating
                        )
                    }
                },
                onFailure = { error ->
                    _uiState.update { state ->
                        state.copy(
                            isSubmitting = false,
                            error = error.message
                        )
                    }
                }
            )
        }
    }

    fun clearMessage() {
        _uiState.update { it.copy(message = null) }
    }

    fun clearError() {
        _uiState.update { it.copy(error = null) }
    }
}

@HiltViewModel
class LogisticsAnalyticsViewModel @Inject constructor(
    private val repository: LogisticsRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(LogisticsAnalyticsUiState())
    val uiState: StateFlow<LogisticsAnalyticsUiState> = _uiState.asStateFlow()

    fun loadAnalytics(providerId: String, days: Int = 30) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }
            
            repository.getProviderAnalytics(providerId, days).collect { result ->
                when (result) {
                    is Result.Success -> {
                        _uiState.update { state ->
                            state.copy(
                                analytics = result.data,
                                isLoading = false
                            )
                        }
                    }
                    is Result.Error -> {
                        _uiState.update { state ->
                            state.copy(
                                error = result.exception.message,
                                isLoading = false
                            )
                        }
                    }
                    is Result.Loading -> {
                        _uiState.update { it.copy(isLoading = true) }
                    }
                }
            }
        }
    }

    fun loadPerformanceMetrics(providerId: String) {
        viewModelScope.launch {
            val metrics = repository.getProviderPerformanceMetrics(providerId)
            _uiState.update { it.copy(performanceMetrics = metrics) }
        }
    }
}

@HiltViewModel
class LogisticsTrackingViewModel @Inject constructor(
    private val repository: LogisticsRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(LogisticsTrackingUiState())
    val uiState: StateFlow<LogisticsTrackingUiState> = _uiState.asStateFlow()

    fun trackShipment(trackingId: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }
            
            repository.getShipmentTracking(trackingId).collect { result ->
                when (result) {
                    is Result.Success -> {
                        _uiState.update { state ->
                            state.copy(
                                trackingInfo = result.data,
                                isLoading = false
                            )
                        }
                    }
                    is Result.Error -> {
                        _uiState.update { state ->
                            state.copy(
                                error = result.exception.message,
                                isLoading = false
                            )
                        }
                    }
                    is Result.Loading -> {
                        _uiState.update { it.copy(isLoading = true) }
                    }
                }
            }
        }
    }

    fun loadUserShipments(userId: String) {
        viewModelScope.launch {
            repository.getUserShipments(userId).collect { result ->
                when (result) {
                    is Result.Success -> {
                        _uiState.update { state ->
                            state.copy(userShipments = result.data)
                        }
                    }
                    is Result.Error -> {
                        _uiState.update { state ->
                            state.copy(error = result.exception.message)
                        }
                    }
                    is Result.Loading -> {
                        _uiState.update { it.copy(isLoading = true) }
                    }
                }
            }
        }
    }

    fun updateShipmentStatus(shipmentId: String, status: ShipmentStatus, location: Location? = null) {
        viewModelScope.launch {
            repository.updateShipmentStatus(shipmentId, status, location).fold(
                onSuccess = {
                    _uiState.update { state ->
                        state.copy(message = "Shipment status updated successfully!")
                    }
                },
                onFailure = { error ->
                    _uiState.update { state ->
                        state.copy(error = error.message)
                    }
                }
            )
        }
    }

    fun clearMessage() {
        _uiState.update { it.copy(message = null) }
    }

    fun clearError() {
        _uiState.update { it.copy(error = null) }
    }
}

// UI State Data Classes
data class LogisticsRatingUiState(
    val ratings: List<LogisticsRating> = emptyList(),
    val submittedRating: LogisticsRating? = null,
    val isLoading: Boolean = false,
    val isSubmitting: Boolean = false,
    val error: String? = null,
    val message: String? = null
)

data class LogisticsAnalyticsUiState(
    val analytics: List<LogisticsAnalytics> = emptyList(),
    val performanceMetrics: LogisticsPerformanceMetrics? = null,
    val isLoading: Boolean = false,
    val error: String? = null
)

data class LogisticsTrackingUiState(
    val trackingInfo: ShipmentTracking? = null,
    val userShipments: List<Shipment> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
    val message: String? = null
)