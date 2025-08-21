package com.agriconnect.app.ui.screens.auction

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.agriconnect.app.data.model.*
import com.agriconnect.app.viewmodel.AuctionViewModelImpl
import java.text.SimpleDateFormat
import java.util.*
import kotlin.time.Duration.Companion.milliseconds

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AuctionListScreen(
    onAuctionClick: (String) -> Unit,
    onCreateAuction: () -> Unit,
    viewModel: AuctionViewModelImpl = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val filters by viewModel.filters.collectAsStateWithLifecycle()
    
    var showFilters by remember { mutableStateOf(false) }
    var searchQuery by remember { mutableStateOf("") }
    var selectedTab by remember { mutableStateOf(0) }

    LaunchedEffect(Unit) {
        viewModel.loadEndingSoonAuctions()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        // Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Live Auctions",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold
            )
            
            Row {
                IconButton(onClick = { showFilters = true }) {
                    Icon(Icons.Default.FilterList, contentDescription = "Filter")
                }
                IconButton(onClick = { viewModel.loadAuctions() }) {
                    Icon(Icons.Default.Refresh, contentDescription = "Refresh")
                }
                FilledTonalButton(onClick = onCreateAuction) {
                    Icon(Icons.Default.Add, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Create Auction")
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Search Bar
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { 
                searchQuery = it
                viewModel.searchAuctions(it)
            },
            label = { Text("Search auctions...") },
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Tabs
        TabRow(selectedTabIndex = selectedTab) {
            Tab(
                selected = selectedTab == 0,
                onClick = { selectedTab = 0 },
                text = { Text("All Auctions") }
            )
            Tab(
                selected = selectedTab == 1,
                onClick = { selectedTab = 1 },
                text = { Text("Ending Soon") }
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Active Filters
        if (filters != AuctionFilters()) {
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                filters.commodity?.let { commodity ->
                    item {
                        FilterChip(
                            selected = true,
                            onClick = { viewModel.applyFilters(filters.copy(commodity = null)) },
                            label = { Text(commodity) },
                            trailingIcon = { Icon(Icons.Default.Close, contentDescription = null) }
                        )
                    }
                }
                filters.auctionType?.let { type ->
                    item {
                        FilterChip(
                            selected = true,
                            onClick = { viewModel.applyFilters(filters.copy(auctionType = null)) },
                            label = { Text(type.name) },
                            trailingIcon = { Icon(Icons.Default.Close, contentDescription = null) }
                        )
                    }
                }
                item {
                    TextButton(onClick = { viewModel.clearFilters() }) {
                        Text("Clear All")
                    }
                }
            }
            Spacer(modifier = Modifier.height(8.dp))
        }

        // Content
        when {
            uiState.isLoading -> {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            }
            
            else -> {
                val auctionsToShow = when (selectedTab) {
                    0 -> uiState.auctions
                    1 -> uiState.endingSoonAuctions
                    else -> uiState.auctions
                }

                if (auctionsToShow.isEmpty()) {
                    EmptyAuctionsCard(
                        title = if (selectedTab == 0) "No Active Auctions" else "No Auctions Ending Soon",
                        description = if (selectedTab == 0) 
                            "No active auctions found matching your criteria." 
                        else 
                            "No auctions ending in the next 24 hours."
                    )
                } else {
                    LazyColumn(
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        items(auctionsToShow) { auction ->
                            AuctionCard(
                                auction = auction,
                                onCardClick = { onAuctionClick(auction.id) },
                                onWatchClick = { /* Handle watch */ }
                            )
                        }
                    }
                }
            }
        }
    }

    // Filter Dialog
    if (showFilters) {
        AuctionFiltersDialog(
            currentFilters = filters,
            onFiltersApplied = { newFilters ->
                viewModel.applyFilters(newFilters)
                showFilters = false
            },
            onDismiss = { showFilters = false }
        )
    }

    // Error/Message Handling
    uiState.error?.let { error ->
        LaunchedEffect(error) {
            // Show error snackbar
            viewModel.clearError()
        }
    }

    uiState.message?.let { message ->
        LaunchedEffect(message) {
            // Show success snackbar
            viewModel.clearMessage()
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AuctionCard(
    auction: Auction,
    onCardClick: () -> Unit,
    onWatchClick: () -> Unit
) {
    Card(
        onClick = onCardClick,
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = auction.title,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "${auction.commodity} • ${auction.location ?: "Location not specified"}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                
                // Status Badge
                AssistChip(
                    onClick = { },
                    label = { Text(auction.status.name) },
                    colors = AssistChipDefaults.assistChipColors(
                        containerColor = when (auction.status) {
                            AuctionStatus.ACTIVE -> MaterialTheme.colorScheme.primaryContainer
                            AuctionStatus.ENDING_SOON -> MaterialTheme.colorScheme.errorContainer
                            else -> MaterialTheme.colorScheme.surfaceVariant
                        }
                    )
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Current Bid Info
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text(
                        text = "Current Bid",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = if (auction.currentHighestBid > 0) 
                            "${auction.currency} ${auction.currentHighestBid}" 
                        else 
                            "No bids yet",
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Bold,
                        color = if (auction.currentHighestBid > 0) 
                            MaterialTheme.colorScheme.primary 
                        else 
                            MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                
                Column {
                    Text(
                        text = "Quantity",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = "${auction.quantity} ${auction.unit}",
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Medium
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Time Remaining
            TimeRemainingRow(endTime = auction.endTime)

            Spacer(modifier = Modifier.height(8.dp))

            // Bidding Activity
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        Icons.Default.People,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp),
                        tint = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "${auction.uniqueBidders} bidders • ${auction.totalBids} bids",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                // Watch Button
                IconButton(onClick = onWatchClick) {
                    Icon(
                        if (auction.isWatching) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                        contentDescription = "Watch",
                        tint = if (auction.isWatching) 
                            MaterialTheme.colorScheme.primary 
                        else 
                            MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Actions
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.End
            ) {
                TextButton(onClick = onCardClick) {
                    Text("View Details")
                }
                Spacer(modifier = Modifier.width(8.dp))
                Button(onClick = onCardClick) {
                    Text("Place Bid")
                }
            }
        }
    }
}

@Composable
fun TimeRemainingRow(endTime: String) {
    try {
        val dateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault())
        val endDate = dateFormat.parse(endTime)
        val currentTime = System.currentTimeMillis()
        val timeRemaining = (endDate?.time ?: 0) - currentTime
        
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                Icons.Default.Schedule,
                contentDescription = null,
                tint = if (timeRemaining < 3600000) // Less than 1 hour
                    MaterialTheme.colorScheme.error
                else
                    MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.size(16.dp)
            )
            Spacer(modifier = Modifier.width(4.dp))
            
            val timeText = when {
                timeRemaining <= 0 -> "Auction ended"
                timeRemaining < 3600000 -> {
                    val minutes = (timeRemaining / 60000).toInt()
                    "$minutes minutes remaining"
                }
                timeRemaining < 86400000 -> {
                    val hours = (timeRemaining / 3600000).toInt()
                    "$hours hours remaining"
                }
                else -> {
                    val days = (timeRemaining / 86400000).toInt()
                    "$days days remaining"
                }
            }
            
            Text(
                text = timeText,
                style = MaterialTheme.typography.bodySmall,
                color = if (timeRemaining < 3600000 && timeRemaining > 0)
                    MaterialTheme.colorScheme.error
                else
                    MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    } catch (e: Exception) {
        Text(
            text = "Time remaining: Unknown",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

@Composable
fun EmptyAuctionsCard(
    title: String,
    description: String
) {
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(32.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                Icons.Default.Gavel,
                contentDescription = null,
                modifier = Modifier.size(64.dp),
                tint = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = description,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}
