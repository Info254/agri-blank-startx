package com.agriconnect.app.services

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.google.firebase.messaging.FirebaseMessaging
import com.google.firebase.messaging.RemoteMessage
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
data class NotificationData(
    val title: String,
    val body: String,
    val type: String,
    val data: Map<String, String> = emptyMap(),
    val priority: String = "normal",
    val sound: String = "default",
    val badge: Int = 1
)

@Serializable
data class PushSubscription(
    val token: String,
    val userId: String,
    val deviceType: String = "android",
    val topics: List<String> = emptyList(),
    val preferences: NotificationPreferences = NotificationPreferences()
)

@Serializable
data class NotificationPreferences(
    val marketUpdates: Boolean = true,
    val priceAlerts: Boolean = true,
    val weatherAlerts: Boolean = true,
    val orderUpdates: Boolean = true,
    val paymentNotifications: Boolean = true,
    val promotions: Boolean = false,
    val quietHours: Boolean = true,
    val quietStart: String = "22:00",
    val quietEnd: String = "07:00"
)

@Singleton
class NotificationService @Inject constructor(
    private val context: Context
) {
    private val httpClient = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .build()

    private val json = Json { ignoreUnknownKeys = true }
    private val serverKey = "your_firebase_server_key" // Replace with actual server key
    private val fcmUrl = "https://fcm.googleapis.com/fcm/send"

    companion object {
        const val CHANNEL_ID_GENERAL = "general_notifications"
        const val CHANNEL_ID_MARKET = "market_updates"
        const val CHANNEL_ID_WEATHER = "weather_alerts"
        const val CHANNEL_ID_ORDERS = "order_updates"
        const val CHANNEL_ID_PAYMENTS = "payment_notifications"
        const val NOTIFICATION_ID_GENERAL = 1001
        const val NOTIFICATION_ID_MARKET = 1002
        const val NOTIFICATION_ID_WEATHER = 1003
        const val NOTIFICATION_ID_ORDERS = 1004
        const val NOTIFICATION_ID_PAYMENTS = 1005
    }

    init {
        createNotificationChannels()
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

            val channels = listOf(
                NotificationChannel(
                    CHANNEL_ID_GENERAL,
                    "General Notifications",
                    NotificationManager.IMPORTANCE_DEFAULT
                ).apply {
                    description = "General app notifications"
                },
                NotificationChannel(
                    CHANNEL_ID_MARKET,
                    "Market Updates",
                    NotificationManager.IMPORTANCE_DEFAULT
                ).apply {
                    description = "Market price and commodity updates"
                },
                NotificationChannel(
                    CHANNEL_ID_WEATHER,
                    "Weather Alerts",
                    NotificationManager.IMPORTANCE_HIGH
                ).apply {
                    description = "Weather warnings and farming alerts"
                },
                NotificationChannel(
                    CHANNEL_ID_ORDERS,
                    "Order Updates",
                    NotificationManager.IMPORTANCE_HIGH
                ).apply {
                    description = "Order status and delivery notifications"
                },
                NotificationChannel(
                    CHANNEL_ID_PAYMENTS,
                    "Payment Notifications",
                    NotificationManager.IMPORTANCE_HIGH
                ).apply {
                    description = "Payment confirmations and alerts"
                }
            )

            channels.forEach { channel ->
                notificationManager.createNotificationChannel(channel)
            }
        }
    }

    suspend fun initializePushNotifications(userId: String): String? = withContext(Dispatchers.IO) {
        try {
            val token = getFirebaseToken()
            if (token != null) {
                registerTokenWithServer(token, userId)
                subscribeToDefaultTopics()
            }
            token
        } catch (e: Exception) {
            println("Failed to initialize push notifications: ${e.message}")
            null
        }
    }

    private suspend fun getFirebaseToken(): String? = withContext(Dispatchers.IO) {
        try {
            var token: String? = null
            FirebaseMessaging.getInstance().token.addOnCompleteListener { task ->
                if (!task.isSuccessful) {
                    println("Fetching FCM registration token failed: ${task.exception}")
                    return@addOnCompleteListener
                }
                token = task.result
                println("FCM Registration Token: $token")
            }
            
            // Wait for token (in real implementation, use proper async handling)
            Thread.sleep(2000)
            token
        } catch (e: Exception) {
            println("Failed to get Firebase token: ${e.message}")
            null
        }
    }

    private suspend fun registerTokenWithServer(token: String, userId: String) = withContext(Dispatchers.IO) {
        try {
            val subscription = PushSubscription(
                token = token,
                userId = userId,
                deviceType = "android",
                topics = listOf("general", "market_updates", "weather_alerts")
            )

            val requestBody = json.encodeToString(PushSubscription.serializer(), subscription)
                .toRequestBody("application/json".toMediaType())

            val request = Request.Builder()
                .url("https://your-backend-url.com/api/notifications/register") // Replace with actual URL
                .addHeader("Content-Type", "application/json")
                .post(requestBody)
                .build()

            val response = httpClient.newCall(request).execute()
            if (response.isSuccessful) {
                println("Token registered successfully with server")
            } else {
                println("Failed to register token with server: ${response.code}")
            }
        } catch (e: Exception) {
            println("Failed to register token with server: ${e.message}")
        }
    }

    private fun subscribeToDefaultTopics() {
        val defaultTopics = listOf(
            "general",
            "market_updates",
            "weather_alerts",
            "farming_tips"
        )

        defaultTopics.forEach { topic ->
            FirebaseMessaging.getInstance().subscribeToTopic(topic)
                .addOnCompleteListener { task ->
                    if (task.isSuccessful) {
                        println("Subscribed to topic: $topic")
                    } else {
                        println("Failed to subscribe to topic: $topic")
                    }
                }
        }
    }

    suspend fun subscribeToTopic(topic: String): Boolean = withContext(Dispatchers.IO) {
        try {
            var success = false
            FirebaseMessaging.getInstance().subscribeToTopic(topic)
                .addOnCompleteListener { task ->
                    success = task.isSuccessful
                    if (success) {
                        println("Successfully subscribed to topic: $topic")
                    } else {
                        println("Failed to subscribe to topic: $topic")
                    }
                }
            
            // Wait for completion (in real implementation, use proper async handling)
            Thread.sleep(1000)
            success
        } catch (e: Exception) {
            println("Failed to subscribe to topic $topic: ${e.message}")
            false
        }
    }

    suspend fun unsubscribeFromTopic(topic: String): Boolean = withContext(Dispatchers.IO) {
        try {
            var success = false
            FirebaseMessaging.getInstance().unsubscribeFromTopic(topic)
                .addOnCompleteListener { task ->
                    success = task.isSuccessful
                    if (success) {
                        println("Successfully unsubscribed from topic: $topic")
                    } else {
                        println("Failed to unsubscribe from topic: $topic")
                    }
                }
            
            // Wait for completion
            Thread.sleep(1000)
            success
        } catch (e: Exception) {
            println("Failed to unsubscribe from topic $topic: ${e.message}")
            false
        }
    }

    fun showLocalNotification(notificationData: NotificationData) {
        try {
            val channelId = getChannelIdForType(notificationData.type)
            val notificationId = getNotificationIdForType(notificationData.type)

            val intent = Intent(context, Class.forName("com.agriconnect.app.MainActivity"))
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            
            // Add notification data to intent
            notificationData.data.forEach { (key, value) ->
                intent.putExtra(key, value)
            }

            val pendingIntent = PendingIntent.getActivity(
                context, 
                0, 
                intent, 
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val notification = NotificationCompat.Builder(context, channelId)
                .setSmallIcon(android.R.drawable.ic_dialog_info) // Replace with app icon
                .setContentTitle(notificationData.title)
                .setContentText(notificationData.body)
                .setPriority(getPriorityForType(notificationData.priority))
                .setContentIntent(pendingIntent)
                .setAutoCancel(true)
                .setNumber(notificationData.badge)
                .build()

            NotificationManagerCompat.from(context).notify(notificationId, notification)
            
        } catch (e: Exception) {
            println("Failed to show local notification: ${e.message}")
        }
    }

    fun handleRemoteMessage(remoteMessage: RemoteMessage) {
        try {
            val title = remoteMessage.notification?.title ?: "AgriConnect"
            val body = remoteMessage.notification?.body ?: ""
            val data = remoteMessage.data
            val type = data["type"] ?: "general"

            val notificationData = NotificationData(
                title = title,
                body = body,
                type = type,
                data = data,
                priority = data["priority"] ?: "normal"
            )

            showLocalNotification(notificationData)
            
            // Handle specific notification actions
            handleNotificationAction(type, data)
            
        } catch (e: Exception) {
            println("Failed to handle remote message: ${e.message}")
        }
    }

    private fun handleNotificationAction(type: String, data: Map<String, String>) {
        when (type) {
            "market_update" -> {
                // Handle market update notification
                val commodity = data["commodity"]
                val price = data["price"]
                println("Market update: $commodity - $price")
            }
            "weather_alert" -> {
                // Handle weather alert notification
                val severity = data["severity"]
                val location = data["location"]
                println("Weather alert: $severity in $location")
            }
            "order_update" -> {
                // Handle order update notification
                val orderId = data["order_id"]
                val status = data["status"]
                println("Order update: $orderId - $status")
            }
            "payment_notification" -> {
                // Handle payment notification
                val amount = data["amount"]
                val status = data["status"]
                println("Payment notification: $amount - $status")
            }
        }
    }

    private fun getChannelIdForType(type: String): String {
        return when (type) {
            "market_update" -> CHANNEL_ID_MARKET
            "weather_alert" -> CHANNEL_ID_WEATHER
            "order_update" -> CHANNEL_ID_ORDERS
            "payment_notification" -> CHANNEL_ID_PAYMENTS
            else -> CHANNEL_ID_GENERAL
        }
    }

    private fun getNotificationIdForType(type: String): Int {
        return when (type) {
            "market_update" -> NOTIFICATION_ID_MARKET
            "weather_alert" -> NOTIFICATION_ID_WEATHER
            "order_update" -> NOTIFICATION_ID_ORDERS
            "payment_notification" -> NOTIFICATION_ID_PAYMENTS
            else -> NOTIFICATION_ID_GENERAL
        }
    }

    private fun getPriorityForType(priority: String): Int {
        return when (priority) {
            "high" -> NotificationCompat.PRIORITY_HIGH
            "low" -> NotificationCompat.PRIORITY_LOW
            else -> NotificationCompat.PRIORITY_DEFAULT
        }
    }

    // Notification preferences management
    suspend fun updateNotificationPreferences(
        userId: String,
        preferences: NotificationPreferences
    ): Boolean = withContext(Dispatchers.IO) {
        try {
            val requestBody = json.encodeToString(NotificationPreferences.serializer(), preferences)
                .toRequestBody("application/json".toMediaType())

            val request = Request.Builder()
                .url("https://your-backend-url.com/api/notifications/preferences/$userId")
                .addHeader("Content-Type", "application/json")
                .put(requestBody)
                .build()

            val response = httpClient.newCall(request).execute()
            response.isSuccessful
        } catch (e: Exception) {
            println("Failed to update notification preferences: ${e.message}")
            false
        }
    }

    // Send notification to specific user (admin function)
    suspend fun sendNotificationToUser(
        userId: String,
        notificationData: NotificationData
    ): Boolean = withContext(Dispatchers.IO) {
        try {
            val payload = mapOf(
                "to" to "/topics/user_$userId",
                "notification" to mapOf(
                    "title" to notificationData.title,
                    "body" to notificationData.body,
                    "sound" to notificationData.sound
                ),
                "data" to notificationData.data,
                "priority" to "high"
            )

            val requestBody = json.encodeToString(kotlinx.serialization.serializer(), payload)
                .toRequestBody("application/json".toMediaType())

            val request = Request.Builder()
                .url(fcmUrl)
                .addHeader("Authorization", "key=$serverKey")
                .addHeader("Content-Type", "application/json")
                .post(requestBody)
                .build()

            val response = httpClient.newCall(request).execute()
            response.isSuccessful
        } catch (e: Exception) {
            println("Failed to send notification to user: ${e.message}")
            false
        }
    }

    // Send notification to topic
    suspend fun sendNotificationToTopic(
        topic: String,
        notificationData: NotificationData
    ): Boolean = withContext(Dispatchers.IO) {
        try {
            val payload = mapOf(
                "to" to "/topics/$topic",
                "notification" to mapOf(
                    "title" to notificationData.title,
                    "body" to notificationData.body,
                    "sound" to notificationData.sound
                ),
                "data" to notificationData.data,
                "priority" to "high"
            )

            val requestBody = json.encodeToString(kotlinx.serialization.serializer(), payload)
                .toRequestBody("application/json".toMediaType())

            val request = Request.Builder()
                .url(fcmUrl)
                .addHeader("Authorization", "key=$serverKey")
                .addHeader("Content-Type", "application/json")
                .post(requestBody)
                .build()

            val response = httpClient.newCall(request).execute()
            response.isSuccessful
        } catch (e: Exception) {
            println("Failed to send notification to topic: ${e.message}")
            false
        }
    }

    // Utility functions for common notification types
    fun sendMarketUpdateNotification(commodity: String, price: String, change: String) {
        val notificationData = NotificationData(
            title = "Market Update",
            body = "$commodity: KES $price ($change)",
            type = "market_update",
            data = mapOf(
                "commodity" to commodity,
                "price" to price,
                "change" to change
            ),
            priority = "normal"
        )
        showLocalNotification(notificationData)
    }

    fun sendWeatherAlertNotification(message: String, severity: String, location: String) {
        val notificationData = NotificationData(
            title = "Weather Alert",
            body = message,
            type = "weather_alert",
            data = mapOf(
                "severity" to severity,
                "location" to location
            ),
            priority = "high"
        )
        showLocalNotification(notificationData)
    }

    fun sendOrderUpdateNotification(orderId: String, status: String, message: String) {
        val notificationData = NotificationData(
            title = "Order Update",
            body = message,
            type = "order_update",
            data = mapOf(
                "order_id" to orderId,
                "status" to status
            ),
            priority = "high"
        )
        showLocalNotification(notificationData)
    }

    fun sendPaymentNotification(amount: String, status: String, message: String) {
        val notificationData = NotificationData(
            title = "Payment Notification",
            body = message,
            type = "payment_notification",
            data = mapOf(
                "amount" to amount,
                "status" to status
            ),
            priority = "high"
        )
        showLocalNotification(notificationData)
    }
}
