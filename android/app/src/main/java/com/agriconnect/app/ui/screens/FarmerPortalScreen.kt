package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.agriconnect.app.viewmodel.FarmerPortalViewModel

@Composable
fun FarmerPortalScreen(viewModel: FarmerPortalViewModel, userId: String) {
    val uiState by viewModel.uiState.collectAsState()
    val tabs = listOf("Dashboard", "Land Parcels", "Crops", "Animals", "Inventory", "Finances", "Analytics", "My Products", "Buy Requests")
    var selectedTab by remember { mutableStateOf(0) }

    LaunchedEffect(selectedTab) {
        when (selectedTab) {
            1 -> viewModel.loadLandParcels(userId)
            // Add similar calls for other tabs
        }
    }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        TabRow(selectedTabIndex = selectedTab) {
            tabs.forEachIndexed { index, title ->
                Tab(
                    selected = selectedTab == index,
                    onClick = { selectedTab = index },
                    text = { Text(title) }
                )
            }
        }
        Spacer(Modifier.height(16.dp))
        if (uiState.isLoading) {
            CircularProgressIndicator()
        }
        uiState.error?.let {
            Text("Error: $it", color = MaterialTheme.colorScheme.error)
        }
        // Render content for each tab (lists, forms, etc.)
    }
} 