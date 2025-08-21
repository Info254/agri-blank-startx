package com.agriconnect.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.agriconnect.app.data.model.*
import com.agriconnect.app.data.repository.LogisticsRepositoryImpl
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class LogisticsViewModelImpl @Inject constructor(
    private val logisticsRepository: LogisticsRepositoryImpl
) : ViewModel() {

    private val _uiState = MutableStateFlow(LogisticsUiState())
    val uiState: StateFlow<LogisticsUiState> = _uiState.asStateFlow()

    private val _filters = MutableStateFlow(ShipmentFilters())
    val filters: StateFlow<ShipmentFilters> = _filters.asStateFlow()

    private val _selectedShipmentId = MutableStateFlow<String?>(null)
    
    // Real-time tracking updates
    val trackingUpdates: StateFlow<List<TrackingEvent>> = _selectedShipmentId
        .filterNotNull()
        .flatMapLatest { shipmentId ->
            logisticsRepository.getShipmentTracking(shipmentId)
        }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(), emptyList())

    init {
        loadShipments()
        loadLogisticsProviders()
    }

    fun loadShipments() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            
            logisticsRepository.getShipments(_filters.value).collect { shipments ->
                _uiState.value = _uiState.value.copy(
                    shipments = shipments,
                    isLoading = false
                )
            }
        }
    }

    fun loadLogisticsProviders(
        serviceArea: String? = null,
        vehicleType: String? = null,
        specialization: String? = null
    ) {
        viewModelScope.launch {
            logisticsRepository.getLogisticsProviders(serviceArea, vehicleType, specialization).collect { providers ->
                _uiState.value = _uiState.value.copy(logisticsProviders = providers)
            }
        }
    }

    fun searchShipments(query: String) {
        if (query.isBlank()) {
            loadShipments()
            return
        }

        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            
            logisticsRepository.searchShipments(query).collect { shipments ->
                _uiState.value = _uiState.value.copy(
                    shipments = shipments,
                    isLoading = false
                )
            }
        }
    }

    fun applyFilters(filters: ShipmentFilters) {
        _filters.value = filters
        loadShipments()
    }

    fun clearFilters() {
        _filters.value = ShipmentFilters()
        loadShipments()
    }

    fun loadShipmentDetails(shipmentId: String) {
        _selectedShipmentId.value = shipmentId
        
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoadingDetails = true)
            
            val shipment = logisticsRepository.getShipmentById(shipmentId)
            _uiState.value = _uiState.value.copy(
                selectedShipment = shipment,
                isLoadingDetails = false
            )
        }
    }

    fun createShipment(shipmentData: CreateShipmentFormData, shipperId: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isSubmitting = true)
            
            logisticsRepository.createShipment(shipmentData, shipperId).fold(
                onSuccess = { shipment ->
                    _uiState.value = _uiState.value.copy(
                        isSubmitting = false,
                        message = "Shipment request created successfully!",
                        createdShipment = shipment
                    )
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(
                        isSubmitting = false,
                        error = error.message
                    )
                }
            )
        }
    }

    fun updateShipmentStatus(shipmentId: String, status: ShipmentStatus) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isSubmitting = true)
            
            logisticsRepository.updateShipmentStatus(shipmentId, status).fold(
                onSuccess = {
                    _uiState.value = _uiState.value.copy(
                        isSubmitting = false,
                        message = "Shipment status updated"
                    )
                    loadShipmentDetails(shipmentId)
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(
                        isSubmitting = false,
                        error = error.message
                    )
                }
            )
        }
    }

    fun assignVehicleAndDriver(shipmentId: String, vehicleId: String, driverId: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isSubmitting = true)
            
            logisticsRepository.assignVehicleAndDriver(shipmentId, vehicleId, driverId).fold(
                onSuccess = {
                    _uiState.value = _uiState.value.copy(
                        isSubmitting = false,
                        message = "Vehicle and driver assigned successfully"
                    )
                    loadShipmentDetails(shipmentId)
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(
                        isSubmitting = false,
                        error = error.message
                    )
                }
            )
        }
    }

    fun addTrackingEvent(
        shipmentId: String,
        eventType: TrackingEventType,
        location: LocationPoint? = null,
        address: String? = null,
        notes: String? = null,
        userId: String
    ) {
        viewModelScope.launch {
            val event = TrackingEvent(
                id = "",
                shipmentId = shipmentId,
                eventType = eventType,
                location = location,
                address = address,
                timestamp = "",
                notes = notes,
                createdBy = userId
            )

            logisticsRepository.addTrackingEvent(event).fold(
                onSuccess = {
                    _uiState.value = _uiState.value.copy(
                        message = "Tracking event added"
                    )
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(error = error.message)
                }
            )
        }
    }

    fun rateShipment(shipmentId: String, rating: Int, feedback: String, isShipperRating: Boolean) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isSubmitting = true)
            
            logisticsRepository.rateShipment(shipmentId, rating, feedback, isShipperRating).fold(
                onSuccess = {
                    _uiState.value = _uiState.value.copy(
                        isSubmitting = false,
                        message = "Rating submitted successfully"
                    )
                    loadShipmentDetails(shipmentId)
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(
                        isSubmitting = false,
                        error = error.message
                    )
                }
            )
        }
    }

    fun calculateShippingQuote(
        providerId: String,
        distance: Double,
        weight: Double,
        pickupDate: String
    ) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isCalculatingQuote = true)
            
            logisticsRepository.calculateShippingQuote(providerId, distance, weight, pickupDate).fold(
                onSuccess = { costBreakdown ->
                    _uiState.value = _uiState.value.copy(
                        isCalculatingQuote = false,
                        shippingQuote = costBreakdown
                    )
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(
                        isCalculatingQuote = false,
                        error = error.message
                    )
                }
            )
        }
    }

    fun clearMessage() {
        _uiState.value = _uiState.value.copy(message = null)
    }

    fun clearError() {
        _uiState.value = _uiState.value.copy(error = null)
    }

    fun clearShippingQuote() {
        _uiState.value = _uiState.value.copy(shippingQuote = null)
    }
}

