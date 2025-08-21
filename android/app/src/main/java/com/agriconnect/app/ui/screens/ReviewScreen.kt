package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.agriconnect.app.data.model.Review
import com.agriconnect.app.viewmodel.ReviewViewModel

@Composable
fun ReviewScreen(viewModel: ReviewViewModel) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.loadReviews()
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
            items(uiState.reviews.size) { idx ->
                val review = uiState.reviews[idx]
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp)
                ) {
                    Column(Modifier.padding(8.dp)) {
                        Text("Reviewer: ${review.reviewerName}", style = MaterialTheme.typography.titleMedium)
                        Text("Rating: ${review.rating}")
                        Text("Comment: ${review.comment}")
                    }
                }
            }
        }
        // Add form for creating reviews here (not shown for brevity)
    }
} 