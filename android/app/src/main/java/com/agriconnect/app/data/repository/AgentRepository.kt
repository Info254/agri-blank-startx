package com.agriconnect.app.data.repository

import com.agriconnect.app.data.model.Agent
import io.github.jan.supabase.postgrest.from
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import com.agriconnect.app.supabase

class AgentRepository {
    suspend fun fetchAgents(): List<Agent> = withContext(Dispatchers.IO) {
        supabase.from("agents").select().decodeList<Agent>()
    }

    suspend fun createAgent(agent: Agent): Agent = withContext(Dispatchers.IO) {
        supabase.from("agents").insert(agent).decodeSingle<Agent>()
    }

    suspend fun updateAgent(agent: Agent): Agent = withContext(Dispatchers.IO) {
        supabase.from("agents").update(agent).eq("id", agent.id).decodeSingle<Agent>()
    }

    suspend fun deleteAgent(id: String) = withContext(Dispatchers.IO) {
        supabase.from("agents").delete().eq("id", id)
    }
} 