package com.agriconnect.app.ui.screens.logistics

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.agriconnect.app.data.model.*
import com.agriconnect.app.viewmodel.LogisticsViewModelImpl
import org.osmdroid.config.Configuration
import org.osmdroid.tileprovider.tilesource.TileSourceFactory
import org.osmdroid.util.GeoPoint
import org.osmdroid.views.MapView
import org.osmdroid.views.overlay.Marker
import org.osmdroid.views.overlay.Polyline

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LogisticsMapScreen(
    shipmentId: String? = null,
    onShipmentClick: (String) -> Unit,
    viewModel: LogisticsViewModelImpl = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val trackingUpdates by viewModel.trackingUpdates.collectAsStateWithLifecycle()
    
    var selectedTab by remember { mutableStateOf(0) }
    var showFilters by remember { mutableStateOf(false) }
    
    val context = LocalContext.current

    LaunchedEffect(shipmentId) {
        shipmentId?.let { viewModel.loadShipmentDetails(it) }
        viewModel.loadShipments()
    }

    Column(
        modifier = Modifier.fillMaxSize()
    ) {
        // Header
        TopAppBar(
            title = { Text("Logistics Tracking") },
            actions = {
                IconButton(onClick = { showFilters = true }) {
                    Icon(Icons.Default.FilterList, contentDescription = "Filter")
                }
                IconButton(onClick = { viewModel.loadShipments() }) {
                    Icon(Icons.Default.Refresh, contentDescription = "Refresh")
                }
            }
        )

        // Tabs
        TabRow(selectedTabIndex = selectedTab) {
            Tab(
                selected = selectedTab == 0,
                onClick = { selectedTab = 0 },
                text = { Text("Map View") }
            )
            Tab(
                selected = selectedTab == 1,
                onClick = { selectedTab = 1 },
                text = { Text("List View") }
            )
            Tab(
                selected = selectedTab == 2,
                onClick = { selectedTab = 2 },
                text = { Text("Live Tracking") }
            )
        }

        // Content based on selected tab
        when (selectedTab) {
            0 -> {
                // Map View
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .weight(1f)
                ) {
                    AndroidView(
                        factory = { context ->
                            Configuration.getInstance().load(context, context.getSharedPreferences("osmdroid", 0))
                            MapView(context).apply {
                                setTileSource(TileSourceFactory.MAPNIK)
                                setMultiTouchControls(true)
                                controller.setZoom(10.0)
                                controller.setCenter(GeoPoint(-1.2921, 36.8219)) // Nairobi center
                            }
                        },
                        update = { mapView ->
                            // Clear existing overlays
                            mapView.overlays.clear()
                            
                            // Add shipment markers
                            uiState.shipments.forEach { shipment ->
                                shipment.pickupCoordinates?.let { pickup ->
                                    val pickupMarker = Marker(mapView).apply {
                                        position = GeoPoint(pickup.latitude, pickup.longitude)
                                        title = "Pickup: ${shipment.title}"
                                        snippet = shipment.pickupAddress
                                        setAnchor(Marker.ANCHOR_CENTER, Marker.ANCHOR_BOTTOM)
                                    }
                                    mapView.overlays.add(pickupMarker)
                                }
                                
                                shipment.deliveryCoordinates?.let { delivery ->
                                    val deliveryMarker = Marker(mapView).apply {
                                        position = GeoPoint(delivery.latitude, delivery.longitude)
                                        title = "Delivery: ${shipment.title}"
                                        snippet = shipment.deliveryAddress
                                        setAnchor(Marker.ANCHOR_CENTER, Marker.ANCHOR_BOTTOM)
                                    }
                                    mapView.overlays.add(deliveryMarker)
                                }
                                
                                // Add route if available
                                if (shipment.pickupCoordinates != null && shipment.deliveryCoordinates != null) {
                                    val routeLine = Polyline().apply {
                                        addPoint(GeoPoint(shipment.pickupCoordinates.latitude, shipment.pickupCoordinates.longitude))
                                        addPoint(GeoPoint(shipment.deliveryCoordinates.latitude, shipment.deliveryCoordinates.longitude))
                                        color = when (shipment.status) {
                                            ShipmentStatus.IN_TRANSIT -> Color.Blue.hashCode()
                                            ShipmentStatus.DELIVERED -> Color.Green.hashCode()
                                            else -> Color.Gray.hashCode()
                                        }
                                        width = 5f
                                    }
                                    mapView.overlays.add(routeLine)
                                }
                            }
                            
                            mapView.invalidate()
                        },
                        modifier = Modifier.fillMaxSize()
                    )
                    
                    // Floating action button for current location
                    FloatingActionButton(
                        onClick = { /* Get current location */ },
                        modifier = Modifier
                            .align(Alignment.BottomEnd)
                            .padding(16.dp)
                    ) {
                        Icon(Icons.Default.MyLocation, contentDescription = "My Location")
                    }
                }
            }
            
            1 -> {
                // List View
                if (uiState.isLoading) {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        CircularProgressIndicator()
                    }
                } else if (uiState.shipments.isEmpty()) {
                    EmptyShipmentsCard()
                } else {
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        items(uiState.shipments) { shipment ->
                            ShipmentTrackingCard(
                                shipment = shipment,
                                onCardClick = { onShipmentClick(shipment.id) }
                            )
                        }
                    }
                }
            }
            
            2 -> {
                // Live Tracking
                uiState.selectedShipment?.let { shipment ->
                    LiveTrackingView(
                        shipment = shipment,
                        trackingEvents = trackingUpdates,
                        onUpdateStatus = { status ->
                            viewModel.updateShipmentStatus(shipment.id, status)
                        }
                    )
                } ?: run {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Icon(
                                Icons.Default.LocationOff,
                                contentDescription = null,
                                modifier = Modifier.size(64.dp),
                                tint = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Spacer(modifier = Modifier.height(16.dp))
                            Text(
                                text = "Select a shipment to view live tracking",
                                style = MaterialTheme.typography.titleMedium
                            )
                        }
                    }
                }
            }
        }
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
fun ShipmentTrackingCard(
    shipment: Shipment,
    onCardClick: () -> Unit
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
                        text = shipment.title,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "${shipment.commodity} • ${shipment.weightKg} ${shipment.unit}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                
                // Status Badge
                AssistChip(
                    onClick = { },
                    label = { Text(shipment.status.name.replace("_", " ")) },
                    colors = AssistChipDefaults.assistChipColors(
                        containerColor = when (shipment.status) {
                            ShipmentStatus.IN_TRANSIT -> MaterialTheme.colorScheme.primaryContainer
                            ShipmentStatus.DELIVERED -> MaterialTheme.colorScheme.tertiaryContainer
                            ShipmentStatus.CANCELLED, ShipmentStatus.FAILED -> MaterialTheme.colorScheme.errorContainer
                            else -> MaterialTheme.colorScheme.surfaceVariant
                        }
                    )
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Route Information
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "From",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = shipment.pickupAddress,
                        style = MaterialTheme.typography.bodySmall,
                        maxLines = 1
                    )
                }
                
                Icon(
                    Icons.Default.ArrowForward,
                    contentDescription = null,
                    modifier = Modifier.padding(horizontal = 8.dp),
                    tint = MaterialTheme.colorScheme.onSurfaceVariant
                )
                
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "To",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = shipment.deliveryAddress,
                        style = MaterialTheme.typography.bodySmall,
                        maxLines = 1
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Distance and Cost
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                shipment.distanceKm?.let { distance ->
                    Text(
                        text = "${String.format("%.1f", distance)} km",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                
                Text(
                    text = "${shipment.currency} ${String.format("%.2f", shipment.totalCost)}",
                    style = MaterialTheme.typography.bodySmall,
                    fontWeight = FontWeight.Medium,
                    color = MaterialTheme.colorScheme.primary
                )
            }

            // Provider Information
            shipment.provider?.let { provider ->
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        Icons.Default.LocalShipping,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp),
                        tint = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = provider.companyName,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    if (provider.rating > 0) {
                        Spacer(modifier = Modifier.width(8.dp))
                        Icon(
                            Icons.Default.Star,
                            contentDescription = null,
                            modifier = Modifier.size(12.dp),
                            tint = MaterialTheme.colorScheme.primary
                        )
                        Text(
                            text = String.format("%.1f", provider.rating),
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun LiveTrackingView(
    shipment: Shipment,
    trackingEvents: List<TrackingEvent>,
    onUpdateStatus: (ShipmentStatus) -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            // Shipment Summary
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer
                )
            ) {
                Column(
                    modifier = Modifier.padding(16.dp)
                ) {
                    Text(
                        text = shipment.title,
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "Status: ${shipment.status.name.replace("_", " ")}",
                        style = MaterialTheme.typography.bodyMedium
                    )
                    shipment.distanceKm?.let { distance ->
                        Text(
                            text = "Distance: ${String.format("%.1f", distance)} km",
                            style = MaterialTheme.typography.bodyMedium
                        )
                    }
                }
            }
        }

        item {
            Text(
                text = "Tracking Events",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
        }

        items(trackingEvents) { event ->
            TrackingEventCard(event = event)
        }

        if (trackingEvents.isEmpty()) {
            item {
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
                            Icons.Default.Timeline,
                            contentDescription = null,
                            modifier = Modifier.size(48.dp),
                            tint = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = "No tracking events yet",
                            style = MaterialTheme.typography.titleMedium
                        )
                        Text(
                            text = "Events will appear here as the shipment progresses",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun TrackingEventCard(event: TrackingEvent) {
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.Top
        ) {
            Icon(
                when (event.eventType) {
                    TrackingEventType.PICKUP_STARTED -> Icons.Default.PlayArrow
                    TrackingEventType.PICKUP_COMPLETED -> Icons.Default.CheckCircle
                    TrackingEventType.IN_TRANSIT -> Icons.Default.LocalShipping
                    TrackingEventType.DELIVERY_STARTED -> Icons.Default.LocationOn
                    TrackingEventType.DELIVERY_COMPLETED -> Icons.Default.Done
                    TrackingEventType.DELAY -> Icons.Default.Warning
                    TrackingEventType.ISSUE -> Icons.Default.Error
                },
                contentDescription = null,
                tint = when (event.eventType) {
                    TrackingEventType.DELIVERY_COMPLETED -> MaterialTheme.colorScheme.primary
                    TrackingEventType.DELAY, TrackingEventType.ISSUE -> MaterialTheme.colorScheme.error
                    else -> MaterialTheme.colorScheme.onSurfaceVariant
                },
                modifier = Modifier.padding(end = 12.dp, top = 2.dp)
            )
            
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = event.eventType.name.replace("_", " ").lowercase()
                        .replaceFirstChar { it.uppercase() },
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Medium
                )
                
                event.address?.let { address ->
                    Text(
                        text = address,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                
                event.notes?.let { notes ->
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = notes,
                        style = MaterialTheme.typography.bodySmall
                    )
                }
                
                Text(
                    text = event.timestamp, // Format timestamp appropriately
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(top = 4.dp)
                )
            }
        }
    }
}

@Composable
fun EmptyShipmentsCard() {
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
                Icons.Default.LocalShipping,
                contentDescription = null,
                modifier = Modifier.size(64.dp),
                tint = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "No Shipments Found",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Create a shipment request to start tracking deliveries",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}
