package com.agriconnect.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.agriconnect.app.data.model.*
import com.agriconnect.app.data.repository.CooperativeRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class CooperativeViewModel @Inject constructor(
    private val cooperativeRepository: CooperativeRepository
) : ViewModel() {

    private val _cooperatives = MutableStateFlow<List<Cooperative>>(emptyList())
    val cooperatives: StateFlow<List<Cooperative>> = _cooperatives.asStateFlow()

    private val _groupFormations = MutableStateFlow<List<GroupFormation>>(emptyList())
    val groupFormations: StateFlow<List<GroupFormation>> = _groupFormations.asStateFlow()

    private val _myMemberships = MutableStateFlow<List<CooperativeMembership>>(emptyList())
    val myMemberships: StateFlow<List<CooperativeMembership>> = _myMemberships.asStateFlow()

    private val _applications = MutableStateFlow<List<CooperativeApplication>>(emptyList())
    val applications: StateFlow<List<CooperativeApplication>> = _applications.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _locationFilter = MutableStateFlow("all")
    val locationFilter: StateFlow<String> = _locationFilter.asStateFlow()

    private val _typeFilter = MutableStateFlow("all")
    val typeFilter: StateFlow<String> = _typeFilter.asStateFlow()

    init {
        loadCooperatives()
        loadUserMemberships()
        loadGroupFormations()
    }

    fun searchCooperatives(query: String) {
        _searchQuery.value = query
        filterCooperatives()
    }

    fun setLocationFilter(location: String) {
        _locationFilter.value = location
        filterCooperatives()
    }

    fun setTypeFilter(type: String) {
        _typeFilter.value = type
        filterCooperatives()
    }

    private fun filterCooperatives() {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                cooperativeRepository.searchCooperatives(
                    query = _searchQuery.value.takeIf { it.isNotBlank() },
                    county = _locationFilter.value.takeIf { it != "all" },
                    type = _typeFilter.value.takeIf { it != "all" }?.let { 
                        CooperativeType.valueOf(it.uppercase()) 
                    }
                ).collect { result ->
                    result.fold(
                        onSuccess = { cooperatives ->
                            _cooperatives.value = cooperatives
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
            }
        }
    }

    fun joinCooperative(cooperativeId: String, applicationData: ApplicationData) {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                val application = CooperativeApplication(
                    id = "app_${System.currentTimeMillis()}",
                    cooperativeId = cooperativeId,
                    applicantId = "current_user_id", // TODO: Get from auth service
                    applicantName = "Current User", // TODO: Get from auth service
                    applicationData = applicationData,
                    status = ApplicationStatus.SUBMITTED,
                    submittedAt = java.util.Date(),
                    reviewedAt = null,
                    reviewedBy = null,
                    reviewNotes = null
                )
                
                cooperativeRepository.submitMembershipApplication(application).collect { result ->
                    result.fold(
                        onSuccess = { submittedApplication ->
                            _applications.value = _applications.value + submittedApplication
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

    fun createGroupFormation(groupFormation: GroupFormation) {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                cooperativeRepository.createGroupFormation(groupFormation).collect { result ->
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
            _isLoading.value = true
            try {
                cooperativeRepository.expressInterestInGroup(
                    groupId = groupId,
                    userId = "current_user_id", // TODO: Get from auth service
                    message = message
                ).collect { result ->
                    result.fold(
                        onSuccess = { success ->
                            if (success) {
                                // Refresh group formations to get updated data
                                loadGroupFormations()
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
            } finally {
                _isLoading.value = false
            }
        }
    }

    private fun loadUserMemberships() {
        viewModelScope.launch {
            try {
                cooperativeRepository.getUserMemberships("current_user_id").collect { result ->
                    result.fold(
                        onSuccess = { memberships ->
                            _myMemberships.value = memberships
                            _error.value = null
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

    fun refreshMemberships() {
        loadUserMemberships()
    }

    fun clearError() {
        _error.value = null
    }

    private fun loadCooperatives() {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                cooperativeRepository.searchCooperatives(
                    limit = 50
                ).collect { result ->
                    result.fold(
                        onSuccess = { cooperatives ->
                            _cooperatives.value = cooperatives
                            _error.value = null
                        },
                        onFailure = { exception ->
                            _error.value = "Failed to load cooperatives: ${exception.message}"
                        }
                    )
                }
            } catch (e: Exception) {
                _error.value = "Loading error: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }

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
                            _error.value = null
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

    fun refresh() {
        loadCooperatives()
        loadUserMemberships()
        loadGroupFormations()
    }

}
