package com.agriconnect.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.agriconnect.app.data.model.*
import com.agriconnect.app.data.repository.RegulatoryRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.util.Date
import javax.inject.Inject

@HiltViewModel
class RegulatoryViewModel @Inject constructor(
    private val regulatoryRepository: RegulatoryRepository
) : ViewModel() {

    private val _alerts = MutableStateFlow<List<RegulatoryAlert>>(emptyList())
    val alerts: StateFlow<List<RegulatoryAlert>> = _alerts.asStateFlow()

    private val _behavioralMetrics = MutableStateFlow<List<BehavioralMetric>>(emptyList())
    val behavioralMetrics: StateFlow<List<BehavioralMetric>> = _behavioralMetrics.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _categoryFilter = MutableStateFlow("all")
    val categoryFilter: StateFlow<String> = _categoryFilter.asStateFlow()

    private val _severityFilter = MutableStateFlow("all")
    val severityFilter: StateFlow<String> = _severityFilter.asStateFlow()

    private val _regionFilter = MutableStateFlow("all")
    val regionFilter: StateFlow<String> = _regionFilter.asStateFlow()

    init {
        loadRegulatoryAlerts()
        loadBehavioralMetrics()
    }

    fun searchAlerts(query: String) {
        _searchQuery.value = query
        loadRegulatoryAlerts()
    }

    fun setCategoryFilter(category: String) {
        _categoryFilter.value = category
        loadRegulatoryAlerts()
    }

    fun setSeverityFilter(severity: String) {
        _severityFilter.value = severity
        loadRegulatoryAlerts()
    }

    fun setRegionFilter(region: String) {
        _regionFilter.value = region
        loadRegulatoryAlerts()
    }

    private fun loadRegulatoryAlerts() {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                regulatoryRepository.searchRegulatoryAlerts(
                    query = _searchQuery.value.takeIf { it.isNotEmpty() },
                    category = _categoryFilter.value.takeIf { it != "all" },
                    severity = _severityFilter.value.takeIf { it != "all" },
                    region = _regionFilter.value.takeIf { it != "all" }
                ).collect { result ->
                    result.fold(
                        onSuccess = { alerts ->
                            _alerts.value = alerts
                            _error.value = null
                        },
                        onFailure = { exception ->
                            _error.value = "Failed to load alerts: ${exception.message}"
                        }
                    )
                }
            } catch (e: Exception) {
                _error.value = "Failed to load alerts: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    private fun loadBehavioralMetrics() {
        viewModelScope.launch {
            try {
                regulatoryRepository.getBehavioralMetrics()
                    .collect { result ->
                        result.fold(
                            onSuccess = { metrics ->
                                _behavioralMetrics.value = metrics
                            },
                            onFailure = { exception ->
                                _error.value = "Failed to load behavioral metrics: ${exception.message}"
                            }
                        )
                    }
            } catch (e: Exception) {
                _error.value = "Failed to load behavioral metrics: ${e.message}"
            }
        }
    }

    fun postAlert(alert: RegulatoryAlert) {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                regulatoryRepository.createRegulatoryAlert(alert)
                    .collect { result ->
                        result.fold(
                            onSuccess = { createdAlert ->
                                _alerts.value = _alerts.value + createdAlert
                                _error.value = null
                            },
                            onFailure = { exception ->
                                _error.value = "Failed to post alert: ${exception.message}"
                            }
                        )
                    }
            } catch (e: Exception) {
                _error.value = "Failed to post alert: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun submitBehavioralReport(metric: BehavioralMetric) {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                regulatoryRepository.submitBehavioralMetric(metric)
                    .collect { result ->
                        result.fold(
                            onSuccess = { submittedMetric ->
                                _behavioralMetrics.value = _behavioralMetrics.value + submittedMetric
                                _error.value = null
                            },
                            onFailure = { exception ->
                                _error.value = "Failed to submit behavioral report: ${exception.message}"
                            }
                        )
                    }
            } catch (e: Exception) {
                _error.value = "Failed to submit behavioral report: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun likeAlert(alertId: String) {
        viewModelScope.launch {
            try {
                regulatoryRepository.updateAlertEngagement(alertId, "like", "current_user_id")
                    .collect { result ->
                        result.fold(
                            onSuccess = { success ->
                                if (success) {
                                    val updatedAlerts = _alerts.value.map { alert ->
                                        if (alert.id == alertId) {
                                            alert.copy(likes = alert.likes + 1)
                                        } else {
                                            alert
                                        }
                                    }
                                    _alerts.value = updatedAlerts
                                }
                            },
                            onFailure = { exception ->
                                _error.value = "Failed to like alert: ${exception.message}"
                            }
                        )
                    }
            } catch (e: Exception) {
                _error.value = "Failed to like alert: ${e.message}"
            }
        }
    }

    fun shareAlert(alertId: String) {
        viewModelScope.launch {
            try {
                regulatoryRepository.updateAlertEngagement(alertId, "share", "current_user_id")
                    .collect { result ->
                        result.fold(
                            onSuccess = { success ->
                                if (success) {
                                    // Share alert via platform sharing mechanism
                                    val alert = _alerts.value.find { it.id == alertId }
                                    alert?.let {
                                        // Platform sharing logic here
                                    }
                                }
                            },
                            onFailure = { exception ->
                                _error.value = "Failed to share alert: ${exception.message}"
                            }
                        )
                    }
            } catch (e: Exception) {
                _error.value = "Failed to share alert: ${e.message}"
            }
        }
    }

    fun markAlertAsViewed(alertId: String) {
        viewModelScope.launch {
            try {
                regulatoryRepository.updateAlertEngagement(alertId, "view", "current_user_id")
                    .collect { result ->
                        result.fold(
                            onSuccess = { success ->
                                if (success) {
                                    val updatedAlerts = _alerts.value.map { alert ->
                                        if (alert.id == alertId) {
                                            alert.copy(views = alert.views + 1)
                                        } else {
                                            alert
                                        }
                                    }
                                    _alerts.value = updatedAlerts
                                }
                            },
                            onFailure = { exception ->
                                _error.value = "Failed to mark alert as viewed: ${exception.message}"
                            }
                        )
                    }
            } catch (e: Exception) {
                _error.value = "Failed to mark alert as viewed: ${e.message}"
            }
        }
    }

    fun clearError() {
        _error.value = null
    }

    fun refresh() {
        loadRegulatoryAlerts()
        loadBehavioralMetrics()
    }
}
