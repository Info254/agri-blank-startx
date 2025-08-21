package com.agriconnect.app.data.model

data class MyTrade(
    val id: String = "",
    val tradeType: String = "buy", // or "sell"
    val product: String = "",
    val quantity: Int = 0,
    val price: Double = 0.0,
    val status: String = "open",
    val createdAt: String = "",
    val updatedAt: String = ""
) 