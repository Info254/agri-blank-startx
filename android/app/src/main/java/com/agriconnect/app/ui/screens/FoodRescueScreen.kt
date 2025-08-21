package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.agriconnect.app.data.model.FoodRescueListing
import com.agriconnect.app.data.model.FoodRescueMatch
import com.agriconnect.app.viewmodel.FoodRescueViewModel

@Composable
fun FoodRescueScreen(viewModel: FoodRescueViewModel) {
    val uiState by viewModel.uiState.collectAsState()
    val tabs = listOf("Listings", "Matches")
    var selectedTab by remember { mutableStateOf(0) }

    LaunchedEffect(selectedTab) {
        when (selectedTab) {
            0 -> viewModel.loadListings()
            1 -> viewModel.loadMatches()
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
            0 -> FoodRescueListingList(uiState.listings)
            1 -> FoodRescueMatchList(uiState.matches)
        }
    }
}

@Composable
fun FoodRescueListingList(listings: List<FoodRescueListing>) {
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
                    Text("Quantity: ${listing.quantity}")
                    Text("Location: ${listing.location}")
                }
            }
        }
    }
}

@Composable
fun FoodRescueMatchList(matches: List<FoodRescueMatch>) {
    LazyColumn {
        items(matches.size) { idx ->
            val match = matches[idx]
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp)
            ) {
                Column(Modifier.padding(8.dp)) {
                    Text("Listing: ${match.listingId}", style = MaterialTheme.typography.titleMedium)
                    Text("Matched To: ${match.matchedTo}")
                    Text("Status: ${match.status}")
                }
            }
        }
    }
} 