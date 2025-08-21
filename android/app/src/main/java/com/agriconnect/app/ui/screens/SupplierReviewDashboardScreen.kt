package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.agriconnect.app.ui.viewmodels.SupplierReviewDashboardViewModel
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue

@Composable
fun SupplierReviewDashboardScreen(viewModel: SupplierReviewDashboardViewModel = viewModel()) {
    val loading by viewModel.loading.collectAsState()
    val error by viewModel.error.collectAsState()
    val reviews by viewModel.reviews.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Supplier Review & Verification") })
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
            when {
                loading -> CircularProgressIndicator()
                error != null -> Text("Error: $error", color = MaterialTheme.colorScheme.error)
                else -> {
                    Text("Supplier Reviews", style = MaterialTheme.typography.headlineSmall)
                    reviews.forEach { review ->
                        Card(Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
                            Column(Modifier.padding(8.dp)) {
                                Text("Supplier ID: ${review.supplierId}")
                                Text("Rating: ${review.rating ?: "-"}")
                                Text("Review: ${review.review ?: "-"}")
                                Text("Verified: ${review.verified}")
                                Text("Created: ${review.createdAt}")
                            }
                        }
                    }
                    Button(onClick = { viewModel.loadReviews() }, modifier = Modifier.fillMaxWidth()) {
                        Text("Refresh Reviews")
                    }
                }
            }
        }
    }
} 