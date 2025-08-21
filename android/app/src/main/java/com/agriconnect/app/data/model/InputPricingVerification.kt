package com.agriconnect.app.data.model

data class InputPricingVerification(
    val id: String = "",
    val productName: String = "",
    val price: Double = 0.0,
    val verified: Boolean = false,
    val submittedBy: String = "",
    val createdAt: String = "",
    val updatedAt: String = ""
) 