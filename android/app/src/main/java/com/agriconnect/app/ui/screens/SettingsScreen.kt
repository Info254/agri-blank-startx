package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.agriconnect.app.viewmodel.SettingsViewModel

@Composable
fun SettingsScreen(viewModel: SettingsViewModel, userId: String) {
    val uiState by viewModel.uiState.collectAsState()
    var theme by remember { mutableStateOf(uiState.settings?.theme ?: "light") }
    var language by remember { mutableStateOf(uiState.settings?.language ?: "en") }

    LaunchedEffect(Unit) {
        viewModel.fetchSettings(userId)
    }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
        Text("App Settings", style = MaterialTheme.typography.headlineSmall)
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
        OutlinedTextField(value = theme, onValueChange = { theme = it }, label = { Text("Theme (light/dark)") })
        OutlinedTextField(value = language, onValueChange = { language = it }, label = { Text("Language") })
        Spacer(Modifier.height(8.dp))
        Button(onClick = {
            viewModel.updateSettings(userId, mapOf("theme" to theme, "language" to language))
        }) {
            Text("Save Settings")
        }
    }
} 