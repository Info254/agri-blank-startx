package com.agriconnect.app.security

import android.util.Base64
import javax.crypto.Cipher
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec
import com.agriconnect.app.BuildConfig

object CredentialManager {
    private const val TRANSFORMATION = "AES/GCM/NoPadding"
    private const val TAG_LENGTH = 128

    fun getSupabaseUrl(): String {
        return decryptCredential(BuildConfig.SUPABASE_URL_ENCRYPTED)
    }

    fun getSupabaseKey(): String {
        return decryptCredential(BuildConfig.SUPABASE_KEY_ENCRYPTED)
    }

    private fun decryptCredential(encryptedValue: String): String {
        try {
            // Decode base64 encrypted value
            val encryptedData = Base64.decode(encryptedValue, Base64.DEFAULT)
            
            // Extract IV and encrypted content
            val ivSize = 12 // GCM IV size
            val iv = encryptedData.sliceArray(0..ivSize-1)
            val encrypted = encryptedData.sliceArray(ivSize until encryptedData.size)
            
            // Get or create secret key from Android Keystore
            val keyAlias = "agriconnect_credential_key"
            val keyGenerator = KeyGenerator.getInstance("AES")
            keyGenerator.init(256)
            val secretKey = keyGenerator.generateKey()
            
            // Decrypt using AES/GCM
            val cipher = Cipher.getInstance(TRANSFORMATION)
            val spec = GCMParameterSpec(TAG_LENGTH, iv)
            cipher.init(Cipher.DECRYPT_MODE, secretKey, spec)
            
            val decryptedBytes = cipher.doFinal(encrypted)
            return String(decryptedBytes, Charsets.UTF_8)
        } catch (e: Exception) {
            throw SecurityException("Failed to decrypt credential", e)
        }
    }
}
