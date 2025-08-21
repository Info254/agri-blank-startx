package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun FarmerExporterCollaborationScreen() {
    val tabs = listOf("Create Request", "Browse Requests", "Find Exporters")
    var selectedTab by remember { mutableStateOf(0) }

    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Farmer-Exporter Collaboration") })
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
        ) {
            ScrollableTabRow(
                selectedTabIndex = selectedTab,
                edgePadding = 8.dp
            ) {
                tabs.forEachIndexed { index, title ->
                    Tab(
                        selected = selectedTab == index,
                        onClick = { selectedTab = index },
                        text = { Text(title) }
                    )
                }
            }
            Spacer(Modifier.height(16.dp))
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.TopCenter) {
                when (selectedTab) {
                    0 -> Text("Create Request content coming soon.")
                    1 -> Text("Browse Requests content coming soon.")
                    2 -> Text("Find Exporters content coming soon.")
                }
            }
        }
    }
} 