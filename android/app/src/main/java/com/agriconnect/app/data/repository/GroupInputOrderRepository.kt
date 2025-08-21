package com.agriconnect.app.data.repository

import com.agriconnect.app.data.model.GroupInputOrder
import io.github.jan.supabase.postgrest.from
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import com.agriconnect.app.supabase

class GroupInputOrderRepository {
    suspend fun fetchGroupOrders(): List<GroupInputOrder> = withContext(Dispatchers.IO) {
        supabase.from("group_input_orders").select().decodeList<GroupInputOrder>()
    }

    suspend fun createGroupOrder(order: GroupInputOrder): GroupInputOrder = withContext(Dispatchers.IO) {
        supabase.from("group_input_orders").insert(order).decodeSingle<GroupInputOrder>()
    }

    suspend fun updateGroupOrder(order: GroupInputOrder): GroupInputOrder = withContext(Dispatchers.IO) {
        supabase.from("group_input_orders").update(order).eq("id", order.id).decodeSingle<GroupInputOrder>()
    }
} 