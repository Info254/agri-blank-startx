package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.agriconnect.app.data.model.Auction
import com.agriconnect.app.data.model.AuctionBid
import com.agriconnect.app.viewmodel.AuctionViewModel

@Composable
fun AuctionScreen(viewModel: AuctionViewModel) {
    val uiState by viewModel.uiState.collectAsState()
    val tabs = listOf("Auctions", "Bids")
    var selectedTab by remember { mutableStateOf(0) }
    var selectedAuctionId by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(selectedTab, selectedAuctionId) {
        when (selectedTab) {
            0 -> viewModel.loadAuctions()
            1 -> selectedAuctionId?.let { viewModel.loadBids(it) }
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
            CircularProgressIndicator(modifier = Modifier.align(Alignment.CenterHorizontally))
        }
        uiState.error?.let {
            Text("Error: $it", color = MaterialTheme.colorScheme.error)
        }
        when (selectedTab) {
            0 -> AuctionList(uiState.auctions) { auctionId ->
                selectedAuctionId = auctionId
                selectedTab = 1
            }
            1 -> AuctionBidList(uiState.bids)
        }
    }
}

@Composable
fun AuctionList(auctions: List<Auction>, onAuctionSelected: (String) -> Unit) {
    LazyColumn {
        items(auctions.size) { idx ->
            val auction = auctions[idx]
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp)
                    .clickable { onAuctionSelected(auction.id) }
            ) {
                Column(Modifier.padding(8.dp)) {
                    Text("Auction: ${auction.title}", style = MaterialTheme.typography.titleMedium)
                    Text("Status: ${auction.status}")
                }
            }
        }
    }
}

@Composable
fun AuctionBidList(bids: List<AuctionBid>) {
    LazyColumn {
        items(bids.size) { idx ->
            val bid = bids[idx]
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp)
            ) {
                Column(Modifier.padding(8.dp)) {
                    Text("Bidder: ${bid.bidderName}", style = MaterialTheme.typography.titleMedium)
                    Text("Amount: ${bid.amount}")
                    Text("Status: ${bid.status}")
                }
            }
        }
    }
} 