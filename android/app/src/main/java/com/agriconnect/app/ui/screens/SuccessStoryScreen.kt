package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.agriconnect.app.data.model.SuccessStory
import com.agriconnect.app.viewmodel.SuccessStoryViewModel

@Composable
fun SuccessStoryScreen(viewModel: SuccessStoryViewModel) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.loadStories()
    }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        if (uiState.isLoading) {
            CircularProgressIndicator(modifier = Modifier.align(Alignment.CenterHorizontally))
        }
        uiState.error?.let {
            Text("Error: $it", color = MaterialTheme.colorScheme.error)
        }
        uiState.successMessage?.let {
            Text(it, color = MaterialTheme.colorScheme.primary)
        }
        LazyColumn(modifier = Modifier.weight(1f)) {
            items(uiState.stories.size) { idx ->
                val story = uiState.stories[idx]
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp)
                ) {
                    Column(Modifier.padding(8.dp)) {
                        Text("Title: ${story.title}", style = MaterialTheme.typography.titleMedium)
                        Text("Author: ${story.authorName}")
                        Text("Content: ${story.content}")
                        Text("Date: ${story.date}")
                    }
                }
            }
        }
        // Add form for creating stories here (not shown for brevity)
    }
} 