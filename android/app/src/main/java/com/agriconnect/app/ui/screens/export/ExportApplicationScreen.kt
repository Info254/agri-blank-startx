package com.agriconnect.app.ui.screens.export

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
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
fun ExportApplicationScreen(
    opportunityId: String,
    farmerId: String,
    onNavigateBack: () -> Unit,
    viewModel: ExportOpportunityViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    
    var proposedVolume by remember { mutableStateOf("") }
    var proposedPrice by remember { mutableStateOf("") }
    var deliveryTimeline by remember { mutableStateOf("") }
    var coverLetter by remember { mutableStateOf("") }
    var selectedCertifications by remember { mutableStateOf(setOf<String>()) }
    var sampleImages by remember { mutableStateOf(listOf<String>()) }
    
    LaunchedEffect(opportunityId) {
        viewModel.loadOpportunityDetails(opportunityId)
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        // Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onNavigateBack) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back")
            }
            Text(
                text = "Apply for Export Opportunity",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(start = 8.dp)
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Opportunity Summary Card
        uiState.selectedOpportunity?.let { opportunity ->
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
                        text = opportunity.title,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "${opportunity.commodity} • ${opportunity.destinationCountry}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "Required: ${opportunity.volumeRequired} ${opportunity.unit}",
                            style = MaterialTheme.typography.bodySmall
                        )
                        opportunity.pricePerUnit?.let { price ->
                            Text(
                                text = "${opportunity.currency} $price per ${opportunity.unit}",
                                style = MaterialTheme.typography.bodySmall,
                                fontWeight = FontWeight.Medium
                            )
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Application Form
        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Proposed Volume
            OutlinedTextField(
                value = proposedVolume,
                onValueChange = { proposedVolume = it },
                label = { Text("Proposed Volume (kg) *") },
                supportingText = { Text("Enter the volume you can supply") },
                modifier = Modifier.fillMaxWidth(),
                isError = proposedVolume.isBlank()
            )

            // Proposed Price
            OutlinedTextField(
                value = proposedPrice,
                onValueChange = { proposedPrice = it },
                label = { Text("Proposed Price per kg (Optional)") },
                supportingText = { Text("Leave blank to accept posted price") },
                modifier = Modifier.fillMaxWidth()
            )

            // Delivery Timeline
            OutlinedTextField(
                value = deliveryTimeline,
                onValueChange = { deliveryTimeline = it },
                label = { Text("Delivery Timeline") },
                supportingText = { Text("When can you deliver the produce?") },
                modifier = Modifier.fillMaxWidth()
            )

            // Quality Certifications
            Card(
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(16.dp)
                ) {
                    Text(
                        text = "Quality Certifications",
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Medium
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    
                    ExportConstants.QUALITY_REQUIREMENTS.forEach { certification ->
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Checkbox(
                                checked = selectedCertifications.contains(certification),
                                onCheckedChange = { isChecked ->
                                    selectedCertifications = if (isChecked) {
                                        selectedCertifications + certification
                                    } else {
                                        selectedCertifications - certification
                                    }
                                }
                            )
                            Text(
                                text = certification,
                                style = MaterialTheme.typography.bodyMedium,
                                modifier = Modifier.padding(start = 8.dp)
                            )
                        }
                    }
                }
            }

            // Sample Images Section
            Card(
                modifier = Modifier.fillMaxWidth()
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
                            text = "Sample Images",
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Medium
                        )
                        OutlinedButton(
                            onClick = {
                                // Add image URL functionality
                                // For now, add placeholder
                                sampleImages = sampleImages + "https://example.com/sample${sampleImages.size + 1}.jpg"
                            }
                        ) {
                            Icon(Icons.Default.Add, contentDescription = null)
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Add Image URL")
                        }
                    }
                    
                    if (sampleImages.isNotEmpty()) {
                        Spacer(modifier = Modifier.height(8.dp))
                        sampleImages.forEachIndexed { index, imageUrl ->
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "Image ${index + 1}",
                                    style = MaterialTheme.typography.bodyMedium,
                                    modifier = Modifier.weight(1f)
                                )
                                IconButton(
                                    onClick = {
                                        sampleImages = sampleImages.filterIndexed { i, _ -> i != index }
                                    }
                                ) {
                                    Icon(Icons.Default.Delete, contentDescription = "Remove")
                                }
                            }
                        }
                    } else {
                        Text(
                            text = "Add URLs to external image hosting (recommended)",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }

            // Cover Letter
            OutlinedTextField(
                value = coverLetter,
                onValueChange = { coverLetter = it },
                label = { Text("Cover Letter") },
                supportingText = { Text("Introduce yourself and explain why you're the best fit") },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(120.dp),
                maxLines = 5
            )
        }

        // Submit Button
        Button(
            onClick = {
                val applicationData = ExportApplicationFormData(
                    proposedVolume = proposedVolume.toDoubleOrNull() ?: 0.0,
                    proposedPrice = proposedPrice.toDoubleOrNull(),
                    deliveryTimeline = deliveryTimeline.takeIf { it.isNotBlank() },
                    qualityCertifications = selectedCertifications.toList(),
                    sampleImages = sampleImages,
                    coverLetter = coverLetter.takeIf { it.isNotBlank() }
                )
                
                viewModel.createApplication(opportunityId, farmerId, applicationData)
            },
            enabled = proposedVolume.isNotBlank() && !uiState.isSubmitting,
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 16.dp)
        ) {
            if (uiState.isSubmitting) {
                CircularProgressIndicator(
                    modifier = Modifier.size(16.dp),
                    color = MaterialTheme.colorScheme.onPrimary
                )
                Spacer(modifier = Modifier.width(8.dp))
            }
            Text("Submit Application")
        }
    }

    // Handle success
    uiState.createdApplication?.let { application ->
        LaunchedEffect(application) {
            // Navigate to application details or show success
            onNavigateBack()
        }
    }

    // Error handling
    uiState.error?.let { error ->
        LaunchedEffect(error) {
            // Show error snackbar
            viewModel.clearError()
        }
    }
}
