package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.agriconnect.app.data.model.MarketplaceListing
import com.agriconnect.app.data.model.BarterTrade
import com.agriconnect.app.data.model.MyTrade
import com.agriconnect.app.viewmodel.CommodityTradingViewModel

@Composable
fun CommodityTradingScreen(viewModel: CommodityTradingViewModel) {
    val uiState by viewModel.uiState.collectAsState()
    val tabs = listOf("Marketplace", "Barter Exchange", "My Trades")
    var selectedTab by remember { mutableStateOf(0) }

    LaunchedEffect(selectedTab) {
        when (selectedTab) {
            0 -> viewModel.loadMarketplace()
            1 -> viewModel.loadBarterTrades()
            2 -> viewModel.loadMyTrades()
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
        uiState.successMessage?.let {
            Text(it, color = MaterialTheme.colorScheme.primary)
        }
        when (selectedTab) {
            0 -> MarketplaceList(uiState.marketplace)
            1 -> BarterTradeList(uiState.barterTrades)
            2 -> MyTradeList(uiState.myTrades)
        }
    }
}

@Composable
fun MarketplaceList(listings: List<MarketplaceListing>) {
    LazyColumn {
        items(listings.size) { idx ->
            val listing = listings[idx]
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp)
            ) {
                Column(Modifier.padding(8.dp)) {
                    Text("Product: ${listing.productName}", style = MaterialTheme.typography.titleMedium)
                    Text("Price: ${listing.price}")
                    Text("Location: ${listing.location}")
                }
            }
        }
    }
}

@Composable
fun BarterTradeList(trades: List<BarterTrade>) {
    LazyColumn {
        items(trades.size) { idx ->
            val trade = trades[idx]
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp)
            ) {
                Column(Modifier.padding(8.dp)) {
                    Text("Offered: ${trade.offeredProduct}", style = MaterialTheme.typography.titleMedium)
                    Text("Requested: ${trade.requestedProduct}")
                    Text("Status: ${trade.status}")
                }
            }
        }
    }
}

@Composable
fun MyTradeList(trades: List<MyTrade>) {
    LazyColumn {
        items(trades.size) { idx ->
            val trade = trades[idx]
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp)
            ) {
                Column(Modifier.padding(8.dp)) {
                    Text("Trade: ${trade.tradeId}", style = MaterialTheme.typography.titleMedium)
                    Text("Product: ${trade.productName}")
                    Text("Status: ${trade.status}")
                }
            }
        }
    }
} 