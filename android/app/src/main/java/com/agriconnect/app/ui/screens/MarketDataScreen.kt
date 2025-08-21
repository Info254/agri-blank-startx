package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun MarketDataScreen() {
    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Market Data (Kilimo AMS)") })
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
            Text("Real-time Market Prices", style = MaterialTheme.typography.headlineSmall)
            Button(onClick = { /* TODO: View prices */ }, modifier = Modifier.fillMaxWidth()) {
                Text("View Prices")
            }
            Text("Demand Forecasting", style = MaterialTheme.typography.headlineSmall)
            Button(onClick = { /* TODO: View forecasts */ }, modifier = Modifier.fillMaxWidth()) {
                Text("View Forecasts")
            }
            Text("Trade Opportunities", style = MaterialTheme.typography.headlineSmall)
            Button(onClick = { /* TODO: View opportunities */ }, modifier = Modifier.fillMaxWidth()) {
                Text("View Opportunities")
            }
        }
    }
} 