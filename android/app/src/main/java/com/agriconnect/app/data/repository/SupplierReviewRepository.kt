package com.agriconnect.app.data.repository

import com.agriconnect.app.data.model.SupplierReview
import io.github.jan.supabase.postgrest.from
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import com.agriconnect.app.supabase

class SupplierReviewRepository {
    suspend fun fetchReviews(): List<SupplierReview> = withContext(Dispatchers.IO) {
        supabase.from("input_supplier_reviews").select().decodeList<SupplierReview>()
    }

    suspend fun createReview(review: SupplierReview): SupplierReview = withContext(Dispatchers.IO) {
        supabase.from("input_supplier_reviews").insert(review).decodeSingle<SupplierReview>()
    }

    suspend fun updateReview(review: SupplierReview): SupplierReview = withContext(Dispatchers.IO) {
        supabase.from("input_supplier_reviews").update(review).eq("id", review.id).decodeSingle<SupplierReview>()
    }

    suspend fun deleteReview(id: String) = withContext(Dispatchers.IO) {
        supabase.from("input_supplier_reviews").delete().eq("id", id)
    }
} 