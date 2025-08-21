package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun OrdersAuctionsMenu(onSelect: (String) -> Unit, onDismiss: () -> Unit) {
    ModalBottomSheet(onDismissRequest = onDismiss) {
        Column(Modifier.padding(16.dp)) {
            Text("Orders & Auctions", style = MaterialTheme.typography.headlineSmall)
            Spacer(Modifier.height(8.dp))
            Button(onClick = { onSelect("group_input_orders") }, modifier = Modifier.fillMaxWidth()) { Text("Group Input Orders") }
            Button(onClick = { onSelect("input_pricing_verification") }, modifier = Modifier.fillMaxWidth()) { Text("Input Pricing Verification") }
            Button(onClick = { onSelect("reverse_bulk_auctions") }, modifier = Modifier.fillMaxWidth()) { Text("Reverse Bulk Auctions") }
            Button(onClick = { onSelect("bulk_order_dashboard") }, modifier = Modifier.fillMaxWidth()) { Text("Bulk Order Dashboard") }
            Button(onClick = { onSelect("barter_exchange") }, modifier = Modifier.fillMaxWidth()) { Text("Barter Exchange") }
            Button(onClick = { onSelect("my_trades") }, modifier = Modifier.fillMaxWidth()) { Text("My Trades") }
            Button(onClick = { onSelect("price_trends") }, modifier = Modifier.fillMaxWidth()) { Text("Price Trends") }
            Button(onClick = { onSelect("marketplace_view") }, modifier = Modifier.fillMaxWidth()) { Text("Marketplace View") }
        }
    }
} 