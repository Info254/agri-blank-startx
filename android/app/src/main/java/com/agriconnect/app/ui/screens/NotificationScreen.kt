package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.agriconnect.app.viewmodel.NotificationViewModel

@Composable
fun NotificationScreen(viewModel: NotificationViewModel, userId: String) {
    val uiState by viewModel.uiState.collectAsState()
    val tabs = listOf("Notifications", "Preferences")
    var selectedTab by remember { mutableStateOf(0) }

    LaunchedEffect(Unit) {
        viewModel.fetchNotifications(userId)
        viewModel.fetchUnreadCount(userId)
        viewModel.fetchPreferences(userId)
    }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        TabRow(selectedTabIndex = selectedTab) {
            tabs.forEachIndexed { index, title ->
                Tab(
                    selected = selectedTab == index,
                    onClick = { selectedTab = index },
                    text = { Text(title) }
                )
            }
        }
        Spacer(Modifier.height(16.dp))
        if (uiState.isLoading) {
            CircularProgressIndicator(modifier = Modifier.align(Alignment.CenterHorizontally))
        }
        uiState.error?.let {
            Text("Error: $it", color = MaterialTheme.colorScheme.error)
        }
        when (selectedTab) {
            0 -> NotificationList(uiState.notifications, uiState.unreadCount, viewModel::markAsRead)
            1 -> NotificationPreferences(uiState.preferences, userId, viewModel)
        }
    }
}

@Composable
fun NotificationList(notifications: List<com.agriconnect.app.data.model.Notification>, unreadCount: Int, markAsRead: (String) -> Unit) {
    Column {
        Text("Unread: $unreadCount", style = MaterialTheme.typography.titleMedium)
        LazyColumn {
            items(notifications.size) { idx ->
                val notification = notifications[idx]
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp)
                ) {
                    Column(Modifier.padding(8.dp)) {
                        Text("Title: ${notification.title}", style = MaterialTheme.typography.titleMedium)
                        Text("Message: ${notification.message}")
                        Text("Date: ${notification.date}")
                        if (!notification.isRead) {
                            Button(onClick = { markAsRead(notification.id) }) {
                                Text("Mark as Read")
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun NotificationPreferences(preferences: com.agriconnect.app.data.model.NotificationPreference?, userId: String, viewModel: com.agriconnect.app.viewmodel.NotificationViewModel) {
    var emailEnabled by remember { mutableStateOf(preferences?.emailEnabled ?: true) }
    var pushEnabled by remember { mutableStateOf(preferences?.pushEnabled ?: true) }
    Column {
        Text("Notification Preferences", style = MaterialTheme.typography.titleMedium)
        Row(verticalAlignment = Alignment.CenterVertically) {
            Checkbox(checked = emailEnabled, onCheckedChange = {
                emailEnabled = it
                viewModel.updatePreferences(userId, mapOf("emailEnabled" to it))
            })
            Text("Email Notifications")
        }
        Row(verticalAlignment = Alignment.CenterVertically) {
            Checkbox(checked = pushEnabled, onCheckedChange = {
                pushEnabled = it
                viewModel.updatePreferences(userId, mapOf("pushEnabled" to it))
            })
            Text("Push Notifications")
        }
    }
} 