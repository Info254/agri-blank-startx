package com.agriconnect.app.data.model

import kotlinx.serialization.Serializable

@Serializable
data class CityMarket(
    val id: String = "",
    val marketName: String = "",
    val marketType: String = "",
    val city: String = "",
    val county: String = "",
    val physicalAddress: String = "",
    val coordinates: String = "", // JSONB as String
    val operatingHours: String = "",
    val operatingDays: List<String> = emptyList(),
    val marketFeeStructure: String = "", // JSONB as String
    val facilities: List<String> = emptyList(),
    val commoditiesTraded: List<String> = emptyList(),
    val averageDailyTraders: Int = 0,
    val averageDailyBuyers: Int = 0,
    val establishedYear: Int? = null,
    val marketAuthority: String? = null,
    val contactPhone: String? = null,
    val contactEmail: String? = null,
    val websiteUrl: String? = null,
    val socialMedia: String? = null, // JSONB as String
    val isVerified: Boolean = false,
    val isActive: Boolean = true,
    val createdAt: String = "",
    val updatedAt: String = ""
) 