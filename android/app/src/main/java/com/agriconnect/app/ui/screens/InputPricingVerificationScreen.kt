package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.agriconnect.app.ui.viewmodels.InputPricingVerificationViewModel
import com.agriconnect.app.data.model.InputPricingVerification
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.remember
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.OutlinedTextField
import androidx.compose.ui.state.MutableState
import androidx.compose.ui.state.remember

@Composable
fun InputPricingVerificationScreen() {
    val viewModel: InputPricingVerificationViewModel = viewModel()
    val verifications by viewModel.verifications.collectAsState()
    val loading by viewModel.loading.collectAsState()
    val error by viewModel.error.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Input Pricing Verification") })
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            if (loading) {
                CircularProgressIndicator()
            } else if (error != null) {
                Text("Error: $error", color = MaterialTheme.colorScheme.error)
            } else {
                Text("Input Price Verifications:", style = MaterialTheme.typography.headlineSmall)
                verifications.forEach { v ->
                    Card(Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
                        Column(Modifier.padding(8.dp)) {
                            Text("Product: ${v.productName}")
                            Text("Price: ${v.price}")
                            Text("Verified: ${v.verified}")
                            Text("Submitted By: ${v.submittedBy}")
                            Button(onClick = { viewModel.verifyPrice(v.id) }, enabled = !v.verified) {
                                Text("Verify Price")
                            }
                        }
                    }
                }
            }
            Spacer(Modifier.height(16.dp))
            var productName by remember { mutableStateOf("") }
            var price by remember { mutableStateOf("") }
            Button(onClick = {
                val priceValue = price.toDoubleOrNull() ?: 0.0
                viewModel.submitVerification(
                    InputPricingVerification(productName = productName, price = priceValue, submittedBy = "You")
                )
            }, enabled = productName.isNotBlank() && price.isNotBlank()) {
                Text("Submit Price Verification")
            }
            OutlinedTextField(
                value = productName,
                onValueChange = { productName = it },
                label = { Text("Product Name") },
                modifier = Modifier.fillMaxWidth()
            )
            OutlinedTextField(
                value = price,
                onValueChange = { price = it },
                label = { Text("Price") },
                modifier = Modifier.fillMaxWidth()
            )
        }
    }
} 