package com.agriconnect.app.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun MarketplaceTradingMenu(onSelect: (String) -> Unit, onDismiss: () -> Unit) {
    ModalBottomSheet(onDismissRequest = onDismiss) {
        Column(Modifier.padding(16.dp)) {
            Text("Marketplace & Trading", style = MaterialTheme.typography.headlineSmall)
            Spacer(Modifier.height(8.dp))
            Button(
                onClick = { onSelect("farm_inputs_marketplace") },
                modifier = Modifier.fillMaxWidth()
            ) { Text("Farm Inputs Marketplace") }
            Button(
                onClick = { onSelect("commodity_trading") },
                modifier = Modifier.fillMaxWidth()
            ) { Text("Commodity Trading") }
            Button(
                onClick = { onSelect("equipment_marketplace") },
                modifier = Modifier.fillMaxWidth()
            ) { Text("Equipment Marketplace") }
            Button(
                onClick = { onSelect("export_opportunities") },
                modifier = Modifier.fillMaxWidth()
            ) { Text("Export Opportunities") }
            Button(
                onClick = { onSelect("city_markets") },
                modifier = Modifier.fillMaxWidth()
            ) { Text("City Markets") }
        }
    }
} 