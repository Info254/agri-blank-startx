package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.agriconnect.app.data.model.ServiceProvider
import com.agriconnect.app.viewmodel.ServiceProviderViewModel

@Composable
fun ServiceProviderScreen(viewModel: ServiceProviderViewModel) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.loadProviders()
    }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        if (uiState.isLoading) {
            CircularProgressIndicator(modifier = Modifier.align(Alignment.CenterHorizontally))
        }
        uiState.error?.let {
            Text("Error: $it", color = MaterialTheme.colorScheme.error)
        }
        uiState.successMessage?.let {
            Text(it, color = MaterialTheme.colorScheme.primary)
        }
        LazyColumn(modifier = Modifier.weight(1f)) {
            items(uiState.providers.size) { idx ->
                val provider = uiState.providers[idx]
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp)
                ) {
                    Column(Modifier.padding(8.dp)) {
                        Text("Name: ${provider.name}", style = MaterialTheme.typography.titleMedium)
                        Text("Type: ${provider.type}")
                        Text("Location: ${provider.location}")
                        Row {
                            Button(
                                onClick = { viewModel.deleteProvider(provider.id) },
                                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)
                            ) {
                                Text("Delete")
                            }
                            Spacer(Modifier.width(8.dp))
                            // Add Edit button and other actions as needed
                        }
                    }
                }
            }
        }
        // Add form for creating/updating providers here (not shown for brevity)
    }
} 