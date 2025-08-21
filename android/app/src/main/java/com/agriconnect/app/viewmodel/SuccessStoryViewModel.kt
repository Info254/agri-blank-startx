package com.agriconnect.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.agriconnect.app.data.model.SuccessStory
import com.agriconnect.app.data.repository.SuccessStoryRepository
import com.agriconnect.app.data.repository.Result
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class SuccessStoryUiState(
    val stories: List<SuccessStory> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
    val successMessage: String? = null
)

class SuccessStoryViewModel(
    private val repository: SuccessStoryRepository = SuccessStoryRepository()
) : ViewModel() {
    private val _uiState = MutableStateFlow(SuccessStoryUiState())
    val uiState: StateFlow<SuccessStoryUiState> = _uiState.asStateFlow()

    fun loadStories() {
        viewModelScope.launch {
            repository.fetchStories().collect { result ->
                when (result) {
                    is Result.Loading -> _uiState.update { it.copy(isLoading = true, error = null) }
                    is Result.Success -> _uiState.update { it.copy(stories = result.data, isLoading = false, error = null) }
                    is Result.Error -> _uiState.update { it.copy(isLoading = false, error = result.exception.message) }
                }
            }
        }
    }
    fun createStory(story: SuccessStory) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null, successMessage = null) }
            when (val result = repository.createStory(story)) {
                is Result.Success -> {
                    loadStories()
                    _uiState.update { it.copy(successMessage = "Story created successfully", isLoading = false) }
                }
                is Result.Error -> _uiState.update { it.copy(error = result.exception.message, isLoading = false) }
                else -> {}
            }
        }
    }
} 