package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun SuccessStoriesDashboardScreen() {
    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Success Stories & Impact Reports") })
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
            Text("Success Stories", style = MaterialTheme.typography.headlineSmall)
            Button(onClick = { /* TODO: View stories */ }, modifier = Modifier.fillMaxWidth()) {
                Text("View Stories")
            }
            Button(onClick = { /* TODO: Manage stories */ }, modifier = Modifier.fillMaxWidth()) {
                Text("Manage Stories")
            }
            Divider()
            Text("Impact Reports", style = MaterialTheme.typography.headlineSmall)
            Button(onClick = { /* TODO: View reports */ }, modifier = Modifier.fillMaxWidth()) {
                Text("View Reports")
            }
            Button(onClick = { /* TODO: Manage reports */ }, modifier = Modifier.fillMaxWidth()) {
                Text("Manage Reports")
            }
        }
    }
} 