package com.agriconnect.app.data.repository

import com.agriconnect.app.data.model.UserProfile
import com.agriconnect.app.supabase
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

sealed class Result<out T> {
    data class Success<out T>(val data: T) : Result<T>()
    data class Error(val exception: Exception) : Result<Nothing>()
    object Loading : Result<Nothing>()
}

class AuthRepository {
    suspend fun register(email: String, password: String, fullName: String, role: String = "user"): Result<UserProfile> = try {
        val authResult = withContext(Dispatchers.IO) {
            supabase.auth.signUpWith("email", email, password)
        }
        if (authResult.error != null) throw Exception(authResult.error.message)
        val userId = authResult.user?.id ?: throw Exception("No user ID returned")
        val profile = UserProfile(
            id = userId,
            fullName = fullName,
            email = email,
            role = role
        )
        val profileResult = withContext(Dispatchers.IO) {
            supabase.from("profiles").insert(profile).decodeSingle<UserProfile>()
        }
        Result.Success(profileResult)
    } catch (e: Exception) {
        Result.Error(e)
    }

    suspend fun login(email: String, password: String): Result<UserProfile> = try {
        val authResult = withContext(Dispatchers.IO) {
            supabase.auth.signInWith("email", email, password)
        }
        if (authResult.error != null) throw Exception(authResult.error.message)
        val userId = authResult.user?.id ?: throw Exception("No user ID returned")
        val profile = withContext(Dispatchers.IO) {
            supabase.from("profiles").select().eq("id", userId).decodeSingle<UserProfile>()
        }
        Result.Success(profile)
    } catch (e: Exception) {
        Result.Error(e)
    }

    suspend fun logout(): Result<Unit> = try {
        withContext(Dispatchers.IO) {
            supabase.auth.signOut()
        }
        Result.Success(Unit)
    } catch (e: Exception) {
        Result.Error(e)
    }

    suspend fun resetPassword(email: String): Result<Unit> = try {
        withContext(Dispatchers.IO) {
            supabase.auth.resetPasswordForEmail(email)
        }
        Result.Success(Unit)
    } catch (e: Exception) {
        Result.Error(e)
    }

    suspend fun updateProfile(updates: Map<String, Any>): Result<UserProfile> = try {
        val userId = supabase.auth.currentUser?.id ?: throw Exception("No user logged in")
        val updated = withContext(Dispatchers.IO) {
            supabase.from("profiles").update(updates).eq("id", userId).decodeSingle<UserProfile>()
        }
        Result.Success(updated)
    } catch (e: Exception) {
        Result.Error(e)
    }

    suspend fun getSession(): Result<UserProfile?> = try {
        val user = supabase.auth.currentUser
        if (user == null) return Result.Success(null)
        val profile = withContext(Dispatchers.IO) {
            supabase.from("profiles").select().eq("id", user.id).decodeSingle<UserProfile>()
        }
        Result.Success(profile)
    } catch (e: Exception) {
        Result.Error(e)
    }
} 