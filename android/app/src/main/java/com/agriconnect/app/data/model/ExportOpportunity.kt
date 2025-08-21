package com.agriconnect.app.data.model

import kotlinx.serialization.Serializable
import java.time.LocalDateTime

@Serializable
data class ExportOpportunity(
    val id: String,
    val exporterId: String,
    val title: String,
    val commodity: String,
    val destinationCountry: String,
    val destinationCity: String? = null,
    val volumeRequired: Double,
    val unit: String = "kg",
    val pricePerUnit: Double? = null,
    val currency: String = "KES",
    val qualityRequirements: List<String> = emptyList(),
    val certificationRequirements: List<String> = emptyList(),
    val shippingTerms: String? = null,
    val paymentTerms: String? = null,
    val deadline: String? = null,
    val description: String? = null,
    val status: ExportStatus = ExportStatus.ACTIVE,
    val verificationStatus: VerificationStatus = VerificationStatus.PENDING,
    val farmerVerifier1: String? = null,
    val farmerVerifier2: String? = null,
    val verificationDate1: String? = null,
    val verificationDate2: String? = null,
    val createdAt: String,
    val updatedAt: String,
    val expiresAt: String? = null,
    val exporterProfile: ExporterProfile? = null
)

@Serializable
enum class ExportStatus {
    ACTIVE, CLOSED, SUSPENDED
}

@Serializable
enum class VerificationStatus {
    PENDING, VERIFIED, REJECTED
}

@Serializable
data class ExportApplication(
    val id: String,
    val opportunityId: String,
    val farmerId: String,
    val proposedVolume: Double,
    val proposedPrice: Double? = null,
    val deliveryTimeline: String? = null,
    val qualityCertifications: List<String> = emptyList(),
    val sampleImages: List<String> = emptyList(),
    val coverLetter: String? = null,
    val status: ApplicationStatus = ApplicationStatus.SUBMITTED,
    val exporterNotes: String? = null,
    val createdAt: String,
    val updatedAt: String,
    val opportunity: ExportOpportunity? = null,
    val workflowStages: List<ExportWorkflowStatus> = emptyList(),
    val documents: List<ExportDocumentLink> = emptyList()
)

@Serializable
enum class ApplicationStatus {
    SUBMITTED, UNDER_REVIEW, ACCEPTED, REJECTED, WITHDRAWN
}

@Serializable
data class ExportDocumentLink(
    val id: String,
    val applicationId: String,
    val documentType: String,
    val documentName: String,
    val externalUrl: String,
    val uploadedBy: String,
    val verificationStatus: DocumentVerificationStatus = DocumentVerificationStatus.PENDING,
    val verifiedBy: String? = null,
    val verificationNotes: String? = null,
    val createdAt: String,
    val expiresAt: String? = null
)

@Serializable
enum class DocumentVerificationStatus {
    PENDING, VERIFIED, REJECTED
}

@Serializable
data class ExportWorkflowStatus(
    val id: String,
    val applicationId: String,
    val stage: WorkflowStage,
    val status: WorkflowStatus,
    val startedAt: String,
    val completedAt: String? = null,
    val notes: String? = null,
    val updatedBy: String? = null
)

@Serializable
enum class WorkflowStage {
    INQUIRY, NEGOTIATION, CONTRACT, DOCUMENTATION, SHIPPING, PAYMENT, COMPLETED
}

@Serializable
enum class WorkflowStatus {
    PENDING, IN_PROGRESS, COMPLETED, FAILED
}

@Serializable
data class ExportVerification(
    val id: String,
    val opportunityId: String,
    val verifierId: String,
    val verificationType: VerificationType,
    val status: VerificationDecision,
    val comments: String? = null,
    val evidenceLinks: List<String> = emptyList(),
    val createdAt: String
)

@Serializable
enum class VerificationType {
    EXPORTER_PROFILE, OPPORTUNITY_DETAILS, BUSINESS_LEGITIMACY
}

@Serializable
enum class VerificationDecision {
    APPROVED, REJECTED, NEEDS_INFO
}

@Serializable
data class ExporterProfile(
    val id: String,
    val userId: String,
    val companyName: String,
    val businessRegistrationNumber: String? = null,
    val exportLicenseNumber: String? = null,
    val taxId: String? = null,
    val businessAddress: String,
    val contactPerson: String,
    val phoneNumber: String,
    val email: String,
    val websiteUrl: String? = null,
    val yearsInBusiness: Int? = null,
    val exportMarkets: List<String> = emptyList(),
    val commoditiesHandled: List<String> = emptyList(),
    val annualExportVolume: Double? = null,
    val certifications: List<String> = emptyList(),
    val verificationBadge: VerificationBadge = VerificationBadge.UNVERIFIED,
    val farmerVerificationsCount: Int = 0,
    val successfulExportsCount: Int = 0,
    val rating: Double = 0.0,
    val createdAt: String,
    val updatedAt: String
)

@Serializable
enum class VerificationBadge {
    UNVERIFIED, BASIC, VERIFIED, PREMIUM
}

@Serializable
data class ExportFilters(
    val commodity: String? = null,
    val destinationCountry: String? = null,
    val minVolume: Double? = null,
    val maxVolume: Double? = null,
    val minPrice: Double? = null,
    val maxPrice: Double? = null,
    val certificationRequirements: List<String> = emptyList(),
    val shippingTerms: String? = null,
    val deadlineFrom: String? = null,
    val deadlineTo: String? = null,
    val verificationStatus: VerificationStatus? = null
)

// Constants
object ExportConstants {
    val EXPORT_COMMODITIES = listOf(
        "Coffee", "Tea", "Avocados", "French Beans", "Snow Peas",
        "Macadamia Nuts", "Cashew Nuts", "Mangoes", "Pineapples",
        "Flowers", "Herbs", "Spices", "Coconut", "Sisal", "Cotton",
        "Pyrethrum", "Other"
    )

    val EXPORT_COUNTRIES = listOf(
        "Netherlands", "Germany", "United Kingdom", "France", "Belgium",
        "United States", "Japan", "China", "India", "UAE", "Saudi Arabia",
        "Egypt", "South Africa", "Other"
    )

    val SHIPPING_TERMS = listOf(
        "FOB (Free on Board)", "CIF (Cost, Insurance, Freight)",
        "CFR (Cost and Freight)", "EXW (Ex Works)", "FCA (Free Carrier)",
        "CPT (Carriage Paid To)", "CIP (Carriage and Insurance Paid)",
        "DAP (Delivered at Place)", "DPU (Delivered at Place Unloaded)",
        "DDP (Delivered Duty Paid)"
    )

    val QUALITY_REQUIREMENTS = listOf(
        "Organic Certified", "Fair Trade Certified", "GlobalGAP Certified",
        "HACCP Compliant", "ISO 22000", "Rainforest Alliance", "UTZ Certified",
        "BRC Certified", "IFS Certified", "Pesticide Residue Free", "Non-GMO",
        "Kosher Certified", "Halal Certified"
    )

    val DOCUMENT_TYPES = listOf(
        "Export License", "Phytosanitary Certificate", "Certificate of Origin",
        "Quality Certificate", "Organic Certificate", "Fair Trade Certificate",
        "Invoice", "Packing List", "Bill of Lading", "Insurance Certificate",
        "Inspection Report", "Other"
    )
}
