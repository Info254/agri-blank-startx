package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.agriconnect.app.ui.viewmodels.MarketplaceViewModel
import com.agriconnect.app.data.model.MarketplaceListing
import androidx.compose.runtime.collectAsState
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.OutlinedTextField
import androidx.compose.ui.remember
import androidx.compose.ui.state.MutableState
import androidx.compose.ui.state.remember

@Composable
fun MarketplaceViewScreen() {
    val viewModel: MarketplaceViewModel = viewModel()
    val listings by viewModel.listings.collectAsState()
    val loading by viewModel.loading.collectAsState()
    val error by viewModel.error.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Marketplace View") })
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
                Text("Marketplace Listings:", style = MaterialTheme.typography.headlineSmall)
                listings.forEach { listing ->
                    Card(Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
                        Column(Modifier.padding(8.dp)) {
                            Text("Title: ${listing.title}")
                            Text("Description: ${listing.description}")
                            Text("Price: ${listing.price}")
                            Text("Seller: ${listing.seller}")
                            Text("Created: ${listing.createdAt}")
                        }
                    }
                }
            }
            Spacer(Modifier.height(16.dp))
            var title by remember { mutableStateOf("") }
            var description by remember { mutableStateOf("") }
            var price by remember { mutableStateOf("") }
            var seller by remember { mutableStateOf("") }
            Button(onClick = {
                val priceValue = price.toDoubleOrNull() ?: 0.0
                viewModel.createListing(
                    MarketplaceListing(title = title, description = description, price = priceValue, seller = seller)
                )
            }, enabled = title.isNotBlank() && description.isNotBlank() && price.isNotBlank() && seller.isNotBlank()) {
                Text("Create New Listing")
            }
            OutlinedTextField(
                value = title,
                onValueChange = { title = it },
                label = { Text("Title") },
                modifier = Modifier.fillMaxWidth()
            )
            OutlinedTextField(
                value = description,
                onValueChange = { description = it },
                label = { Text("Description") },
                modifier = Modifier.fillMaxWidth()
            )
            OutlinedTextField(
                value = price,
                onValueChange = { price = it },
                label = { Text("Price") },
                modifier = Modifier.fillMaxWidth()
            )
            OutlinedTextField(
                value = seller,
                onValueChange = { seller = it },
                label = { Text("Seller") },
                modifier = Modifier.fillMaxWidth()
            )
        }
    }
} 