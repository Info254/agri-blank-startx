package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.agriconnect.app.ui.components.*
import com.agriconnect.app.ui.viewmodels.NewsViewModel
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.runtime.saveable.rememberSaveable

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NewsScreen(
    onBackClick: () -> Unit,
    viewModel: NewsViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val listState = rememberLazyListState()
    var hasInitiallyLoaded by rememberSaveable { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        if (!hasInitiallyLoaded) {
            viewModel.loadNews()
            hasInitiallyLoaded = true
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Latest News") },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(Icons.Default.ArrowBack, "Back")
                    }
                }
            )
        }
    ) { padding ->
        Box(modifier = Modifier.padding(padding)) {
            when {
                uiState.isLoading && !hasInitiallyLoaded -> LoadingIndicator()
                uiState.error != null -> ErrorMessage(uiState.error)
                else -> {
                    LazyColumn(
                        state = listState,
                        contentPadding = PaddingValues(16.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        items(
                            items = uiState.news,
                            key = { it.id }
                        ) { newsItem ->
                            NewsCard(
                                title = newsItem.title,
                                content = newsItem.content,
                                imageUrl = newsItem.imageUrl,
                                date = newsItem.createdAt,
                                onClick = { /* Handle news click */ }
                            )
                        }
                    }
                }
            }
        }
    }
}
