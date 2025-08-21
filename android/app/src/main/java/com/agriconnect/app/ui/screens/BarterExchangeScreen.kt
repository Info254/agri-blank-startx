package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.agriconnect.app.ui.viewmodels.BarterExchangeViewModel
import com.agriconnect.app.data.model.BarterTrade
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.remember
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.OutlinedTextField
import androidx.compose.runtime.mutableStateOf

@Composable
fun BarterExchangeScreen() {
    val viewModel: BarterExchangeViewModel = viewModel()
    val trades by viewModel.trades.collectAsState()
    val loading by viewModel.loading.collectAsState()
    val error by viewModel.error.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Barter Exchange") })
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
                Text("Barter Trades:", style = MaterialTheme.typography.headlineSmall)
                trades.forEach { trade ->
                    Card(Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
                        Column(Modifier.padding(8.dp)) {
                            Text("Offered: ${trade.offeredItem}")
                            Text("Requested: ${trade.requestedItem}")
                            Text("Status: ${trade.status}")
                            Text("Created: ${trade.createdAt}")
                        }
                    }
                }
            }
            Spacer(Modifier.height(16.dp))
            var offeredItem by remember { mutableStateOf("") }
            var requestedItem by remember { mutableStateOf("") }
            Button(onClick = { viewModel.createTrade(com.agriconnect.app.data.model.BarterTrade(offeredItem = offeredItem, requestedItem = requestedItem)) }, enabled = offeredItem.isNotBlank() && requestedItem.isNotBlank()) {
                Text("Create New Trade")
            }
            OutlinedTextField(
                value = offeredItem,
                onValueChange = { offeredItem = it },
                label = { Text("Offered Item") },
                modifier = Modifier.fillMaxWidth()
            )
            OutlinedTextField(
                value = requestedItem,
                onValueChange = { requestedItem = it },
                label = { Text("Requested Item") },
                modifier = Modifier.fillMaxWidth()
            )
        }
    }
} 