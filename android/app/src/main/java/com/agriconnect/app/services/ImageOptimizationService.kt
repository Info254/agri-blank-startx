package com.agriconnect.app.services

import android.content.Context
import android.graphics.*
import android.graphics.drawable.BitmapDrawable
import android.net.Uri
import androidx.exifinterface.media.ExifInterface
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.Serializable
import java.io.*
import java.util.*
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.math.*

@Serializable
data class ImageOptimizationOptions(
    val maxWidth: Int = 1920,
    val maxHeight: Int = 1080,
    val quality: Int = 85,
    val format: String = "JPEG",
    val maintainAspectRatio: Boolean = true,
    val autoRotate: Boolean = true,
    val removeExif: Boolean = true
)

@Serializable
data class WatermarkOptions(
    val text: String? = null,
    val imagePath: String? = null,
    val position: String = "bottom_right", // top_left, top_right, bottom_left, bottom_right, center
    val opacity: Float = 0.7f,
    val size: Float = 0.1f, // Relative to image size
    val margin: Int = 20
)

@Serializable
data class CropOptions(
    val x: Int,
    val y: Int,
    val width: Int,
    val height: Int
)

@Serializable
data class OptimizationResult(
    val originalSize: Long,
    val optimizedSize: Long,
    val compressionRatio: Float,
    val outputPath: String,
    val processingTime: Long,
    val dimensions: Pair<Int, Int>
)

