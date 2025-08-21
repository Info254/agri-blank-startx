package com.agriconnect.app.ui.screens.export

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
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
fun ExportOpportunityDetailsScreen(
    opportunityId: String,
    currentUserId: String,
    onNavigateBack: () -> Unit,
    onApplyClick: () -> Unit,
    viewModel: ExportOpportunityViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    
    var showVerificationDialog by remember { mutableStateOf(false) }
    
    LaunchedEffect(opportunityId) {
        viewModel.loadOpportunityDetails(opportunityId)
    }

    Column(
        modifier = Modifier.fillMaxSize()
    ) {
        // Top App Bar
        TopAppBar(
            title = { Text("Export Opportunity") },
            navigationIcon = {
                IconButton(onClick = onNavigateBack) {
                    Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                }
            },
            actions = {
                IconButton(onClick = { /* Share functionality */ }) {
                    Icon(Icons.Default.Share, contentDescription = "Share")
                }
            }
        )

        when {
            uiState.isLoadingDetails -> {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            }
            
            uiState.selectedOpportunity != null -> {
                val opportunity = uiState.selectedOpportunity!!
                
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .verticalScroll(rememberScrollState())
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    // Header Card
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        colors = CardDefaults.cardColors(
                            containerColor = MaterialTheme.colorScheme.primaryContainer
                        )
                    ) {
                        Column(
                            modifier = Modifier.padding(16.dp)
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.Top
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = opportunity.title,
                                        style = MaterialTheme.typography.headlineSmall,
                                        fontWeight = FontWeight.Bold
                                    )
                                    Text(
                                        text = "${opportunity.commodity} • ${opportunity.destinationCountry}",
                                        style = MaterialTheme.typography.titleMedium,
                                        color = MaterialTheme.colorScheme.onPrimaryContainer
                                    )
                                }
                                
                                // Verification Badge
                                AssistChip(
                                    onClick = { },
                                    label = { Text("Verified") },
                                    leadingIcon = { Icon(Icons.Default.Verified, contentDescription = null) },
                                    colors = AssistChipDefaults.assistChipColors(
                                        containerColor = MaterialTheme.colorScheme.primary,
                                        labelColor = MaterialTheme.colorScheme.onPrimary
                                    )
                                )
                            }
                        }
                    }

                    // Key Details Card
                    Card(modifier = Modifier.fillMaxWidth()) {
                        Column(
                            modifier = Modifier.padding(16.dp),
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            Text(
                                text = "Opportunity Details",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold
                            )
                            
                            DetailRow(
                                label = "Volume Required",
                                value = "${opportunity.volumeRequired} ${opportunity.unit}"
                            )
                            
                            opportunity.pricePerUnit?.let { price ->
                                DetailRow(
                                    label = "Price per ${opportunity.unit}",
                                    value = "${opportunity.currency} $price"
                                )
                            }
                            
                            opportunity.deadline?.let { deadline ->
                                DetailRow(
                                    label = "Deadline",
                                    value = deadline
                                )
                            }
                            
                            opportunity.shippingTerms?.let { terms ->
                                DetailRow(
                                    label = "Shipping Terms",
                                    value = terms
                                )
                            }
                            
                            opportunity.paymentTerms?.let { terms ->
                                DetailRow(
                                    label = "Payment Terms",
                                    value = terms
                                )
                            }
                        }
                    }

                    // Description
                    opportunity.description?.let { description ->
                        Card(modifier = Modifier.fillMaxWidth()) {
                            Column(
                                modifier = Modifier.padding(16.dp)
                            ) {
                                Text(
                                    text = "Description",
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.Bold
                                )
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(
                                    text = description,
                                    style = MaterialTheme.typography.bodyMedium
                                )
                            }
                        }
                    }

                    // Quality Requirements
                    if (opportunity.qualityRequirements.isNotEmpty()) {
                        Card(modifier = Modifier.fillMaxWidth()) {
                            Column(
                                modifier = Modifier.padding(16.dp)
                            ) {
                                Text(
                                    text = "Quality Requirements",
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.Bold
                                )
                                Spacer(modifier = Modifier.height(8.dp))
                                LazyRow(
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    items(opportunity.qualityRequirements) { requirement ->
                                        AssistChip(
                                            onClick = { },
                                            label = { Text(requirement) }
                                        )
                                    }
                                }
                            }
                        }
                    }

                    // Certification Requirements
                    if (opportunity.certificationRequirements.isNotEmpty()) {
                        Card(modifier = Modifier.fillMaxWidth()) {
                            Column(
                                modifier = Modifier.padding(16.dp)
                            ) {
                                Text(
                                    text = "Certification Requirements",
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.Bold
                                )
                                Spacer(modifier = Modifier.height(8.dp))
                                LazyRow(
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    items(opportunity.certificationRequirements) { certification ->
                                        AssistChip(
                                            onClick = { },
                                            label = { Text(certification) }
                                        )
                                    }
                                }
                            }
                        }
                    }

                    // Exporter Profile
                    opportunity.exporterProfile?.let { profile ->
                        Card(modifier = Modifier.fillMaxWidth()) {
                            Column(
                                modifier = Modifier.padding(16.dp)
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.Top
                                ) {
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(
                                            text = "Exporter Profile",
                                            style = MaterialTheme.typography.titleMedium,
                                            fontWeight = FontWeight.Bold
                                        )
                                        Spacer(modifier = Modifier.height(8.dp))
                                        Text(
                                            text = profile.companyName,
                                            style = MaterialTheme.typography.titleSmall,
                                            fontWeight = FontWeight.Medium
                                        )
                                        Text(
                                            text = profile.businessAddress,
                                            style = MaterialTheme.typography.bodyMedium,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                    }
                                    
                                    // Rating
                                    if (profile.rating > 0) {
                                        Row(
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Icon(
                                                Icons.Default.Star,
                                                contentDescription = null,
                                                tint = MaterialTheme.colorScheme.primary,
                                                modifier = Modifier.size(16.dp)
                                            )
                                            Text(
                                                text = String.format("%.1f", profile.rating),
                                                style = MaterialTheme.typography.bodyMedium,
                                                fontWeight = FontWeight.Medium
                                            )
                                        }
                                    }
                                }
                                
                                Spacer(modifier = Modifier.height(8.dp))
                                
                                Row(
                                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                                ) {
                                    Text(
                                        text = "${profile.successfulExportsCount} exports",
                                        style = MaterialTheme.typography.bodySmall
                                    )
                                    Text(
                                        text = "${profile.farmerVerificationsCount} verifications",
                                        style = MaterialTheme.typography.bodySmall
                                    )
                                }
                            }
                        }
                    }

                    // Verification Status
                    Card(modifier = Modifier.fillMaxWidth()) {
                        Column(
                            modifier = Modifier.padding(16.dp)
                        ) {
                            Text(
                                text = "Farmer Verification",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Column {
                                    Text(
                                        text = "Verifier 1",
                                        style = MaterialTheme.typography.labelMedium
                                    )
                                    if (opportunity.farmerVerifier1 != null) {
                                        Row(
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Icon(
                                                Icons.Default.CheckCircle,
                                                contentDescription = null,
                                                tint = MaterialTheme.colorScheme.primary,
                                                modifier = Modifier.size(16.dp)
                                            )
                                            Spacer(modifier = Modifier.width(4.dp))
                                            Text(
                                                text = "Verified",
                                                style = MaterialTheme.typography.bodySmall
                                            )
                                        }
                                    } else {
                                        Text(
                                            text = "Pending",
                                            style = MaterialTheme.typography.bodySmall,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                    }
                                }
                                
                                Column {
                                    Text(
                                        text = "Verifier 2",
                                        style = MaterialTheme.typography.labelMedium
                                    )
                                    if (opportunity.farmerVerifier2 != null) {
                                        Row(
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Icon(
                                                Icons.Default.CheckCircle,
                                                contentDescription = null,
                                                tint = MaterialTheme.colorScheme.primary,
                                                modifier = Modifier.size(16.dp)
                                            )
                                            Spacer(modifier = Modifier.width(4.dp))
                                            Text(
                                                text = "Verified",
                                                style = MaterialTheme.typography.bodySmall
                                            )
                                        }
                                    } else {
                                        Text(
                                            text = "Pending",
                                            style = MaterialTheme.typography.bodySmall,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                    }
                                }
                            }
                            
                            // Verification Button
                            if (opportunity.farmerVerifier1 != currentUserId && 
                                opportunity.farmerVerifier2 != currentUserId &&
                                (opportunity.farmerVerifier1 == null || opportunity.farmerVerifier2 == null)) {
                                Spacer(modifier = Modifier.height(8.dp))
                                OutlinedButton(
                                    onClick = { showVerificationDialog = true },
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Icon(Icons.Default.VerifiedUser, contentDescription = null)
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text("Verify This Opportunity")
                                }
                            }
                        }
                    }
                }

                // Bottom Action Button
                Button(
                    onClick = onApplyClick,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp)
                ) {
                    Text("Apply for This Opportunity")
                }
            }
        }
    }

    // Verification Dialog
    if (showVerificationDialog) {
        VerificationDialog(
            onVerify = { decision, comments ->
                viewModel.verifyOpportunity(
                    opportunityId = opportunityId,
                    farmerId = currentUserId,
                    verificationType = VerificationType.OPPORTUNITY_DETAILS,
                    decision = decision,
                    comments = comments
                )
                showVerificationDialog = false
            },
            onDismiss = { showVerificationDialog = false }
        )
    }
}

