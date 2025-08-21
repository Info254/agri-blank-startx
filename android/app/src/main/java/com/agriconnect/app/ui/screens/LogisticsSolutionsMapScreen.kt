package com.agriconnect.app.ui.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.agriconnect.app.R

// Data model for a logistics provider
// In real app, fetch from backend

data class LogisticsProvider(
    val id: String,
    val name: String,
    val type: String, // e.g., transport, storage, aggregator, etc.
    val description: String,
    val county: String,
    val latitude: Double,
    val longitude: Double,
    val contact: String,
    val isVerified: Boolean,
    val rating: Double,
    val services: List<String>
)

@Composable
fun LogisticsSolutionsMapScreen() {
    // Mock data for demonstration
    val allProviders = remember {
        listOf(
            LogisticsProvider("1", "Central Storage Facility", "storage", "Modern cold storage facility - 5000 tons capacity", "Nakuru", -0.3031, 36.0800, "+254 700 234 567", true, 4.5, listOf("Cold Storage", "Dry Storage")),
            LogisticsProvider("2", "AgriCredit Solutions", "microcredit", "Microfinance institution - 5-15% interest rates", "Kisumu", -0.0917, 34.7680, "+254 700 345 678", true, 4.3, listOf("Farm Loans")),
            LogisticsProvider("3", "FarmLink P2P", "p2p_lending", "Peer-to-peer lending platform - 8-20% interest", "Mombasa", -4.0435, 39.6682, "+254 700 456 789", true, 4.2, listOf("Quick Loans")),
            LogisticsProvider("4", "Nairobi Transporters", "transport", "Fleet of trucks for produce delivery", "Nairobi", -1.2921, 36.8219, "+254 700 111 222", true, 4.6, listOf("Transport")),
            LogisticsProvider("5", "Thika Aggregators", "aggregator", "Handles maize, beans, and more", "Thika", -1.0333, 37.0693, "+254 700 333 444", true, 4.1, listOf("Aggregation"))
        )
    }
    var selectedType by remember { mutableStateOf("all") }
    var selectedCounty by remember { mutableStateOf("all") }
    var searchTerm by remember { mutableStateOf("") }
    var selectedProvider by remember { mutableStateOf<LogisticsProvider?>(null) }

    val filteredProviders = allProviders.filter { provider ->
        (selectedType == "all" || provider.type == selectedType) &&
        (selectedCounty == "all" || provider.county.equals(selectedCounty, ignoreCase = true)) &&
        (searchTerm.isBlank() || provider.name.contains(searchTerm, ignoreCase = true) || provider.description.contains(searchTerm, ignoreCase = true))
    }

    Column(Modifier.fillMaxSize().padding(16.dp)) {
        Text("Logistics Solutions Map", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        Spacer(Modifier.height(8.dp))
        // Filters
        Row(verticalAlignment = Alignment.CenterVertically) {
            DropdownMenuBox(
                label = "Type",
                options = listOf("all", "transport", "storage", "aggregator", "microcredit", "p2p_lending"),
                selected = selectedType,
                onSelected = { selectedType = it }
            )
            Spacer(Modifier.width(8.dp))
            DropdownMenuBox(
                label = "County",
                options = listOf("all", "Nairobi", "Nakuru", "Kisumu", "Mombasa", "Thika"),
                selected = selectedCounty,
                onSelected = { selectedCounty = it }
            )
            Spacer(Modifier.width(8.dp))
            OutlinedTextField(
                value = searchTerm,
                onValueChange = { searchTerm = it },
                label = { Text("Search") },
                modifier = Modifier.weight(1f)
            )
        }
        Spacer(Modifier.height(8.dp))
        // Map legend
        MapLegend()
        Spacer(Modifier.height(8.dp))
        // Map area
        Box(Modifier.fillMaxWidth().height(300.dp).background(Color(0xFFE0E0E0))) {
            // Static SVG/bitmap background (replace with your Kenya map resource)
            Image(
                painter = painterResource(id = R.drawable.kenya_map_outline),
                contentDescription = "Kenya Map",
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop
            )
            // Overlay provider pins
            filteredProviders.forEach { provider ->
                // Calculate position based on lat/lng (mocked for demo)
                val left = ((provider.longitude - 34) / 8) * 1.0f // Kenya approx: lng 34-42
                val top = ((provider.latitude + 5) / 10) * 1.0f // Kenya approx: lat -5 to +5
                Box(
                    Modifier
                        .absoluteOffset(x = (left * 300).dp, y = (top * 300).dp)
                        .size(24.dp)
                        .background(getProviderColor(provider.type), shape = MaterialTheme.shapes.small)
                        .clickable { selectedProvider = provider },
                    contentAlignment = Alignment.Center
                ) {
                    Text("•", color = Color.White, fontWeight = FontWeight.Bold)
                }
            }
            // Popup for selected provider
            selectedProvider?.let { provider ->
                Box(
                    Modifier
                        .align(Alignment.TopEnd)
                        .background(Color.White, shape = MaterialTheme.shapes.medium)
                        .padding(12.dp)
                        .width(220.dp)
                ) {
                    Column {
                        Text(provider.name, fontWeight = FontWeight.Bold)
                        Text(provider.type)
                        Text(provider.description, style = MaterialTheme.typography.bodySmall)
                        Text("Contact: ${provider.contact}")
                        Text("Rating: ${provider.rating}")
                        Text("Services: ${provider.services.joinToString(", ")}")
                        Button(onClick = { selectedProvider = null }, modifier = Modifier.align(Alignment.End)) {
                            Text("Close")
                        }
                    }
                }
            }
        }
        Spacer(Modifier.height(8.dp))
        // Providers list
        Text("Providers (${filteredProviders.size})", fontWeight = FontWeight.Bold)
        LazyColumn(Modifier.weight(1f)) {
            items(filteredProviders) { provider ->
                Card(
                    Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp)
                        .clickable { selectedProvider = provider }
                ) {
                    Column(Modifier.padding(8.dp)) {
                        Text(provider.name, fontWeight = FontWeight.Bold)
                        Text(provider.type)
                        Text(provider.county)
                        Text(provider.description, style = MaterialTheme.typography.bodySmall)
                    }
                }
            }
        }
    }
}

