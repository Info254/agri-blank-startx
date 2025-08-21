package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.agriconnect.app.ui.viewmodels.AdminDashboardViewModel
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue

@Composable
fun AdminDashboardScreen(viewModel: AdminDashboardViewModel = viewModel()) {
    val loading by viewModel.loading.collectAsState()
    val error by viewModel.error.collectAsState()
    val markets by viewModel.markets.collectAsState()
    val agents by viewModel.agents.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Admin Dashboard") })
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
                    Text("Analytics Overview", style = MaterialTheme.typography.headlineSmall)
                    Card(modifier = Modifier.fillMaxWidth()) {
                        Column(Modifier.padding(16.dp)) {
                            Text("Impact Reports")
                            Text("- Total Markets: ${markets.size}\n- Total Agents: ${agents.size}")
                        }
                    }
                    Text("Markets", style = MaterialTheme.typography.titleMedium)
                    markets.forEach { market ->
                        Card(Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
                            Column(Modifier.padding(8.dp)) {
                                Text("${market.marketName} (${market.city}, ${market.county})")
                                Text("Type: ${market.marketType}")
                                Text("Active: ${market.isActive}")
                            }
                        }
                    }
                    Text("Agents", style = MaterialTheme.typography.titleMedium)
                    agents.forEach { agent ->
                        Card(Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
                            Column(Modifier.padding(8.dp)) {
                                Text("Role: ${agent.role}")
                                Text("Verified: ${agent.verified}")
                            }
                        }
                    }
                    Button(onClick = { viewModel.loadDashboardData() }, modifier = Modifier.fillMaxWidth()) {
                        Text("Refresh Data")
                    }
                }
            }
        }
    }
} 