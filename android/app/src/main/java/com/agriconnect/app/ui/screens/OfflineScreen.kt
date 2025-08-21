package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.agriconnect.app.data.model.OfflineData
import com.agriconnect.app.viewmodel.OfflineViewModel

@Composable
fun OfflineScreen(viewModel: OfflineViewModel) {
    val uiState by viewModel.uiState.collectAsState()
    var dataToSave by remember { mutableStateOf(OfflineData()) }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
        Text("Offline Support", style = MaterialTheme.typography.headlineSmall)
        Spacer(Modifier.height(16.dp))
        if (uiState.isLoading) {
            CircularProgressIndicator()
        }
        uiState.error?.let {
            Text("Error: $it", color = MaterialTheme.colorScheme.error)
        }
        uiState.successMessage?.let {
            Text(it, color = MaterialTheme.colorScheme.primary)
        }
        Button(onClick = { viewModel.saveData(dataToSave) }) {
            Text("Save Data for Offline Use")
        }
        Spacer(Modifier.height(8.dp))
        Button(onClick = { viewModel.loadData() }) {
            Text("Load Offline Data")
        }
        Spacer(Modifier.height(8.dp))
        Button(onClick = { viewModel.clearCache() }) {
            Text("Clear Offline Cache")
        }
        Spacer(Modifier.height(16.dp))
        if (uiState.offlineData != null) {
            Text("Offline Data Loaded:")
            Text(uiState.offlineData.toString())
        } else {
            Text("No offline data available.")
        }
    }
} 