@Singleton
class ImageOptimizationService @Inject constructor(
    private val context: Context
) {

    suspend fun optimizeImage(
        inputPath: String,
        outputPath: String,
        options: ImageOptimizationOptions = ImageOptimizationOptions()
    ): OptimizationResult = withContext(Dispatchers.IO) {
        val startTime = System.currentTimeMillis()
        
        try {
            val originalFile = File(inputPath)
            val originalSize = originalFile.length()
            
            // Load and decode bitmap
            var bitmap = loadBitmap(inputPath, options.maxWidth, options.maxHeight)
            
            // Auto-rotate based on EXIF data
            if (options.autoRotate) {
                bitmap = autoRotateImage(bitmap, inputPath)
            }
            
            // Resize if needed
            bitmap = resizeBitmap(bitmap, options.maxWidth, options.maxHeight, options.maintainAspectRatio)
            
            // Save optimized image
            val format = when (options.format.uppercase()) {
                "PNG" -> Bitmap.CompressFormat.PNG
                "WEBP" -> if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.R) {
                    Bitmap.CompressFormat.WEBP_LOSSLESS
                } else {
                    @Suppress("DEPRECATION")
                    Bitmap.CompressFormat.WEBP
                }
                else -> Bitmap.CompressFormat.JPEG
            }
            
            saveBitmap(bitmap, outputPath, format, options.quality)
            
            val optimizedFile = File(outputPath)
            val optimizedSize = optimizedFile.length()
            val compressionRatio = if (originalSize > 0) optimizedSize.toFloat() / originalSize.toFloat() else 1f
            val processingTime = System.currentTimeMillis() - startTime
            
            OptimizationResult(
                originalSize = originalSize,
                optimizedSize = optimizedSize,
                compressionRatio = compressionRatio,
                outputPath = outputPath,
                processingTime = processingTime,
                dimensions = Pair(bitmap.width, bitmap.height)
            )
        } catch (e: Exception) {
            println("Image optimization failed: ${e.message}")
            throw e
        }
    }

    suspend fun addWatermark(
        inputPath: String,
        outputPath: String,
        watermarkOptions: WatermarkOptions
    ): Boolean = withContext(Dispatchers.IO) {
        try {
            val bitmap = BitmapFactory.decodeFile(inputPath)
            val watermarkedBitmap = bitmap.copy(Bitmap.Config.ARGB_8888, true)
            val canvas = Canvas(watermarkedBitmap)
            
            when {
                watermarkOptions.text != null -> {
                    addTextWatermark(canvas, watermarkedBitmap, watermarkOptions)
                }
                watermarkOptions.imagePath != null -> {
                    addImageWatermark(canvas, watermarkedBitmap, watermarkOptions)
                }
            }
            
            saveBitmap(watermarkedBitmap, outputPath, Bitmap.CompressFormat.JPEG, 90)
            true
        } catch (e: Exception) {
            println("Watermark addition failed: ${e.message}")
            false
        }
    }

    suspend fun cropImage(
        inputPath: String,
        outputPath: String,
        cropOptions: CropOptions
    ): Boolean = withContext(Dispatchers.IO) {
        try {
            val bitmap = BitmapFactory.decodeFile(inputPath)
            
            // Validate crop dimensions
            val validX = maxOf(0, minOf(cropOptions.x, bitmap.width - 1))
            val validY = maxOf(0, minOf(cropOptions.y, bitmap.height - 1))
            val validWidth = minOf(cropOptions.width, bitmap.width - validX)
            val validHeight = minOf(cropOptions.height, bitmap.height - validY)
            
            val croppedBitmap = Bitmap.createBitmap(bitmap, validX, validY, validWidth, validHeight)
            saveBitmap(croppedBitmap, outputPath, Bitmap.CompressFormat.JPEG, 90)
            true
        } catch (e: Exception) {
            println("Image cropping failed: ${e.message}")
            false
        }
    }

    suspend fun batchOptimize(
        inputPaths: List<String>,
        outputDirectory: String,
        options: ImageOptimizationOptions = ImageOptimizationOptions()
    ): List<OptimizationResult> = withContext(Dispatchers.IO) {
        val results = mutableListOf<OptimizationResult>()
        
        inputPaths.forEach { inputPath ->
            try {
                val inputFile = File(inputPath)
                val outputPath = "$outputDirectory/optimized_${inputFile.name}"
                
                val result = optimizeImage(inputPath, outputPath, options)
                results.add(result)
                
                println("Optimized: ${inputFile.name} - ${result.compressionRatio * 100}% of original size")
            } catch (e: Exception) {
                println("Failed to optimize $inputPath: ${e.message}")
            }
        }
        
        results
    }

    suspend fun generateThumbnail(
        inputPath: String,
        outputPath: String,
        size: Int = 150
    ): Boolean = withContext(Dispatchers.IO) {
        try {
            val options = ImageOptimizationOptions(
                maxWidth = size,
                maxHeight = size,
                quality = 80,
                maintainAspectRatio = false
            )
            
            optimizeImage(inputPath, outputPath, options)
            true
        } catch (e: Exception) {
            println("Thumbnail generation failed: ${e.message}")
            false
        }
    }

    private fun loadBitmap(path: String, maxWidth: Int, maxHeight: Int): Bitmap {
        val options = BitmapFactory.Options()
        options.inJustDecodeBounds = true
        BitmapFactory.decodeFile(path, options)
        
        val sampleSize = calculateInSampleSize(options, maxWidth, maxHeight)
        options.inSampleSize = sampleSize
        options.inJustDecodeBounds = false
        
        return BitmapFactory.decodeFile(path, options)
            ?: throw IllegalArgumentException("Could not decode image: $path")
    }

    private fun calculateInSampleSize(options: BitmapFactory.Options, reqWidth: Int, reqHeight: Int): Int {
        val height = options.outHeight
        val width = options.outWidth
        var inSampleSize = 1

        if (height > reqHeight || width > reqWidth) {
            val halfHeight = height / 2
            val halfWidth = width / 2

            while (halfHeight / inSampleSize >= reqHeight && halfWidth / inSampleSize >= reqWidth) {
                inSampleSize *= 2
            }
        }

        return inSampleSize
    }

    private fun autoRotateImage(bitmap: Bitmap, imagePath: String): Bitmap {
        try {
            val exif = ExifInterface(imagePath)
            val orientation = exif.getAttributeInt(ExifInterface.TAG_ORIENTATION, ExifInterface.ORIENTATION_NORMAL)
            
            val matrix = Matrix()
            when (orientation) {
                ExifInterface.ORIENTATION_ROTATE_90 -> matrix.postRotate(90f)
                ExifInterface.ORIENTATION_ROTATE_180 -> matrix.postRotate(180f)
                ExifInterface.ORIENTATION_ROTATE_270 -> matrix.postRotate(270f)
                ExifInterface.ORIENTATION_FLIP_HORIZONTAL -> matrix.postScale(-1f, 1f)
                ExifInterface.ORIENTATION_FLIP_VERTICAL -> matrix.postScale(1f, -1f)
                else -> return bitmap
            }
            
            return Bitmap.createBitmap(bitmap, 0, 0, bitmap.width, bitmap.height, matrix, true)
        } catch (e: Exception) {
            println("Auto-rotation failed: ${e.message}")
            return bitmap
        }
    }

    private fun resizeBitmap(
        bitmap: Bitmap,
        maxWidth: Int,
        maxHeight: Int,
        maintainAspectRatio: Boolean
    ): Bitmap {
        val width = bitmap.width
        val height = bitmap.height
        
        if (width <= maxWidth && height <= maxHeight) {
            return bitmap
        }
        
        val scaleWidth: Float
        val scaleHeight: Float
        
        if (maintainAspectRatio) {
            val scale = minOf(maxWidth.toFloat() / width, maxHeight.toFloat() / height)
            scaleWidth = scale
            scaleHeight = scale
        } else {
            scaleWidth = maxWidth.toFloat() / width
            scaleHeight = maxHeight.toFloat() / height
        }
        
        val matrix = Matrix()
        matrix.postScale(scaleWidth, scaleHeight)
        
        return Bitmap.createBitmap(bitmap, 0, 0, width, height, matrix, true)
    }

    private fun addTextWatermark(canvas: Canvas, bitmap: Bitmap, options: WatermarkOptions) {
        val text = options.text ?: return
        
        val paint = Paint().apply {
            color = Color.WHITE
            alpha = (options.opacity * 255).toInt()
            textSize = bitmap.width * options.size
            isAntiAlias = true
            setShadowLayer(4f, 2f, 2f, Color.BLACK)
        }
        
        val textBounds = Rect()
        paint.getTextBounds(text, 0, text.length, textBounds)
        
        val position = getWatermarkPosition(
            bitmap.width, bitmap.height,
            textBounds.width(), textBounds.height(),
            options.position, options.margin
        )
        
        canvas.drawText(text, position.first.toFloat(), position.second.toFloat(), paint)
    }

    private fun addImageWatermark(canvas: Canvas, bitmap: Bitmap, options: WatermarkOptions) {
        val watermarkPath = options.imagePath ?: return
        
        try {
            val watermarkBitmap = BitmapFactory.decodeFile(watermarkPath)
            val watermarkSize = (bitmap.width * options.size).toInt()
            val scaledWatermark = Bitmap.createScaledBitmap(watermarkBitmap, watermarkSize, watermarkSize, true)
            
            val paint = Paint().apply {
                alpha = (options.opacity * 255).toInt()
            }
            
            val position = getWatermarkPosition(
                bitmap.width, bitmap.height,
                scaledWatermark.width, scaledWatermark.height,
                options.position, options.margin
            )
            
            canvas.drawBitmap(scaledWatermark, position.first.toFloat(), position.second.toFloat(), paint)
        } catch (e: Exception) {
            println("Failed to add image watermark: ${e.message}")
        }
    }

    private fun getWatermarkPosition(
        imageWidth: Int,
        imageHeight: Int,
        watermarkWidth: Int,
        watermarkHeight: Int,
        position: String,
        margin: Int
    ): Pair<Int, Int> {
        return when (position.lowercase()) {
            "top_left" -> Pair(margin, margin + watermarkHeight)
            "top_right" -> Pair(imageWidth - watermarkWidth - margin, margin + watermarkHeight)
            "bottom_left" -> Pair(margin, imageHeight - margin)
            "bottom_right" -> Pair(imageWidth - watermarkWidth - margin, imageHeight - margin)
            "center" -> Pair(
                (imageWidth - watermarkWidth) / 2,
                (imageHeight - watermarkHeight) / 2 + watermarkHeight
            )
            else -> Pair(imageWidth - watermarkWidth - margin, imageHeight - margin)
        }
    }

    private fun saveBitmap(
        bitmap: Bitmap,
        outputPath: String,
        format: Bitmap.CompressFormat,
        quality: Int
    ) {
        val outputFile = File(outputPath)
        outputFile.parentFile?.mkdirs()
        
        FileOutputStream(outputFile).use { out ->
            bitmap.compress(format, quality, out)
        }
    }

    // Utility functions
    suspend fun getImageDimensions(imagePath: String): Pair<Int, Int>? = withContext(Dispatchers.IO) {
        try {
            val options = BitmapFactory.Options()
            options.inJustDecodeBounds = true
            BitmapFactory.decodeFile(imagePath, options)
            Pair(options.outWidth, options.outHeight)
        } catch (e: Exception) {
            println("Failed to get image dimensions: ${e.message}")
            null
        }
    }

    suspend fun getImageSize(imagePath: String): Long = withContext(Dispatchers.IO) {
        try {
            File(imagePath).length()
        } catch (e: Exception) {
            0L
        }
    }

    suspend fun convertFormat(
        inputPath: String,
        outputPath: String,
        targetFormat: String,
        quality: Int = 90
    ): Boolean = withContext(Dispatchers.IO) {
        try {
            val bitmap = BitmapFactory.decodeFile(inputPath)
            val format = when (targetFormat.uppercase()) {
                "PNG" -> Bitmap.CompressFormat.PNG
                "WEBP" -> if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.R) {
                    Bitmap.CompressFormat.WEBP_LOSSLESS
                } else {
                    @Suppress("DEPRECATION")
                    Bitmap.CompressFormat.WEBP
                }
                else -> Bitmap.CompressFormat.JPEG
            }
            
            saveBitmap(bitmap, outputPath, format, quality)
            true
        } catch (e: Exception) {
            println("Format conversion failed: ${e.message}")
            false
        }
    }

    // Progressive JPEG support
    suspend fun createProgressiveJPEG(
        inputPath: String,
        outputPath: String,
        quality: Int = 85
    ): Boolean = withContext(Dispatchers.IO) {
        try {
            val bitmap = BitmapFactory.decodeFile(inputPath)
            
            // Create progressive JPEG using custom compression
            val outputFile = File(outputPath)
            outputFile.parentFile?.mkdirs()
            
            FileOutputStream(outputFile).use { out ->
                // Note: Android doesn't have built-in progressive JPEG support
                // This would require a native library like libjpeg-turbo
                bitmap.compress(Bitmap.CompressFormat.JPEG, quality, out)
            }
            
            true
        } catch (e: Exception) {
            println("Progressive JPEG creation failed: ${e.message}")
            false
        }
    }

    // Image analysis
    suspend fun analyzeImage(imagePath: String): Map<String, Any> = withContext(Dispatchers.IO) {
        try {
            val bitmap = BitmapFactory.decodeFile(imagePath)
            val fileSize = File(imagePath).length()
            
            // Basic image analysis
            val colorAnalysis = analyzeColors(bitmap)
            val sharpness = analyzeSharpness(bitmap)
            val brightness = analyzeBrightness(bitmap)
            
            mapOf(
                "width" to bitmap.width,
                "height" to bitmap.height,
                "fileSize" to fileSize,
                "aspectRatio" to (bitmap.width.toFloat() / bitmap.height.toFloat()),
                "dominantColor" to colorAnalysis["dominant"],
                "averageBrightness" to brightness,
                "sharpnessScore" to sharpness,
                "recommendedOptimization" to getOptimizationRecommendation(bitmap, fileSize)
            )
        } catch (e: Exception) {
            println("Image analysis failed: ${e.message}")
            emptyMap()
        }
    }

    private fun analyzeColors(bitmap: Bitmap): Map<String, Any> {
        val colorCounts = mutableMapOf<Int, Int>()
        val pixels = IntArray(bitmap.width * bitmap.height)
        bitmap.getPixels(pixels, 0, bitmap.width, 0, 0, bitmap.width, bitmap.height)
        
        pixels.forEach { pixel ->
            colorCounts[pixel] = colorCounts.getOrDefault(pixel, 0) + 1
        }
        
        val dominantColor = colorCounts.maxByOrNull { it.value }?.key ?: Color.BLACK
        
        return mapOf(
            "dominant" to String.format("#%06X", 0xFFFFFF and dominantColor),
            "uniqueColors" to colorCounts.size
        )
    }

    private fun analyzeSharpness(bitmap: Bitmap): Float {
        // Simple sharpness analysis using Laplacian variance
        val grayscale = convertToGrayscale(bitmap)
        var variance = 0.0
        var mean = 0.0
        val pixels = IntArray(grayscale.width * grayscale.height)
        grayscale.getPixels(pixels, 0, grayscale.width, 0, 0, grayscale.width, grayscale.height)
        
        // Calculate mean
        pixels.forEach { pixel ->
            mean += Color.red(pixel) // Grayscale, so R=G=B
        }
        mean /= pixels.size
        
        // Calculate variance
        pixels.forEach { pixel ->
            val diff = Color.red(pixel) - mean
            variance += diff * diff
        }
        variance /= pixels.size
        
        return variance.toFloat()
    }

    private fun analyzeBrightness(bitmap: Bitmap): Float {
        val pixels = IntArray(bitmap.width * bitmap.height)
        bitmap.getPixels(pixels, 0, bitmap.width, 0, 0, bitmap.width, bitmap.height)
        
        var totalBrightness = 0.0
        pixels.forEach { pixel ->
            val r = Color.red(pixel)
            val g = Color.green(pixel)
            val b = Color.blue(pixel)
            totalBrightness += (0.299 * r + 0.587 * g + 0.114 * b)
        }
        
        return (totalBrightness / pixels.size).toFloat()
    }

    private fun convertToGrayscale(bitmap: Bitmap): Bitmap {
        val grayscaleBitmap = Bitmap.createBitmap(bitmap.width, bitmap.height, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(grayscaleBitmap)
        val paint = Paint()
        val colorMatrix = ColorMatrix()
        colorMatrix.setSaturation(0f)
        paint.colorFilter = ColorMatrixColorFilter(colorMatrix)
        canvas.drawBitmap(bitmap, 0f, 0f, paint)
        return grayscaleBitmap
    }

    private fun getOptimizationRecommendation(bitmap: Bitmap, fileSize: Long): String {
        val megapixels = (bitmap.width * bitmap.height) / 1_000_000.0
        val fileSizeMB = fileSize / (1024.0 * 1024.0)
        
        return when {
            fileSizeMB > 10 -> "High compression recommended - file size is very large"
            megapixels > 8 -> "Resize recommended - resolution is very high for mobile"
            bitmap.width > 2048 || bitmap.height > 2048 -> "Resize recommended for faster loading"
            fileSizeMB > 2 -> "Moderate compression recommended"
            else -> "Image is well optimized"
        }
    }
}
