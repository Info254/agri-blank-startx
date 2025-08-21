package com.agriconnect.app.data.repository

import com.agriconnect.app.data.model.*
import com.agriconnect.app.viewmodel.ReportSuspiciousActivityData
import com.agriconnect.app.viewmodel.SellerSafetyData
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.postgrest.from
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class FraudDetectionRepository @Inject constructor(
    private val supabaseClient: SupabaseClient
) {

    suspend fun getUserTrustScore(userId: String): TrustScore? {
        return try {
            supabaseClient.from("trust_scores")
                .select()
                .eq("user_id", userId)
                .decodeSingleOrNull<TrustScore>()
        } catch (e: Exception) {
            null
        }
    }

    suspend fun getUserFraudAlerts(userId: String): List<FraudAlert> {
        return try {
            supabaseClient.from("fraud_alerts")
                .select()
                .eq("user_id", userId)
                .eq("status", AlertStatus.ACTIVE.name.lowercase())
                .order("created_at", ascending = false)
                .decode<List<FraudAlert>>()
        } catch (e: Exception) {
            emptyList()
        }
    }

    suspend fun reportSuspiciousActivity(activityData: ReportSuspiciousActivityData): Result<Unit> {
        return try {
            supabaseClient.from("fraud_alerts")
                .insert(
                    mapOf(
                        "user_id" to activityData.suspectedUserId,
                        "alert_type" to when(activityData.activityType) {
                            com.agriconnect.app.viewmodel.SuspiciousActivityType.FAKE_LISTINGS -> FraudAlertType.FAKE_SELLER
                            com.agriconnect.app.viewmodel.SuspiciousActivityType.PAYMENT_FRAUD -> FraudAlertType.SUSPICIOUS_PAYMENT
                            com.agriconnect.app.viewmodel.SuspiciousActivityType.IDENTITY_THEFT -> FraudAlertType.IDENTITY_THEFT
                            else -> FraudAlertType.FAKE_SELLER
                        }.name.lowercase(),
                        "severity" to AlertSeverity.HIGH.name.lowercase(),
                        "description" to activityData.description,
                        "evidence" to mapOf("files" to activityData.evidence, "reporter_id" to activityData.reporterId),
                        "status" to AlertStatus.ACTIVE.name.lowercase()
                    )
                )

            Result.Success(Unit)
        } catch (e: Exception) {
            Result.Error(e)
        }
    }

    suspend fun getSellerSafetyData(sellerId: String): SellerSafetyData {
        return try {
            val verification = supabaseClient.from("seller_verifications")
                .select()
                .eq("seller_id", sellerId)
                .decodeSingleOrNull<SellerVerification>()

            val profile = supabaseClient.from("user_profiles")
                .select()
                .eq("id", sellerId)
                .decodeSingleOrNull<UserProfile>()

            val disputes = supabaseClient.from("transaction_disputes")
                .select()
                .eq("respondent_id", sellerId)
                .decode<List<TransactionDispute>>()

            val fraudAlerts = supabaseClient.from("fraud_alerts")
                .select()
                .eq("user_id", sellerId)
                .eq("status", AlertStatus.ACTIVE.name.lowercase())
                .decode<List<FraudAlert>>()

            SellerSafetyData(
                sellerId = sellerId,
                verificationLevel = verification?.verificationLevel ?: VerificationLevel.UNVERIFIED,
                rating = profile?.rating ?: 0.0,
                accountAgeDays = calculateAccountAge(profile?.createdAt ?: ""),
                disputeCount = disputes.size,
                fraudAlertCount = fraudAlerts.size,
                trustScore = verification?.verificationScore ?: 0.0,
                pricesBelowMarket = 0 // This would need market price analysis
            )
        } catch (e: Exception) {
            SellerSafetyData(
                sellerId = sellerId,
                verificationLevel = VerificationLevel.UNVERIFIED,
                rating = 0.0,
                accountAgeDays = 0,
                disputeCount = 0,
                fraudAlertCount = 1, // Assume risk if we can't verify
                trustScore = 0.0,
                pricesBelowMarket = 0
            )
        }
    }

    private fun calculateAccountAge(createdAt: String): Int {
        // Simple calculation - in production would use proper date parsing
        return try {
            30 // Default to 30 days for now
        } catch (e: Exception) {
            0
        }
    }
}
