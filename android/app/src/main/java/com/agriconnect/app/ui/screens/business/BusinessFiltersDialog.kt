package com.agriconnect.app.ui.screens.business

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.selection.selectable
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.agriconnect.app.data.model.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BusinessFiltersDialog(
    filters: BusinessMatchingFilters,
    onFiltersApplied: (BusinessMatchingFilters) -> Unit,
    onDismiss: () -> Unit
) {
    var tempFilters by remember { mutableStateOf(filters) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Filter Businesses") },
        text = {
            LazyColumn(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(400.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Business Types
                item {
                    FilterSection(
                        title = "Business Types",
                        options = BusinessType.values().map { it.name.replace("_", " ") },
                        selectedOptions = tempFilters.businessTypes.map { it.name.replace("_", " ") },
                        onSelectionChanged = { selected ->
                            tempFilters = tempFilters.copy(
                                businessTypes = selected.map { name ->
                                    BusinessType.valueOf(name.replace(" ", "_"))
                                }
                            )
                        }
                    )
                }

                // Business Sizes
                item {
                    FilterSection(
                        title = "Business Sizes",
                        options = BusinessSize.values().map { it.name },
                        selectedOptions = tempFilters.businessSizes.map { it.name },
                        onSelectionChanged = { selected ->
                            tempFilters = tempFilters.copy(
                                businessSizes = selected.map { BusinessSize.valueOf(it) }
                            )
                        }
                    )
                }

                // Countries
                item {
                    FilterSection(
                        title = "Countries",
                        options = listOf("Kenya", "Uganda", "Tanzania", "Rwanda", "Ethiopia"),
                        selectedOptions = tempFilters.countries,
                        onSelectionChanged = { selected ->
                            tempFilters = tempFilters.copy(countries = selected)
                        }
                    )
                }

                // Commodities
                item {
                    FilterSection(
                        title = "Commodities",
                        options = BusinessMatchingConstants.SERVICES.take(10),
                        selectedOptions = tempFilters.commodities,
                        onSelectionChanged = { selected ->
                            tempFilters = tempFilters.copy(commodities = selected)
                        }
                    )
                }

                // Verification Status
                item {
                    FilterSection(
                        title = "Verification",
                        options = VerificationStatus.values().map { it.name.replace("_", " ") },
                        selectedOptions = tempFilters.verificationStatus.map { it.name.replace("_", " ") },
                        onSelectionChanged = { selected ->
                            tempFilters = tempFilters.copy(
                                verificationStatus = selected.map { name ->
                                    VerificationStatus.valueOf(name.replace(" ", "_"))
                                }
                            )
                        }
                    )
                }

                // Additional Options
                item {
                    Column {
                        Text(
                            text = "Additional Options",
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Checkbox(
                                checked = tempFilters.isActiveOnly,
                                onCheckedChange = { 
                                    tempFilters = tempFilters.copy(isActiveOnly = it)
                                }
                            )
                            Text("Active profiles only")
                        }
                        
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Checkbox(
                                checked = tempFilters.isFeaturedOnly,
                                onCheckedChange = { 
                                    tempFilters = tempFilters.copy(isFeaturedOnly = it)
                                }
                            )
                            Text("Featured profiles only")
                        }
                    }
                }
            }
        },
        confirmButton = {
            Button(
                onClick = { onFiltersApplied(tempFilters) }
            ) {
                Text("Apply Filters")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}

@Composable
fun FilterSection(
    title: String,
    options: List<String>,
    selectedOptions: List<String>,
    onSelectionChanged: (List<String>) -> Unit
) {
    Column {
        Text(
            text = title,
            style = MaterialTheme.typography.titleSmall,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(8.dp))
        
        options.forEach { option ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .selectable(
                        selected = selectedOptions.contains(option),
                        onClick = {
                            val newSelection = if (selectedOptions.contains(option)) {
                                selectedOptions - option
                            } else {
                                selectedOptions + option
                            }
                            onSelectionChanged(newSelection)
                        }
                    ),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Checkbox(
                    checked = selectedOptions.contains(option),
                    onCheckedChange = null
                )
                Text(
                    text = option,
                    modifier = Modifier.padding(start = 8.dp)
                )
            }
        }
    }
}
