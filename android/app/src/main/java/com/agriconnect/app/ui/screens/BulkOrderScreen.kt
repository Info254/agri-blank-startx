package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.agriconnect.app.data.model.BulkOrder
import com.agriconnect.app.viewmodel.BulkOrderViewModel

@Composable
fun BulkOrderScreen(viewModel: BulkOrderViewModel) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.loadOrders()
    }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        if (uiState.isLoading) {
            CircularProgressIndicator(modifier = Modifier.align(Alignment.CenterHorizontally))
        }
        uiState.error?.let {
            Text("Error: $it", color = MaterialTheme.colorScheme.error)
        }
        uiState.successMessage?.let {
            Text(it, color = MaterialTheme.colorScheme.primary)
        }

        // List of Bulk Orders
        LazyColumn(modifier = Modifier.weight(1f)) {
            items(uiState.orders.size) { idx ->
                val order = uiState.orders[idx]
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp),
                    onClick = { viewModel.selectOrder(order) }
                ) {
                    Column(Modifier.padding(8.dp)) {
                        Text("Order: ${order.title}", style = MaterialTheme.typography.titleMedium)
                        Text("Quantity: ${order.quantity}")
                        Text("Status: ${order.status}")
                        Row {
                            Button(
                                onClick = { viewModel.deleteOrder(order.id) },
                                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)
                            ) {
                                Text("Delete")
                            }
                            Spacer(Modifier.width(8.dp))
                            // Add Edit button and other actions as needed
                        }
                    }
                }
            }
        }

        // Add form for creating/updating orders here (not shown for brevity)
        // You can use TextFields, Buttons, etc., and call viewModel.createOrder() or viewModel.updateOrder()
    }
} 