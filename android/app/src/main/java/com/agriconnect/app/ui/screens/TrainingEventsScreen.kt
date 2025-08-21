package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun TrainingEventsScreen() {
    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Training Events") })
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
            Text("Upcoming Events", style = MaterialTheme.typography.headlineSmall)
            Button(onClick = { /* TODO: View events */ }, modifier = Modifier.fillMaxWidth()) {
                Text("View Events")
            }
            Text("Event Details", style = MaterialTheme.typography.headlineSmall)
            Button(onClick = { /* TODO: View details */ }, modifier = Modifier.fillMaxWidth()) {
                Text("View Details")
            }
            Text("Register for Event", style = MaterialTheme.typography.headlineSmall)
            Button(onClick = { /* TODO: Register */ }, modifier = Modifier.fillMaxWidth()) {
                Text("Register")
            }
        }
    }
} 