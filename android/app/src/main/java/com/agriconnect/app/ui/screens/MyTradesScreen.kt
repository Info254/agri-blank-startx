package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.agriconnect.app.ui.viewmodels.MyTradesViewModel
import com.agriconnect.app.data.model.MyTrade
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.remember
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.OutlinedTextField
import androidx.compose.runtime.mutableStateOf

@Composable
fun MyTradesScreen() {
    val viewModel: MyTradesViewModel = viewModel()
    val trades by viewModel.trades.collectAsState()
    val loading by viewModel.loading.collectAsState()
    val error by viewModel.error.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(title = { Text("My Trades") })
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
                Text("My Trades:", style = MaterialTheme.typography.headlineSmall)
                trades.forEach { trade ->
                    Card(Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
                        Column(Modifier.padding(8.dp)) {
                            Text("Type: ${trade.tradeType}")
                            Text("Product: ${trade.product}")
                            Text("Quantity: ${trade.quantity}")
                            Text("Price: ${trade.price}")
                            Text("Status: ${trade.status}")
                            Text("Created: ${trade.createdAt}")
                        }
                    }
                }
            }
            Spacer(Modifier.height(16.dp))
            var tradeType by remember { mutableStateOf("buy") }
            var product by remember { mutableStateOf("") }
            var quantity by remember { mutableStateOf("") }
            var price by remember { mutableStateOf("") }
            Button(onClick = {
                val quantityValue = quantity.toIntOrNull() ?: 0
                val priceValue = price.toDoubleOrNull() ?: 0.0
                viewModel.createTrade(
                    MyTrade(tradeType = tradeType, product = product, quantity = quantityValue, price = priceValue)
                )
            }, enabled = product.isNotBlank() && quantity.isNotBlank() && price.isNotBlank()) {
                Text("Create New Trade")
            }
            OutlinedTextField(
                value = product,
                onValueChange = { product = it },
                label = { Text("Product") },
                modifier = Modifier.fillMaxWidth()
            )
            OutlinedTextField(
                value = quantity,
                onValueChange = { quantity = it },
                label = { Text("Quantity") },
                modifier = Modifier.fillMaxWidth()
            )
            OutlinedTextField(
                value = price,
                onValueChange = { price = it },
                label = { Text("Price") },
                modifier = Modifier.fillMaxWidth()
            )
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceEvenly) {
                Button(onClick = { tradeType = "buy" }, enabled = tradeType != "buy") { Text("Buy") }
                Button(onClick = { tradeType = "sell" }, enabled = tradeType != "sell") { Text("Sell") }
            }
        }
    }
} 