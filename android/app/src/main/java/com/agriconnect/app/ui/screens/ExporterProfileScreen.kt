package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun ExporterProfileScreen() {
    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Exporter Profile") })
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
            Text("Create, view, and edit your exporter profile.", style = MaterialTheme.typography.headlineSmall)
            Button(onClick = { /* TODO: Create/Edit profile */ }, modifier = Modifier.fillMaxWidth()) {
                Text("Create/Edit Profile")
            }
            Button(onClick = { /* TODO: View profile */ }, modifier = Modifier.fillMaxWidth()) {
                Text("View Profile")
            }
        }
    }
} 