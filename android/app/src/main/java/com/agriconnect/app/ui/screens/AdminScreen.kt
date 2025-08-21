package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.agriconnect.app.viewmodel.AdminViewModel

@Composable
fun AdminScreen(viewModel: AdminViewModel) {
    val uiState by viewModel.uiState.collectAsState()
    val tabs = listOf("Users", "Logs", "System Status")
    var selectedTab by remember { mutableStateOf(0) }

    LaunchedEffect(selectedTab) {
        when (selectedTab) {
            0 -> viewModel.fetchUsers()
            1 -> viewModel.fetchLogs()
            2 -> viewModel.fetchSystemStatus()
        }
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
            0 -> UserList(uiState.users)
            1 -> LogList(uiState.logs)
            2 -> SystemStatusView(uiState.systemStatus)
        }
    }
}

@Composable
fun UserList(users: List<com.agriconnect.app.data.model.AdminUser>) {
    LazyColumn {
        items(users.size) { idx ->
            val user = users[idx]
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp)
            ) {
                Column(Modifier.padding(8.dp)) {
                    Text("Name: ${user.fullName}", style = MaterialTheme.typography.titleMedium)
                    Text("Email: ${user.email}")
                    Text("Role: ${user.role}")
                }
            }
        }
    }
}

@Composable
fun LogList(logs: List<com.agriconnect.app.data.model.AdminLog>) {
    LazyColumn {
        items(logs.size) { idx ->
            val log = logs[idx]
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp)
            ) {
                Column(Modifier.padding(8.dp)) {
                    Text("Log: ${log.message}", style = MaterialTheme.typography.titleMedium)
                    Text("Date: ${log.date}")
                }
            }
        }
    }
}

@Composable
fun SystemStatusView(status: com.agriconnect.app.data.model.SystemStatus?) {
    if (status == null) {
        Text("No system status available.")
        return
    }
    Column {
        Text("System Status", style = MaterialTheme.typography.titleMedium)
        Text("Uptime: ${status.uptime}")
        Text("Health: ${status.health}")
        Text("Last Checked: ${status.lastChecked}")
    }
} 