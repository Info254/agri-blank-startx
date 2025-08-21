package com.agriconnect.app.ui.screens.logistics

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.agriconnect.app.data.model.*
import com.agriconnect.app.viewmodel.LogisticsViewModelImpl

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CreateShipmentScreen(
    onNavigateBack: () -> Unit,
    onShipmentCreated: (String) -> Unit,
    viewModel: LogisticsViewModelImpl = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    
    var formData by remember { mutableStateOf(CreateShipmentFormData()) }
    var showProviderSelection by remember { mutableStateOf(false) }
    var selectedProvider by remember { mutableStateOf<LogisticsProvider?>(null) }
    var showQuoteDialog by remember { mutableStateOf(false) }
    
    val scrollState = rememberScrollState()

    LaunchedEffect(Unit) {
        viewModel.loadLogisticsProviders()
    }

    LaunchedEffect(uiState.createdShipment) {
        uiState.createdShipment?.let { shipment ->
            onShipmentCreated(shipment.id)
        }
    }

    Column(
        modifier = Modifier.fillMaxSize()
    ) {
        // Header
        TopAppBar(
            title = { Text("Create Shipment Request") },
            navigationIcon = {
                IconButton(onClick = onNavigateBack) {
                    Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                }
            }
        )

        // Form Content
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(scrollState)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Basic Information
            Card(
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text(
                        text = "Shipment Details",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )

                    OutlinedTextField(
                        value = formData.title,
                        onValueChange = { formData = formData.copy(title = it) },
                        label = { Text("Shipment Title") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )

                    OutlinedTextField(
                        value = formData.description,
                        onValueChange = { formData = formData.copy(description = it) },
                        label = { Text("Description") },
                        modifier = Modifier.fillMaxWidth(),
                        minLines = 2,
                        maxLines = 4
                    )

                    // Commodity Selection
                    var expandedCommodity by remember { mutableStateOf(false) }
                    ExposedDropdownMenuBox(
                        expanded = expandedCommodity,
                        onExpandedChange = { expandedCommodity = it }
                    ) {
                        OutlinedTextField(
                            value = formData.commodity,
                            onValueChange = { },
                            readOnly = true,
                            label = { Text("Commodity") },
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expandedCommodity) },
                            modifier = Modifier
                                .fillMaxWidth()
                                .menuAnchor()
                        )
                        ExposedDropdownMenu(
                            expanded = expandedCommodity,
                            onDismissRequest = { expandedCommodity = false }
                        ) {
                            COMMODITIES.forEach { commodity ->
                                DropdownMenuItem(
                                    text = { Text(commodity) },
                                    onClick = {
                                        formData = formData.copy(commodity = commodity)
                                        expandedCommodity = false
                                    }
                                )
                            }
                        }
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        OutlinedTextField(
                            value = formData.weightKg.toString().takeIf { it != "0.0" } ?: "",
                            onValueChange = { 
                                it.toDoubleOrNull()?.let { weight ->
                                    formData = formData.copy(weightKg = weight)
                                }
                            },
                            label = { Text("Weight (kg)") },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                            modifier = Modifier.weight(1f)
                        )

                        // Unit Selection
                        var expandedUnit by remember { mutableStateOf(false) }
                        ExposedDropdownMenuBox(
                            expanded = expandedUnit,
                            onExpandedChange = { expandedUnit = it },
                            modifier = Modifier.weight(1f)
                        ) {
                            OutlinedTextField(
                                value = formData.unit,
                                onValueChange = { },
                                readOnly = true,
                                label = { Text("Unit") },
                                trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expandedUnit) },
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .menuAnchor()
                            )
                            ExposedDropdownMenu(
                                expanded = expandedUnit,
                                onDismissRequest = { expandedUnit = false }
                            ) {
                                listOf("kg", "tons", "bags", "crates", "boxes").forEach { unit ->
                                    DropdownMenuItem(
                                        text = { Text(unit) },
                                        onClick = {
                                            formData = formData.copy(unit = unit)
                                            expandedUnit = false
                                        }
                                    )
                                }
                            }
                        }
                    }
                }
            }

            // Pickup Information
            Card(
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text(
                        text = "Pickup Details",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )

                    OutlinedTextField(
                        value = formData.pickupAddress,
                        onValueChange = { formData = formData.copy(pickupAddress = it) },
                        label = { Text("Pickup Address") },
                        modifier = Modifier.fillMaxWidth(),
                        minLines = 2
                    )

                    OutlinedTextField(
                        value = formData.pickupDate,
                        onValueChange = { formData = formData.copy(pickupDate = it) },
                        label = { Text("Pickup Date (YYYY-MM-DD)") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )

                    OutlinedTextField(
                        value = formData.pickupTime,
                        onValueChange = { formData = formData.copy(pickupTime = it) },
                        label = { Text("Pickup Time (HH:MM)") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )

                    OutlinedTextField(
                        value = formData.pickupContact,
                        onValueChange = { formData = formData.copy(pickupContact = it) },
                        label = { Text("Pickup Contact") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )
                }
            }

            // Delivery Information
            Card(
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text(
                        text = "Delivery Details",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )

                    OutlinedTextField(
                        value = formData.deliveryAddress,
                        onValueChange = { formData = formData.copy(deliveryAddress = it) },
                        label = { Text("Delivery Address") },
                        modifier = Modifier.fillMaxWidth(),
                        minLines = 2
                    )

                    OutlinedTextField(
                        value = formData.deliveryDate,
                        onValueChange = { formData = formData.copy(deliveryDate = it) },
                        label = { Text("Delivery Date (YYYY-MM-DD)") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )

                    OutlinedTextField(
                        value = formData.deliveryTime,
                        onValueChange = { formData = formData.copy(deliveryTime = it) },
                        label = { Text("Delivery Time (HH:MM)") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )

                    OutlinedTextField(
                        value = formData.deliveryContact,
                        onValueChange = { formData = formData.copy(deliveryContact = it) },
                        label = { Text("Delivery Contact") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )
                }
            }

            // Special Requirements
            Card(
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text(
                        text = "Special Requirements",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )

                    // Temperature Control
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Checkbox(
                            checked = formData.requiresRefrigeration,
                            onCheckedChange = { formData = formData.copy(requiresRefrigeration = it) }
                        )
                        Text(
                            text = "Requires Refrigeration",
                            modifier = Modifier.padding(start = 8.dp)
                        )
                    }

                    // Fragile Items
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Checkbox(
                            checked = formData.isFragile,
                            onCheckedChange = { formData = formData.copy(isFragile = it) }
                        )
                        Text(
                            text = "Fragile Items",
                            modifier = Modifier.padding(start = 8.dp)
                        )
                    }

                    // Hazardous Materials
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Checkbox(
                            checked = formData.isHazardous,
                            onCheckedChange = { formData = formData.copy(isHazardous = it) }
                        )
                        Text(
                            text = "Hazardous Materials",
                            modifier = Modifier.padding(start = 8.dp)
                        )
                    }

                    OutlinedTextField(
                        value = formData.specialInstructions,
                        onValueChange = { formData = formData.copy(specialInstructions = it) },
                        label = { Text("Special Instructions") },
                        modifier = Modifier.fillMaxWidth(),
                        minLines = 2,
                        maxLines = 4
                    )
                }
            }

            // Provider Selection
            Card(
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text(
                        text = "Logistics Provider",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )

                    selectedProvider?.let { provider ->
                        ProviderSelectionCard(
                            provider = provider,
                            onRemove = { selectedProvider = null }
                        )
                    } ?: run {
                        OutlinedButton(
                            onClick = { showProviderSelection = true },
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Icon(Icons.Default.Add, contentDescription = null)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Select Provider")
                        }
                    }

                    // Get Quote Button
                    if (selectedProvider != null && formData.isValidForQuote()) {
                        Button(
                            onClick = { showQuoteDialog = true },
                            modifier = Modifier.fillMaxWidth(),
                            enabled = !uiState.isCalculatingQuote
                        ) {
                            if (uiState.isCalculatingQuote) {
                                CircularProgressIndicator(
                                    modifier = Modifier.size(16.dp),
                                    strokeWidth = 2.dp
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                            }
                            Text("Get Shipping Quote")
                        }
                    }

                    // Display Quote
                    uiState.shippingQuote?.let { quote ->
                        ShippingQuoteCard(
                            quote = quote,
                            onDismiss = { viewModel.clearShippingQuote() }
                        )
                    }
                }
            }

            // Submit Button
            Button(
                onClick = {
                    selectedProvider?.let { provider ->
                        val shipmentData = formData.copy(providerId = provider.id)
                        viewModel.createShipment(shipmentData, "current_user_id") // Replace with actual user ID
                    }
                },
                modifier = Modifier.fillMaxWidth(),
                enabled = formData.isValid() && selectedProvider != null && !uiState.isSubmitting
            ) {
                if (uiState.isSubmitting) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(16.dp),
                        strokeWidth = 2.dp
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                }
                Text("Create Shipment Request")
            }
        }
    }

    // Provider Selection Dialog
    if (showProviderSelection) {
        ProviderSelectionDialog(
            providers = uiState.logisticsProviders,
            onProviderSelected = { provider ->
                selectedProvider = provider
                showProviderSelection = false
            },
            onDismiss = { showProviderSelection = false }
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

@Composable
fun ProviderSelectionCard(
    provider: LogisticsProvider,
    onRemove: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.primaryContainer
        )
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = provider.companyName,
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = provider.serviceAreas.joinToString(", "),
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                if (provider.rating > 0) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            Icons.Default.Star,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp),
                            tint = MaterialTheme.colorScheme.primary
                        )
                        Text(
                            text = String.format("%.1f", provider.rating),
                            style = MaterialTheme.typography.bodySmall,
                            modifier = Modifier.padding(start = 4.dp)
                        )
                    }
                }
            }
            
            IconButton(onClick = onRemove) {
                Icon(Icons.Default.Close, contentDescription = "Remove")
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProviderSelectionDialog(
    providers: List<LogisticsProvider>,
    onProviderSelected: (LogisticsProvider) -> Unit,
    onDismiss: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Select Logistics Provider") },
        text = {
            LazyColumn {
                items(providers) { provider ->
                    Card(
                        onClick = { onProviderSelected(provider) },
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp)
                    ) {
                        Column(
                            modifier = Modifier.padding(16.dp)
                        ) {
                            Text(
                                text = provider.companyName,
                                style = MaterialTheme.typography.titleSmall,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = provider.serviceAreas.joinToString(", "),
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            if (provider.rating > 0) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    modifier = Modifier.padding(top = 4.dp)
                                ) {
                                    Icon(
                                        Icons.Default.Star,
                                        contentDescription = null,
                                        modifier = Modifier.size(16.dp),
                                        tint = MaterialTheme.colorScheme.primary
                                    )
                                    Text(
                                        text = String.format("%.1f", provider.rating),
                                        style = MaterialTheme.typography.bodySmall,
                                        modifier = Modifier.padding(start = 4.dp)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        },
        confirmButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}

@Composable
fun ShippingQuoteCard(
    quote: ShippingCostBreakdown,
    onDismiss: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.tertiaryContainer
        )
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Shipping Quote",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                IconButton(onClick = onDismiss) {
                    Icon(Icons.Default.Close, contentDescription = "Dismiss")
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Cost Breakdown
            quote.breakdown.forEach { (factor, cost) ->
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = factor.replace("_", " ").replaceFirstChar { it.uppercase() },
                        style = MaterialTheme.typography.bodyMedium
                    )
                    Text(
                        text = "${quote.currency} ${String.format("%.2f", cost)}",
                        style = MaterialTheme.typography.bodyMedium
                    )
                }
            }

            Divider(modifier = Modifier.padding(vertical = 8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "Total Cost",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "${quote.currency} ${String.format("%.2f", quote.totalCost)}",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
            }
        }
    }
}

// Extension functions for form validation
private fun CreateShipmentFormData.isValid(): Boolean {
    return title.isNotBlank() &&
            commodity.isNotBlank() &&
            weightKg > 0 &&
            pickupAddress.isNotBlank() &&
            deliveryAddress.isNotBlank() &&
            pickupDate.isNotBlank() &&
            deliveryDate.isNotBlank()
}

private fun CreateShipmentFormData.isValidForQuote(): Boolean {
    return isValid() && providerId.isNotBlank()
}
