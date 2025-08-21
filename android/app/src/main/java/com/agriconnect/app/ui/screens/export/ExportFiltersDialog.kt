package com.agriconnect.app.ui.screens.export

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import com.agriconnect.app.data.model.ExportConstants
import com.agriconnect.app.data.model.ExportFilters

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ExportFiltersDialog(
    currentFilters: ExportFilters,
    onFiltersApplied: (ExportFilters) -> Unit,
    onDismiss: () -> Unit
) {
    var filters by remember { mutableStateOf(currentFilters) }
    
    Dialog(onDismissRequest = onDismiss) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .fillMaxHeight(0.9f)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp)
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Filter Opportunities",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold
                    )
                    TextButton(onClick = onDismiss) {
                        Text("Cancel")
                    }
                }

                Divider(modifier = Modifier.padding(vertical = 8.dp))

                // Scrollable content
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    // Commodity Filter
                    FilterSection(
                        title = "Commodity",
                        content = {
                            var expanded by remember { mutableStateOf(false) }
                            
                            ExposedDropdownMenuBox(
                                expanded = expanded,
                                onExpandedChange = { expanded = it }
                            ) {
                                OutlinedTextField(
                                    value = filters.commodity ?: "All Commodities",
                                    onValueChange = { },
                                    readOnly = true,
                                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
                                    modifier = Modifier
                                        .menuAnchor()
                                        .fillMaxWidth()
                                )
                                
                                ExposedDropdownMenu(
                                    expanded = expanded,
                                    onDismissRequest = { expanded = false }
                                ) {
                                    DropdownMenuItem(
                                        text = { Text("All Commodities") },
                                        onClick = {
                                            filters = filters.copy(commodity = null)
                                            expanded = false
                                        }
                                    )
                                    ExportConstants.EXPORT_COMMODITIES.forEach { commodity ->
                                        DropdownMenuItem(
                                            text = { Text(commodity) },
                                            onClick = {
                                                filters = filters.copy(commodity = commodity)
                                                expanded = false
                                            }
                                        )
                                    }
                                }
                            }
                        }
                    )

                    // Destination Country Filter
                    FilterSection(
                        title = "Destination Country",
                        content = {
                            var expanded by remember { mutableStateOf(false) }
                            
                            ExposedDropdownMenuBox(
                                expanded = expanded,
                                onExpandedChange = { expanded = it }
                            ) {
                                OutlinedTextField(
                                    value = filters.destinationCountry ?: "All Countries",
                                    onValueChange = { },
                                    readOnly = true,
                                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
                                    modifier = Modifier
                                        .menuAnchor()
                                        .fillMaxWidth()
                                )
                                
                                ExposedDropdownMenu(
                                    expanded = expanded,
                                    onDismissRequest = { expanded = false }
                                ) {
                                    DropdownMenuItem(
                                        text = { Text("All Countries") },
                                        onClick = {
                                            filters = filters.copy(destinationCountry = null)
                                            expanded = false
                                        }
                                    )
                                    ExportConstants.EXPORT_COUNTRIES.forEach { country ->
                                        DropdownMenuItem(
                                            text = { Text(country) },
                                            onClick = {
                                                filters = filters.copy(destinationCountry = country)
                                                expanded = false
                                            }
                                        )
                                    }
                                }
                            }
                        }
                    )

                    // Volume Range Filter
                    FilterSection(
                        title = "Volume Range (kg)",
                        content = {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                OutlinedTextField(
                                    value = filters.minVolume?.toString() ?: "",
                                    onValueChange = { value ->
                                        filters = filters.copy(
                                            minVolume = value.toDoubleOrNull()
                                        )
                                    },
                                    label = { Text("Min Volume") },
                                    modifier = Modifier.weight(1f)
                                )
                                OutlinedTextField(
                                    value = filters.maxVolume?.toString() ?: "",
                                    onValueChange = { value ->
                                        filters = filters.copy(
                                            maxVolume = value.toDoubleOrNull()
                                        )
                                    },
                                    label = { Text("Max Volume") },
                                    modifier = Modifier.weight(1f)
                                )
                            }
                        }
                    )

                    // Price Range Filter
                    FilterSection(
                        title = "Price Range (KES per kg)",
                        content = {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                OutlinedTextField(
                                    value = filters.minPrice?.toString() ?: "",
                                    onValueChange = { value ->
                                        filters = filters.copy(
                                            minPrice = value.toDoubleOrNull()
                                        )
                                    },
                                    label = { Text("Min Price") },
                                    modifier = Modifier.weight(1f)
                                )
                                OutlinedTextField(
                                    value = filters.maxPrice?.toString() ?: "",
                                    onValueChange = { value ->
                                        filters = filters.copy(
                                            maxPrice = value.toDoubleOrNull()
                                        )
                                    },
                                    label = { Text("Max Price") },
                                    modifier = Modifier.weight(1f)
                                )
                            }
                        }
                    )

                    // Shipping Terms Filter
                    FilterSection(
                        title = "Shipping Terms",
                        content = {
                            var expanded by remember { mutableStateOf(false) }
                            
                            ExposedDropdownMenuBox(
                                expanded = expanded,
                                onExpandedChange = { expanded = it }
                            ) {
                                OutlinedTextField(
                                    value = filters.shippingTerms ?: "Any Terms",
                                    onValueChange = { },
                                    readOnly = true,
                                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
                                    modifier = Modifier
                                        .menuAnchor()
                                        .fillMaxWidth()
                                )
                                
                                ExposedDropdownMenu(
                                    expanded = expanded,
                                    onDismissRequest = { expanded = false }
                                ) {
                                    DropdownMenuItem(
                                        text = { Text("Any Terms") },
                                        onClick = {
                                            filters = filters.copy(shippingTerms = null)
                                            expanded = false
                                        }
                                    )
                                    ExportConstants.SHIPPING_TERMS.forEach { terms ->
                                        DropdownMenuItem(
                                            text = { Text(terms) },
                                            onClick = {
                                                filters = filters.copy(shippingTerms = terms)
                                                expanded = false
                                            }
                                        )
                                    }
                                }
                            }
                        }
                    )

                    // Certification Requirements
                    FilterSection(
                        title = "Certification Requirements",
                        content = {
                            Column(
                                verticalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                ExportConstants.QUALITY_REQUIREMENTS.take(6).forEach { certification ->
                                    Row(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .selectable(
                                                selected = filters.certificationRequirements.contains(certification),
                                                onClick = {
                                                    val updatedList = if (filters.certificationRequirements.contains(certification)) {
                                                        filters.certificationRequirements - certification
                                                    } else {
                                                        filters.certificationRequirements + certification
                                                    }
                                                    filters = filters.copy(certificationRequirements = updatedList)
                                                }
                                            ),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Checkbox(
                                            checked = filters.certificationRequirements.contains(certification),
                                            onCheckedChange = null
                                        )
                                        Spacer(modifier = Modifier.width(8.dp))
                                        Text(
                                            text = certification,
                                            style = MaterialTheme.typography.bodyMedium
                                        )
                                    }
                                }
                            }
                        }
                    )
                }

                Divider(modifier = Modifier.padding(vertical = 8.dp))

                // Action Buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    OutlinedButton(
                        onClick = {
                            filters = ExportFilters()
                        },
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Clear All")
                    }
                    Button(
                        onClick = { onFiltersApplied(filters) },
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Apply Filters")
                    }
                }
            }
        }
    }
}

@Composable
private fun FilterSection(
    title: String,
    content: @Composable () -> Unit
) {
    Column {
        Text(
            text = title,
            style = MaterialTheme.typography.titleSmall,
            fontWeight = FontWeight.Medium,
            modifier = Modifier.padding(bottom = 8.dp)
        )
        content()
    }
}
