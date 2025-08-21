package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun ServiceProvidersScreen() {
    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Service Providers & Registration") })
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
            Text("Providers List", style = MaterialTheme.typography.headlineSmall)
            Button(onClick = { /* TODO: View providers */ }, modifier = Modifier.fillMaxWidth()) {
                Text("View Providers")
            }
            Text("Filter Providers", style = MaterialTheme.typography.headlineSmall)
            Button(onClick = { /* TODO: Filter providers */ }, modifier = Modifier.fillMaxWidth()) {
                Text("Filter Providers")
            }
            Text("Register as Provider", style = MaterialTheme.typography.headlineSmall)
            Button(onClick = { /* TODO: Open registration form */ }, modifier = Modifier.fillMaxWidth()) {
                Text("Register")
            }
        }
    }
} 