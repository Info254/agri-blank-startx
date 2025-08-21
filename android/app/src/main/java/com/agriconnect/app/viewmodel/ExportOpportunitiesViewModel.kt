package com.agriconnect.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.agriconnect.app.data.model.*
import com.agriconnect.app.data.repository.ExportOpportunitiesRepository
import com.agriconnect.app.data.repository.Result
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class ExportOpportunitiesUiState(
    val opportunities: List<ExportOpportunity> = emptyList(),
    val filteredOpportunities: List<ExportOpportunity> = emptyList(),
    val featuredOpportunities: List<ExportOpportunity> = emptyList(),
    val userApplications: List<ExportApplication> = emptyList(),
    val selectedOpportunity: ExportOpportunity? = null,
    val selectedApplication: ExportApplication? = null,
    val searchQuery: String = "",
    val activeFilters: ExportFilters = ExportFilters(),
    val isLoading: Boolean = false,
    val isLoadingDetails: Boolean = false,
    val isSearching: Boolean = false,
    val isSubmitting: Boolean = false,
    val error: String? = null,
    val message: String? = null
)

@HiltViewModel
class ExportOpportunitiesViewModel @Inject constructor(
    private val repository: ExportOpportunitiesRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(ExportOpportunitiesUiState())
    val uiState: StateFlow<ExportOpportunitiesUiState> = _uiState.asStateFlow()

    init {
        loadOpportunities()
        loadFeaturedOpportunities()
    }

    fun loadOpportunities() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            
            repository.getExportOpportunities(_uiState.value.activeFilters).collect { result ->
                when (result) {
                    is Result.Loading -> _uiState.update { it.copy(isLoading = true) }
                    is Result.Success -> {
                        val opportunities = result.data
                        _uiState.update { state ->
                            state.copy(
                                opportunities = opportunities,
                                filteredOpportunities = opportunities,
                                isLoading = false,
                                error = null
                            )
                        }
                    }
                    is Result.Error -> _uiState.update { it.copy(isLoading = false, error = result.exception.message) }
                }
            }
        }
    }

    fun searchOpportunities(query: String) {
        _uiState.update { it.copy(searchQuery = query, isSearching = true) }
        
        if (query.isBlank()) {
            _uiState.update { state ->
                state.copy(
                    filteredOpportunities = applyFiltersToOpportunities(state.opportunities, state.activeFilters),
                    isSearching = false
                )
            }
            return
        }

        viewModelScope.launch {
            repository.searchExportOpportunities(query, _uiState.value.activeFilters).collect { result ->
                when (result) {
                    is Result.Success -> {
                        _uiState.update { state ->
                            state.copy(
                                filteredOpportunities = result.data,
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

    fun applyFilters(filters: ExportFilters) {
        _uiState.update { state ->
            state.copy(
                activeFilters = filters,
                filteredOpportunities = applyFiltersToOpportunities(state.opportunities, filters)
            )
        }
    }

    fun clearFilters() {
        val emptyFilters = ExportFilters()
        _uiState.update { state ->
            state.copy(
                activeFilters = emptyFilters,
                filteredOpportunities = state.opportunities
            )
        }
    }

    fun loadOpportunityDetails(opportunityId: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoadingDetails = true) }
            
            val opportunity = repository.getExportOpportunity(opportunityId)
            _uiState.update { state ->
                state.copy(
                    selectedOpportunity = opportunity,
                    isLoadingDetails = false
                )
            }
        }
    }

    fun applyToOpportunity(opportunityId: String, applicationData: CreateExportApplicationData) {
        viewModelScope.launch {
            _uiState.update { it.copy(isSubmitting = true) }
            
            repository.createExportApplication(opportunityId, applicationData).fold(
                onSuccess = { application ->
                    _uiState.update { state ->
                        state.copy(
                            isSubmitting = false,
                            message = "Application submitted successfully!",
                            selectedApplication = application
                        )
                    }
                    loadUserApplications(applicationData.farmerId)
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

    fun loadUserApplications(userId: String) {
        viewModelScope.launch {
            repository.getUserExportApplications(userId).collect { result ->
                when (result) {
                    is Result.Success -> {
                        _uiState.update { state ->
                            state.copy(userApplications = result.data)
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

    fun updateApplicationStatus(applicationId: String, status: ApplicationStatus) {
        viewModelScope.launch {
            repository.updateApplicationStatus(applicationId, status).fold(
                onSuccess = {
                    _uiState.update { state ->
                        state.copy(message = "Application status updated successfully!")
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

    fun withdrawApplication(applicationId: String) {
        updateApplicationStatus(applicationId, ApplicationStatus.WITHDRAWN)
    }

    fun loadFeaturedOpportunities() {
        viewModelScope.launch {
            val featured = repository.getFeaturedOpportunities()
            _uiState.update { it.copy(featuredOpportunities = featured) }
        }
    }

    fun bookmarkOpportunity(opportunityId: String, userId: String) {
        viewModelScope.launch {
            repository.bookmarkOpportunity(opportunityId, userId).fold(
                onSuccess = {
                    _uiState.update { state ->
                        state.copy(message = "Opportunity bookmarked!")
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

    private fun applyFiltersToOpportunities(opportunities: List<ExportOpportunity>, filters: ExportFilters): List<ExportOpportunity> {
        return opportunities.filter { opportunity ->
            // Commodity filter
            filters.commodity?.let { commodity ->
                opportunity.commodity.contains(commodity, ignoreCase = true)
            } ?: true
        }.filter { opportunity ->
            // Destination country filter
            filters.destinationCountry?.let { country ->
                opportunity.destinationCountry.equals(country, ignoreCase = true)
            } ?: true
        }.filter { opportunity ->
            // Volume range filter
            filters.minVolume?.let { minVol ->
                opportunity.volumeRequired >= minVol
            } ?: true
        }.filter { opportunity ->
            filters.maxVolume?.let { maxVol ->
                opportunity.volumeRequired <= maxVol
            } ?: true
        }.filter { opportunity ->
            // Price range filter
            filters.minPrice?.let { minPrice ->
                opportunity.pricePerUnit?.let { it >= minPrice } ?: true
            } ?: true
        }.filter { opportunity ->
            filters.maxPrice?.let { maxPrice ->
                opportunity.pricePerUnit?.let { it <= maxPrice } ?: true
            } ?: true
        }.filter { opportunity ->
            // Certification requirements filter
            if (filters.certificationRequirements.isNotEmpty()) {
                filters.certificationRequirements.any { cert ->
                    opportunity.certificationRequirements.contains(cert)
                }
            } else true
        }.filter { opportunity ->
            // Verification status filter
            filters.verificationStatus?.let { status ->
                opportunity.verificationStatus == status
            } ?: true
        }.filter { opportunity ->
            // Deadline filter
            filters.deadlineFrom?.let { fromDate ->
                opportunity.deadline?.let { deadline ->
                    deadline >= fromDate
                } ?: true
            } ?: true
        }.filter { opportunity ->
            filters.deadlineTo?.let { toDate ->
                opportunity.deadline?.let { deadline ->
                    deadline <= toDate
                } ?: true
            } ?: true
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
class ExportApplicationViewModel @Inject constructor(
    private val repository: ExportOpportunitiesRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(ExportApplicationUiState())
    val uiState: StateFlow<ExportApplicationUiState> = _uiState.asStateFlow()

    fun loadApplicationDetails(applicationId: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }
            
            val application = repository.getExportApplication(applicationId)
            val workflowStages = repository.getApplicationWorkflowStages(applicationId)
            val documents = repository.getApplicationDocuments(applicationId)
            
            _uiState.update { state ->
                state.copy(
                    application = application,
                    workflowStages = workflowStages,
                    documents = documents,
                    isLoading = false
                )
            }
        }
    }

    fun uploadDocument(applicationId: String, documentData: ExportDocumentUploadData) {
        viewModelScope.launch {
            _uiState.update { it.copy(isUploading = true) }
            
            repository.uploadApplicationDocument(applicationId, documentData).fold(
                onSuccess = { document ->
                    _uiState.update { state ->
                        state.copy(
                            isUploading = false,
                            message = "Document uploaded successfully!",
                            documents = state.documents + document
                        )
                    }
                },
                onFailure = { error ->
                    _uiState.update { state ->
                        state.copy(
                            isUploading = false,
                            error = error.message
                        )
                    }
                }
            )
        }
    }

    fun updateWorkflowStage(applicationId: String, stage: WorkflowStage, status: WorkflowStatus, notes: String? = null) {
        viewModelScope.launch {
            repository.updateWorkflowStage(applicationId, stage, status, notes).fold(
                onSuccess = {
                    _uiState.update { state ->
                        state.copy(message = "Workflow stage updated successfully!")
                    }
                    loadApplicationDetails(applicationId)
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

@HiltViewModel
class ExporterProfileViewModel @Inject constructor(
    private val repository: ExportOpportunitiesRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(ExporterProfileUiState())
    val uiState: StateFlow<ExporterProfileUiState> = _uiState.asStateFlow()

    fun loadExporterProfile(exporterId: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }
            
            val profile = repository.getExporterProfile(exporterId)
            val opportunities = repository.getExporterOpportunities(exporterId)
            val verifications = repository.getExporterVerifications(exporterId)
            
            _uiState.update { state ->
                state.copy(
                    profile = profile,
                    opportunities = opportunities,
                    verifications = verifications,
                    isLoading = false
                )
            }
        }
    }

    fun createExportOpportunity(exporterId: String, opportunityData: CreateExportOpportunityData) {
        viewModelScope.launch {
            _uiState.update { it.copy(isSubmitting = true) }
            
            repository.createExportOpportunity(exporterId, opportunityData).fold(
                onSuccess = { opportunity ->
                    _uiState.update { state ->
                        state.copy(
                            isSubmitting = false,
                            message = "Export opportunity created successfully!",
                            opportunities = state.opportunities + opportunity
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

    fun updateExporterProfile(exporterId: String, updates: Map<String, Any>) {
        viewModelScope.launch {
            _uiState.update { it.copy(isSubmitting = true) }
            
            repository.updateExporterProfile(exporterId, updates).fold(
                onSuccess = { profile ->
                    _uiState.update { state ->
                        state.copy(
                            isSubmitting = false,
                            message = "Profile updated successfully!",
                            profile = profile
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

    fun requestVerification(exporterId: String, verificationType: VerificationType, evidence: List<String>) {
        viewModelScope.launch {
            repository.requestExporterVerification(exporterId, verificationType, evidence).fold(
                onSuccess = {
                    _uiState.update { state ->
                        state.copy(message = "Verification request submitted successfully!")
                    }
                    loadExporterProfile(exporterId)
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
data class ExportApplicationUiState(
    val application: ExportApplication? = null,
    val workflowStages: List<ExportWorkflowStatus> = emptyList(),
    val documents: List<ExportDocumentLink> = emptyList(),
    val isLoading: Boolean = false,
    val isUploading: Boolean = false,
    val error: String? = null,
    val message: String? = null
)

data class ExporterProfileUiState(
    val profile: ExporterProfile? = null,
    val opportunities: List<ExportOpportunity> = emptyList(),
    val verifications: List<ExportVerification> = emptyList(),
    val isLoading: Boolean = false,
    val isSubmitting: Boolean = false,
    val error: String? = null,
    val message: String? = null
)

// Data Transfer Objects
data class CreateExportApplicationData(
    val farmerId: String,
    val proposedVolume: Double,
    val proposedPrice: Double? = null,
    val deliveryTimeline: String? = null,
    val qualityCertifications: List<String> = emptyList(),
    val sampleImages: List<String> = emptyList(),
    val coverLetter: String? = null
)

data class CreateExportOpportunityData(
    val title: String,
    val commodity: String,
    val destinationCountry: String,
    val destinationCity: String? = null,
    val volumeRequired: Double,
    val unit: String = "kg",
    val pricePerUnit: Double? = null,
    val currency: String = "KES",
    val qualityRequirements: List<String> = emptyList(),
    val certificationRequirements: List<String> = emptyList(),
    val shippingTerms: String? = null,
    val paymentTerms: String? = null,
    val deadline: String? = null,
    val description: String? = null
)

data class ExportDocumentUploadData(
    val documentType: String,
    val documentName: String,
    val externalUrl: String,
    val uploadedBy: String
)
