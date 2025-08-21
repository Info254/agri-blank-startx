package com.agriconnect.app.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.agriconnect.app.data.model.CityMarket
import com.agriconnect.app.data.model.Agent
import com.agriconnect.app.data.repository.CityMarketRepository
import com.agriconnect.app.data.repository.AgentRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class AdminDashboardViewModel(
    private val cityMarketRepository: CityMarketRepository = CityMarketRepository(),
    private val agentRepository: AgentRepository = AgentRepository()
) : ViewModel() {
    private val _markets = MutableStateFlow<List<CityMarket>>(emptyList())
    val markets: StateFlow<List<CityMarket>> = _markets

    private val _agents = MutableStateFlow<List<Agent>>(emptyList())
    val agents: StateFlow<List<Agent>> = _agents

    private val _loading = MutableStateFlow(false)
    val loading: StateFlow<Boolean> = _loading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    init {
        loadDashboardData()
    }

    fun loadDashboardData() {
        _loading.value = true
        viewModelScope.launch {
            try {
                _markets.value = cityMarketRepository.fetchMarkets()
                _agents.value = agentRepository.fetchAgents()
                _error.value = null
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _loading.value = false
            }
        }
    }
} 