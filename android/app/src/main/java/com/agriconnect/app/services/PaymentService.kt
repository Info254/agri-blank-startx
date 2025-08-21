package com.agriconnect.app.services

import android.content.Context
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import java.text.SimpleDateFormat
import java.util.*
import java.util.concurrent.TimeUnit
import javax.inject.Inject
import javax.inject.Singleton
import android.util.Base64

@Serializable
data class PaymentRequest(
    val amount: Float,
    val phoneNumber: String,
    val accountReference: String,
    val transactionDesc: String,
    val callbackUrl: String? = null
)

@Serializable
data class PaymentResponse(
    val merchantRequestID: String,
    val checkoutRequestID: String,
    val responseCode: String,
    val responseDescription: String,
    val customerMessage: String
)

@Serializable
data class PaymentStatus(
    val merchantRequestID: String,
    val checkoutRequestID: String,
    val resultCode: String,
    val resultDesc: String,
    val amount: Float? = null,
    val mpesaReceiptNumber: String? = null,
    val transactionDate: String? = null,
    val phoneNumber: String? = null
)

@Serializable
data class EscrowTransaction(
    val id: String,
    val buyerId: String,
    val sellerId: String,
    val amount: Float,
    val productId: String,
    val status: String,
    val createdAt: String,
    val holdUntil: String
)

