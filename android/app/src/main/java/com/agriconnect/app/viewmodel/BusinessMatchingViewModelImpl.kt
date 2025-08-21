package com.agriconnect.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.agriconnect.app.data.model.*
import com.agriconnect.app.data.repository.BusinessMatchingRepositoryImpl
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class BusinessMatchingViewModelImpl @Inject constructor(
    private val businessMatchingRepository: BusinessMatchingRepositoryImpl
) : ViewModel() {

    private val _uiState = MutableStateFlow(BusinessMatchingUiState())
    val uiState: StateFlow<BusinessMatchingUiState> = _uiState.asStateFlow()

    private val _filters = MutableStateFlow(BusinessMatchingFilters())
    val filters: StateFlow<BusinessMatchingFilters> = _filters.asStateFlow()

    init {
        loadBusinessProfiles()
        loadFeaturedProfiles()
    }

    fun loadBusinessProfiles() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            
            businessMatchingRepository.getBusinessProfiles(_filters.value).collect { profiles ->
                _uiState.value = _uiState.value.copy(
                    businessProfiles = profiles,
                    isLoading = false
                )
            }
        }
    }

    fun loadUserProfile(userId: String) {
        viewModelScope.launch {
            val profile = businessMatchingRepository.getUserBusinessProfile(userId)
            _uiState.value = _uiState.value.copy(userProfile = profile)
            
            profile?.let { loadMatches(it.id) }
        }
    }

    fun loadMatches(profileId: String) {
        viewModelScope.launch {
            businessMatchingRepository.getBusinessMatches(profileId, _filters.value).collect { matches ->
                _uiState.value = _uiState.value.copy(matches = matches)
            }
        }
    }

    fun searchProfiles(query: String) {
        if (query.isBlank()) {
            loadBusinessProfiles()
            return
        }

        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            
            businessMatchingRepository.searchBusinessProfiles(query, _filters.value).collect { profiles ->
                _uiState.value = _uiState.value.copy(
                    businessProfiles = profiles,
                    isLoading = false
                )
            }
        }
    }

    fun applyFilters(filters: BusinessMatchingFilters) {
        _filters.value = filters
        loadBusinessProfiles()
    }

    fun clearFilters() {
        _filters.value = BusinessMatchingFilters()
        loadBusinessProfiles()
    }

    fun createBusinessProfile(profileData: CreateBusinessProfileData, userId: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isSubmitting = true)
            
            businessMatchingRepository.createBusinessProfile(profileData, userId).fold(
                onSuccess = { profile ->
                    _uiState.value = _uiState.value.copy(
                        isSubmitting = false,
                        userProfile = profile,
                        message = "Business profile created successfully!"
                    )
                    loadMatches(profile.id)
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

    fun updateBusinessProfile(profileId: String, updates: Map<String, Any>) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isSubmitting = true)
            
            businessMatchingRepository.updateBusinessProfile(profileId, updates).fold(
                onSuccess = { profile ->
                    _uiState.value = _uiState.value.copy(
                        isSubmitting = false,
                        userProfile = profile,
                        message = "Profile updated successfully!"
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

    fun loadProfileDetails(profileId: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoadingDetails = true)
            
            val profile = businessMatchingRepository.getBusinessProfile(profileId)
            val averageRating = businessMatchingRepository.getAverageRating(profileId)
            val statistics = businessMatchingRepository.getProfileStatistics(profileId)
            
            _uiState.value = _uiState.value.copy(
                selectedProfile = profile,
                selectedProfileRating = averageRating,
                selectedProfileStats = statistics,
                isLoadingDetails = false
            )
        }
    }

    fun expressInterest(recipientProfileId: String, message: String) {
        viewModelScope.launch {
            _uiState.value.userProfile?.let { userProfile ->
                val interactionData = CreateInteractionData(
                    recipientProfileId = recipientProfileId,
                    interactionType = InteractionType.INTEREST_EXPRESSED,
                    message = message
                )
                
                businessMatchingRepository.createInteraction(userProfile.id, interactionData).fold(
                    onSuccess = {
                        _uiState.value = _uiState.value.copy(
                            message = "Interest expressed successfully!"
                        )
                    },
                    onFailure = { error ->
                        _uiState.value = _uiState.value.copy(error = error.message)
                    }
                )
            }
        }
    }

    fun sendMessage(recipientProfileId: String, message: String) {
        viewModelScope.launch {
            _uiState.value.userProfile?.let { userProfile ->
                val interactionData = CreateInteractionData(
                    recipientProfileId = recipientProfileId,
                    interactionType = InteractionType.MESSAGE_SENT,
                    message = message
                )
                
                businessMatchingRepository.createInteraction(userProfile.id, interactionData).fold(
                    onSuccess = {
                        _uiState.value = _uiState.value.copy(
                            message = "Message sent successfully!"
                        )
                    },
                    onFailure = { error ->
                        _uiState.value = _uiState.value.copy(error = error.message)
                    }
                )
            }
        }
    }

    fun updateMatchStatus(matchId: String, status: MatchStatus) {
        viewModelScope.launch {
            businessMatchingRepository.updateMatchStatus(matchId, status).fold(
                onSuccess = {
                    _uiState.value = _uiState.value.copy(
                        message = "Match status updated"
                    )
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(error = error.message)
                }
            )
        }
    }

    fun refreshMatches() {
        viewModelScope.launch {
            _uiState.value.userProfile?.let { profile ->
                _uiState.value = _uiState.value.copy(isRefreshing = true)
                
                businessMatchingRepository.refreshMatches(profile.id).fold(
                    onSuccess = { count ->
                        _uiState.value = _uiState.value.copy(
                            isRefreshing = false,
                            message = "$count new matches generated!"
                        )
                        loadMatches(profile.id)
                    },
                    onFailure = { error ->
                        _uiState.value = _uiState.value.copy(
                            isRefreshing = false,
                            error = error.message
                        )
                    }
                )
            }
        }
    }

    fun loadFeaturedProfiles() {
        viewModelScope.launch {
            val featured = businessMatchingRepository.getFeaturedProfiles()
            _uiState.value = _uiState.value.copy(featuredProfiles = featured)
        }
    }

    fun loadRecommendedProfiles() {
        viewModelScope.launch {
            _uiState.value.userProfile?.let { profile ->
                val recommended = businessMatchingRepository.getRecommendedProfiles(profile.id)
                _uiState.value = _uiState.value.copy(recommendedProfiles = recommended)
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
class BusinessInteractionViewModel @Inject constructor(
    private val businessMatchingRepository: BusinessMatchingRepositoryImpl
) : ViewModel() {

    private val _uiState = MutableStateFlow(BusinessInteractionUiState())
    val uiState: StateFlow<BusinessInteractionUiState> = _uiState.asStateFlow()

    fun loadInteractions(profileId: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            
            businessMatchingRepository.getInteractions(profileId).collect { interactions ->
                _uiState.value = _uiState.value.copy(
                    interactions = interactions,
                    isLoading = false
                )
            }
        }
    }

    fun updateInteractionStatus(interactionId: String, status: InteractionStatus) {
        viewModelScope.launch {
            businessMatchingRepository.updateInteractionStatus(interactionId, status).fold(
                onSuccess = {
                    _uiState.value = _uiState.value.copy(
                        message = "Interaction updated"
                    )
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(error = error.message)
                }
            )
        }
    }

    fun markAsRead(interactionId: String) {
        viewModelScope.launch {
            businessMatchingRepository.markInteractionAsRead(interactionId)
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
class BusinessRatingViewModel @Inject constructor(
    private val businessMatchingRepository: BusinessMatchingRepositoryImpl
) : ViewModel() {

    private val _uiState = MutableStateFlow(BusinessRatingUiState())
    val uiState: StateFlow<BusinessRatingUiState> = _uiState.asStateFlow()

    fun loadRatings(profileId: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            
            businessMatchingRepository.getBusinessRatings(profileId).collect { ratings ->
                _uiState.value = _uiState.value.copy(
                    ratings = ratings,
                    isLoading = false
                )
            }
        }
    }

    fun createRating(raterProfileId: String, ratingData: CreateRatingData) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isSubmitting = true)
            
            businessMatchingRepository.createRating(raterProfileId, ratingData).fold(
                onSuccess = { rating ->
                    _uiState.value = _uiState.value.copy(
                        isSubmitting = false,
                        message = "Rating submitted successfully!",
                        createdRating = rating
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

    fun clearMessage() {
        _uiState.value = _uiState.value.copy(message = null)
    }

    fun clearError() {
        _uiState.value = _uiState.value.copy(error = null)
    }
}

@HiltViewModel
class BusinessAnalyticsViewModel @Inject constructor(
    private val businessMatchingRepository: BusinessMatchingRepositoryImpl
) : ViewModel() {

    private val _uiState = MutableStateFlow(BusinessAnalyticsUiState())
    val uiState: StateFlow<BusinessAnalyticsUiState> = _uiState.asStateFlow()

    fun loadAnalytics(profileId: String, days: Int = 30) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            
            businessMatchingRepository.getProfileAnalytics(profileId, days).collect { analytics ->
                _uiState.value = _uiState.value.copy(
                    analytics = analytics,
                    isLoading = false
                )
            }
        }
    }
}

// UI State Data Classes
data class BusinessMatchingUiState(
    val businessProfiles: List<BusinessProfile> = emptyList(),
    val matches: List<BusinessMatchingScore> = emptyList(),
    val featuredProfiles: List<BusinessProfile> = emptyList(),
    val recommendedProfiles: List<BusinessProfile> = emptyList(),
    val userProfile: BusinessProfile? = null,
    val selectedProfile: BusinessProfile? = null,
    val selectedProfileRating: Double = 0.0,
    val selectedProfileStats: Map<String, Int> = emptyMap(),
    val isLoading: Boolean = false,
    val isLoadingDetails: Boolean = false,
    val isSubmitting: Boolean = false,
    val isRefreshing: Boolean = false,
    val error: String? = null,
    val message: String? = null
)

data class BusinessInteractionUiState(
    val interactions: List<BusinessInteraction> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
    val message: String? = null
)

data class BusinessRatingUiState(
    val ratings: List<BusinessRating> = emptyList(),
    val createdRating: BusinessRating? = null,
    val isLoading: Boolean = false,
    val isSubmitting: Boolean = false,
    val error: String? = null,
    val message: String? = null
)

data class BusinessAnalyticsUiState(
    val analytics: List<BusinessProfileAnalytics> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null
)
