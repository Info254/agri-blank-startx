package com.agriconnect.app.ui.screens.export

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.agriconnect.app.data.model.*
import com.agriconnect.app.viewmodel.ExportOpportunityViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ExportOpportunitiesListScreen(
    onOpportunityClick: (String) -> Unit,
    onCreateApplication: (String) -> Unit,
    viewModel: ExportOpportunityViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val filters by viewModel.filters.collectAsStateWithLifecycle()
    
    var showFilters by remember { mutableStateOf(false) }
    var searchQuery by remember { mutableStateOf("") }

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
                text = "Export Opportunities",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold
            )
            
            Row {
                IconButton(onClick = { showFilters = true }) {
                    Icon(Icons.Default.FilterList, contentDescription = "Filter")
                }
                IconButton(onClick = { viewModel.loadExportOpportunities() }) {
                    Icon(Icons.Default.Refresh, contentDescription = "Refresh")
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Search Bar
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { 
                searchQuery = it
                viewModel.searchOpportunities(it)
            },
            label = { Text("Search opportunities...") },
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Active Filters Chips
        if (filters != ExportFilters()) {
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                filters.commodity?.let { commodity ->
                    item {
                        FilterChip(
                            selected = true,
                            onClick = { viewModel.applyFilters(filters.copy(commodity = null)) },
                            label = { Text(commodity) },
                            trailingIcon = { Icon(Icons.Default.Close, contentDescription = null) }
                        )
                    }
                }
                filters.destinationCountry?.let { country ->
                    item {
                        FilterChip(
                            selected = true,
                            onClick = { viewModel.applyFilters(filters.copy(destinationCountry = null)) },
                            label = { Text(country) },
                            trailingIcon = { Icon(Icons.Default.Close, contentDescription = null) }
                        )
                    }
                }
                item {
                    TextButton(onClick = { viewModel.clearFilters() }) {
                        Text("Clear All")
                    }
                }
            }
            Spacer(modifier = Modifier.height(8.dp))
        }

        // Content
        when {
            uiState.isLoading -> {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            }
            
            uiState.opportunities.isEmpty() -> {
                EmptyStateCard(
                    title = "No Export Opportunities",
                    description = "No verified export opportunities found matching your criteria.",
                    icon = Icons.Default.Business
                )
            }
            
            else -> {
                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(uiState.opportunities) { opportunity ->
                        ExportOpportunityCard(
                            opportunity = opportunity,
                            onCardClick = { onOpportunityClick(opportunity.id) },
                            onApplyClick = { onCreateApplication(opportunity.id) }
                        )
                    }
                }
            }
        }
    }

    // Filter Dialog
    if (showFilters) {
        ExportFiltersDialog(
            currentFilters = filters,
            onFiltersApplied = { newFilters ->
                viewModel.applyFilters(newFilters)
                showFilters = false
            },
            onDismiss = { showFilters = false }
        )
    }

    // Error/Message Handling
    uiState.error?.let { error ->
        LaunchedEffect(error) {
            // Show error snackbar
        }
    }

    uiState.message?.let { message ->
        LaunchedEffect(message) {
            // Show success snackbar
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ExportOpportunityCard(
    opportunity: ExportOpportunity,
    onCardClick: () -> Unit,
    onApplyClick: () -> Unit
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
                        text = opportunity.title,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "${opportunity.commodity} • ${opportunity.destinationCountry}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                
                // Verification Badge
                AssistChip(
                    onClick = { },
                    label = { Text("Verified") },
                    leadingIcon = { Icon(Icons.Default.Verified, contentDescription = null) },
                    colors = AssistChipDefaults.assistChipColors(
                        containerColor = MaterialTheme.colorScheme.primaryContainer
                    )
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Details
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text(
                        text = "Volume Required",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = "${opportunity.volumeRequired} ${opportunity.unit}",
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Medium
                    )
                }
                
                opportunity.pricePerUnit?.let { price ->
                    Column {
                        Text(
                            text = "Price per ${opportunity.unit}",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Text(
                            text = "${opportunity.currency} $price",
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.Medium,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                }
            }

            opportunity.deadline?.let { deadline ->
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        Icons.Default.Schedule,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "Deadline: $deadline",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            // Quality Requirements
            if (opportunity.qualityRequirements.isNotEmpty()) {
                Spacer(modifier = Modifier.height(8.dp))
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    items(opportunity.qualityRequirements.take(3)) { requirement ->
                        AssistChip(
                            onClick = { },
                            label = { Text(requirement, style = MaterialTheme.typography.labelSmall) }
                        )
                    }
                    if (opportunity.qualityRequirements.size > 3) {
                        item {
                            AssistChip(
                                onClick = { },
                                label = { Text("+${opportunity.qualityRequirements.size - 3} more") }
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Actions
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.End
            ) {
                TextButton(onClick = onCardClick) {
                    Text("View Details")
                }
                Spacer(modifier = Modifier.width(8.dp))
                Button(onClick = onApplyClick) {
                    Text("Apply Now")
                }
            }
        }
    }
}

@Composable
fun EmptyStateCard(
    title: String,
    description: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector
) {
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
                icon,
                contentDescription = null,
                modifier = Modifier.size(64.dp),
                tint = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = description,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}
