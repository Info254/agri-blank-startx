package com.agriconnect.app.data.model

data class Service(
    val id: String = "",
    val name: String = "",
    val description: String = "",
    val imageUrl: String? = null,
    val status: String = ""
)

data class Product(
    val id: String = "",
    val name: String = "",
    val description: String = "",
    val price: Double = 0.0,
    val imageUrl: String? = null,
    val category: String = ""
)

data class News(
    val id: String = "",
    val title: String = "",
    val content: String = "",
    val imageUrl: String? = null,
    val createdAt: String = ""
)

data class UiState(
    val isLoading: Boolean = false,
    val error: String? = null,
    val services: List<Service> = emptyList(),
    val products: List<Product> = emptyList(),
    val news: List<News> = emptyList()
)
