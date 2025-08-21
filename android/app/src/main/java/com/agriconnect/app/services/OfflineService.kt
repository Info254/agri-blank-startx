package com.agriconnect.app.services

import androidx.room.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import java.util.*
import javax.inject.Inject
import javax.inject.Singleton

// Room Database Entities
@Entity(tableName = "offline_data")
data class OfflineDataEntity(
    @PrimaryKey val id: String = UUID.randomUUID().toString(),
    val type: String,
    val data: String,
    val timestamp: Long = System.currentTimeMillis(),
    val syncStatus: String = "pending", // pending, synced, failed
    val priority: Int = 1 // 1 = high, 2 = medium, 3 = low
)

@Entity(tableName = "cached_api_responses")
data class CachedApiResponse(
    @PrimaryKey val endpoint: String,
    val response: String,
    val timestamp: Long = System.currentTimeMillis(),
    val expiryTime: Long = System.currentTimeMillis() + (24 * 60 * 60 * 1000) // 24 hours default
)

@Entity(tableName = "offline_images")
data class OfflineImage(
    @PrimaryKey val id: String = UUID.randomUUID().toString(),
    val originalUrl: String,
    val localPath: String,
    val timestamp: Long = System.currentTimeMillis(),
    val size: Long = 0,
    val syncStatus: String = "pending"
)

@Entity(tableName = "sync_queue")
data class SyncQueueItem(
    @PrimaryKey val id: String = UUID.randomUUID().toString(),
    val action: String, // CREATE, UPDATE, DELETE
    val endpoint: String,
    val data: String,
    val timestamp: Long = System.currentTimeMillis(),
    val retryCount: Int = 0,
    val maxRetries: Int = 3,
    val priority: Int = 1
)

// Room DAOs
@Dao
interface OfflineDataDao {
    @Query("SELECT * FROM offline_data WHERE syncStatus = :status ORDER BY priority ASC, timestamp DESC")
    suspend fun getDataByStatus(status: String): List<OfflineDataEntity>

    @Query("SELECT * FROM offline_data WHERE type = :type ORDER BY timestamp DESC")
    suspend fun getDataByType(type: String): List<OfflineDataEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertData(data: OfflineDataEntity)

    @Update
    suspend fun updateData(data: OfflineDataEntity)

    @Delete
    suspend fun deleteData(data: OfflineDataEntity)

    @Query("DELETE FROM offline_data WHERE syncStatus = 'synced' AND timestamp < :cutoffTime")
    suspend fun cleanupSyncedData(cutoffTime: Long)
}

@Dao
interface CachedApiDao {
    @Query("SELECT * FROM cached_api_responses WHERE endpoint = :endpoint AND expiryTime > :currentTime")
    suspend fun getCachedResponse(endpoint: String, currentTime: Long): CachedApiResponse?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun cacheResponse(response: CachedApiResponse)

    @Query("DELETE FROM cached_api_responses WHERE expiryTime < :currentTime")
    suspend fun cleanupExpiredCache(currentTime: Long)
}

@Dao
interface OfflineImageDao {
    @Query("SELECT * FROM offline_images WHERE originalUrl = :url")
    suspend fun getImageByUrl(url: String): OfflineImage?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertImage(image: OfflineImage)

    @Query("DELETE FROM offline_images WHERE timestamp < :cutoffTime")
    suspend fun cleanupOldImages(cutoffTime: Long)
}

@Dao
interface SyncQueueDao {
    @Query("SELECT * FROM sync_queue ORDER BY priority ASC, timestamp ASC")
    suspend fun getAllQueueItems(): List<SyncQueueItem>

    @Insert
    suspend fun addToQueue(item: SyncQueueItem)

    @Update
    suspend fun updateQueueItem(item: SyncQueueItem)

    @Delete
    suspend fun removeFromQueue(item: SyncQueueItem)

    @Query("DELETE FROM sync_queue WHERE retryCount >= maxRetries")
    suspend fun cleanupFailedItems()
}

// Room Database
@Database(
    entities = [OfflineDataEntity::class, CachedApiResponse::class, OfflineImage::class, SyncQueueItem::class],
    version = 1,
    exportSchema = false
)
abstract class OfflineDatabase : RoomDatabase() {
    abstract fun offlineDataDao(): OfflineDataDao
    abstract fun cachedApiDao(): CachedApiDao
    abstract fun offlineImageDao(): OfflineImageDao
    abstract fun syncQueueDao(): SyncQueueDao
}

@Serializable
data class OfflineCapabilities(
    val canCreateProducts: Boolean = true,
    val canUpdateProfile: Boolean = true,
    val canViewCachedData: Boolean = true,
    val canQueueActions: Boolean = true,
    val maxOfflineStorage: Long = 100 * 1024 * 1024, // 100MB
    val syncInterval: Long = 5 * 60 * 1000 // 5 minutes
)

