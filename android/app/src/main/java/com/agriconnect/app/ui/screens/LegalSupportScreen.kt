package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun LegalSupportScreen() {
    val tabs = listOf("Privacy Policy", "Terms of Service", "FAQ", "Help & Support")
    var selectedTab by remember { mutableStateOf(0) }

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
        when (selectedTab) {
            0 -> PrivacyPolicyView()
            1 -> TermsOfServiceView()
            2 -> FAQView()
            3 -> HelpSupportView()
        }
    }
}

@Composable
fun PrivacyPolicyView() {
    Text("Privacy Policy content goes here.")
}

@Composable
fun TermsOfServiceView() {
    Text("Terms of Service content goes here.")
}

@Composable
fun FAQView() {
    Text("FAQ content goes here.")
}

@Composable
fun HelpSupportView() {
    Text("Help & Support / Contact content goes here.")
} 