package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.agriconnect.app.data.model.Warehouse
import com.agriconnect.app.data.model.WarehouseBooking
import com.agriconnect.app.viewmodel.WarehouseViewModel

@Composable
fun WarehouseScreen(viewModel: WarehouseViewModel, userId: String) {
    val uiState by viewModel.uiState.collectAsState()
    val tabs = listOf("Warehouses", "My Bookings")
    var selectedTab by remember { mutableStateOf(0) }

    LaunchedEffect(selectedTab) {
        when (selectedTab) {
            0 -> viewModel.loadWarehouses()
            1 -> viewModel.loadBookings(userId)
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
            0 -> WarehouseList(uiState.warehouses)
            1 -> BookingList(uiState.bookings)
        }
    }
}

@Composable
fun WarehouseList(warehouses: List<Warehouse>) {
    LazyColumn {
        items(warehouses.size) { idx ->
            val warehouse = warehouses[idx]
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp)
            ) {
                Column(Modifier.padding(8.dp)) {
                    Text("Warehouse: ${warehouse.name}", style = MaterialTheme.typography.titleMedium)
                    Text("Location: ${warehouse.location}")
                    Text("Capacity: ${warehouse.capacity}")
                }
            }
        }
    }
}

@Composable
fun BookingList(bookings: List<WarehouseBooking>) {
    LazyColumn {
        items(bookings.size) { idx ->
            val booking = bookings[idx]
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp)
            ) {
                Column(Modifier.padding(8.dp)) {
                    Text("Booking ID: ${booking.id}", style = MaterialTheme.typography.titleMedium)
                    Text("Warehouse: ${booking.warehouseName}")
                    Text("Start: ${booking.startDate}")
                    Text("End: ${booking.endDate}")
                }
            }
        }
    }
} 