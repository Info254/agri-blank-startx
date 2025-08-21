package com.agriconnect.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.agriconnect.app.data.model.*
import com.agriconnect.app.data.repository.ExportRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ExportOpportunityViewModel @Inject constructor(
    private val exportRepository: ExportRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(ExportOpportunityUiState())
    val uiState: StateFlow<ExportOpportunityUiState> = _uiState.asStateFlow()

    private val _filters = MutableStateFlow(ExportFilters())
    val filters: StateFlow<ExportFilters> = _filters.asStateFlow()

    init {
        loadExportOpportunities()
    }

    fun loadExportOpportunities() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            
            exportRepository.getExportOpportunities(_filters.value).collect { opportunities ->
                _uiState.value = _uiState.value.copy(
                    opportunities = opportunities,
                    isLoading = false
                )
            }
        }
    }

    fun searchOpportunities(query: String) {
        if (query.isBlank()) {
            loadExportOpportunities()
            return
        }

        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            
            exportRepository.searchExportOpportunities(query).collect { opportunities ->
                _uiState.value = _uiState.value.copy(
                    opportunities = opportunities,
                    isLoading = false
                )
            }
        }
    }

    fun applyFilters(filters: ExportFilters) {
        _filters.value = filters
        loadExportOpportunities()
    }

    fun clearFilters() {
        _filters.value = ExportFilters()
        loadExportOpportunities()
    }

    fun loadOpportunityDetails(opportunityId: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoadingDetails = true)
            
            val opportunity = exportRepository.getExportOpportunityById(opportunityId)
            _uiState.value = _uiState.value.copy(
                selectedOpportunity = opportunity,
                isLoadingDetails = false
            )
        }
    }

    fun verifyOpportunity(
        opportunityId: String,
        farmerId: String,
        verificationType: VerificationType,
        decision: VerificationDecision,
        comments: String? = null
    ) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isSubmitting = true)
            
            exportRepository.verifyExportOpportunity(
                opportunityId, farmerId, verificationType, decision, comments
            ).fold(
                onSuccess = {
                    _uiState.value = _uiState.value.copy(
                        isSubmitting = false,
                        message = "Verification submitted successfully"
                    )
                    loadOpportunityDetails(opportunityId)
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

    fun createApplication(
        opportunityId: String,
        farmerId: String,
        applicationData: ExportApplicationFormData
    ) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isSubmitting = true)
            
            val application = ExportApplication(
                id = "",
                opportunityId = opportunityId,
                farmerId = farmerId,
                proposedVolume = applicationData.proposedVolume,
                proposedPrice = applicationData.proposedPrice,
                deliveryTimeline = applicationData.deliveryTimeline,
                qualityCertifications = applicationData.qualityCertifications,
                sampleImages = applicationData.sampleImages,
                coverLetter = applicationData.coverLetter,
                createdAt = "",
                updatedAt = ""
            )

            exportRepository.createExportApplication(application).fold(
                onSuccess = { createdApplication ->
                    _uiState.value = _uiState.value.copy(
                        isSubmitting = false,
                        message = "Application submitted successfully",
                        createdApplication = createdApplication
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
class ExportApplicationViewModel @Inject constructor(
    private val exportRepository: ExportRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(ExportApplicationUiState())
    val uiState: StateFlow<ExportApplicationUiState> = _uiState.asStateFlow()

    fun loadMyApplications(farmerId: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            
            exportRepository.getMyExportApplications(farmerId).collect { applications ->
                _uiState.value = _uiState.value.copy(
                    applications = applications,
                    isLoading = false
                )
            }
        }
    }

    fun loadApplicationDetails(applicationId: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoadingDetails = true)
            
            // Load workflow status
            exportRepository.getWorkflowStatus(applicationId).collect { workflowStages ->
                _uiState.value = _uiState.value.copy(
                    workflowStages = workflowStages,
                    isLoadingDetails = false
                )
            }
        }
    }

    fun loadApplicationDocuments(applicationId: String) {
        viewModelScope.launch {
            exportRepository.getApplicationDocuments(applicationId).collect { documents ->
                _uiState.value = _uiState.value.copy(documents = documents)
            }
        }
    }

    fun addDocumentLink(
        applicationId: String,
        documentType: String,
        documentName: String,
        externalUrl: String,
        uploadedBy: String
    ) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isSubmitting = true)
            
            val documentLink = ExportDocumentLink(
                id = "",
                applicationId = applicationId,
                documentType = documentType,
                documentName = documentName,
                externalUrl = externalUrl,
                uploadedBy = uploadedBy,
                createdAt = ""
            )

            exportRepository.addDocumentLink(documentLink).fold(
                onSuccess = {
                    _uiState.value = _uiState.value.copy(
                        isSubmitting = false,
                        message = "Document link added successfully"
                    )
                    loadApplicationDocuments(applicationId)
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

    fun updateWorkflowStage(
        applicationId: String,
        stage: WorkflowStage,
        status: WorkflowStatus,
        notes: String? = null
    ) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isSubmitting = true)
            
            exportRepository.updateWorkflowStage(applicationId, stage, status, notes).fold(
                onSuccess = {
                    _uiState.value = _uiState.value.copy(
                        isSubmitting = false,
                        message = "Workflow updated successfully"
                    )
                    loadApplicationDetails(applicationId)
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

    fun withdrawApplication(applicationId: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isSubmitting = true)
            
            exportRepository.updateApplicationStatus(
                applicationId, 
                ApplicationStatus.WITHDRAWN
            ).fold(
                onSuccess = {
                    _uiState.value = _uiState.value.copy(
                        isSubmitting = false,
                        message = "Application withdrawn successfully"
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

// UI State Data Classes
data class ExportOpportunityUiState(
    val opportunities: List<ExportOpportunity> = emptyList(),
    val selectedOpportunity: ExportOpportunity? = null,
    val createdApplication: ExportApplication? = null,
    val isLoading: Boolean = false,
    val isLoadingDetails: Boolean = false,
    val isSubmitting: Boolean = false,
    val error: String? = null,
    val message: String? = null
)

data class ExportApplicationUiState(
    val applications: List<ExportApplication> = emptyList(),
    val workflowStages: List<ExportWorkflowStatus> = emptyList(),
    val documents: List<ExportDocumentLink> = emptyList(),
    val isLoading: Boolean = false,
    val isLoadingDetails: Boolean = false,
    val isSubmitting: Boolean = false,
    val error: String? = null,
    val message: String? = null
)

// Form Data Classes
data class ExportApplicationFormData(
    val proposedVolume: Double,
    val proposedPrice: Double? = null,
    val deliveryTimeline: String? = null,
    val qualityCertifications: List<String> = emptyList(),
    val sampleImages: List<String> = emptyList(),
    val coverLetter: String? = null
)
