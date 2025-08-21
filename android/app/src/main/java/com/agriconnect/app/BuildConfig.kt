package com.agriconnect.app

object SecureConfig {
    init {
        System.loadLibrary("native-lib")
    }

    external fun getSupabaseUrl(): String
    external fun getSupabaseKey(): String
}
