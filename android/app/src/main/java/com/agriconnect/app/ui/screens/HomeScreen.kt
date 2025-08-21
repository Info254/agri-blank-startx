package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.agriconnect.app.ui.viewmodels.HomeViewModel
import com.agriconnect.app.ui.components.BottomNavigation
import com.agriconnect.app.ui.components.LoadingIndicator
import androidx.navigation.NavController
import androidx.compose.ui.Alignment
import com.agriconnect.app.ui.screens.MarketplaceTradingMenu
import com.agriconnect.app.ui.screens.OrdersAuctionsMenu

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    onServiceClick: () -> Unit,
    onProductClick: () -> Unit,
    onNewsClick: () -> Unit,
    navController: NavController? = null, // Optional for navigation
    viewModel: HomeViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    var showMarketplaceMenu by remember { mutableStateOf(false) }
    var showOrdersAuctionsMenu by remember { mutableStateOf(false) }

    Scaffold(
        bottomBar = { BottomNavigation(onServiceClick, onProductClick, onNewsClick) }
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            when {
                uiState.isLoading -> LoadingIndicator()
                uiState.error != null -> ErrorMessage(uiState.error)
                else -> HomeContent(
                    services = uiState.services,
                    products = uiState.products,
                    news = uiState.news,
                    onServiceClick = onServiceClick,
                    onProductClick = onProductClick,
                    onNewsClick = onNewsClick
                )
            }
            // Feature Grid
            Text("Quick Access", style = MaterialTheme.typography.titleMedium)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                FeatureCard(
                    title = "Admin Dashboard",
                    onClick = { navController?.navigate("admin_dashboard") }
                )
                FeatureCard(
                    title = "Agent Dashboard",
                    onClick = { navController?.navigate("agent_dashboard") }
                )
                FeatureCard(
                    title = "Bulk Orders",
                    onClick = { navController?.navigate("bulk_order_dashboard") }
                )
            }
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                FeatureCard(
                    title = "Input Pricing",
                    onClick = { navController?.navigate("input_pricing_dashboard") }
                )
                FeatureCard(
                    title = "Donations",
                    onClick = { navController?.navigate("donation_dashboard") }
                )
                FeatureCard(
                    title = "Food Rescue",
                    onClick = { navController?.navigate("food_rescue_dashboard") }
                )
            }
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                FeatureCard(
                    title = "Product Auctions",
                    onClick = { navController?.navigate("product_auction_dashboard") }
                )
                FeatureCard(
                    title = "Supplier Reviews",
                    onClick = { navController?.navigate("supplier_review_dashboard") }
                )
                FeatureCard(
                    title = "Community Forum",
                    onClick = { navController?.navigate("community_forum_dashboard") }
                )
            }
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                FeatureCard(
                    title = "Success Stories",
                    onClick = { navController?.navigate("success_stories_dashboard") }
                )
                FeatureCard(
                    title = "Notifications",
                    onClick = { navController?.navigate("notification_center") }
                )
                FeatureCard(
                    title = "Profile",
                    onClick = { navController?.navigate("profile") }
                )
            }
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                FeatureCard(
                    title = "Logistics Map",
                    onClick = { navController?.navigate("logistics_solutions_map") }
                )
            }
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                FeatureCard(
                    title = "Farmer Portal",
                    onClick = { navController?.navigate("farmer_portal") }
                )
                FeatureCard(
                    title = "Market Data",
                    onClick = { navController?.navigate("market_data") }
                )
            }
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                FeatureCard(
                    title = "Service Providers",
                    onClick = { navController?.navigate("service_providers") }
                )
                FeatureCard(
                    title = "Training Events",
                    onClick = { navController?.navigate("training_events") }
                )
                FeatureCard(
                    title = "Market Linkages",
                    onClick = { navController?.navigate("market_linkages") }
                )
            }
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                FeatureCard(
                    title = "Marketplace & Trading",
                    onClick = { showMarketplaceMenu = true }
                )
            }
            if (showMarketplaceMenu) {
                MarketplaceTradingMenu(
                    onSelect = { route ->
                        showMarketplaceMenu = false
                        navController?.navigate(route)
                    },
                    onDismiss = { showMarketplaceMenu = false }
                )
            }
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                FeatureCard(
                    title = "Orders & Auctions",
                    onClick = { showOrdersAuctionsMenu = true }
                )
            }
            if (showOrdersAuctionsMenu) {
                OrdersAuctionsMenu(
                    onSelect = { route ->
                        showOrdersAuctionsMenu = false
                        navController?.navigate(route)
                    },
                    onDismiss = { showOrdersAuctionsMenu = false }
                )
            }
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                FeatureCard(
                    title = "Exporter Profile",
                    onClick = { navController?.navigate("exporter_profile") }
                )
                FeatureCard(
                    title = "Exporter Collaboration",
                    onClick = { navController?.navigate("farmer_exporter_collaboration") }
                )
                FeatureCard(
                    title = "Partner With Us",
                    onClick = { navController?.navigate("partner_with_us") }
                )
                FeatureCard(
                    title = "Partner Dashboard",
                    onClick = { navController?.navigate("partner_dashboard") }
                )
            }
        }
    }
}

@Composable
fun FeatureCard(title: String, onClick: () -> Unit) {
    Card(
        onClick = onClick,
        modifier = Modifier
            .weight(1f)
            .height(100.dp)
    ) {
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier.fillMaxSize()
        ) {
            Text(title, style = MaterialTheme.typography.bodyLarge)
        }
    }
}
