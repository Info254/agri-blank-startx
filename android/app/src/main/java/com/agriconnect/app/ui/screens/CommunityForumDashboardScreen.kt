package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun CommunityForumDashboardScreen() {
    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Community Forum Dashboard") })
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
            Text("Community Forum", style = MaterialTheme.typography.headlineSmall)
            Button(onClick = { /* TODO: View forum posts */ }, modifier = Modifier.fillMaxWidth()) {
                Text("View Forum Posts")
            }
            Button(onClick = { /* TODO: Create forum post */ }, modifier = Modifier.fillMaxWidth()) {
                Text("Create Forum Post")
            }
            Button(onClick = { /* TODO: Manage discussions */ }, modifier = Modifier.fillMaxWidth()) {
                Text("Manage Discussions")
            }
        }
    }
} 