@Composable
fun DropdownMenuBox(label: String, options: List<String>, selected: String, onSelected: (String) -> Unit) {
    var expanded by remember { mutableStateOf(false) }
    Box {
        OutlinedButton(onClick = { expanded = true }) {
            Text("$label: $selected")
        }
        DropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
            options.forEach { option ->
                DropdownMenuItem(text = { Text(option) }, onClick = {
                    onSelected(option)
                    expanded = false
                })
            }
        }
    }
}

@Composable
fun MapLegend() {
    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceEvenly) {
        LegendItem("Transport", Color(0xFF2196F3))
        LegendItem("Storage", Color(0xFF4CAF50))
        LegendItem("Aggregator", Color(0xFF9C27B0))
        LegendItem("Microcredit", Color(0xFFFF9800))
        LegendItem("P2P Lending", Color(0xFF795548))
    }
}

@Composable
fun LegendItem(label: String, color: Color) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Box(Modifier.size(16.dp).background(color, shape = MaterialTheme.shapes.small))
        Spacer(Modifier.width(4.dp))
        Text(label, style = MaterialTheme.typography.bodySmall)
    }
}

fun getProviderColor(type: String): Color = when (type) {
    "transport" -> Color(0xFF2196F3)
    "storage" -> Color(0xFF4CAF50)
    "aggregator" -> Color(0xFF9C27B0)
    "microcredit" -> Color(0xFFFF9800)
    "p2p_lending" -> Color(0xFF795548)
    else -> Color.Gray
} 