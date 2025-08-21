package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.agriconnect.app.ui.viewmodels.FoodRescueDashboardViewModel
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue

@Composable
fun FoodRescueDashboardScreen(viewModel: FoodRescueDashboardViewModel = viewModel()) {
    val loading by viewModel.loading.collectAsState()
    val error by viewModel.error.collectAsState()
    val recipients by viewModel.recipients.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Food Rescue Dashboard") })
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
                    Text("Food Rescue", style = MaterialTheme.typography.headlineSmall)
                    recipients.forEach { recipient ->
                        Card(Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
                            Column(Modifier.padding(8.dp)) {
                                Text("Name: ${recipient.name}")
                                Text("Type: ${recipient.type}")
                                Text("Location: ${recipient.location ?: "-"}")
                                Text("Contact: ${recipient.contact ?: "-"}")
                                Text("Created: ${recipient.createdAt}")
                            }
                        }
                    }
                    Button(onClick = { viewModel.loadRecipients() }, modifier = Modifier.fillMaxWidth()) {
                        Text("Refresh Recipients")
                    }
                }
            }
        }
    }
} 