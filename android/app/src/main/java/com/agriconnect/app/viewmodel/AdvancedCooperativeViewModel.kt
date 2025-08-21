package com.agriconnect.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.agriconnect.app.data.model.*
import com.agriconnect.app.data.repository.CooperativeRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import java.util.Date
import javax.inject.Inject

@HiltViewModel
class AdvancedCooperativeViewModel @Inject constructor(
    private val cooperativeRepository: CooperativeRepository
) : ViewModel() {

    // State management with advanced filtering
    private val _cooperatives = MutableStateFlow<List<Cooperative>>(emptyList())
    val cooperatives: StateFlow<List<Cooperative>> = _cooperatives.asStateFlow()

    private val _filteredCooperatives = MutableStateFlow<List<Cooperative>>(emptyList())
    val filteredCooperatives: StateFlow<List<Cooperative>> = _filteredCooperatives.asStateFlow()

    private val _groupFormations = MutableStateFlow<List<GroupFormation>>(emptyList())
    val groupFormations: StateFlow<List<GroupFormation>> = _groupFormations.asStateFlow()

    private val _userMemberships = MutableStateFlow<List<CooperativeMembership>>(emptyList())
    val userMemberships: StateFlow<List<CooperativeMembership>> = _userMemberships.asStateFlow()

    private val _applications = MutableStateFlow<List<CooperativeApplication>>(emptyList())
    val applications: StateFlow<List<CooperativeApplication>> = _applications.asStateFlow()

    private val _recommendations = MutableStateFlow<List<CooperativeRecommendation>>(emptyList())
    val recommendations: StateFlow<List<CooperativeRecommendation>> = _recommendations.asStateFlow()

    private val _analytics = MutableStateFlow<CooperativeAnalytics?>(null)
    val analytics: StateFlow<CooperativeAnalytics?> = _analytics.asStateFlow()

    // UI State
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _isRefreshing = MutableStateFlow(false)
    val isRefreshing: StateFlow<Boolean> = _isRefreshing.asStateFlow()

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()

    // Advanced search and filter states
    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _selectedCounty = MutableStateFlow<String?>(null)
    val selectedCounty: StateFlow<String?> = _selectedCounty.asStateFlow()

    private val _selectedType = MutableStateFlow<CooperativeType?>(null)
    val selectedType: StateFlow<CooperativeType?> = _selectedType.asStateFlow()

    private val _selectedVerificationLevel = MutableStateFlow<VerificationLevel?>(null)
    val selectedVerificationLevel: StateFlow<VerificationLevel?> = _selectedVerificationLevel.asStateFlow()

    private val _isRecruitingOnly = MutableStateFlow(false)
    val isRecruitingOnly: StateFlow<Boolean> = _isRecruitingOnly.asStateFlow()

    private val _minPerformanceScore = MutableStateFlow(0.0)
    val minPerformanceScore: StateFlow<Double> = _minPerformanceScore.asStateFlow()

    private val _maxDistance = MutableStateFlow<Double?>(null)
    val maxDistance: StateFlow<Double?> = _maxDistance.asStateFlow()

    private val _userLocation = MutableStateFlow<Coordinates?>(null)
    val userLocation: StateFlow<Coordinates?> = _userLocation.asStateFlow()

    private val _selectedCertifications = MutableStateFlow<List<String>>(emptyList())
    val selectedCertifications: StateFlow<List<String>> = _selectedCertifications.asStateFlow()

    private val _selectedCommodities = MutableStateFlow<List<String>>(emptyList())
    val selectedCommodities: StateFlow<List<String>> = _selectedCommodities.asStateFlow()

    // Pagination
    private val _currentPage = MutableStateFlow(0)
    private val _hasMoreData = MutableStateFlow(true)
    val hasMoreData: StateFlow<Boolean> = _hasMoreData.asStateFlow()

    // Search debouncing
    private var searchJob: Job? = null
    private val searchDebounceMs = 500L

    init {
        // Initialize with recommendations and recent cooperatives
        loadInitialData()
        
        // Set up reactive search
        setupReactiveSearch()
    }

    private fun setupReactiveSearch() {
        // Combine all filter states and trigger search when any changes
        combine(
            searchQuery,
            selectedCounty,
            selectedType,
            selectedVerificationLevel,
            isRecruitingOnly,
            minPerformanceScore,
            maxDistance,
            selectedCertifications,
            selectedCommodities
        ) { query, county, type, verification, recruiting, minScore, distance, certs, commodities ->
            SearchParams(query, county, type, verification, recruiting, minScore, distance, certs, commodities)
        }.debounce(searchDebounceMs)
            .distinctUntilChanged()
            .onEach { params ->
                performSearch(params)
            }
            .launchIn(viewModelScope)
    }

    private fun loadInitialData() {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                // Load recommendations first for better UX
                loadRecommendations()
                
                // Load user memberships
                loadUserMemberships()
                
                // Load recent cooperatives
                searchCooperatives()
                
                // Load group formations
                loadGroupFormations()
                
            } catch (e: Exception) {
                _error.value = "Failed to load initial data: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    // Advanced search with all filters
    fun searchCooperatives(loadMore: Boolean = false) {
        searchJob?.cancel()
        searchJob = viewModelScope.launch {
            if (!loadMore) {
                _currentPage.value = 0
                _isLoading.value = true
            }

            try {
                cooperativeRepository.searchCooperatives(
                    query = _searchQuery.value.takeIf { it.isNotBlank() },
                    county = _selectedCounty.value,
                    type = _selectedType.value,
                    verificationLevel = _selectedVerificationLevel.value,
                    isRecruiting = _isRecruitingOnly.value.takeIf { it },
                    minPerformanceScore = _minPerformanceScore.value.takeIf { it > 0 },
                    maxDistance = _maxDistance.value,
                    userLocation = _userLocation.value,
                    certifications = _selectedCertifications.value.takeIf { it.isNotEmpty() },
                    commodities = _selectedCommodities.value.takeIf { it.isNotEmpty() },
                    limit = 20,
                    offset = _currentPage.value * 20
                ).collect { result ->
                    result.fold(
                        onSuccess = { newCooperatives ->
                            if (loadMore) {
                                _cooperatives.value = _cooperatives.value + newCooperatives
                            } else {
                                _cooperatives.value = newCooperatives
                            }
                            _hasMoreData.value = newCooperatives.size == 20
                            _currentPage.value += 1
                            _error.value = null
                        },
                        onFailure = { exception ->
                            _error.value = "Search failed: ${exception.message}"
                        }
                    )
                }
            } catch (e: Exception) {
                _error.value = "Search error: ${e.message}"
            } finally {
                _isLoading.value = false
                _isRefreshing.value = false
            }
        }
    }

    private suspend fun performSearch(params: SearchParams) {
        cooperativeRepository.searchCooperatives(
            query = params.query.takeIf { it.isNotBlank() },
            county = params.county,
            type = params.type,
            verificationLevel = params.verificationLevel,
            isRecruiting = params.isRecruiting.takeIf { it },
            minPerformanceScore = params.minPerformanceScore.takeIf { it > 0 },
            maxDistance = params.maxDistance,
            userLocation = _userLocation.value,
            certifications = params.certifications.takeIf { it.isNotEmpty() },
            commodities = params.commodities.takeIf { it.isNotEmpty() },
            limit = 20
        ).collect { result ->
            result.fold(
                onSuccess = { cooperatives ->
                    _cooperatives.value = cooperatives
                    _currentPage.value = 1
                    _hasMoreData.value = cooperatives.size == 20
                },
                onFailure = { exception ->
                    _error.value = "Search failed: ${exception.message}"
                }
            )
        }
    }

    // Filter management
    fun updateSearchQuery(query: String) {
        _searchQuery.value = query
    }

    fun setCountyFilter(county: String?) {
        _selectedCounty.value = county
    }

    fun setTypeFilter(type: CooperativeType?) {
        _selectedType.value = type
    }

    fun setVerificationFilter(level: VerificationLevel?) {
        _selectedVerificationLevel.value = level
    }

    fun setRecruitingFilter(recruitingOnly: Boolean) {
        _isRecruitingOnly.value = recruitingOnly
    }

    fun setPerformanceFilter(minScore: Double) {
        _minPerformanceScore.value = minScore
    }

    fun setDistanceFilter(maxDistanceKm: Double?) {
        _maxDistance.value = maxDistanceKm
    }

    fun updateUserLocation(location: Coordinates) {
        _userLocation.value = location
    }

    fun setCertificationFilter(certifications: List<String>) {
        _selectedCertifications.value = certifications
    }

    fun setCommodityFilter(commodities: List<String>) {
        _selectedCommodities.value = commodities
    }

    fun clearAllFilters() {
        _selectedCounty.value = null
        _selectedType.value = null
        _selectedVerificationLevel.value = null
        _isRecruitingOnly.value = false
        _minPerformanceScore.value = 0.0
        _maxDistance.value = null
        _selectedCertifications.value = emptyList()
        _selectedCommodities.value = emptyList()
    }

    // Cooperative registration with validation
    fun registerCooperative(cooperative: Cooperative) {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                cooperativeRepository.registerCooperative(cooperative).collect { result ->
                    result.fold(
                        onSuccess = { registeredCooperative ->
                            _cooperatives.value = listOf(registeredCooperative) + _cooperatives.value
                            _error.value = null
                        },
                        onFailure = { exception ->
                            _error.value = "Registration failed: ${exception.message}"
                        }
                    )
                }
            } catch (e: Exception) {
                _error.value = "Registration error: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    // Advanced membership application with document upload
    fun submitMembershipApplication(
        cooperativeId: String,
        applicationData: ApplicationData,
        supportingDocuments: List<String> = emptyList()
    ) {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                val application = CooperativeApplication(
                    id = "app_${System.currentTimeMillis()}",
                    cooperativeId = cooperativeId,
                    applicantId = "current_user_id", // TODO: Get from auth
                    applicantName = "Current User", // TODO: Get from auth
                    applicationData = applicationData,
                    status = ApplicationStatus.SUBMITTED,
                    submittedAt = Date(),
                    reviewedAt = null,
                    reviewedBy = null,
                    reviewNotes = null
                )

                cooperativeRepository.submitMembershipApplication(application).collect { result ->
                    result.fold(
                        onSuccess = { submittedApplication ->
                            _applications.value = listOf(submittedApplication) + _applications.value
                            _error.value = null
                        },
                        onFailure = { exception ->
                            _error.value = "Application failed: ${exception.message}"
                        }
                    )
                }
            } catch (e: Exception) {
                _error.value = "Application error: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    // Group formation management
    fun createGroupFormation(group: GroupFormation) {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                cooperativeRepository.createGroupFormation(group).collect { result ->
                    result.fold(
                        onSuccess = { createdGroup ->
                            _groupFormations.value = listOf(createdGroup) + _groupFormations.value
                            _error.value = null
                        },
                        onFailure = { exception ->
                            _error.value = "Group creation failed: ${exception.message}"
                        }
                    )
                }
            } catch (e: Exception) {
                _error.value = "Group creation error: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun expressInterestInGroup(groupId: String, message: String? = null) {
        viewModelScope.launch {
            try {
                cooperativeRepository.expressInterestInGroup(
                    groupId = groupId,
                    userId = "current_user_id", // TODO: Get from auth
                    message = message
                ).collect { result ->
                    result.fold(
                        onSuccess = { success ->
                            if (success) {
                                // Update local state
                                _groupFormations.value = _groupFormations.value.map { group ->
                                    if (group.id == groupId) {
                                        group.copy(
                                            interestedMembers = group.interestedMembers + "current_user_id",
                                            currentMembers = group.currentMembers + 1
                                        )
                                    } else {
                                        group
                                    }
                                }
                                _error.value = null
                            }
                        },
                        onFailure = { exception ->
                            _error.value = "Failed to express interest: ${exception.message}"
                        }
                    )
                }
            } catch (e: Exception) {
                _error.value = "Interest expression error: ${e.message}"
            }
        }
    }

    // Load user memberships with performance tracking
    private fun loadUserMemberships() {
        viewModelScope.launch {
            try {
                cooperativeRepository.getUserMemberships("current_user_id").collect { result ->
                    result.fold(
                        onSuccess = { memberships ->
                            _userMemberships.value = memberships
                        },
                        onFailure = { exception ->
                            _error.value = "Failed to load memberships: ${exception.message}"
                        }
                    )
                }
            } catch (e: Exception) {
                _error.value = "Membership loading error: ${e.message}"
            }
        }
    }

    // Load group formations with advanced filtering
    private fun loadGroupFormations() {
        viewModelScope.launch {
            try {
                cooperativeRepository.searchGroupFormations(
                    status = GroupFormationStatus.FORMING,
                    limit = 50
                ).collect { result ->
                    result.fold(
                        onSuccess = { groups ->
                            _groupFormations.value = groups
                        },
                        onFailure = { exception ->
                            _error.value = "Failed to load groups: ${exception.message}"
                        }
                    )
                }
            } catch (e: Exception) {
                _error.value = "Group loading error: ${e.message}"
            }
        }
    }

    // AI-powered recommendations
    private fun loadRecommendations() {
        viewModelScope.launch {
            try {
                cooperativeRepository.getRecommendedCooperatives("current_user_id").collect { result ->
                    result.fold(
                        onSuccess = { recommendations ->
                            _recommendations.value = recommendations
                        },
                        onFailure = { exception ->
                            // Don't show error for recommendations as it's not critical
                        }
                    )
                }
            } catch (e: Exception) {
                // Silent fail for recommendations
            }
        }
    }

    // Load cooperative analytics
    fun loadCooperativeAnalytics(cooperativeId: String) {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                cooperativeRepository.getCooperativeAnalytics(cooperativeId).collect { result ->
                    result.fold(
                        onSuccess = { analytics ->
                            _analytics.value = analytics
                            _error.value = null
                        },
                        onFailure = { exception ->
                            _error.value = "Failed to load analytics: ${exception.message}"
                        }
                    )
                }
            } catch (e: Exception) {
                _error.value = "Analytics error: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    // Refresh data
    fun refresh() {
        _isRefreshing.value = true
        _currentPage.value = 0
        searchCooperatives()
        loadUserMemberships()
        loadGroupFormations()
        loadRecommendations()
    }

    // Load more data for pagination
    fun loadMore() {
        if (_hasMoreData.value && !_isLoading.value) {
            searchCooperatives(loadMore = true)
        }
    }

    // Utility functions
    fun getCooperativeById(id: String): Cooperative? {
        return _cooperatives.value.find { it.id == id }
    }

    fun getUserMembershipForCooperative(cooperativeId: String): CooperativeMembership? {
        return _userMemberships.value.find { it.cooperativeId == cooperativeId }
    }

    fun isUserMemberOf(cooperativeId: String): Boolean {
        return getUserMembershipForCooperative(cooperativeId) != null
    }

    fun clearError() {
        _error.value = null
    }

    // Data classes for internal use
    private data class SearchParams(
        val query: String,
        val county: String?,
        val type: CooperativeType?,
        val verificationLevel: VerificationLevel?,
        val isRecruiting: Boolean,
        val minPerformanceScore: Double,
        val maxDistance: Double?,
        val certifications: List<String>,
        val commodities: List<String>
    )
}
