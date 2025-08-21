package com.agriconnect.app.di

import android.content.Context
import androidx.room.Room
import com.agriconnect.app.services.*
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object ServiceModule {

    @Provides
    @Singleton
    fun provideOfflineDatabase(@ApplicationContext context: Context): OfflineDatabase {
        return Room.databaseBuilder(
            context,
            OfflineDatabase::class.java,
            "offline_database"
        ).build()
    }

    @Provides
    @Singleton
    fun provideMLService(@ApplicationContext context: Context): MLService {
        return MLService(context)
    }

    @Provides
    @Singleton
    fun provideOCRService(@ApplicationContext context: Context): OCRService {
        return OCRService(context)
    }

    @Provides
    @Singleton
    fun provideWeatherService(
        @ApplicationContext context: Context,
        mlService: MLService
    ): WeatherService {
        return WeatherService(context, mlService)
    }

    @Provides
    @Singleton
    fun provideOptimizationService(): OptimizationService {
        return OptimizationService()
    }

    @Provides
    @Singleton
    fun providePaymentService(@ApplicationContext context: Context): PaymentService {
        return PaymentService(context)
    }

    @Provides
    @Singleton
    fun provideNotificationService(@ApplicationContext context: Context): NotificationService {
        return NotificationService(context)
    }

    @Provides
    @Singleton
    fun provideOfflineService(database: OfflineDatabase): OfflineService {
        return OfflineService(database)
    }

    @Provides
    @Singleton
    fun provideImageOptimizationService(@ApplicationContext context: Context): ImageOptimizationService {
        return ImageOptimizationService(context)
    }

    @Provides
    @Singleton
    fun provideSearchService(@ApplicationContext context: Context): SearchService {
        return SearchService(context)
    }
}
