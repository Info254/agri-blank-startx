package com.agriconnect.app.data

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject
import javax.inject.Singleton
import com.agriconnect.app.data.model.*

@Singleton
class Repository @Inject constructor(
    private val supabaseProvider: SupabaseProvider
) {
    suspend fun getServices(): Flow<List<Service>> = flow {
        val services = supabaseProvider.client
            .postgrest["services"]
            .select()
            .decodeList<Service>()
        emit(services)
    }

    suspend fun getProducts(): Flow<List<Product>> = flow {
        val products = supabaseProvider.client
            .postgrest["products"]
            .select()
            .decodeList<Product>()
        emit(products)
    }

    suspend fun getNews(): Flow<List<News>> = flow {
        val news = supabaseProvider.client
            .postgrest["news"]
            .select()
            .decodeList<News>()
        emit(news)
    }

    suspend fun uploadImage(imageBytes: ByteArray, path: String): String {
        return supabaseProvider.client.storage["images"]
            .upload(path, imageBytes)
            .getPublicUrl()
    }
}
