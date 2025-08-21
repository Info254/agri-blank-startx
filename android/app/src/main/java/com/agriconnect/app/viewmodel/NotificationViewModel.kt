package com.agriconnect.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.agriconnect.app.data.model.Notification
import com.agriconnect.app.data.model.NotificationPreference
import com.agriconnect.app.data.repository.NotificationRepository
import com.agriconnect.app.data.repository.Result
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class NotificationUiState(
    val notifications: List<Notification> = emptyList(),
    val unreadCount: Int = 0,
    val preferences: NotificationPreference? = null,
    val isLoading: Boolean = false,
    val error: String? = null,
    val successMessage: String? = null
)

class NotificationViewModel(
    private val repository: NotificationRepository = NotificationRepository()
) : ViewModel() {
    private val _uiState = MutableStateFlow(NotificationUiState())
    val uiState: StateFlow<NotificationUiState> = _uiState.asStateFlow()

    fun fetchNotifications(userId: String) {
        viewModelScope.launch {
            repository.fetchNotifications(userId).collect { result ->
                when (result) {
                    is Result.Loading -> _uiState.update { it.copy(isLoading = true, error = null) }
                    is Result.Success -> _uiState.update { it.copy(notifications = result.data, isLoading = false, error = null) }
                    is Result.Error -> _uiState.update { it.copy(isLoading = false, error = result.exception.message) }
                }
            }
        }
    }
    fun markAsRead(notificationId: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null, successMessage = null) }
            when (val result = repository.markAsRead(notificationId)) {
                is Result.Success -> _uiState.update { it.copy(isLoading = false, successMessage = "Marked as read!") }
                is Result.Error -> _uiState.update { it.copy(error = result.exception.message, isLoading = false) }
                else -> {}
            }
        }
    }
    fun fetchUnreadCount(userId: String) {
        viewModelScope.launch {
            repository.fetchUnreadCount(userId).collect { result ->
                when (result) {
                    is Result.Loading -> {}
                    is Result.Success -> _uiState.update { it.copy(unreadCount = result.data) }
                    is Result.Error -> {}
                }
            }
        }
    }
    fun fetchPreferences(userId: String) {
        viewModelScope.launch {
            repository.fetchPreferences(userId).collect { result ->
                when (result) {
                    is Result.Loading -> _uiState.update { it.copy(isLoading = true, error = null) }
                    is Result.Success -> _uiState.update { it.copy(preferences = result.data, isLoading = false, error = null) }
                    is Result.Error -> _uiState.update { it.copy(isLoading = false, error = result.exception.message) }
                }
            }
        }
    }
    fun updatePreferences(userId: String, updates: Map<String, Any>) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null, successMessage = null) }
            when (val result = repository.updatePreferences(userId, updates)) {
                is Result.Success -> _uiState.update { it.copy(preferences = result.data, isLoading = false, successMessage = "Preferences updated!") }
                is Result.Error -> _uiState.update { it.copy(error = result.exception.message, isLoading = false) }
                else -> {}
            }
        }
    }
} 