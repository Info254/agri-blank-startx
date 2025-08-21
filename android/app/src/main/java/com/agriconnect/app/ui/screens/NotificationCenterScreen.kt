package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun NotificationCenterScreen() {
    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Notification Center") })
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
            Text("Push Notifications", style = MaterialTheme.typography.headlineSmall)
            Button(onClick = { /* TODO: View notifications */ }, modifier = Modifier.fillMaxWidth()) {
                Text("View Notifications")
            }
            Button(onClick = { /* TODO: Manage notifications */ }, modifier = Modifier.fillMaxWidth()) {
                Text("Manage Notifications")
            }
        }
    }
} 