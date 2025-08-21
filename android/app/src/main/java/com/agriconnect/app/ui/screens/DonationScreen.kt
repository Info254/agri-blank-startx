package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.agriconnect.app.data.model.Donation
import com.agriconnect.app.data.model.DonationRequest
import com.agriconnect.app.viewmodel.DonationViewModel

@Composable
fun DonationScreen(viewModel: DonationViewModel) {
    val uiState by viewModel.uiState.collectAsState()
    val tabs = listOf("Donations", "Requests")
    var selectedTab by remember { mutableStateOf(0) }

    LaunchedEffect(selectedTab) {
        when (selectedTab) {
            0 -> viewModel.loadDonations()
            1 -> viewModel.loadRequests()
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
            0 -> DonationList(uiState.donations)
            1 -> RequestList(uiState.requests)
        }
    }
}

@Composable
fun DonationList(donations: List<Donation>) {
    LazyColumn {
        items(donations.size) { idx ->
            val donation = donations[idx]
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp)
            ) {
                Column(Modifier.padding(8.dp)) {
                    Text("Donor: ${donation.donorName}", style = MaterialTheme.typography.titleMedium)
                    Text("Amount: ${donation.amount}")
                    Text("Date: ${donation.date}")
                }
            }
        }
    }
}

@Composable
fun RequestList(requests: List<DonationRequest>) {
    LazyColumn {
        items(requests.size) { idx ->
            val request = requests[idx]
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp)
            ) {
                Column(Modifier.padding(8.dp)) {
                    Text("Requester: ${request.requesterName}", style = MaterialTheme.typography.titleMedium)
                    Text("Requested: ${request.requestedAmount}")
                    Text("Status: ${request.status}")
                }
            }
        }
    }
} 