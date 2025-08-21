package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun CityMarketsScreen() {
    Scaffold(
        topBar = {
            TopAppBar(title = { Text("City Markets") })
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
            Text("View city markets and connect with buyers/sellers.", style = MaterialTheme.typography.headlineSmall)
            Button(onClick = { /* TODO: View city markets */ }, modifier = Modifier.fillMaxWidth()) {
                Text("View City Markets")
            }
            Button(onClick = { /* TODO: Connect with buyers/sellers */ }, modifier = Modifier.fillMaxWidth()) {
                Text("Connect with Buyers/Sellers")
            }
        }
    }
} 