package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.agriconnect.app.ui.viewmodels.AgentDashboardViewModel
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue

@Composable
fun AgentDashboardScreen(viewModel: AgentDashboardViewModel = viewModel()) {
    val loading by viewModel.loading.collectAsState()
    val error by viewModel.error.collectAsState()
    val agents by viewModel.agents.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Agent Dashboard") })
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
                    Text("Product Management", style = MaterialTheme.typography.headlineSmall)
                    Button(onClick = { /* TODO: Add product management */ }, modifier = Modifier.fillMaxWidth()) {
                        Text("Manage Products")
                    }
                    Button(onClick = { /* TODO: Add input pricing */ }, modifier = Modifier.fillMaxWidth()) {
                        Text("Input Pricing & Verification")
                    }
                    Button(onClick = { /* TODO: Add reviews */ }, modifier = Modifier.fillMaxWidth()) {
                        Text("Reviews & Donations")
                    }
                    Button(onClick = { /* TODO: Add analytics */ }, modifier = Modifier.fillMaxWidth()) {
                        Text("Analytics")
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
                    Button(onClick = { viewModel.loadAgents() }, modifier = Modifier.fillMaxWidth()) {
                        Text("Refresh Agents")
                    }
                }
            }
        }
    }
} 