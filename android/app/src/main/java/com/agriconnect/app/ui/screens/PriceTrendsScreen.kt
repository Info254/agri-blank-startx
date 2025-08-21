package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.agriconnect.app.ui.viewmodels.PriceTrendsViewModel
import com.agriconnect.app.data.model.PriceTrend
import androidx.compose.runtime.collectAsState
import androidx.compose.material3.CircularProgressIndicator

@Composable
fun PriceTrendsScreen() {
    val viewModel: PriceTrendsViewModel = viewModel()
    val trends by viewModel.trends.collectAsState()
    val loading by viewModel.loading.collectAsState()
    val error by viewModel.error.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Price Trends") })
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
            if (loading) {
                CircularProgressIndicator()
            } else if (error != null) {
                Text("Error: $error", color = MaterialTheme.colorScheme.error)
            } else {
                Text("Price Trends:", style = MaterialTheme.typography.headlineSmall)
                trends.forEach { trend ->
                    Card(Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
                        Column(Modifier.padding(8.dp)) {
                            Text("Product: ${trend.product}")
                            Text("Date: ${trend.date}")
                            Text("Price: ${trend.price}")
                            Text("Source: ${trend.source}")
                        }
                    }
                }
            }
        }
    }
} 