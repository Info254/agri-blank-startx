package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun ExportOpportunitiesScreen() {
    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Export Opportunities") })
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
            Text("View and apply for export opportunities.", style = MaterialTheme.typography.headlineSmall)
            Button(onClick = { /* TODO: View opportunities */ }, modifier = Modifier.fillMaxWidth()) {
                Text("View Opportunities")
            }
            Button(onClick = { /* TODO: Apply for export */ }, modifier = Modifier.fillMaxWidth()) {
                Text("Apply for Export")
            }
        }
    }
} 