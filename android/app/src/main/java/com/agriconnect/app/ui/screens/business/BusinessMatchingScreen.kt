package com.agriconnect.app.ui.screens.business

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.agriconnect.app.data.model.*
import com.agriconnect.app.viewmodel.BusinessMatchingViewModelImpl

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BusinessMatchingScreen(
    onProfileClick: (String) -> Unit,
    onCreateProfile: () -> Unit,
    viewModel: BusinessMatchingViewModelImpl = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val filters by viewModel.filters.collectAsStateWithLifecycle()
    
    var selectedTab by remember { mutableStateOf(0) }
    var showFilters by remember { mutableStateOf(false) }
    var searchQuery by remember { mutableStateOf("") }

    LaunchedEffect(Unit) {
        viewModel.loadBusinessProfiles()
        viewModel.loadFeaturedProfiles()
        viewModel.loadRecommendedProfiles()
    }

    Column(
        modifier = Modifier.fillMaxSize()
    ) {
        // Header
        TopAppBar(
            title = { Text("Business Matching") },
            actions = {
                IconButton(onClick = { showFilters = true }) {
                    Icon(Icons.Default.FilterList, contentDescription = "Filter")
                }
                IconButton(onClick = { viewModel.refreshMatches() }) {
                    Icon(Icons.Default.Refresh, contentDescription = "Refresh Matches")
                }
            }
        )

        // Search Bar
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { 
                searchQuery = it
                viewModel.searchProfiles(it)
            },
            label = { Text("Search businesses...") },
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        )

        // Check if user has profile
        if (uiState.userProfile == null) {
            CreateProfilePrompt(onCreateProfile = onCreateProfile)
        } else {
            // Tabs
            TabRow(selectedTabIndex = selectedTab) {
                Tab(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    text = { Text("Discover") }
                )
                Tab(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    text = { Text("My Matches") }
                )
                Tab(
                    selected = selectedTab == 2,
                    onClick = { selectedTab = 2 },
                    text = { Text("Featured") }
                )
            }

            // Content based on selected tab
            when (selectedTab) {
                0 -> {
                    DiscoverBusinessesTab(
                        profiles = uiState.businessProfiles,
                        recommendedProfiles = uiState.recommendedProfiles,
                        isLoading = uiState.isLoading,
                        onProfileClick = onProfileClick,
                        onExpressInterest = { profileId, message ->
                            viewModel.expressInterest(profileId, message)
                        }
                    )
                }
                1 -> {
                    MyMatchesTab(
                        matches = uiState.matches,
                        isLoading = uiState.isLoading,
                        onProfileClick = onProfileClick,
                        onUpdateMatchStatus = { matchId, status ->
                            viewModel.updateMatchStatus(matchId, status)
                        }
                    )
                }
                2 -> {
                    FeaturedBusinessesTab(
                        featuredProfiles = uiState.featuredProfiles,
                        isLoading = uiState.isLoading,
                        onProfileClick = onProfileClick
                    )
                }
            }
        }
    }

    // Filters Dialog
    if (showFilters) {
        BusinessFiltersDialog(
            filters = filters,
            onFiltersApplied = { newFilters ->
                viewModel.applyFilters(newFilters)
                showFilters = false
            },
            onDismiss = { showFilters = false }
        )
    }

    // Loading indicator for refresh
    if (uiState.isRefreshing) {
        Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            CircularProgressIndicator()
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

@Composable
fun CreateProfilePrompt(onCreateProfile: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.primaryContainer
        )
    ) {
        Column(
            modifier = Modifier.padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                Icons.Default.Business,
                contentDescription = null,
                modifier = Modifier.size(64.dp),
                tint = MaterialTheme.colorScheme.primary
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "Create Your Business Profile",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Connect with other businesses in the agricultural value chain. Create your profile to start discovering potential partners.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(modifier = Modifier.height(16.dp))
            Button(
                onClick = onCreateProfile,
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(Icons.Default.Add, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Create Business Profile")
            }
        }
    }
}

