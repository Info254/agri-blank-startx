package com.agriconnect.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class Agent(
    val id: String = "",
    val userId: String = "",
    val marketId: String? = null,
    val role: String = "",
    val profileInfo: String? = null,
    val verified: Boolean = false,
    val createdAt: String = ""
) 