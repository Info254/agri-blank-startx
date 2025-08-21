package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun ProfileScreen() {
    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Profile & Account Settings") })
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
            Text("Profile", style = MaterialTheme.typography.headlineSmall)
            Button(onClick = { /* TODO: View profile */ }, modifier = Modifier.fillMaxWidth()) {
                Text("View Profile")
            }
            Button(onClick = { /* TODO: Edit profile */ }, modifier = Modifier.fillMaxWidth()) {
                Text("Edit Profile")
            }
            Divider()
            Text("Account Settings", style = MaterialTheme.typography.headlineSmall)
            Button(onClick = { /* TODO: View settings */ }, modifier = Modifier.fillMaxWidth()) {
                Text("View Settings")
            }
            Button(onClick = { /* TODO: Edit settings */ }, modifier = Modifier.fillMaxWidth()) {
                Text("Edit Settings")
            }
        }
    }
} 