@Composable
fun DiscoverBusinessesTab(
    profiles: List<BusinessProfile>,
    recommendedProfiles: List<BusinessProfile>,
    isLoading: Boolean,
    onProfileClick: (String) -> Unit,
    onExpressInterest: (String, String) -> Unit
) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(16.dp)
    ) {
        // Recommended Section
        if (recommendedProfiles.isNotEmpty()) {
            item {
                Text(
                    text = "Recommended for You",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
            }
            
            item {
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    contentPadding = PaddingValues(horizontal = 4.dp)
                ) {
                    items(recommendedProfiles) { profile ->
                        RecommendedBusinessCard(
                            profile = profile,
                            onCardClick = { onProfileClick(profile.id) },
                            onExpressInterest = { message ->
                                onExpressInterest(profile.id, message)
                            }
                        )
                    }
                }
            }
            
            item {
                Divider(modifier = Modifier.padding(vertical = 8.dp))
            }
        }

        // All Businesses Section
        item {
            Text(
                text = "All Businesses",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
        }

        if (isLoading) {
            item {
                Box(
                    modifier = Modifier.fillMaxWidth(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            }
        } else if (profiles.isEmpty()) {
            item {
                EmptyBusinessesCard()
            }
        } else {
            items(profiles) { profile ->
                BusinessProfileCard(
                    profile = profile,
                    onCardClick = { onProfileClick(profile.id) },
                    onExpressInterest = { message ->
                        onExpressInterest(profile.id, message)
                    }
                )
            }
        }
    }
}

@Composable
fun MyMatchesTab(
    matches: List<BusinessMatchingScore>,
    isLoading: Boolean,
    onProfileClick: (String) -> Unit,
    onUpdateMatchStatus: (String, MatchStatus) -> Unit
) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.spacedBy(12.dp),
        contentPadding = PaddingValues(16.dp)
    ) {
        if (isLoading) {
            item {
                Box(
                    modifier = Modifier.fillMaxWidth(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            }
        } else if (matches.isEmpty()) {
            item {
                EmptyMatchesCard()
            }
        } else {
            items(matches) { match ->
                BusinessMatchCard(
                    match = match,
                    onCardClick = { onProfileClick(match.profileBId) },
                    onUpdateStatus = { status ->
                        onUpdateMatchStatus(match.id, status)
                    }
                )
            }
        }
    }
}

@Composable
fun FeaturedBusinessesTab(
    featuredProfiles: List<BusinessProfile>,
    isLoading: Boolean,
    onProfileClick: (String) -> Unit
) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.spacedBy(12.dp),
        contentPadding = PaddingValues(16.dp)
    ) {
        if (isLoading) {
            item {
                Box(
                    modifier = Modifier.fillMaxWidth(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            }
        } else if (featuredProfiles.isEmpty()) {
            item {
                EmptyFeaturedCard()
            }
        } else {
            items(featuredProfiles) { profile ->
                FeaturedBusinessCard(
                    profile = profile,
                    onCardClick = { onProfileClick(profile.id) }
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BusinessProfileCard(
    profile: BusinessProfile,
    onCardClick: () -> Unit,
    onExpressInterest: (String) -> Unit
) {
    var showInterestDialog by remember { mutableStateOf(false) }

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
                        text = profile.businessName,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "${profile.businessType.name.replace("_", " ")} • ${profile.businessSize.name}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                
                // Verification Badge
                if (profile.verificationStatus == VerificationStatus.VERIFIED) {
                    AssistChip(
                        onClick = { },
                        label = { Text("Verified") },
                        leadingIcon = { Icon(Icons.Default.Verified, contentDescription = null) },
                        colors = AssistChipDefaults.assistChipColors(
                            containerColor = MaterialTheme.colorScheme.primaryContainer
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Location
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    Icons.Default.LocationOn,
                    contentDescription = null,
                    modifier = Modifier.size(16.dp),
                    tint = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = "${profile.city}, ${profile.country}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            // Description
            if (profile.description.isNotBlank()) {
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = profile.description,
                    style = MaterialTheme.typography.bodySmall,
                    maxLines = 2
                )
            }

            // Commodities/Services
            if (profile.commoditiesHandled.isNotEmpty()) {
                Spacer(modifier = Modifier.height(8.dp))
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(profile.commoditiesHandled.take(3)) { commodity ->
                        AssistChip(
                            onClick = { },
                            label = { Text(commodity) }
                        )
                    }
                    if (profile.commoditiesHandled.size > 3) {
                        item {
                            AssistChip(
                                onClick = { },
                                label = { Text("+${profile.commoditiesHandled.size - 3} more") }
                            )
                        }
                    }
                }
            }

            // Action Buttons
            Spacer(modifier = Modifier.height(12.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OutlinedButton(
                    onClick = { showInterestDialog = true },
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(Icons.Default.Favorite, contentDescription = null)
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Express Interest")
                }
                
                Button(
                    onClick = onCardClick,
                    modifier = Modifier.weight(1f)
                ) {
                    Text("View Profile")
                }
            }
        }
    }

    // Interest Dialog
    if (showInterestDialog) {
        ExpressInterestDialog(
            businessName = profile.businessName,
            onInterestExpressed = { message ->
                onExpressInterest(message)
                showInterestDialog = false
            },
            onDismiss = { showInterestDialog = false }
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BusinessMatchCard(
    match: BusinessMatchingScore,
    onCardClick: () -> Unit,
    onUpdateStatus: (MatchStatus) -> Unit
) {
    Card(
        onClick = onCardClick,
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.tertiaryContainer
        )
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            // Match Score Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Match Score",
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        Icons.Default.Star,
                        contentDescription = null,
                        modifier = Modifier.size(20.dp),
                        tint = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "${String.format("%.0f", match.overallCompatibilityScore)}%",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Match Reason
            if (match.matchReason.isNotBlank()) {
                Text(
                    text = match.matchReason,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            // Potential Synergies
            if (match.potentialSynergies.isNotEmpty()) {
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Synergies:",
                    style = MaterialTheme.typography.labelSmall,
                    fontWeight = FontWeight.Bold
                )
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(match.potentialSynergies.take(2)) { synergy ->
                        AssistChip(
                            onClick = { },
                            label = { Text(synergy) }
                        )
                    }
                }
            }

            // Action Buttons
            Spacer(modifier = Modifier.height(12.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                if (match.matchStatus == MatchStatus.SUGGESTED) {
                    OutlinedButton(
                        onClick = { onUpdateStatus(MatchStatus.DECLINED) },
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Pass")
                    }
                    
                    Button(
                        onClick = { onUpdateStatus(MatchStatus.INTERESTED) },
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Interested")
                    }
                } else {
                    Button(
                        onClick = onCardClick,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("View Details")
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RecommendedBusinessCard(
    profile: BusinessProfile,
    onCardClick: () -> Unit,
    onExpressInterest: (String) -> Unit
) {
    Card(
        onClick = onCardClick,
        modifier = Modifier.width(280.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = profile.businessName,
                style = MaterialTheme.typography.titleSmall,
                fontWeight = FontWeight.Bold,
                maxLines = 1
            )
            Text(
                text = profile.businessType.name.replace("_", " "),
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Text(
                text = profile.description,
                style = MaterialTheme.typography.bodySmall,
                maxLines = 2
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Button(
                onClick = onCardClick,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("View Profile")
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FeaturedBusinessCard(
    profile: BusinessProfile,
    onCardClick: () -> Unit
) {
    Card(
        onClick = onCardClick,
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.secondaryContainer
        )
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                Icons.Default.Star,
                contentDescription = null,
                modifier = Modifier.size(24.dp),
                tint = MaterialTheme.colorScheme.primary
            )
            
            Spacer(modifier = Modifier.width(12.dp))
            
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = profile.businessName,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "${profile.businessType.name.replace("_", " ")} • ${profile.city}, ${profile.country}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            
            Icon(
                Icons.Default.ChevronRight,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
fun ExpressInterestDialog(
    businessName: String,
    onInterestExpressed: (String) -> Unit,
    onDismiss: () -> Unit
) {
    var message by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Express Interest in $businessName") },
        text = {
            Column {
                Text("Send a message to express your interest in partnering:")
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(
                    value = message,
                    onValueChange = { message = it },
                    label = { Text("Your message") },
                    minLines = 3,
                    maxLines = 5,
                    modifier = Modifier.fillMaxWidth()
                )
            }
        },
        confirmButton = {
            Button(
                onClick = { onInterestExpressed(message) },
                enabled = message.isNotBlank()
            ) {
                Text("Send")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}

@Composable
fun EmptyBusinessesCard() {
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
                Icons.Default.Business,
                contentDescription = null,
                modifier = Modifier.size(64.dp),
                tint = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "No Businesses Found",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "Try adjusting your search or filters",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
fun EmptyMatchesCard() {
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
                Icons.Default.Favorite,
                contentDescription = null,
                modifier = Modifier.size(64.dp),
                tint = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "No Matches Yet",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "Complete your profile to get better matches",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
fun EmptyFeaturedCard() {
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
                Icons.Default.Star,
                contentDescription = null,
                modifier = Modifier.size(64.dp),
                tint = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "No Featured Businesses",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "Check back later for featured profiles",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}
