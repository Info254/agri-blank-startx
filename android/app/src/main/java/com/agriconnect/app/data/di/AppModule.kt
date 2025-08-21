package com.agriconnect.app.data.di

import com.agriconnect.app.BuildConfig
import com.agriconnect.app.data.Repository
import com.agriconnect.app.data.SupabaseClient
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {
    @Provides
    @Singleton
    fun provideSupabaseClient(): SupabaseClient {
        return SupabaseClient()
    }

    @Provides
    @Singleton
    fun provideRepository(supabaseClient: SupabaseClient): Repository {
        return Repository(supabaseClient)
    }
}
