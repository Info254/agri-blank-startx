package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.agriconnect.app.data.model.LogisticsProvider
import com.agriconnect.app.data.model.Aggregator
import com.agriconnect.app.data.model.Processor
import com.agriconnect.app.viewmodel.LogisticsViewModel

@Composable
fun LogisticsScreen(viewModel: LogisticsViewModel) {
    val uiState by viewModel.uiState.collectAsState()
    val tabs = listOf("Providers", "Aggregators", "Processors")
    var selectedTab by remember { mutableStateOf(0) }

    LaunchedEffect(selectedTab) {
        when (selectedTab) {
            0 -> viewModel.loadProviders()
            1 -> viewModel.loadAggregators()
            2 -> viewModel.loadProcessors()
        }
    }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        TabRow(selectedTabIndex = selectedTab) {
            tabs.forEachIndexed { index, title ->
                Tab(
                    selected = selectedTab == index,
                    onClick = { selectedTab = index },
                    text = { Text(title) }
                )
            }
        }
        Spacer(Modifier.height(16.dp))
        if (uiState.isLoading) {
            CircularProgressIndicator(modifier = Modifier.align(Alignment.CenterHorizontally))
        }
        uiState.error?.let {
            Text("Error: $it", color = MaterialTheme.colorScheme.error)
        }
        when (selectedTab) {
            0 -> LogisticsProviderList(uiState.providers)
            1 -> AggregatorList(uiState.aggregators)
            2 -> ProcessorList(uiState.processors)
        }
    }
}

@Composable
fun LogisticsProviderList(providers: List<LogisticsProvider>) {
    LazyColumn {
        items(providers.size) { idx ->
            val provider = providers[idx]
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp)
            ) {
                Column(Modifier.padding(8.dp)) {
                    Text("Name: ${provider.name}", style = MaterialTheme.typography.titleMedium)
                    Text("Type: ${provider.type}")
                    Text("Location: ${provider.location}")
                }
            }
        }
    }
}

@Composable
fun AggregatorList(aggregators: List<Aggregator>) {
    LazyColumn {
        items(aggregators.size) { idx ->
            val aggregator = aggregators[idx]
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp)
            ) {
                Column(Modifier.padding(8.dp)) {
                    Text("Aggregator: ${aggregator.aggregatorName}", style = MaterialTheme.typography.titleMedium)
                    Text("County: ${aggregator.county}")
                }
            }
        }
    }
}

@Composable
fun ProcessorList(processors: List<Processor>) {
    LazyColumn {
        items(processors.size) { idx ->
            val processor = processors[idx]
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp)
            ) {
                Column(Modifier.padding(8.dp)) {
                    Text("Processor: ${processor.processorName}", style = MaterialTheme.typography.titleMedium)
                    Text("Specialty: ${processor.specialty}")
                }
            }
        }
    }
} 