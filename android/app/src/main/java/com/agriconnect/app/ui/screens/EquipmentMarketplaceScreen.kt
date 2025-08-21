package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun EquipmentMarketplaceScreen() {
    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Equipment Marketplace") })
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
            Text("Browse and rent/buy equipment.", style = MaterialTheme.typography.headlineSmall)
            Button(onClick = { /* TODO: Browse equipment */ }, modifier = Modifier.fillMaxWidth()) {
                Text("Browse Equipment")
            }
            Button(onClick = { /* TODO: Rent/Buy equipment */ }, modifier = Modifier.fillMaxWidth()) {
                Text("Rent/Buy Equipment")
            }
        }
    }
} 