@HiltViewModel
class LogisticsProviderViewModel @Inject constructor(
    private val logisticsRepository: LogisticsRepositoryImpl
) : ViewModel() {

    private val _uiState = MutableStateFlow(LogisticsProviderUiState())
    val uiState: StateFlow<LogisticsProviderUiState> = _uiState.asStateFlow()

    fun loadProviderProfile(userId: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            
            // Load provider profile, vehicles, drivers, and KPIs
            // This would require additional repository methods
        }
    }

    fun loadProviderVehicles(providerId: String) {
        viewModelScope.launch {
            logisticsRepository.getProviderVehicles(providerId).collect { vehicles ->
                _uiState.value = _uiState.value.copy(vehicles = vehicles)
            }
        }
    }

    fun loadProviderDrivers(providerId: String) {
        viewModelScope.launch {
            logisticsRepository.getProviderDrivers(providerId).collect { drivers ->
                _uiState.value = _uiState.value.copy(drivers = drivers)
            }
        }
    }

    fun createVehicle(vehicle: Vehicle) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isSubmitting = true)
            
            logisticsRepository.createVehicle(vehicle).fold(
                onSuccess = { createdVehicle ->
                    _uiState.value = _uiState.value.copy(
                        isSubmitting = false,
                        message = "Vehicle added successfully",
                        createdVehicle = createdVehicle
                    )
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(
                        isSubmitting = false,
                        error = error.message
                    )
                }
            )
        }
    }

    fun createDriver(driver: Driver) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isSubmitting = true)
            
            logisticsRepository.createDriver(driver).fold(
                onSuccess = { createdDriver ->
                    _uiState.value = _uiState.value.copy(
                        isSubmitting = false,
                        message = "Driver added successfully",
                        createdDriver = createdDriver
                    )
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(
                        isSubmitting = false,
                        error = error.message
                    )
                }
            )
        }
    }

    fun updateVehicleStatus(vehicleId: String, status: VehicleStatus) {
        viewModelScope.launch {
            logisticsRepository.updateVehicleStatus(vehicleId, status).fold(
                onSuccess = {
                    _uiState.value = _uiState.value.copy(
                        message = "Vehicle status updated"
                    )
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(error = error.message)
                }
            )
        }
    }

    fun updateDriverStatus(driverId: String, status: DriverStatus) {
        viewModelScope.launch {
            logisticsRepository.updateDriverStatus(driverId, status).fold(
                onSuccess = {
                    _uiState.value = _uiState.value.copy(
                        message = "Driver status updated"
                    )
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(error = error.message)
                }
            )
        }
    }

    fun loadKPIsHistory(providerId: String) {
        viewModelScope.launch {
            logisticsRepository.getProviderKPIsHistory(providerId).collect { kpis ->
                _uiState.value = _uiState.value.copy(kpisHistory = kpis)
            }
        }
    }

    fun loadCostFactors(providerId: String) {
        viewModelScope.launch {
            logisticsRepository.getCostFactors(providerId).collect { factors ->
                _uiState.value = _uiState.value.copy(costFactors = factors)
            }
        }
    }

    fun clearMessage() {
        _uiState.value = _uiState.value.copy(message = null)
    }

    fun clearError() {
        _uiState.value = _uiState.value.copy(error = null)
    }
}

@HiltViewModel
class GPSTrackingViewModel @Inject constructor(
    private val logisticsRepository: LogisticsRepositoryImpl
) : ViewModel() {

    private val _uiState = MutableStateFlow(GPSTrackingUiState())
    val uiState: StateFlow<GPSTrackingUiState> = _uiState.asStateFlow()

    fun loadGPSHistory(shipmentId: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            
            logisticsRepository.getGPSTrackingHistory(shipmentId).collect { trackingPoints ->
                _uiState.value = _uiState.value.copy(
                    trackingPoints = trackingPoints,
                    isLoading = false
                )
            }
        }
    }

    fun addGPSTrackingPoint(tracking: GPSTracking) {
        viewModelScope.launch {
            logisticsRepository.addGPSTrackingPoint(tracking).fold(
                onSuccess = {
                    // GPS point added successfully
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(error = error.message)
                }
            )
        }
    }

    fun clearError() {
        _uiState.value = _uiState.value.copy(error = null)
    }
}

// UI State Data Classes
data class LogisticsUiState(
    val shipments: List<Shipment> = emptyList(),
    val selectedShipment: Shipment? = null,
    val logisticsProviders: List<LogisticsProvider> = emptyList(),
    val createdShipment: Shipment? = null,
    val shippingQuote: ShippingCostBreakdown? = null,
    val isLoading: Boolean = false,
    val isLoadingDetails: Boolean = false,
    val isSubmitting: Boolean = false,
    val isCalculatingQuote: Boolean = false,
    val error: String? = null,
    val message: String? = null
)

data class LogisticsProviderUiState(
    val provider: LogisticsProvider? = null,
    val vehicles: List<Vehicle> = emptyList(),
    val drivers: List<Driver> = emptyList(),
    val kpisHistory: List<LogisticsKPIs> = emptyList(),
    val costFactors: List<CostFactor> = emptyList(),
    val createdVehicle: Vehicle? = null,
    val createdDriver: Driver? = null,
    val isLoading: Boolean = false,
    val isSubmitting: Boolean = false,
    val error: String? = null,
    val message: String? = null
)

data class GPSTrackingUiState(
    val trackingPoints: List<GPSTracking> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null
)