@Singleton
class PaymentService @Inject constructor(
    private val context: Context
) {
    private val httpClient = OkHttpClient.Builder()
        .connectTimeout(60, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)
        .build()

    private val json = Json { ignoreUnknownKeys = true }
    
    // M-Pesa configuration
    private val consumerKey = "your_mpesa_consumer_key" // Replace with actual key
    private val consumerSecret = "your_mpesa_consumer_secret" // Replace with actual secret
    private val businessShortCode = "174379" // Replace with actual shortcode
    private val passkey = "your_mpesa_passkey" // Replace with actual passkey
    private val baseUrl = "https://sandbox.safaricom.co.ke" // Use production URL for live

    suspend fun initiateSTKPush(paymentRequest: PaymentRequest): PaymentResponse = withContext(Dispatchers.IO) {
        try {
            val accessToken = getAccessToken()
            val timestamp = generateTimestamp()
            val password = generatePassword(timestamp)

            val stkPushData = mapOf(
                "BusinessShortCode" to businessShortCode,
                "Password" to password,
                "Timestamp" to timestamp,
                "TransactionType" to "CustomerPayBillOnline",
                "Amount" to paymentRequest.amount.toInt(),
                "PartyA" to formatPhoneNumber(paymentRequest.phoneNumber),
                "PartyB" to businessShortCode,
                "PhoneNumber" to formatPhoneNumber(paymentRequest.phoneNumber),
                "CallBackURL" to (paymentRequest.callbackUrl ?: "https://your-callback-url.com/callback"),
                "AccountReference" to paymentRequest.accountReference,
                "TransactionDesc" to paymentRequest.transactionDesc
            )

            val requestBody = json.encodeToString(kotlinx.serialization.serializer(), stkPushData)
                .toRequestBody("application/json".toMediaType())

            val request = Request.Builder()
                .url("$baseUrl/mpesa/stkpush/v1/processrequest")
                .addHeader("Authorization", "Bearer $accessToken")
                .addHeader("Content-Type", "application/json")
                .post(requestBody)
                .build()

            val response = httpClient.newCall(request).execute()
            val responseBody = response.body?.string() ?: throw Exception("Empty response")

            if (!response.isSuccessful) {
                throw Exception("M-Pesa API error: ${response.code} - $responseBody")
            }

            // Parse response
            val responseMap = json.decodeFromString<Map<String, String>>(responseBody)
            
            val paymentResponse = PaymentResponse(
                merchantRequestID = responseMap["MerchantRequestID"] ?: "",
                checkoutRequestID = responseMap["CheckoutRequestID"] ?: "",
                responseCode = responseMap["ResponseCode"] ?: "",
                responseDescription = responseMap["ResponseDescription"] ?: "",
                customerMessage = responseMap["CustomerMessage"] ?: ""
            )

            // Store transaction for tracking
            storeTransaction(paymentResponse, paymentRequest)

            paymentResponse
        } catch (e: Exception) {
            println("STK Push failed: ${e.message}")
            throw e
        }
    }

    suspend fun checkTransactionStatus(checkoutRequestID: String): PaymentStatus = withContext(Dispatchers.IO) {
        try {
            val accessToken = getAccessToken()
            val timestamp = generateTimestamp()
            val password = generatePassword(timestamp)

            val queryData = mapOf(
                "BusinessShortCode" to businessShortCode,
                "Password" to password,
                "Timestamp" to timestamp,
                "CheckoutRequestID" to checkoutRequestID
            )

            val requestBody = json.encodeToString(kotlinx.serialization.serializer(), queryData)
                .toRequestBody("application/json".toMediaType())

            val request = Request.Builder()
                .url("$baseUrl/mpesa/stkpushquery/v1/query")
                .addHeader("Authorization", "Bearer $accessToken")
                .addHeader("Content-Type", "application/json")
                .post(requestBody)
                .build()

            val response = httpClient.newCall(request).execute()
            val responseBody = response.body?.string() ?: throw Exception("Empty response")

            if (!response.isSuccessful) {
                throw Exception("M-Pesa query error: ${response.code} - $responseBody")
            }

            // Parse response
            val responseMap = json.decodeFromString<Map<String, String>>(responseBody)
            
            val paymentStatus = PaymentStatus(
                merchantRequestID = responseMap["MerchantRequestID"] ?: "",
                checkoutRequestID = responseMap["CheckoutRequestID"] ?: "",
                resultCode = responseMap["ResultCode"] ?: "",
                resultDesc = responseMap["ResultDesc"] ?: ""
            )

            // Update transaction status
            updateTransactionStatus(checkoutRequestID, paymentStatus)

            paymentStatus
        } catch (e: Exception) {
            println("Transaction status check failed: ${e.message}")
            throw e
        }
    }

    private suspend fun getAccessToken(): String = withContext(Dispatchers.IO) {
        try {
            val credentials = "$consumerKey:$consumerSecret"
            val auth = Base64.encodeToString(credentials.toByteArray(), Base64.NO_WRAP)
            
            val request = Request.Builder()
                .url("$baseUrl/oauth/v1/generate?grant_type=client_credentials")
                .addHeader("Authorization", "Basic $auth")
                .get()
                .build()

            val response = httpClient.newCall(request).execute()
            val responseBody = response.body?.string() ?: throw Exception("Empty response")

            if (!response.isSuccessful) {
                throw Exception("Failed to get access token: ${response.code} - $responseBody")
            }

            val responseMap = json.decodeFromString<Map<String, String>>(responseBody)
            responseMap["access_token"] ?: throw Exception("No access token in response")
        } catch (e: Exception) {
            println("Failed to get M-Pesa access token: ${e.message}")
            throw e
        }
    }

    private fun generateTimestamp(): String {
        val dateFormat = SimpleDateFormat("yyyyMMddHHmmss", Locale.getDefault())
        return dateFormat.format(Date())
    }

    private fun generatePassword(timestamp: String): String {
        val data = "$businessShortCode$passkey$timestamp"
        return Base64.encodeToString(data.toByteArray(), Base64.NO_WRAP)
    }

    private fun storeTransaction(paymentResponse: PaymentResponse, paymentRequest: PaymentRequest) {
        // Store transaction in local database or send to backend
        // This would typically use Room database or API call
        println("Storing transaction: ${paymentResponse.checkoutRequestID}")
    }

    private fun updateTransactionStatus(checkoutRequestID: String, status: PaymentStatus) {
        // Update transaction status in local database or backend
        println("Updating transaction status: $checkoutRequestID - ${status.resultCode}")
    }

    // Escrow functionality for buyer protection
    suspend fun createEscrowTransaction(
        buyerId: String,
        sellerId: String,
        amount: Float,
        productId: String,
        phoneNumber: String
    ): PaymentResponse = withContext(Dispatchers.IO) {
        try {
            // Create escrow record first
            val escrowId = createEscrowRecord(buyerId, sellerId, amount, productId)
            
            // Initiate M-Pesa payment
            val paymentRequest = PaymentRequest(
                amount = amount,
                phoneNumber = phoneNumber,
                accountReference = "ESCROW-$escrowId",
                transactionDesc = "Escrow payment for product $productId"
            )

            initiateSTKPush(paymentRequest)
        } catch (e: Exception) {
            println("Escrow transaction failed: ${e.message}")
            throw e
        }
    }

    private fun createEscrowRecord(
        buyerId: String,
        sellerId: String,
        amount: Float,
        productId: String
    ): String {
        val escrowId = UUID.randomUUID().toString()
        val currentTime = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.getDefault()).format(Date())
        val holdUntil = Calendar.getInstance().apply {
            add(Calendar.DAY_OF_YEAR, 7) // 7 days hold
        }
        val holdUntilString = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.getDefault()).format(holdUntil.time)

        val escrowRecord = EscrowTransaction(
            id = escrowId,
            buyerId = buyerId,
            sellerId = sellerId,
            amount = amount,
            productId = productId,
            status = "pending_payment",
            createdAt = currentTime,
            holdUntil = holdUntilString
        )

        // Store escrow record (would typically use database or API)
        println("Created escrow record: $escrowId")
        
        return escrowId
    }

    suspend fun releaseEscrowFunds(escrowId: String, deliveryConfirmed: Boolean): Boolean = withContext(Dispatchers.IO) {
        try {
            val status = if (deliveryConfirmed) "completed" else "refunded"
            
            // Update escrow status (would typically use database or API)
            println("Escrow funds $status for transaction $escrowId")
            
            // In a real implementation, this would trigger actual fund transfer
            true
        } catch (e: Exception) {
            println("Escrow release failed: ${e.message}")
            false
        }
    }

    // Utility methods for payment validation
    fun validatePhoneNumber(phoneNumber: String): Boolean {
        val kenyanPhoneRegex = Regex("""^(?:\+254|254|0)?([17]\d{8})$""")
        return kenyanPhoneRegex.matches(phoneNumber)
    }

    fun formatPhoneNumber(phoneNumber: String): String {
        val cleaned = phoneNumber.replace(Regex("""[^\d]"""), "")
        return when {
            cleaned.startsWith("0") -> "254${cleaned.substring(1)}"
            cleaned.startsWith("254") -> cleaned
            else -> "254$cleaned"
        }
    }

    fun validateAmount(amount: Float): Boolean {
        return amount >= 1f && amount <= 70000f // M-Pesa limits
    }

    // Payment security features
    fun generateSecureReference(): String {
        return "AGR-${System.currentTimeMillis()}-${(1000..9999).random()}"
    }

    suspend fun validateTransaction(
        amount: Float,
        sellerId: String,
        productId: String
    ): ValidationResult = withContext(Dispatchers.Default) {
        val warnings = mutableListOf<String>()
        var riskLevel = "LOW"

        // Amount validation
        if (amount > 100000f) {
            warnings.add("💰 HIGH VALUE transaction alert (>KES 100,000)")
            riskLevel = "HIGH"
        }

        // Seller validation (mock - would check actual seller data)
        val sellerRisk = validateSeller(sellerId)
        warnings.addAll(sellerRisk.warnings)
        if (sellerRisk.riskLevel == "HIGH") riskLevel = "HIGH"

        ValidationResult(
            isValid = warnings.isEmpty() || riskLevel != "CRITICAL",
            warnings = warnings,
            riskLevel = riskLevel,
            recommendations = generateSecurityRecommendations(riskLevel)
        )
    }

    private fun validateSeller(sellerId: String): ValidationResult {
        // Mock seller validation - in real app would check database
        val warnings = mutableListOf<String>()
        var riskLevel = "LOW"

        // Simulate seller checks
        val isNewSeller = (0..1).random() == 1
        val hasLowRating = (0..1).random() == 1
        val isUnverified = (0..1).random() == 1

        if (isNewSeller) {
            warnings.add("🆕 NEW SELLER account warning (<30 days)")
            riskLevel = "MEDIUM"
        }

        if (hasLowRating) {
            warnings.add("⭐ LOW RATING seller alert (<3.0 stars)")
            riskLevel = "MEDIUM"
        }

        if (isUnverified) {
            warnings.add("⚠️ UNVERIFIED SELLER warning")
            riskLevel = "HIGH"
        }

        return ValidationResult(
            isValid = riskLevel != "CRITICAL",
            warnings = warnings,
            riskLevel = riskLevel,
            recommendations = emptyList()
        )
    }

    private fun generateSecurityRecommendations(riskLevel: String): List<String> {
        val baseRecommendations = listOf(
            "🚫 NEVER PAY OUTSIDE THE PLATFORM",
            "🚫 Don't send money via M-Pesa directly to sellers",
            "🚫 Don't pay before delivery confirmation",
            "✅ Always use escrow payment system",
            "✅ Inspect goods before confirming delivery",
            "✅ Report issues immediately for protection"
        )

        return when (riskLevel) {
            "HIGH" -> baseRecommendations + listOf(
                "⚠️ EXTRA CAUTION: This transaction has high risk factors",
                "📞 Consider contacting seller directly before payment",
                "🛡️ Use escrow payment for maximum protection"
            )
            "MEDIUM" -> baseRecommendations + listOf(
                "⚠️ MODERATE RISK: Please review seller details carefully"
            )
            else -> baseRecommendations
        }
    }
}

@Serializable
data class ValidationResult(
    val isValid: Boolean,
    val warnings: List<String>,
    val riskLevel: String,
    val recommendations: List<String>
)
