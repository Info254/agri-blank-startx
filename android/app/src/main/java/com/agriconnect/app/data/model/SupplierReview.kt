package com.agriconnect.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class SupplierReview(
    val id: String = "",
    val supplierId: String = "",
    val rating: Int? = null,
    val review: String? = null,
    val photoUrl: String? = null,
    val verified: Boolean = false,
    val createdAt: String = ""
) 