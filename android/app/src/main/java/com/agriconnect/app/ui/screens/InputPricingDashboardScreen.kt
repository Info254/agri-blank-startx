package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun InputPricingDashboardScreen() {
    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Input Pricing Dashboard") })
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
            Text("Input Pricing", style = MaterialTheme.typography.headlineSmall)
            Button(onClick = { /* TODO: View input prices */ }, modifier = Modifier.fillMaxWidth()) {
                Text("View Input Prices")
            }
            Button(onClick = { /* TODO: Verify input prices */ }, modifier = Modifier.fillMaxWidth()) {
                Text("Verify Input Prices")
            }
            Button(onClick = { /* TODO: Manage input prices */ }, modifier = Modifier.fillMaxWidth()) {
                Text("Manage Input Prices")
            }
        }
    }
} 