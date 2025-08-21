package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.agriconnect.app.ui.viewmodels.GroupInputOrdersViewModel
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.remember
import androidx.compose.ui.state.MutableState
import androidx.compose.ui.state.remember
import com.agriconnect.app.data.model.GroupInputOrder
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.OutlinedTextField

@Composable
fun GroupInputOrdersScreen() {
    val viewModel: GroupInputOrdersViewModel = viewModel()
    val orders by viewModel.orders.collectAsState()
    val loading by viewModel.loading.collectAsState()
    val error by viewModel.error.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Group Input Orders") })
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
                Text("Group Orders:", style = MaterialTheme.typography.headlineSmall)
                orders.forEach { order ->
                    Card(Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
                        Column(Modifier.padding(8.dp)) {
                            Text("Group: ${order.groupName}")
                            Text("Status: ${order.status}")
                            Text("Created: ${order.createdAt}")
                        }
                    }
                }
            }
            Spacer(Modifier.height(16.dp))
            var groupName by remember { mutableStateOf("") }
            Button(onClick = { viewModel.createOrder(com.agriconnect.app.data.model.GroupInputOrder(groupName = groupName)) }, enabled = groupName.isNotBlank()) {
                Text("Create New Group Order")
            }
            OutlinedTextField(
                value = groupName,
                onValueChange = { groupName = it },
                label = { Text("Group Name") },
                modifier = Modifier.fillMaxWidth()
            )
        }
    }
} 