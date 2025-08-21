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
class SupplyChainAnalyticsViewModel @Inject constructor(
    private val regulatoryRepository: RegulatoryRepository
) : ViewModel() {

    private val _churnPredictions = MutableStateFlow<List<ChurnPrediction>>(emptyList())
    val churnPredictions: StateFlow<List<ChurnPrediction>> = _churnPredictions.asStateFlow()

    private val _optimizations = MutableStateFlow<List<SupplyChainOptimization>>(emptyList())
    val optimizations: StateFlow<List<SupplyChainOptimization>> = _optimizations.asStateFlow()

    private val _relationshipHealth = MutableStateFlow<List<RelationshipHealth>>(emptyList())
    val relationshipHealth: StateFlow<List<RelationshipHealth>> = _relationshipHealth.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()

    private val _selectedPlayerType = MutableStateFlow("all")
    val selectedPlayerType: StateFlow<String> = _selectedPlayerType.asStateFlow()

    private val _selectedRiskLevel = MutableStateFlow("all")
    val selectedRiskLevel: StateFlow<String> = _selectedRiskLevel.asStateFlow()

    init {
        loadChurnPredictions()
        loadOptimizations()
        loadRelationshipHealth()
    }

    fun setPlayerTypeFilter(playerType: String) {
        _selectedPlayerType.value = playerType
        loadChurnPredictions()
    }

    fun setRiskLevelFilter(riskLevel: String) {
        _selectedRiskLevel.value = riskLevel
        loadChurnPredictions()
    }

    private fun loadChurnPredictions() {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                regulatoryRepository.getChurnPredictions(
                    playerType = _selectedPlayerType.value.takeIf { it != "all" },
                    riskLevel = _selectedRiskLevel.value.takeIf { it != "all" }
                ).collect { result ->
                    result.fold(
                        onSuccess = { predictions ->
                            _churnPredictions.value = predictions
                            _error.value = null
                        },
                        onFailure = { exception ->
                            _error.value = "Failed to load churn predictions: ${exception.message}"
                        }
                    )
                }
            } catch (e: Exception) {
                _error.value = "Failed to load churn predictions: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    private fun loadOptimizations() {
        viewModelScope.launch {
            try {
                regulatoryRepository.getSupplyChainOptimizations()
                    .collect { result ->
                        result.fold(
                            onSuccess = { optimizations ->
                                _optimizations.value = optimizations
                            },
                            onFailure = { exception ->
                                _error.value = "Failed to load optimizations: ${exception.message}"
                            }
                        )
                    }
            } catch (e: Exception) {
                _error.value = "Failed to load optimizations: ${e.message}"
            }
        }
    }

    private fun loadRelationshipHealth() {
        viewModelScope.launch {
            try {
                regulatoryRepository.getRelationshipHealth()
                    .collect { result ->
                        result.fold(
                            onSuccess = { relationships ->
                                _relationshipHealth.value = relationships
                            },
                            onFailure = { exception ->
                                _error.value = "Failed to load relationship health: ${exception.message}"
                            }
                        )
                    }
            } catch (e: Exception) {
                _error.value = "Failed to load relationship health: ${e.message}"
            }
        }
    }

    fun runChurnAnalysis() {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                // Refresh churn predictions with latest AI/ML analysis
                loadChurnPredictions()
                _error.value = null
            } catch (e: Exception) {
                _error.value = "Failed to run churn analysis: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun implementOptimization(optimizationId: String) {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                regulatoryRepository.updateOptimizationStatus(
                    optimizationId = optimizationId,
                    status = "IN_PROGRESS"
                ).collect { result ->
                    result.fold(
                        onSuccess = { updatedOptimization ->
                            val updatedOptimizations = _optimizations.value.map { optimization ->
                                if (optimization.id == optimizationId) {
                                    updatedOptimization
                                } else {
                                    optimization
                                }
                            }
                            _optimizations.value = updatedOptimizations
                            _error.value = null
                        },
                        onFailure = { exception ->
                            _error.value = "Failed to implement optimization: ${exception.message}"
                        }
                    )
                }
            } catch (e: Exception) {
                _error.value = "Failed to implement optimization: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun assessRelationshipHealth() {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                // Refresh relationship health data
                loadRelationshipHealth()
                _error.value = null
            } catch (e: Exception) {
                _error.value = "Failed to assess relationship health: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun getHighRiskPlayers(): List<ChurnPrediction> {
        return _churnPredictions.value.filter { 
            it.riskLevel == RiskLevel.HIGH || it.riskLevel == RiskLevel.CRITICAL 
        }
    }

    fun getOptimizationsByROI(): List<SupplyChainOptimization> {
        return _optimizations.value.sortedByDescending { it.roi }
    }

    fun getUnhealthyRelationships(): List<RelationshipHealth> {
        return _relationshipHealth.value.filter { it.healthScore < 60.0 }
    }

    fun clearError() {
        _error.value = null
    }

    fun refresh() {
        loadChurnPredictions()
        loadOptimizations()
        loadRelationshipHealth()
    }
}
