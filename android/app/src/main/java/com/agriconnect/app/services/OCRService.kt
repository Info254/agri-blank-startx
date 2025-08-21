package com.agriconnect.app.services

import android.content.Context
import android.graphics.Bitmap
import android.net.Uri
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.latin.TextRecognizerOptions
import kotlinx.coroutines.tasks.await
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import javax.inject.Inject
import javax.inject.Singleton

data class OCRResult(
    val text: String,
    val confidence: Float,
    val blocks: List<TextBlock>
)

data class TextBlock(
    val text: String,
    val boundingBox: android.graphics.Rect?,
    val confidence: Float
)

data class DocumentAnalysis(
    val documentType: String,
    val extractedData: Map<String, String>,
    val confidence: Float
)

@Singleton
class OCRService @Inject constructor(
    private val context: Context
) {
    private val textRecognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)

    suspend fun extractTextFromImage(bitmap: Bitmap): OCRResult = withContext(Dispatchers.IO) {
        try {
            val image = InputImage.fromBitmap(bitmap, 0)
            val result = textRecognizer.process(image).await()
            
            val blocks = result.textBlocks.map { block ->
                TextBlock(
                    text = block.text,
                    boundingBox = block.boundingBox,
                    confidence = block.confidence ?: 0.8f
                )
            }
            
            OCRResult(
                text = result.text,
                confidence = calculateOverallConfidence(blocks),
                blocks = blocks
            )
        } catch (e: Exception) {
            println("OCR processing failed: ${e.message}")
            OCRResult(
                text = "OCR processing failed",
                confidence = 0f,
                blocks = emptyList()
            )
        }
    }

    suspend fun extractTextFromUri(uri: Uri): OCRResult = withContext(Dispatchers.IO) {
        try {
            val image = InputImage.fromFilePath(context, uri)
            val result = textRecognizer.process(image).await()
            
            val blocks = result.textBlocks.map { block ->
                TextBlock(
                    text = block.text,
                    boundingBox = block.boundingBox,
                    confidence = block.confidence ?: 0.8f
                )
            }
            
            OCRResult(
                text = result.text,
                confidence = calculateOverallConfidence(blocks),
                blocks = blocks
            )
        } catch (e: Exception) {
            println("OCR processing failed: ${e.message}")
            OCRResult(
                text = "OCR processing failed",
                confidence = 0f,
                blocks = emptyList()
            )
        }
    }

    suspend fun analyzeDocument(bitmap: Bitmap): DocumentAnalysis = withContext(Dispatchers.Default) {
        try {
            val ocrResult = extractTextFromImage(bitmap)
            val text = ocrResult.text.lowercase()
            
            val documentType = detectDocumentType(text)
            val extractedData = extractStructuredData(text, documentType)
            
            DocumentAnalysis(
                documentType = documentType,
                extractedData = extractedData,
                confidence = ocrResult.confidence
            )
        } catch (e: Exception) {
            println("Document analysis failed: ${e.message}")
            DocumentAnalysis(
                documentType = "unknown",
                extractedData = emptyMap(),
                confidence = 0f
            )
        }
    }

    suspend fun extractReceiptData(bitmap: Bitmap): Map<String, String> = withContext(Dispatchers.Default) {
        try {
            val ocrResult = extractTextFromImage(bitmap)
            val text = ocrResult.text
            
            val extractedData = mutableMapOf<String, String>()
            
            // Extract total amount
            val totalRegex = Regex("""(?:total|amount|sum)[\s:]*(?:ksh?|kes)?[\s]*(\d+(?:\.\d{2})?)""", RegexOption.IGNORE_CASE)
            totalRegex.find(text)?.let { match ->
                extractedData["total"] = match.groupValues[1]
            }
            
            // Extract date
            val dateRegex = Regex("""\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b""")
            dateRegex.find(text)?.let { match ->
                extractedData["date"] = match.groupValues[1]
            }
            
            // Extract vendor/shop name (usually at the top)
            val lines = text.split("\n").filter { it.trim().isNotEmpty() }
            if (lines.isNotEmpty()) {
                extractedData["vendor"] = lines[0].trim()
            }
            
            // Extract phone number
            val phoneRegex = Regex("""(?:\+254|254|0)([17]\d{8})""")
            phoneRegex.find(text)?.let { match ->
                extractedData["phone"] = match.value
            }
            
            extractedData
        } catch (e: Exception) {
            println("Receipt extraction failed: ${e.message}")
            emptyMap()
        }
    }

    suspend fun extractFarmInputLabel(bitmap: Bitmap): Map<String, String> = withContext(Dispatchers.Default) {
        try {
            val ocrResult = extractTextFromImage(bitmap)
            val text = ocrResult.text
            
            val extractedData = mutableMapOf<String, String>()
            
            // Extract product name (usually prominent text)
            val lines = text.split("\n").filter { it.trim().isNotEmpty() }
            if (lines.isNotEmpty()) {
                extractedData["product_name"] = lines.find { it.length > 5 && it.any { char -> char.isLetter() } } ?: lines[0]
            }
            
            // Extract NPK values
            val npkRegex = Regex("""(\d+)-(\d+)-(\d+)""")
            npkRegex.find(text)?.let { match ->
                extractedData["nitrogen"] = match.groupValues[1]
                extractedData["phosphorus"] = match.groupValues[2]
                extractedData["potassium"] = match.groupValues[3]
            }
            
            // Extract weight/quantity
            val weightRegex = Regex("""(\d+(?:\.\d+)?)\s*(kg|g|l|ml|liter|gram|kilogram)""", RegexOption.IGNORE_CASE)
            weightRegex.find(text)?.let { match ->
                extractedData["quantity"] = match.groupValues[1]
                extractedData["unit"] = match.groupValues[2]
            }
            
            // Extract manufacturer
            val manufacturerKeywords = listOf("manufactured by", "mfg by", "company", "ltd", "limited", "inc")
            lines.forEach { line ->
                if (manufacturerKeywords.any { keyword -> line.lowercase().contains(keyword) }) {
                    extractedData["manufacturer"] = line.trim()
                    return@forEach
                }
            }
            
            // Extract batch number
            val batchRegex = Regex("""(?:batch|lot|b/n)[\s:]*([a-z0-9]+)""", RegexOption.IGNORE_CASE)
            batchRegex.find(text)?.let { match ->
                extractedData["batch_number"] = match.groupValues[1]
            }
            
            // Extract expiry date
            val expiryRegex = Regex("""(?:exp|expiry|expires?)[\s:]*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})""", RegexOption.IGNORE_CASE)
            expiryRegex.find(text)?.let { match ->
                extractedData["expiry_date"] = match.groupValues[1]
            }
            
            extractedData
        } catch (e: Exception) {
            println("Farm input label extraction failed: ${e.message}")
            emptyMap()
        }
    }

    private fun calculateOverallConfidence(blocks: List<TextBlock>): Float {
        if (blocks.isEmpty()) return 0f
        return blocks.map { it.confidence }.average().toFloat()
    }

    private fun detectDocumentType(text: String): String {
        return when {
            text.contains("receipt", ignoreCase = true) || 
            text.contains("total", ignoreCase = true) -> "receipt"
            
            text.contains("fertilizer", ignoreCase = true) || 
            text.contains("pesticide", ignoreCase = true) ||
            text.contains("seed", ignoreCase = true) -> "farm_input_label"
            
            text.contains("invoice", ignoreCase = true) -> "invoice"
            
            text.contains("certificate", ignoreCase = true) -> "certificate"
            
            text.contains("license", ignoreCase = true) -> "license"
            
            else -> "document"
        }
    }

    private fun extractStructuredData(text: String, documentType: String): Map<String, String> {
        return when (documentType) {
            "receipt" -> extractReceiptDataFromText(text)
            "farm_input_label" -> extractFarmInputDataFromText(text)
            "invoice" -> extractInvoiceDataFromText(text)
            else -> extractGeneralDataFromText(text)
        }
    }

    private fun extractReceiptDataFromText(text: String): Map<String, String> {
        val data = mutableMapOf<String, String>()
        
        // Extract amounts
        val amountRegex = Regex("""(?:ksh?|kes)?\s*(\d+(?:\.\d{2})?)""", RegexOption.IGNORE_CASE)
        amountRegex.findAll(text).forEach { match ->
            data["amount_${data.size}"] = match.groupValues[1]
        }
        
        return data
    }

    private fun extractFarmInputDataFromText(text: String): Map<String, String> {
        val data = mutableMapOf<String, String>()
        
        // Extract active ingredients
        val activeIngredientRegex = Regex("""(\w+)\s*(\d+(?:\.\d+)?)\s*%""")
        activeIngredientRegex.findAll(text).forEach { match ->
            data["active_ingredient_${match.groupValues[1]}"] = "${match.groupValues[2]}%"
        }
        
        return data
    }

    private fun extractInvoiceDataFromText(text: String): Map<String, String> {
        val data = mutableMapOf<String, String>()
        
        // Extract invoice number
        val invoiceRegex = Regex("""(?:invoice|inv)[\s#:]*([a-z0-9]+)""", RegexOption.IGNORE_CASE)
        invoiceRegex.find(text)?.let { match ->
            data["invoice_number"] = match.groupValues[1]
        }
        
        return data
    }

    private fun extractGeneralDataFromText(text: String): Map<String, String> {
        val data = mutableMapOf<String, String>()
        
        // Extract any numbers
        val numberRegex = Regex("""\b(\d+(?:\.\d+)?)\b""")
        numberRegex.findAll(text).forEachIndexed { index, match ->
            if (index < 5) { // Limit to first 5 numbers
                data["number_$index"] = match.groupValues[1]
            }
        }
        
        return data
    }

    fun cleanup() {
        textRecognizer.close()
    }
}
