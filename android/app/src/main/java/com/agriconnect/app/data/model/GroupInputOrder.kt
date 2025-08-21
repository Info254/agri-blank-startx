package com.agriconnect.app.data.model

data class GroupInputOrder(
    val id: String = "",
    val groupName: String = "",
    val items: List<GroupInputOrderItem> = emptyList(),
    val status: String = "pending",
    val createdAt: String = "",
    val updatedAt: String = ""
)

data class GroupInputOrderItem(
    val id: String = "",
    val productName: String = "",
    val quantity: Int = 0,
    val unit: String = "",
    val price: Double = 0.0
) 