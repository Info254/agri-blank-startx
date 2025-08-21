package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.agriconnect.app.ui.viewmodels.PartnerDashboardViewModel
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.LaunchedEffect

@Composable
fun PartnerDashboardScreen(viewModel: PartnerDashboardViewModel = viewModel()) {
    val loading by viewModel.loading.collectAsState()
    val error by viewModel.error.collectAsState()
    val profile by viewModel.profile.collectAsState()
    val events by viewModel.events.collectAsState()

    // Load data on first composition
    LaunchedEffect(Unit) { viewModel.loadProfileAndEvents() }

    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Partner Dashboard") })
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            when {
                loading -> CircularProgressIndicator()
                error != null -> Text("Error: $error", color = MaterialTheme.colorScheme.error)
                else -> {
                    Text("Manage your company profile and events.", style = MaterialTheme.typography.headlineSmall)
                    Card(Modifier.fillMaxWidth()) {
                        Column(Modifier.padding(8.dp)) {
                            Text("Company: ${profile.name}")
                            Text("Description: ${profile.description}")
                        }
                    }
                    Text("Events", style = MaterialTheme.typography.titleMedium)
                    events.forEach { event ->
                        Card(Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
                            Column(Modifier.padding(8.dp)) {
                                Text("${event.title}")
                                Text("Date: ${event.date}")
                            }
                        }
                    }
                    Button(onClick = { viewModel.loadProfileAndEvents() }, modifier = Modifier.fillMaxWidth()) {
                        Text("Refresh")
                    }
                }
            }
        }
    }
} 