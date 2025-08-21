package com.agriconnect.app.data.repository

import com.agriconnect.app.data.model.Recipient
import io.github.jan.supabase.postgrest.from
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import com.agriconnect.app.supabase

class RecipientRepository {
    suspend fun fetchRecipients(): List<Recipient> = withContext(Dispatchers.IO) {
        supabase.from("recipients").select().decodeList<Recipient>()
    }

    suspend fun createRecipient(recipient: Recipient): Recipient = withContext(Dispatchers.IO) {
        supabase.from("recipients").insert(recipient).decodeSingle<Recipient>()
    }

    suspend fun updateRecipient(recipient: Recipient): Recipient = withContext(Dispatchers.IO) {
        supabase.from("recipients").update(recipient).eq("id", recipient.id).decodeSingle<Recipient>()
    }

    suspend fun deleteRecipient(id: String) = withContext(Dispatchers.IO) {
        supabase.from("recipients").delete().eq("id", id)
    }
} 