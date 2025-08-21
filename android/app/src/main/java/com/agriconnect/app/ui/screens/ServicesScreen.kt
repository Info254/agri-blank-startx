package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.agriconnect.app.ui.components.*
import com.agriconnect.app.ui.viewmodels.ServicesViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ServicesScreen(
    onBackClick: () -> Unit,
    onCameraClick: () -> Unit,
    viewModel: ServicesViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Services") },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(Icons.Default.ArrowBack, "Back")
                    }
                },
                actions = {
                    IconButton(onClick = onCameraClick) {
                        Icon(Icons.Default.Camera, "Camera")
                    }
                }
            )
        }
    ) { padding ->
        Box(modifier = Modifier.padding(padding)) {
            when {
                uiState.isLoading -> LoadingIndicator()
                uiState.error != null -> ErrorMessage(uiState.error)
                else -> {
                    LazyColumn(
                        contentPadding = PaddingValues(16.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        items(uiState.services) { service ->
                            ServiceCard(
                                title = service.name,
                                description = service.description,
                                imageUrl = service.imageUrl,
                                onClick = { /* Handle service click */ }
                            )
                        }
                    }

                    // Pull to refresh
                    SwipeRefresh(
                        state = rememberSwipeRefreshState(uiState.isLoading),
                        onRefresh = { viewModel.refresh() }
                    ) {
                        LazyColumn { /* ... */ }
                    }
                }
            }
        }
    }
}
