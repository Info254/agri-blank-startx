package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun FarmInputsMarketplaceScreen() {
    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Farm Inputs Marketplace") })
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
            Text("Browse and purchase farm inputs.", style = MaterialTheme.typography.headlineSmall)
            Button(onClick = { /* TODO: Browse inputs */ }, modifier = Modifier.fillMaxWidth()) {
                Text("Browse Inputs")
            }
            Button(onClick = { /* TODO: Purchase inputs */ }, modifier = Modifier.fillMaxWidth()) {
                Text("Purchase Inputs")
            }
        }
    }
} 