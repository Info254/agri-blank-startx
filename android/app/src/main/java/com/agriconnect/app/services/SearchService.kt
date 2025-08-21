package com.agriconnect.app.services

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import java.util.concurrent.TimeUnit
import javax.inject.Inject
import javax.inject.Singleton

@Serializable
data class SearchQuery(
    val query: String,
    val filters: Map<String, String> = emptyMap(),
    val facets: List<String> = emptyList(),
    val sortBy: String = "relevance",
    val limit: Int = 20,
    val offset: Int = 0
)

@Serializable
data class SearchResult(
    val id: String,
    val title: String,
    val description: String,
    val type: String,
    val score: Float,
    val highlights: List<String> = emptyList(),
    val metadata: Map<String, String> = emptyMap()
)

@Serializable
data class SearchResponse(
    val results: List<SearchResult>,
    val totalCount: Int,
    val facets: Map<String, List<FacetValue>>,
    val suggestions: List<String> = emptyList(),
    val queryTime: Long
)

@Serializable
data class FacetValue(
    val value: String,
    val count: Int
)

@Serializable
data class SearchAnalytics(
    val query: String,
    val timestamp: Long,
    val resultCount: Int,
    val clickedResults: List<String> = emptyList(),
    val userId: String? = null
)

class SearchDatabaseHelper(context: Context) : SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {
    companion object {
        const val DATABASE_NAME = "search_database.db"
        const val DATABASE_VERSION = 1
        
        // FTS table for full-text search
        const val TABLE_SEARCH_INDEX = "search_index_fts"
        const val TABLE_SEARCH_ANALYTICS = "search_analytics"
        const val TABLE_SEARCH_SUGGESTIONS = "search_suggestions"
    }

    override fun onCreate(db: SQLiteDatabase) {
        // Create FTS table for full-text search
        db.execSQL("""
            CREATE VIRTUAL TABLE $TABLE_SEARCH_INDEX USING fts5(
                id UNINDEXED,
                title,
                description,
                content,
                type UNINDEXED,
                category UNINDEXED,
                tags,
                location UNINDEXED,
                price UNINDEXED,
                created_at UNINDEXED
            )
        """)

        // Create analytics table
        db.execSQL("""
            CREATE TABLE $TABLE_SEARCH_ANALYTICS (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                query TEXT NOT NULL,
                timestamp INTEGER NOT NULL,
                result_count INTEGER NOT NULL,
                clicked_results TEXT,
                user_id TEXT
            )
        """)

        // Create suggestions table
        db.execSQL("""
            CREATE TABLE $TABLE_SEARCH_SUGGESTIONS (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                suggestion TEXT UNIQUE NOT NULL,
                frequency INTEGER DEFAULT 1,
                last_used INTEGER NOT NULL
            )
        """)
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        db.execSQL("DROP TABLE IF EXISTS $TABLE_SEARCH_INDEX")
        db.execSQL("DROP TABLE IF EXISTS $TABLE_SEARCH_ANALYTICS")
        db.execSQL("DROP TABLE IF EXISTS $TABLE_SEARCH_SUGGESTIONS")
        onCreate(db)
    }
}

