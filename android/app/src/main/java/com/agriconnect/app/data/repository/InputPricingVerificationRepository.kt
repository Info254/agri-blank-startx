package com.agriconnect.app.data.repository

import com.agriconnect.app.data.model.InputPricingVerification
import io.github.jan.supabase.postgrest.from
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import com.agriconnect.app.supabase

class InputPricingVerificationRepository {
    suspend fun fetchVerifications(): List<InputPricingVerification> = withContext(Dispatchers.IO) {
        supabase.from("input_pricing_verification").select().decodeList<InputPricingVerification>()
    }

    suspend fun submitVerification(verification: InputPricingVerification): InputPricingVerification = withContext(Dispatchers.IO) {
        supabase.from("input_pricing_verification").insert(verification).decodeSingle<InputPricingVerification>()
    }

    suspend fun verifyPrice(id: String): InputPricingVerification = withContext(Dispatchers.IO) {
        // This assumes you have a "verified" column and want to set it to true
        supabase.from("input_pricing_verification").update(mapOf("verified" to true)).eq("id", id).decodeSingle<InputPricingVerification>()
    }
} 