package com.agriconnect.app.security

import android.content.Context
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKeys
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class SecureCredentialManager @Inject constructor(
    @ApplicationContext private val context: Context
) {
    private val masterKeyAlias = MasterKeys.getOrCreate(MasterKeys.AES256_GCM_SPEC)

    private val encryptedPrefs by lazy {
        EncryptedSharedPreferences.create(
            "secure_credentials",
            masterKeyAlias,
            context,
            EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
            EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
        )
    }

    fun storeCredentials(supabaseUrl: String, supabaseKey: String) {
        encryptedPrefs.edit()
            .putString(KEY_SUPABASE_URL, supabaseUrl)
            .putString(KEY_SUPABASE_KEY, supabaseKey)
            .apply()
    }

    fun getSupabaseUrl(): String = encryptedPrefs.getString(KEY_SUPABASE_URL, "") ?: ""
    fun getSupabaseKey(): String = encryptedPrefs.getString(KEY_SUPABASE_KEY, "") ?: ""

    companion object {
        private const val KEY_SUPABASE_URL = "supabase_url"
        private const val KEY_SUPABASE_KEY = "supabase_key"
    }
}