@Singleton
class SearchService @Inject constructor(
    private val context: Context
) {
    private val dbHelper = SearchDatabaseHelper(context)
    private val httpClient = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .build()
    
    private val json = Json { ignoreUnknownKeys = true }

    suspend fun search(searchQuery: SearchQuery): SearchResponse = withContext(Dispatchers.IO) {
        val startTime = System.currentTimeMillis()
        
        try {
            // Try local FTS search first
            val localResults = searchLocal(searchQuery)
            
            // If local results are insufficient, try remote search
            val results = if (localResults.size < searchQuery.limit / 2) {
                val remoteResults = searchRemote(searchQuery)
                combineResults(localResults, remoteResults, searchQuery.limit)
            } else {
                localResults
            }
            
            // Generate facets
            val facets = generateFacets(results)
            
            // Get suggestions
            val suggestions = getSuggestions(searchQuery.query)
            
            val queryTime = System.currentTimeMillis() - startTime
            
            // Log analytics
            logSearchAnalytics(searchQuery, results.size)
            
            SearchResponse(
                results = results,
                totalCount = results.size,
                facets = facets,
                suggestions = suggestions,
                queryTime = queryTime
            )
        } catch (e: Exception) {
            println("Search failed: ${e.message}")
            SearchResponse(
                results = emptyList(),
                totalCount = 0,
                facets = emptyMap(),
                suggestions = emptyList(),
                queryTime = System.currentTimeMillis() - startTime
            )
        }
    }

    private suspend fun searchLocal(searchQuery: SearchQuery): List<SearchResult> = withContext(Dispatchers.IO) {
        try {
            val db = dbHelper.readableDatabase
            val results = mutableListOf<SearchResult>()
            
            // Build FTS query
            val ftsQuery = buildFTSQuery(searchQuery.query)
            val whereClause = buildWhereClause(searchQuery.filters)
            val orderClause = buildOrderClause(searchQuery.sortBy)
            
            val sql = """
                SELECT id, title, description, type, 
                       rank, snippet($TABLE_SEARCH_INDEX, 1, '<b>', '</b>', '...', 32) as highlight
                FROM ${SearchDatabaseHelper.TABLE_SEARCH_INDEX}
                WHERE ${SearchDatabaseHelper.TABLE_SEARCH_INDEX} MATCH ?
                $whereClause
                $orderClause
                LIMIT ? OFFSET ?
            """.trimIndent()
            
            val cursor = db.rawQuery(sql, arrayOf(
                ftsQuery,
                searchQuery.limit.toString(),
                searchQuery.offset.toString()
            ))
            
            cursor.use {
                while (it.moveToNext()) {
                    val result = SearchResult(
                        id = it.getString(0),
                        title = it.getString(1),
                        description = it.getString(2),
                        type = it.getString(3),
                        score = it.getFloat(4),
                        highlights = listOf(it.getString(5) ?: "")
                    )
                    results.add(result)
                }
            }
            
            results
        } catch (e: Exception) {
            println("Local search failed: ${e.message}")
            emptyList()
        }
    }

    private suspend fun searchRemote(searchQuery: SearchQuery): List<SearchResult> = withContext(Dispatchers.IO) {
        try {
            val requestBody = json.encodeToString(SearchQuery.serializer(), searchQuery)
                .toRequestBody("application/json".toMediaType())

            val request = Request.Builder()
                .url("https://your-backend-url.com/api/search") // Replace with actual URL
                .addHeader("Content-Type", "application/json")
                .post(requestBody)
                .build()

            val response = httpClient.newCall(request).execute()
            if (!response.isSuccessful) {
                return@withContext emptyList()
            }

            val responseBody = response.body?.string() ?: return@withContext emptyList()
            val searchResponse = json.decodeFromString<SearchResponse>(responseBody)
            
            searchResponse.results
        } catch (e: Exception) {
            println("Remote search failed: ${e.message}")
            emptyList()
        }
    }

    private fun combineResults(
        localResults: List<SearchResult>,
        remoteResults: List<SearchResult>,
        limit: Int
    ): List<SearchResult> {
        val combined = mutableListOf<SearchResult>()
        val seenIds = mutableSetOf<String>()
        
        // Add local results first (they're more relevant for offline usage)
        localResults.forEach { result ->
            if (seenIds.add(result.id)) {
                combined.add(result)
            }
        }
        
        // Add remote results if we need more
        remoteResults.forEach { result ->
            if (combined.size < limit && seenIds.add(result.id)) {
                combined.add(result)
            }
        }
        
        return combined.take(limit)
    }

    private fun buildFTSQuery(query: String): String {
        // Clean and prepare query for FTS5
        val cleanQuery = query.trim()
            .replace(Regex("[^\\w\\s]"), " ")
            .replace(Regex("\\s+"), " ")
        
        return if (cleanQuery.contains(" ")) {
            "\"$cleanQuery\" OR ${cleanQuery.split(" ").joinToString(" OR ")}"
        } else {
            "$cleanQuery*"
        }
    }

    private fun buildWhereClause(filters: Map<String, String>): String {
        if (filters.isEmpty()) return ""
        
        val conditions = filters.map { (key, value) ->
            when (key) {
                "type" -> "type = '$value'"
                "category" -> "category = '$value'"
                "location" -> "location LIKE '%$value%'"
                "price_min" -> "CAST(price as INTEGER) >= $value"
                "price_max" -> "CAST(price as INTEGER) <= $value"
                else -> "1=1"
            }
        }
        
        return if (conditions.isNotEmpty()) {
            " AND " + conditions.joinToString(" AND ")
        } else ""
    }

    private fun buildOrderClause(sortBy: String): String {
        return when (sortBy) {
            "price_asc" -> "ORDER BY CAST(price as INTEGER) ASC"
            "price_desc" -> "ORDER BY CAST(price as INTEGER) DESC"
            "date_desc" -> "ORDER BY created_at DESC"
            "date_asc" -> "ORDER BY created_at ASC"
            else -> "ORDER BY rank"
        }
    }

    private fun generateFacets(results: List<SearchResult>): Map<String, List<FacetValue>> {
        val facets = mutableMapOf<String, MutableMap<String, Int>>()
        
        results.forEach { result ->
            // Type facet
            val typeMap = facets.getOrPut("type") { mutableMapOf() }
            typeMap[result.type] = typeMap.getOrDefault(result.type, 0) + 1
            
            // Category facet from metadata
            result.metadata["category"]?.let { category ->
                val categoryMap = facets.getOrPut("category") { mutableMapOf() }
                categoryMap[category] = categoryMap.getOrDefault(category, 0) + 1
            }
            
            // Location facet from metadata
            result.metadata["location"]?.let { location ->
                val locationMap = facets.getOrPut("location") { mutableMapOf() }
                locationMap[location] = locationMap.getOrDefault(location, 0) + 1
            }
        }
        
        return facets.mapValues { (_, valueMap) ->
            valueMap.map { (value, count) ->
                FacetValue(value, count)
            }.sortedByDescending { it.count }
        }
    }

    suspend fun indexContent(
        id: String,
        title: String,
        description: String,
        content: String,
        type: String,
        metadata: Map<String, String> = emptyMap()
    ): Boolean = withContext(Dispatchers.IO) {
        try {
            val db = dbHelper.writableDatabase
            
            val sql = """
                INSERT OR REPLACE INTO ${SearchDatabaseHelper.TABLE_SEARCH_INDEX}
                (id, title, description, content, type, category, tags, location, price, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """.trimIndent()
            
            db.execSQL(sql, arrayOf(
                id,
                title,
                description,
                content,
                type,
                metadata["category"] ?: "",
                metadata["tags"] ?: "",
                metadata["location"] ?: "",
                metadata["price"] ?: "",
                System.currentTimeMillis().toString()
            ))
            
            true
        } catch (e: Exception) {
            println("Content indexing failed: ${e.message}")
            false
        }
    }

    suspend fun removeFromIndex(id: String): Boolean = withContext(Dispatchers.IO) {
        try {
            val db = dbHelper.writableDatabase
            val rowsDeleted = db.delete(
                SearchDatabaseHelper.TABLE_SEARCH_INDEX,
                "id = ?",
                arrayOf(id)
            )
            rowsDeleted > 0
        } catch (e: Exception) {
            println("Content removal failed: ${e.message}")
            false
        }
    }

    private suspend fun getSuggestions(query: String): List<String> = withContext(Dispatchers.IO) {
        try {
            val db = dbHelper.readableDatabase
            val suggestions = mutableListOf<String>()
            
            val sql = """
                SELECT suggestion FROM ${SearchDatabaseHelper.TABLE_SEARCH_SUGGESTIONS}
                WHERE suggestion LIKE ?
                ORDER BY frequency DESC, last_used DESC
                LIMIT 5
            """.trimIndent()
            
            val cursor = db.rawQuery(sql, arrayOf("$query%"))
            cursor.use {
                while (it.moveToNext()) {
                    suggestions.add(it.getString(0))
                }
            }
            
            suggestions
        } catch (e: Exception) {
            println("Failed to get suggestions: ${e.message}")
            emptyList()
        }
    }

    suspend fun addSuggestion(suggestion: String): Boolean = withContext(Dispatchers.IO) {
        try {
            val db = dbHelper.writableDatabase
            
            val sql = """
                INSERT OR REPLACE INTO ${SearchDatabaseHelper.TABLE_SEARCH_SUGGESTIONS}
                (suggestion, frequency, last_used)
                VALUES (?, 
                    COALESCE((SELECT frequency FROM ${SearchDatabaseHelper.TABLE_SEARCH_SUGGESTIONS} WHERE suggestion = ?) + 1, 1),
                    ?)
            """.trimIndent()
            
            db.execSQL(sql, arrayOf(suggestion, suggestion, System.currentTimeMillis()))
            true
        } catch (e: Exception) {
            println("Failed to add suggestion: ${e.message}")
            false
        }
    }

    private suspend fun logSearchAnalytics(searchQuery: SearchQuery, resultCount: Int) = withContext(Dispatchers.IO) {
        try {
            val db = dbHelper.writableDatabase
            
            val sql = """
                INSERT INTO ${SearchDatabaseHelper.TABLE_SEARCH_ANALYTICS}
                (query, timestamp, result_count, user_id)
                VALUES (?, ?, ?, ?)
            """.trimIndent()
            
            db.execSQL(sql, arrayOf(
                searchQuery.query,
                System.currentTimeMillis(),
                resultCount,
                null // User ID would come from auth service
            ))
            
            // Also add query as suggestion
            addSuggestion(searchQuery.query)
        } catch (e: Exception) {
            println("Failed to log search analytics: ${e.message}")
        }
    }

    suspend fun getSearchAnalytics(days: Int = 7): Map<String, Any> = withContext(Dispatchers.IO) {
        try {
            val db = dbHelper.readableDatabase
            val cutoffTime = System.currentTimeMillis() - (days * 24 * 60 * 60 * 1000)
            
            // Top queries
            val topQueriesSql = """
                SELECT query, COUNT(*) as count
                FROM ${SearchDatabaseHelper.TABLE_SEARCH_ANALYTICS}
                WHERE timestamp > ?
                GROUP BY query
                ORDER BY count DESC
                LIMIT 10
            """.trimIndent()
            
            val topQueries = mutableListOf<Pair<String, Int>>()
            val cursor1 = db.rawQuery(topQueriesSql, arrayOf(cutoffTime.toString()))
            cursor1.use {
                while (it.moveToNext()) {
                    topQueries.add(Pair(it.getString(0), it.getInt(1)))
                }
            }
            
            // Search volume
            val volumeSql = """
                SELECT COUNT(*) as total_searches,
                       AVG(result_count) as avg_results
                FROM ${SearchDatabaseHelper.TABLE_SEARCH_ANALYTICS}
                WHERE timestamp > ?
            """.trimIndent()
            
            var totalSearches = 0
            var avgResults = 0.0
            val cursor2 = db.rawQuery(volumeSql, arrayOf(cutoffTime.toString()))
            cursor2.use {
                if (it.moveToFirst()) {
                    totalSearches = it.getInt(0)
                    avgResults = it.getDouble(1)
                }
            }
            
            mapOf(
                "topQueries" to topQueries,
                "totalSearches" to totalSearches,
                "averageResults" to avgResults,
                "period" to "${days}d"
            )
        } catch (e: Exception) {
            println("Failed to get search analytics: ${e.message}")
            emptyMap()
        }
    }

    // Specialized search functions for different content types
    suspend fun searchProducts(query: String, filters: Map<String, String> = emptyMap()): List<SearchResult> {
        val searchQuery = SearchQuery(
            query = query,
            filters = filters + ("type" to "product"),
            sortBy = "relevance"
        )
        return search(searchQuery).results
    }

    suspend fun searchMarkets(query: String, location: String? = null): List<SearchResult> {
        val filters = mutableMapOf("type" to "market")
        location?.let { filters["location"] = it }
        
        val searchQuery = SearchQuery(
            query = query,
            filters = filters,
            sortBy = "relevance"
        )
        return search(searchQuery).results
    }

    suspend fun searchFarmers(query: String, location: String? = null): List<SearchResult> {
        val filters = mutableMapOf("type" to "farmer")
        location?.let { filters["location"] = it }
        
        val searchQuery = SearchQuery(
            query = query,
            filters = filters,
            sortBy = "relevance"
        )
        return search(searchQuery).results
    }

    // Cleanup and maintenance
    suspend fun cleanupSearchData(): Boolean = withContext(Dispatchers.IO) {
        try {
            val db = dbHelper.writableDatabase
            val cutoffTime = System.currentTimeMillis() - (30 * 24 * 60 * 60 * 1000) // 30 days
            
            // Clean old analytics
            db.delete(
                SearchDatabaseHelper.TABLE_SEARCH_ANALYTICS,
                "timestamp < ?",
                arrayOf(cutoffTime.toString())
            )
            
            // Clean unused suggestions
            db.delete(
                SearchDatabaseHelper.TABLE_SEARCH_SUGGESTIONS,
                "last_used < ? AND frequency < 2",
                arrayOf(cutoffTime.toString())
            )
            
            // Optimize FTS index
            db.execSQL("INSERT INTO ${SearchDatabaseHelper.TABLE_SEARCH_INDEX}(${SearchDatabaseHelper.TABLE_SEARCH_INDEX}) VALUES('optimize')")
            
            true
        } catch (e: Exception) {
            println("Search cleanup failed: ${e.message}")
            false
        }
    }
}
