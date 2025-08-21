package com.agriconnect.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class BulkOrder(
    val id: String = "",
    val buyerId: String = "",
    val produceType: String = "",
    val quantity: Int = 0,
    val quality: String? = null,
    val deliveryDate: String? = null,
    val status: String = "open",
    val createdAt: String = ""
)

@Serializable
data class BulkOrderBid(
    val id: String = "",
    val orderId: String = "",
    val farmerId: String = "",
    val price: Double = 0.0,
    val qualityOffer: String? = null,
    val status: String = "pending",
    val createdAt: String = ""
) 