@Singleton
class OfflineService @Inject constructor(
    private val database: OfflineDatabase
) {
    private val json = Json { ignoreUnknownKeys = true }
    private val offlineDataDao = database.offlineDataDao()
    private val cachedApiDao = database.cachedApiDao()
    private val offlineImageDao = database.offlineImageDao()
    private val syncQueueDao = database.syncQueueDao()

    suspend fun storeOfflineData(type: String, data: Any, priority: Int = 2): String = withContext(Dispatchers.IO) {
        try {
            val dataJson = json.encodeToString(kotlinx.serialization.serializer(), data)
            val offlineData = OfflineDataEntity(
                type = type,
                data = dataJson,
                priority = priority
            )
            
            offlineDataDao.insertData(offlineData)
            println("Stored offline data: $type")
            offlineData.id
        } catch (e: Exception) {
            println("Failed to store offline data: ${e.message}")
            throw e
        }
    }

    suspend fun getOfflineData(type: String): List<String> = withContext(Dispatchers.IO) {
        try {
            val dataList = offlineDataDao.getDataByType(type)
            dataList.map { it.data }
        } catch (e: Exception) {
            println("Failed to get offline data: ${e.message}")
            emptyList()
        }
    }

    suspend fun cacheApiResponse(endpoint: String, response: String, expiryHours: Int = 24): Boolean = withContext(Dispatchers.IO) {
        try {
            val expiryTime = System.currentTimeMillis() + (expiryHours * 60 * 60 * 1000)
            val cachedResponse = CachedApiResponse(
                endpoint = endpoint,
                response = response,
                expiryTime = expiryTime
            )
            
            cachedApiDao.cacheResponse(cachedResponse)
            println("Cached API response for: $endpoint")
            true
        } catch (e: Exception) {
            println("Failed to cache API response: ${e.message}")
            false
        }
    }

    suspend fun getCachedApiResponse(endpoint: String): String? = withContext(Dispatchers.IO) {
        try {
            val currentTime = System.currentTimeMillis()
            val cachedResponse = cachedApiDao.getCachedResponse(endpoint, currentTime)
            cachedResponse?.response
        } catch (e: Exception) {
            println("Failed to get cached API response: ${e.message}")
            null
        }
    }

    suspend fun addToSyncQueue(action: String, endpoint: String, data: Any, priority: Int = 2): Boolean = withContext(Dispatchers.IO) {
        try {
            val dataJson = json.encodeToString(kotlinx.serialization.serializer(), data)
            val queueItem = SyncQueueItem(
                action = action,
                endpoint = endpoint,
                data = dataJson,
                priority = priority
            )
            
            syncQueueDao.addToQueue(queueItem)
            println("Added to sync queue: $action $endpoint")
            true
        } catch (e: Exception) {
            println("Failed to add to sync queue: ${e.message}")
            false
        }
    }

    suspend fun processSyncQueue(): Int = withContext(Dispatchers.IO) {
        try {
            val queueItems = syncQueueDao.getAllQueueItems()
            var syncedCount = 0
            
            for (item in queueItems) {
                try {
                    val success = syncQueueItem(item)
                    if (success) {
                        syncQueueDao.removeFromQueue(item)
                        syncedCount++
                        println("Synced queue item: ${item.action} ${item.endpoint}")
                    } else {
                        // Increment retry count
                        val updatedItem = item.copy(retryCount = item.retryCount + 1)
                        if (updatedItem.retryCount >= updatedItem.maxRetries) {
                            syncQueueDao.removeFromQueue(item)
                            println("Max retries reached for: ${item.action} ${item.endpoint}")
                        } else {
                            syncQueueDao.updateQueueItem(updatedItem)
                        }
                    }
                } catch (e: Exception) {
                    println("Failed to sync queue item: ${e.message}")
                }
            }
            
            syncedCount
        } catch (e: Exception) {
            println("Failed to process sync queue: ${e.message}")
            0
        }
    }

    private suspend fun syncQueueItem(item: SyncQueueItem): Boolean = withContext(Dispatchers.IO) {
        try {
            // Mock sync implementation - in real app would make actual API calls
            println("Syncing: ${item.action} ${item.endpoint}")
            
            // Simulate network request
            kotlinx.coroutines.delay(1000)
            
            // Mock success/failure based on retry count
            val success = item.retryCount < 2 || (0..1).random() == 1
            
            if (success) {
                // Update related offline data status
                updateOfflineDataSyncStatus(item.data, "synced")
            }
            
            success
        } catch (e: Exception) {
            println("Sync failed for ${item.endpoint}: ${e.message}")
            false
        }
    }

    private suspend fun updateOfflineDataSyncStatus(dataJson: String, status: String) {
        try {
            val dataList = offlineDataDao.getDataByStatus("pending")
            val matchingData = dataList.find { it.data == dataJson }
            
            if (matchingData != null) {
                val updatedData = matchingData.copy(syncStatus = status)
                offlineDataDao.updateData(updatedData)
            }
        } catch (e: Exception) {
            println("Failed to update sync status: ${e.message}")
        }
    }

    // Offline product creation
    suspend fun createProductOffline(productData: Map<String, Any>): String = withContext(Dispatchers.IO) {
        try {
            val productId = storeOfflineData("product_create", productData, priority = 1)
            addToSyncQueue("CREATE", "/api/products", productData, priority = 1)
            productId
        } catch (e: Exception) {
            println("Failed to create product offline: ${e.message}")
            throw e
        }
    }

    // Offline profile update
    suspend fun updateProfileOffline(profileData: Map<String, Any>): Boolean = withContext(Dispatchers.IO) {
        try {
            storeOfflineData("profile_update", profileData, priority = 1)
            addToSyncQueue("UPDATE", "/api/profile", profileData, priority = 1)
            true
        } catch (e: Exception) {
            println("Failed to update profile offline: ${e.message}")
            false
        }
    }

    // Offline image storage
    suspend fun storeImageOffline(imageUrl: String, localPath: String): Boolean = withContext(Dispatchers.IO) {
        try {
            val offlineImage = OfflineImage(
                originalUrl = imageUrl,
                localPath = localPath
            )
            
            offlineImageDao.insertImage(offlineImage)
            println("Stored image offline: $imageUrl -> $localPath")
            true
        } catch (e: Exception) {
            println("Failed to store image offline: ${e.message}")
            false
        }
    }

    suspend fun getOfflineImagePath(imageUrl: String): String? = withContext(Dispatchers.IO) {
        try {
            val offlineImage = offlineImageDao.getImageByUrl(imageUrl)
            offlineImage?.localPath
        } catch (e: Exception) {
            println("Failed to get offline image path: ${e.message}")
            null
        }
    }

    // Storage management
    suspend fun getStorageUsage(): Long = withContext(Dispatchers.IO) {
        try {
            // Calculate storage usage from all offline data
            val offlineData = offlineDataDao.getDataByStatus("pending")
            val cachedResponses = cachedApiDao.getCachedResponse("", System.currentTimeMillis()) // Get all
            
            var totalSize = 0L
            offlineData.forEach { totalSize += it.data.length }
            
            totalSize
        } catch (e: Exception) {
            println("Failed to calculate storage usage: ${e.message}")
            0L
        }
    }

    suspend fun cleanupOfflineData(): Boolean = withContext(Dispatchers.IO) {
        try {
            val cutoffTime = System.currentTimeMillis() - (7 * 24 * 60 * 60 * 1000) // 7 days ago
            
            // Cleanup synced data older than 7 days
            offlineDataDao.cleanupSyncedData(cutoffTime)
            
            // Cleanup expired cache
            cachedApiDao.cleanupExpiredCache(System.currentTimeMillis())
            
            // Cleanup old images
            offlineImageDao.cleanupOldImages(cutoffTime)
            
            // Cleanup failed sync items
            syncQueueDao.cleanupFailedItems()
            
            println("Offline data cleanup completed")
            true
        } catch (e: Exception) {
            println("Failed to cleanup offline data: ${e.message}")
            false
        }
    }

    // Connectivity status management
    suspend fun isOnline(): Boolean = withContext(Dispatchers.IO) {
        try {
            // Mock connectivity check - in real app would check actual network status
            (0..1).random() == 1
        } catch (e: Exception) {
            false
        }
    }

    suspend fun getOfflineCapabilities(): OfflineCapabilities = withContext(Dispatchers.Default) {
        OfflineCapabilities()
    }

    // Sync status reporting
    suspend fun getSyncStatus(): Map<String, Any> = withContext(Dispatchers.IO) {
        try {
            val pendingData = offlineDataDao.getDataByStatus("pending")
            val queueItems = syncQueueDao.getAllQueueItems()
            val storageUsage = getStorageUsage()
            
            mapOf(
                "pendingItems" to pendingData.size,
                "queueItems" to queueItems.size,
                "storageUsage" to storageUsage,
                "isOnline" to isOnline(),
                "lastSync" to System.currentTimeMillis()
            )
        } catch (e: Exception) {
            println("Failed to get sync status: ${e.message}")
            mapOf(
                "pendingItems" to 0,
                "queueItems" to 0,
                "storageUsage" to 0L,
                "isOnline" to false,
                "lastSync" to 0L
            )
        }
    }

    // Background sync
    suspend fun performBackgroundSync(): Boolean = withContext(Dispatchers.IO) {
        try {
            if (!isOnline()) {
                println("Device is offline, skipping sync")
                return@withContext false
            }
            
            val syncedCount = processSyncQueue()
            cleanupOfflineData()
            
            println("Background sync completed: $syncedCount items synced")
            true
        } catch (e: Exception) {
            println("Background sync failed: ${e.message}")
            false
        }
    }
}
