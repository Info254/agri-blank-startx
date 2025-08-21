package com.agriconnect.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class MarketAuction(
    val id: String = "",
    val productId: String = "",
    val auctionStart: String = "",
    val auctionEnd: String = "",
    val startingPrice: Double = 0.0,
    val currentBid: Double? = null,
    val winnerUserId: String? = null,
    val status: String = "open",
    val createdAt: String = ""
)

@Serializable
data class MarketBid(
    val id: String = "",
    val auctionId: String = "",
    val bidderUserId: String = "",
    val bidAmount: Double = 0.0,
    val bidTime: String = ""
) 