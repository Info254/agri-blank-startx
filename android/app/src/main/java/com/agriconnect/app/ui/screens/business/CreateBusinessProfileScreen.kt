package com.agriconnect.app.ui.screens.business

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
import com.agriconnect.app.viewmodel.BusinessMatchingViewModelImpl

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CreateBusinessProfileScreen(
    onNavigateBack: () -> Unit,
    onProfileCreated: () -> Unit,
    viewModel: BusinessMatchingViewModelImpl = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    
    var formData by remember { mutableStateOf(CreateBusinessProfileData()) }
    val scrollState = rememberScrollState()

    LaunchedEffect(uiState.userProfile) {
        if (uiState.userProfile != null) {
            onProfileCreated()
        }
    }

    Column(
        modifier = Modifier.fillMaxSize()
    ) {
        // Header
        TopAppBar(
            title = { Text("Create Business Profile") },
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
                        text = "Basic Information",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )

                    OutlinedTextField(
                        value = formData.businessName,
                        onValueChange = { formData = formData.copy(businessName = it) },
                        label = { Text("Business Name *") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )

                    // Business Type Selection
                    var expandedBusinessType by remember { mutableStateOf(false) }
                    ExposedDropdownMenuBox(
                        expanded = expandedBusinessType,
                        onExpandedChange = { expandedBusinessType = it }
                    ) {
                        OutlinedTextField(
                            value = formData.businessType.name.replace("_", " "),
                            onValueChange = { },
                            readOnly = true,
                            label = { Text("Business Type *") },
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expandedBusinessType) },
                            modifier = Modifier
                                .fillMaxWidth()
                                .menuAnchor()
                        )
                        ExposedDropdownMenu(
                            expanded = expandedBusinessType,
                            onDismissRequest = { expandedBusinessType = false }
                        ) {
                            BusinessType.values().forEach { type ->
                                DropdownMenuItem(
                                    text = { Text(type.name.replace("_", " ")) },
                                    onClick = {
                                        formData = formData.copy(businessType = type)
                                        expandedBusinessType = false
                                    }
                                )
                            }
                        }
                    }

                    // Industry Sector Selection
                    var expandedSector by remember { mutableStateOf(false) }
                    ExposedDropdownMenuBox(
                        expanded = expandedSector,
                        onExpandedChange = { expandedSector = it }
                    ) {
                        OutlinedTextField(
                            value = formData.industrySector,
                            onValueChange = { },
                            readOnly = true,
                            label = { Text("Industry Sector *") },
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expandedSector) },
                            modifier = Modifier
                                .fillMaxWidth()
                                .menuAnchor()
                        )
                        ExposedDropdownMenu(
                            expanded = expandedSector,
                            onDismissRequest = { expandedSector = false }
                        ) {
                            BusinessMatchingConstants.INDUSTRY_SECTORS.forEach { sector ->
                                DropdownMenuItem(
                                    text = { Text(sector) },
                                    onClick = {
                                        formData = formData.copy(industrySector = sector)
                                        expandedSector = false
                                    }
                                )
                            }
                        }
                    }

                    // Business Size Selection
                    var expandedSize by remember { mutableStateOf(false) }
                    ExposedDropdownMenuBox(
                        expanded = expandedSize,
                        onExpandedChange = { expandedSize = it }
                    ) {
                        OutlinedTextField(
                            value = formData.businessSize.name,
                            onValueChange = { },
                            readOnly = true,
                            label = { Text("Business Size *") },
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expandedSize) },
                            modifier = Modifier
                                .fillMaxWidth()
                                .menuAnchor()
                        )
                        ExposedDropdownMenu(
                            expanded = expandedSize,
                            onDismissRequest = { expandedSize = false }
                        ) {
                            BusinessSize.values().forEach { size ->
                                DropdownMenuItem(
                                    text = { Text(size.name) },
                                    onClick = {
                                        formData = formData.copy(businessSize = size)
                                        expandedSize = false
                                    }
                                )
                            }
                        }
                    }

                    OutlinedTextField(
                        value = formData.description,
                        onValueChange = { formData = formData.copy(description = it) },
                        label = { Text("Business Description") },
                        modifier = Modifier.fillMaxWidth(),
                        minLines = 3,
                        maxLines = 5
                    )
                }
            }

            // Location Information
            Card(
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text(
                        text = "Location & Contact",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        OutlinedTextField(
                            value = formData.country,
                            onValueChange = { formData = formData.copy(country = it) },
                            label = { Text("Country *") },
                            modifier = Modifier.weight(1f)
                        )

                        OutlinedTextField(
                            value = formData.region,
                            onValueChange = { formData = formData.copy(region = it) },
                            label = { Text("Region") },
                            modifier = Modifier.weight(1f)
                        )
                    }

                    OutlinedTextField(
                        value = formData.city,
                        onValueChange = { formData = formData.copy(city = it) },
                        label = { Text("City *") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    OutlinedTextField(
                        value = formData.address,
                        onValueChange = { formData = formData.copy(address = it) },
                        label = { Text("Address") },
                        modifier = Modifier.fillMaxWidth(),
                        minLines = 2
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        OutlinedTextField(
                            value = formData.phone,
                            onValueChange = { formData = formData.copy(phone = it) },
                            label = { Text("Phone") },
                            modifier = Modifier.weight(1f),
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone)
                        )

                        OutlinedTextField(
                            value = formData.email,
                            onValueChange = { formData = formData.copy(email = it) },
                            label = { Text("Email") },
                            modifier = Modifier.weight(1f),
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email)
                        )
                    }

                    OutlinedTextField(
                        value = formData.website,
                        onValueChange = { formData = formData.copy(website = it) },
                        label = { Text("Website") },
                        modifier = Modifier.fillMaxWidth(),
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Uri)
                    )
                }
            }

            // Business Details
            Card(
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text(
                        text = "Business Details",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        OutlinedTextField(
                            value = formData.establishedYear?.toString() ?: "",
                            onValueChange = { 
                                it.toIntOrNull()?.let { year ->
                                    formData = formData.copy(establishedYear = year)
                                }
                            },
                            label = { Text("Established Year") },
                            modifier = Modifier.weight(1f),
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
                        )

                        // Revenue Range Selection
                        var expandedRevenue by remember { mutableStateOf(false) }
                        ExposedDropdownMenuBox(
                            expanded = expandedRevenue,
                            onExpandedChange = { expandedRevenue = it },
                            modifier = Modifier.weight(1f)
                        ) {
                            OutlinedTextField(
                                value = formData.annualRevenueRange,
                                onValueChange = { },
                                readOnly = true,
                                label = { Text("Revenue Range") },
                                trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expandedRevenue) },
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .menuAnchor()
                            )
                            ExposedDropdownMenu(
                                expanded = expandedRevenue,
                                onDismissRequest = { expandedRevenue = false }
                            ) {
                                BusinessMatchingConstants.REVENUE_RANGES.forEach { range ->
                                    DropdownMenuItem(
                                        text = { Text(range) },
                                        onClick = {
                                            formData = formData.copy(annualRevenueRange = range)
                                            expandedRevenue = false
                                        }
                                    )
                                }
                            }
                        }
                    }

                    // Employee Count Selection
                    var expandedEmployees by remember { mutableStateOf(false) }
                    ExposedDropdownMenuBox(
                        expanded = expandedEmployees,
                        onExpandedChange = { expandedEmployees = it }
                    ) {
                        OutlinedTextField(
                            value = formData.employeeCountRange,
                            onValueChange = { },
                            readOnly = true,
                            label = { Text("Employee Count") },
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expandedEmployees) },
                            modifier = Modifier
                                .fillMaxWidth()
                                .menuAnchor()
                        )
                        ExposedDropdownMenu(
                            expanded = expandedEmployees,
                            onDismissRequest = { expandedEmployees = false }
                        ) {
                            BusinessMatchingConstants.EMPLOYEE_RANGES.forEach { range ->
                                DropdownMenuItem(
                                    text = { Text(range) },
                                    onClick = {
                                        formData = formData.copy(employeeCountRange = range)
                                        expandedEmployees = false
                                    }
                                )
                            }
                        }
                    }
                }
            }

            // Capabilities
            Card(
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text(
                        text = "Capabilities & Preferences",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )

                    // Commodities Handled
                    MultiSelectField(
                        label = "Commodities Handled",
                        options = BusinessMatchingConstants.SERVICES.take(15),
                        selectedOptions = formData.commoditiesHandled,
                        onSelectionChanged = { selected ->
                            formData = formData.copy(commoditiesHandled = selected)
                        }
                    )

                    // Services Offered
                    MultiSelectField(
                        label = "Services Offered",
                        options = BusinessMatchingConstants.SERVICES,
                        selectedOptions = formData.servicesOffered,
                        onSelectionChanged = { selected ->
                            formData = formData.copy(servicesOffered = selected)
                        }
                    )

                    // Target Markets
                    MultiSelectField(
                        label = "Target Markets",
                        options = listOf("Local", "Regional", "National", "International", "East Africa", "Africa", "Global"),
                        selectedOptions = formData.targetMarkets,
                        onSelectionChanged = { selected ->
                            formData = formData.copy(targetMarkets = selected)
                        }
                    )

                    // Deal Size Range
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        OutlinedTextField(
                            value = formData.preferredDealSizeMin?.toString() ?: "",
                            onValueChange = { 
                                it.toDoubleOrNull()?.let { min ->
                                    formData = formData.copy(preferredDealSizeMin = min)
                                }
                            },
                            label = { Text("Min Deal Size (USD)") },
                            modifier = Modifier.weight(1f),
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal)
                        )

                        OutlinedTextField(
                            value = formData.preferredDealSizeMax?.toString() ?: "",
                            onValueChange = { 
                                it.toDoubleOrNull()?.let { max ->
                                    formData = formData.copy(preferredDealSizeMax = max)
                                }
                            },
                            label = { Text("Max Deal Size (USD)") },
                            modifier = Modifier.weight(1f),
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal)
                        )
                    }

                    // Payment Terms
                    MultiSelectField(
                        label = "Accepted Payment Terms",
                        options = BusinessMatchingConstants.PAYMENT_TERMS,
                        selectedOptions = formData.paymentTermsAccepted,
                        onSelectionChanged = { selected ->
                            formData = formData.copy(paymentTermsAccepted = selected)
                        }
                    )

                    // Quality Standards
                    MultiSelectField(
                        label = "Quality Standards",
                        options = BusinessMatchingConstants.QUALITY_STANDARDS,
                        selectedOptions = formData.qualityStandards,
                        onSelectionChanged = { selected ->
                            formData = formData.copy(qualityStandards = selected)
                        }
                    )

                    // Certifications
                    MultiSelectField(
                        label = "Certifications",
                        options = BusinessMatchingConstants.CERTIFICATIONS,
                        selectedOptions = formData.certifications,
                        onSelectionChanged = { selected ->
                            formData = formData.copy(certifications = selected)
                        }
                    )
                }
            }

            // Partnership Goals
            Card(
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text(
                        text = "Partnership Goals",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )

                    // Business Goals
                    MultiSelectField(
                        label = "Business Goals",
                        options = BusinessMatchingConstants.BUSINESS_GOALS,
                        selectedOptions = formData.businessGoals,
                        onSelectionChanged = { selected ->
                            formData = formData.copy(businessGoals = selected)
                        }
                    )

                    // Partnership Preferences
                    MultiSelectField(
                        label = "Partnership Types Sought",
                        options = BusinessMatchingConstants.PARTNERSHIP_TYPES,
                        selectedOptions = formData.partnershipPreferences,
                        onSelectionChanged = { selected ->
                            formData = formData.copy(partnershipPreferences = selected)
                        }
                    )

                    // Languages
                    MultiSelectField(
                        label = "Languages Supported",
                        options = listOf("English", "Swahili", "French", "Arabic", "Amharic", "Kinyarwanda", "Luganda"),
                        selectedOptions = formData.languagesSupported,
                        onSelectionChanged = { selected ->
                            formData = formData.copy(languagesSupported = selected)
                        }
                    )
                }
            }

            // Submit Button
            Button(
                onClick = {
                    viewModel.createBusinessProfile(formData, "current_user_id") // Replace with actual user ID
                },
                modifier = Modifier.fillMaxWidth(),
                enabled = formData.isValid() && !uiState.isSubmitting
            ) {
                if (uiState.isSubmitting) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(16.dp),
                        strokeWidth = 2.dp
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                }
                Text("Create Business Profile")
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
fun MultiSelectField(
    label: String,
    options: List<String>,
    selectedOptions: List<String>,
    onSelectionChanged: (List<String>) -> Unit
) {
    var expanded by remember { mutableStateOf(false) }
    
    Column {
        OutlinedTextField(
            value = if (selectedOptions.isEmpty()) "" else "${selectedOptions.size} selected",
            onValueChange = { },
            readOnly = true,
            label = { Text(label) },
            trailingIcon = { 
                IconButton(onClick = { expanded = !expanded }) {
                    Icon(
                        if (expanded) Icons.Default.ExpandLess else Icons.Default.ExpandMore,
                        contentDescription = null
                    )
                }
            },
            modifier = Modifier.fillMaxWidth()
        )
        
        if (expanded) {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .heightIn(max = 200.dp)
            ) {
                LazyColumn(
                    modifier = Modifier.padding(8.dp)
                ) {
                    items(options) { option ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Checkbox(
                                checked = selectedOptions.contains(option),
                                onCheckedChange = { checked ->
                                    val newSelection = if (checked) {
                                        selectedOptions + option
                                    } else {
                                        selectedOptions - option
                                    }
                                    onSelectionChanged(newSelection)
                                }
                            )
                            Text(
                                text = option,
                                modifier = Modifier.padding(start = 8.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}

// Extension function for form validation
private fun CreateBusinessProfileData.isValid(): Boolean {
    return businessName.isNotBlank() &&
            industrySector.isNotBlank() &&
            country.isNotBlank() &&
            city.isNotBlank()
}