@Composable
private fun DetailRow(
    label: String,
    value: String
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Text(
            text = value,
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = FontWeight.Medium
        )
    }
}

@Composable
private fun VerificationDialog(
    onVerify: (VerificationDecision, String?) -> Unit,
    onDismiss: () -> Unit
) {
    var decision by remember { mutableStateOf(VerificationDecision.APPROVED) }
    var comments by remember { mutableStateOf("") }
    
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Verify Export Opportunity") },
        text = {
            Column {
                Text("As a farmer, your verification helps build trust in the platform.")
                Spacer(modifier = Modifier.height(16.dp))
                
                // Decision Selection
                Text(
                    text = "Your Decision",
                    style = MaterialTheme.typography.labelMedium
                )
                Spacer(modifier = Modifier.height(8.dp))
                
                Column {
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = decision == VerificationDecision.APPROVED,
                            onClick = { decision = VerificationDecision.APPROVED }
                        )
                        Text("Approve - This looks legitimate")
                    }
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = decision == VerificationDecision.NEEDS_INFO,
                            onClick = { decision = VerificationDecision.NEEDS_INFO }
                        )
                        Text("Needs More Information")
                    }
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = decision == VerificationDecision.REJECTED,
                            onClick = { decision = VerificationDecision.REJECTED }
                        )
                        Text("Reject - Suspicious or Invalid")
                    }
                }
                
                Spacer(modifier = Modifier.height(16.dp))
                
                // Comments
                OutlinedTextField(
                    value = comments,
                    onValueChange = { comments = it },
                    label = { Text("Comments (Optional)") },
                    modifier = Modifier.fillMaxWidth(),
                    maxLines = 3
                )
            }
        },
        confirmButton = {
            Button(
                onClick = { onVerify(decision, comments.takeIf { it.isNotBlank() }) }
            ) {
                Text("Submit Verification")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}
