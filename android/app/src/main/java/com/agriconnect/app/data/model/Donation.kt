package com.agriconnect.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class Donation(
    val id: String = "",
    val productId: String = "",
    val agentId: String = "",
    val donatedAt: String = "",
    val feedback: String? = null,
    val feedbackRating: Int? = null
) 