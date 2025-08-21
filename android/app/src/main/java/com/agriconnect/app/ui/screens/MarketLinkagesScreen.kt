package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun MarketLinkagesScreen() {
    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Market Linkages & Access") })
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
            Text("Market Linkages", style = MaterialTheme.typography.headlineSmall)
            Button(onClick = { /* TODO: View linkages */ }, modifier = Modifier.fillMaxWidth()) {
                Text("View Linkages")
            }
            Text("Opportunities", style = MaterialTheme.typography.headlineSmall)
            Button(onClick = { /* TODO: View opportunities */ }, modifier = Modifier.fillMaxWidth()) {
                Text("View Opportunities")
            }
            Text("Connect with Markets", style = MaterialTheme.typography.headlineSmall)
            Button(onClick = { /* TODO: Connect */ }, modifier = Modifier.fillMaxWidth()) {
                Text("Connect")
            }
        }
    }
} 