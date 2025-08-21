package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.agriconnect.app.ui.viewmodels.ReverseBulkAuctionsViewModel
import com.agriconnect.app.data.model.ReverseBulkAuction
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.remember
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.OutlinedTextField
import androidx.compose.runtime.mutableStateOf

@Composable
fun ReverseBulkAuctionsScreen() {
    val viewModel: ReverseBulkAuctionsViewModel = viewModel()
    val auctions by viewModel.auctions.collectAsState()
    val loading by viewModel.loading.collectAsState()
    val error by viewModel.error.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Reverse Bulk Auctions") })
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
                Text("Bulk Auctions:", style = MaterialTheme.typography.headlineSmall)
                auctions.forEach { auction ->
                    Card(Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
                        Column(Modifier.padding(8.dp)) {
                            Text("Auction: ${auction.auctionName}")
                            Text("Status: ${auction.status}")
                            Text("Created: ${auction.createdAt}")
                        }
                    }
                }
            }
            Spacer(Modifier.height(16.dp))
            var auctionName by remember { mutableStateOf("") }
            Button(onClick = { viewModel.createAuction(com.agriconnect.app.data.model.ReverseBulkAuction(auctionName = auctionName)) }, enabled = auctionName.isNotBlank()) {
                Text("Create New Auction")
            }
            OutlinedTextField(
                value = auctionName,
                onValueChange = { auctionName = it },
                label = { Text("Auction Name") },
                modifier = Modifier.fillMaxWidth()
            )
        }
    }
} 