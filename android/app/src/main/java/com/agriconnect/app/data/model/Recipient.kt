package com.agriconnect.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class Recipient(
    val id: String = "",
    val name: String = "",
    val type: String = "", // e.g., 'children_home', 'food_bank', 'charity'
    val location: String? = null,
    val contact: String? = null,
    val createdAt: String = ""
) 