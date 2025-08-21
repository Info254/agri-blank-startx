package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.agriconnect.app.ui.viewmodels.ProductAuctionDashboardViewModel
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue

@Composable
fun ProductAuctionDashboardScreen(viewModel: ProductAuctionDashboardViewModel = viewModel()) {
    val loading by viewModel.loading.collectAsState()
    val error by viewModel.error.collectAsState()
    val auctions by viewModel.auctions.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Product Auction Dashboard") })
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
                    Text("Product Auctions", style = MaterialTheme.typography.headlineSmall)
                    auctions.forEach { auction ->
                        Card(Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
                            Column(Modifier.padding(8.dp)) {
                                Text("Product ID: ${auction.productId}")
                                Text("Start: ${auction.auctionStart}")
                                Text("End: ${auction.auctionEnd}")
                                Text("Status: ${auction.status}")
                                Text("Current Bid: ${auction.currentBid ?: "-"}")
                            }
                        }
                    }
                    Button(onClick = { viewModel.loadAuctions() }, modifier = Modifier.fillMaxWidth()) {
                        Text("Refresh Auctions")
                    }
                }
            }
        }
    }
} 