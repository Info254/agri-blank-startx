package com.agriconnect.app.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.agriconnect.app.ui.screens.*

sealed class Screen(val route: String) {
    object Home : Screen("home")
    object Services : Screen("services")
    object Products : Screen("products")
    object News : Screen("news")
    object Camera : Screen("camera")
    object AdminDashboard : Screen("admin_dashboard")
    object AgentDashboard : Screen("agent_dashboard")
    object BulkOrderDashboard : Screen("bulk_order_dashboard")
    object InputPricingDashboard : Screen("input_pricing_dashboard")
    object DonationDashboard : Screen("donation_dashboard")
    object FoodRescueDashboard : Screen("food_rescue_dashboard")
    object ProductAuctionDashboard : Screen("product_auction_dashboard")
    object SupplierReviewDashboard : Screen("supplier_review_dashboard")
    object CommunityForumDashboard : Screen("community_forum_dashboard")
    object SuccessStoriesDashboard : Screen("success_stories_dashboard")
    object NotificationCenter : Screen("notification_center")
    object Profile : Screen("profile")
    object LogisticsSolutionsMap : Screen("logistics_solutions_map")
    object FarmerPortal : Screen("farmer_portal")
    object MarketData : Screen("market_data")
    object ServiceProviders : Screen("service_providers")
    object TrainingEvents : Screen("training_events")
    object MarketLinkages : Screen("market_linkages")
    object FarmInputsMarketplace : Screen("farm_inputs_marketplace")
    object CommodityTrading : Screen("commodity_trading")
    object EquipmentMarketplace : Screen("equipment_marketplace")
    object ExportOpportunities : Screen("export_opportunities")
    object CityMarkets : Screen("city_markets")
    object ExporterProfile : Screen("exporter_profile")
    object FarmerExporterCollaboration : Screen("farmer_exporter_collaboration")
    object PartnerWithUs : Screen("partner_with_us")
    object PartnerDashboard : Screen("partner_dashboard")
    object GroupInputOrders : Screen("group_input_orders")
    object InputPricingVerification : Screen("input_pricing_verification")
    object ReverseBulkAuctions : Screen("reverse_bulk_auctions")
    object BarterExchange : Screen("barter_exchange")
    object MyTrades : Screen("my_trades")
    object PriceTrends : Screen("price_trends")
    object MarketplaceView : Screen("marketplace_view")
}

@Composable
fun AppNavigation(navController: NavHostController) {
    NavHost(
        navController = navController,
        startDestination = Screen.Home.route
    ) {
        composable(Screen.Home.route) {
            HomeScreen(
                onServiceClick = { navController.navigate(Screen.Services.route) },
                onProductClick = { navController.navigate(Screen.Products.route) },
                onNewsClick = { navController.navigate(Screen.News.route) }
            )
        }
        composable(Screen.Services.route) {
            ServicesScreen(
                onBackClick = { navController.popBackStack() },
                onCameraClick = { navController.navigate(Screen.Camera.route) }
            )
        }
        composable(Screen.Products.route) {
            ProductsScreen(
                onBackClick = { navController.popBackStack() }
            )
        }
        composable(Screen.News.route) {
            NewsScreen(
                onBackClick = { navController.popBackStack() }
            )
        }
        composable(Screen.Camera.route) {
            CameraScreen(
                onImageCaptured = { uri ->
                    navController.previousBackStackEntry?.savedStateHandle?.set("capturedImage", uri)
                    navController.popBackStack()
                },
                onBackClick = { navController.popBackStack() }
            )
        }
        composable(Screen.AdminDashboard.route) {
            AdminDashboardScreen()
        }
        composable(Screen.AgentDashboard.route) {
            AgentDashboardScreen()
        }
        composable(Screen.BulkOrderDashboard.route) {
            BulkOrderDashboardScreen()
        }
        composable(Screen.InputPricingDashboard.route) {
            InputPricingDashboardScreen()
        }
        composable(Screen.DonationDashboard.route) {
            DonationDashboardScreen()
        }
        composable(Screen.FoodRescueDashboard.route) {
            FoodRescueDashboardScreen()
        }
        composable(Screen.ProductAuctionDashboard.route) {
            ProductAuctionDashboardScreen()
        }
        composable(Screen.SupplierReviewDashboard.route) {
            SupplierReviewDashboardScreen()
        }
        composable(Screen.CommunityForumDashboard.route) {
            CommunityForumDashboardScreen()
        }
        composable(Screen.SuccessStoriesDashboard.route) {
            SuccessStoriesDashboardScreen()
        }
        composable(Screen.NotificationCenter.route) {
            NotificationCenterScreen()
        }
        composable(Screen.Profile.route) {
            ProfileScreen()
        }
        composable(Screen.LogisticsSolutionsMap.route) {
            LogisticsSolutionsMapScreen()
        }
        composable(Screen.FarmerPortal.route) {
            FarmerPortalScreen()
        }
        composable(Screen.MarketData.route) {
            MarketDataScreen()
        }
        composable(Screen.ServiceProviders.route) {
            ServiceProvidersScreen()
        }
        composable(Screen.TrainingEvents.route) {
            TrainingEventsScreen()
        }
        composable(Screen.MarketLinkages.route) {
            MarketLinkagesScreen()
        }
        composable(Screen.FarmInputsMarketplace.route) {
            FarmInputsMarketplaceScreen()
        }
        composable(Screen.CommodityTrading.route) {
            CommodityTradingScreen()
        }
        composable(Screen.EquipmentMarketplace.route) {
            EquipmentMarketplaceScreen()
        }
        composable(Screen.ExportOpportunities.route) {
            ExportOpportunitiesScreen()
        }
        composable(Screen.CityMarkets.route) {
            CityMarketsScreen()
        }
        composable(Screen.ExporterProfile.route) {
            ExporterProfileScreen()
        }
        composable(Screen.FarmerExporterCollaboration.route) {
            FarmerExporterCollaborationScreen()
        }
        composable(Screen.PartnerWithUs.route) {
            PartnerWithUsScreen()
        }
        composable(Screen.PartnerDashboard.route) {
            PartnerDashboardScreen()
        }
        composable(Screen.GroupInputOrders.route) {
            GroupInputOrdersScreen()
        }
        composable(Screen.InputPricingVerification.route) {
            InputPricingVerificationScreen()
        }
        composable(Screen.ReverseBulkAuctions.route) {
            ReverseBulkAuctionsScreen()
        }
        composable(Screen.BarterExchange.route) {
            BarterExchangeScreen()
        }
        composable(Screen.MyTrades.route) {
            MyTradesScreen()
        }
        composable(Screen.PriceTrends.route) {
            PriceTrendsScreen()
        }
        composable(Screen.MarketplaceView.route) {
            MarketplaceViewScreen()
        }
    }
}
