package com.agriconnect.app.ui.components

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.res.stringResource
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.rememberCoroutineScope
import kotlinx.coroutines.launch
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.foundation.layout.height

@Composable
fun BottomBar(navController: NavHostController) {
    val sheetState = rememberModalBottomSheetState()
    val coroutineScope = rememberCoroutineScope()
    var showSheet by remember { mutableStateOf(false) }

    NavigationBar {
        val navBackStackEntry by navController.currentBackStackEntryAsState()
        val currentDestination = navBackStackEntry?.destination

        listOf(
            NavigationItem.Home,
            NavigationItem.Services,
            NavigationItem.Products,
            NavigationItem.News
        ).forEach { item ->
            NavigationBarItem(
                icon = { Icon(item.icon, contentDescription = null) },
                label = { Text(item.title) },
                selected = currentDestination?.hierarchy?.any { it.route == item.route } == true,
                onClick = {
                    navController.navigate(item.route) {
                        popUpTo(navController.graph.findStartDestination().id) {
                            saveState = true
                        }
                        launchSingleTop = true
                        restoreState = true
                    }
                }
            )
        }
        // More button
        NavigationBarItem(
            icon = { Icon(Icons.Default.Menu, contentDescription = "More") },
            label = { Text("More") },
            selected = false,
            onClick = { showSheet = true }
        )
    }

    if (showSheet) {
        ModalBottomSheet(
            onDismissRequest = { showSheet = false },
            sheetState = sheetState
        ) {
            Column(Modifier.padding(16.dp)) {
                Text("More Features", style = MaterialTheme.typography.titleMedium)
                Spacer(Modifier.height(8.dp))
                Button(
                    onClick = {
                        showSheet = false
                        navController.navigate("admin_dashboard")
                    },
                    modifier = Modifier.fillMaxWidth()
                ) { Text("Admin Dashboard") }
                Button(
                    onClick = {
                        showSheet = false
                        navController.navigate("agent_dashboard")
                    },
                    modifier = Modifier.fillMaxWidth()
                ) { Text("Agent Dashboard") }
                Button(
                    onClick = {
                        showSheet = false
                        navController.navigate("bulk_order_dashboard")
                    },
                    modifier = Modifier.fillMaxWidth()
                ) { Text("Bulk Orders") }
                Button(
                    onClick = {
                        showSheet = false
                        navController.navigate("input_pricing_dashboard")
                    },
                    modifier = Modifier.fillMaxWidth()
                ) { Text("Input Pricing") }
                Button(
                    onClick = {
                        showSheet = false
                        navController.navigate("donation_dashboard")
                    },
                    modifier = Modifier.fillMaxWidth()
                ) { Text("Donations") }
                Button(
                    onClick = {
                        showSheet = false
                        navController.navigate("food_rescue_dashboard")
                    },
                    modifier = Modifier.fillMaxWidth()
                ) { Text("Food Rescue") }
                Button(
                    onClick = {
                        showSheet = false
                        navController.navigate("product_auction_dashboard")
                    },
                    modifier = Modifier.fillMaxWidth()
                ) { Text("Product Auctions") }
                Button(
                    onClick = {
                        showSheet = false
                        navController.navigate("supplier_review_dashboard")
                    },
                    modifier = Modifier.fillMaxWidth()
                ) { Text("Supplier Reviews") }
                Button(
                    onClick = {
                        showSheet = false
                        navController.navigate("community_forum_dashboard")
                    },
                    modifier = Modifier.fillMaxWidth()
                ) { Text("Community Forum") }
                Button(
                    onClick = {
                        showSheet = false
                        navController.navigate("success_stories_dashboard")
                    },
                    modifier = Modifier.fillMaxWidth()
                ) { Text("Success Stories") }
                Button(
                    onClick = {
                        showSheet = false
                        navController.navigate("notification_center")
                    },
                    modifier = Modifier.fillMaxWidth()
                ) { Text("Notifications") }
                Button(
                    onClick = {
                        showSheet = false
                        navController.navigate("profile")
                    },
                    modifier = Modifier.fillMaxWidth()
                ) { Text("Profile") }
                Button(
                    onClick = {
                        showSheet = false
                        navController.navigate("logistics_solutions_map")
                    },
                    modifier = Modifier.fillMaxWidth()
                ) { Text("Logistics Map") }
                Button(
                    onClick = {
                        showSheet = false
                        navController.navigate("farmer_portal")
                    },
                    modifier = Modifier.fillMaxWidth()
                ) { Text("Farmer Portal") }
                Button(
                    onClick = {
                        showSheet = false
                        navController.navigate("market_data")
                    },
                    modifier = Modifier.fillMaxWidth()
                ) { Text("Market Data") }
                Button(
                    onClick = {
                        showSheet = false
                        navController.navigate("service_providers")
                    },
                    modifier = Modifier.fillMaxWidth()
                ) { Text("Service Providers") }
                Button(
                    onClick = {
                        showSheet = false
                        navController.navigate("training_events")
                    },
                    modifier = Modifier.fillMaxWidth()
                ) { Text("Training Events") }
                Button(
                    onClick = {
                        showSheet = false
                        navController.navigate("market_linkages")
                    },
                    modifier = Modifier.fillMaxWidth()
                ) { Text("Market Linkages") }
                Button(
                    onClick = {
                        showSheet = false
                        navController.navigate("exporter_profile")
                    },
                    modifier = Modifier.fillMaxWidth()
                ) { Text("Exporter Profile") }
                Button(
                    onClick = {
                        showSheet = false
                        navController.navigate("farmer_exporter_collaboration")
                    },
                    modifier = Modifier.fillMaxWidth()
                ) { Text("Exporter Collaboration") }
                Button(
                    onClick = {
                        showSheet = false
                        navController.navigate("partner_with_us")
                    },
                    modifier = Modifier.fillMaxWidth()
                ) { Text("Partner With Us") }
                Button(
                    onClick = {
                        showSheet = false
                        navController.navigate("partner_dashboard")
                    },
                    modifier = Modifier.fillMaxWidth()
                ) { Text("Partner Dashboard") }
                // Add more features as you implement them
            }
        }
    }
}

sealed class NavigationItem(
    val route: String,
    val title: String,
    val icon: ImageVector
) {
    object Home : NavigationItem("home", "Home", Icons.Default.Home)
    object Services : NavigationItem("services", "Services", Icons.Default.Build)
    object Products : NavigationItem("products", "Products", Icons.Default.ShoppingCart)
    object News : NavigationItem("news", "News", Icons.Default.Article)
}
