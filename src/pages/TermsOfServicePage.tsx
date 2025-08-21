import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Scale, AlertTriangle, Shield, Users, Gavel, FileText, Database } from 'lucide-react';
import SocialShare from '@/components/common/SocialShare';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-center space-x-2">
            <Scale className="h-8 w-8 text-blue-600" />
            <CardTitle className="text-3xl">Terms of Service - AgriConnect</CardTitle>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Effective: January 1, 2024</Badge>
            <Badge variant="outline">Last Updated: {new Date().toLocaleDateString()}</Badge>
            <Badge variant="outline">Version 2.2</Badge>
          </div>
          
          {/* Social Sharing Section */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Share Our Terms</h3>
                <p className="text-sm text-blue-800">
                  Help other farmers understand AgriConnect's commitment to transparency and data protection.
                </p>
              </div>
              <SocialShare
                title="AgriConnect Terms of Service"
                text="AgriConnect is committed to transparent agricultural technology. Our Terms of Service outline our commitment to farmers, data protection, and open agriculture policies in Kenya."
                size="sm"
              />
            </div>
          </div>

          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900">Legal Agreement</h3>
                <p className="text-sm text-red-800">
                  These Terms of Service constitute a legally binding agreement between you and AgriConnect. 
                  By accessing or using our platform, you agree to be bound by these terms and all applicable laws.
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FileText className="mr-2 h-6 w-6 text-blue-600" />
              1. Acceptance of Terms
            </h2>
            
            <div className="space-y-4">
              <p className="text-sm leading-relaxed">
                By accessing, browsing, or using the AgriConnect platform (website, mobile application, or API services), 
                you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
              </p>
              
              <div className="p-4 border rounded-lg bg-blue-50">
                <h3 className="font-semibold mb-2">Platform Scope</h3>
                <p className="text-sm">
                  AgriConnect is an agricultural technology platform that connects farmers, buyers, service providers, 
                  and other stakeholders in Kenya's agricultural ecosystem. We facilitate connections but do not 
                  control or guarantee the quality, legality, or availability of products or services offered by users.
                </p>
              </div>

              <div className="p-4 border rounded-lg bg-amber-50">
                <h3 className="font-semibold mb-2 flex items-center">
                  <AlertTriangle className="mr-2 h-4 w-4 text-amber-600" />
                  User Eligibility
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>You must be at least 18 years old to use AgriConnect</li>
                  <li>You must have legal capacity to enter into binding agreements</li>
                  <li>You must comply with all applicable laws in Kenya and your jurisdiction</li>
                  <li>Business users must have proper registration and licensing as required by law</li>
                </ul>
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Database className="mr-2 h-6 w-6 text-blue-600" />
              2. Open Data Policy Compliance
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-green-50">
                <h3 className="font-semibold mb-2">Kenya Ministry of Agriculture Open Data Adherence</h3>
                <p className="text-sm mb-3">
                  AgriConnect fully adheres to the Kenya Ministry of Agriculture and Livestock Development's 
                  Open Data Policy, ensuring transparent, accessible, and responsible agricultural data sharing.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <h4 className="font-medium text-green-700 mb-2">Data Quality Standards</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Complete data without privacy violations</li>
                      <li>Primary data traceable to source</li>
                      <li>Timely updates preserving data value</li>
                      <li>Accessible to widest user range</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-700 mb-2">Technical Standards</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Machine-processable structured data</li>
                      <li>Non-discriminatory access policies</li>
                      <li>License-free, non-proprietary formats</li>
                      <li>Reviewable with designated contacts</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Our Data Commitments</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Open by Default:</strong> Non-sensitive agricultural data freely available</li>
                  <li><strong>High-Quality APIs:</strong> Free, reliable application programming interfaces</li>
                  <li><strong>Government Partnerships:</strong> Collaboration with MoA&LD and counties</li>
                  <li><strong>Security Standards:</strong> Highest privacy and security protections</li>
                  <li><strong>Systematic Renewal:</strong> Regular data updates and historical preservation</li>
                </ul>
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Users className="mr-2 h-6 w-6 text-blue-600" />
              3. User Responsibilities and Conduct
            </h2>
            
            <div className="space-y-6">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Account Security</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Maintain the confidentiality of your account credentials</li>
                  <li>Notify us immediately of any unauthorized access to your account</li>
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Update your information promptly when changes occur</li>
                  <li>You are responsible for all activities that occur under your account</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Acceptable Use</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-green-700 mb-2">✓ Permitted Activities</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Legitimate agricultural trading and business</li>
                      <li>Seeking or providing agricultural services</li>
                      <li>Sharing educational farming content</li>
                      <li>Participating in community discussions</li>
                      <li>Using APIs for business integration</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-700 mb-2">✗ Prohibited Activities</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Fraudulent or deceptive practices</li>
                      <li>Selling illegal or harmful products</li>
                      <li>Harassment or abusive behavior</li>
                      <li>Spam or unsolicited communications</li>
                      <li>Unauthorized data scraping or API abuse</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-red-50">
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
                  Strictly Prohibited Activities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Money laundering or financial crimes</li>
                    <li>Tax evasion or fraudulent reporting</li>
                    <li>Selling counterfeit agricultural products</li>
                    <li>Misrepresenting crop quality or certifications</li>
                  </ul>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Violating intellectual property rights</li>
                    <li>Distributing malware or viruses</li>
                    <li>Attempting to hack or compromise the platform</li>
                    <li>Creating multiple accounts to circumvent restrictions</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Shield className="mr-2 h-6 w-6 text-blue-600" />
              4. Platform Disclaimers and Limitations
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-yellow-50">
                <h3 className="font-semibold mb-2">Platform Role Disclaimer</h3>
                <p className="text-sm mb-2">
                  <strong>AgriConnect is a technology platform that facilitates connections.</strong> We do not:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Own, sell, or directly control any agricultural products or services</li>
                  <li>Guarantee the quality, safety, legality, or availability of user offerings</li>
                  <li>Manage farming operations or provide direct agricultural services</li>
                  <li>Act as a financial institution or provide banking services</li>
                  <li>Assume responsibility for user transactions or business relationships</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Data and Information Disclaimer</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Market Prices:</strong> Provided for informational purposes only; not investment advice</li>
                  <li><strong>Weather Data:</strong> Based on third-party sources; users should verify independently</li>
                  <li><strong>Agricultural Advice:</strong> AI-generated suggestions are not professional consultations</li>
                  <li><strong>External APIs:</strong> We integrate with Kilimo Statistics API and other government sources but cannot guarantee their accuracy</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg bg-red-50">
                <h3 className="font-semibold mb-2 flex items-center">
                  <AlertTriangle className="mr-2 h-4 w-4 text-red-600" />
                  Service Availability
                </h3>
                <p className="text-sm">
                  While we strive for 99.9% uptime, we cannot guarantee uninterrupted service. 
                  The platform may be temporarily unavailable due to maintenance, updates, or technical issues. 
                  We are not liable for losses resulting from service interruptions.
                </p>
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Gavel className="mr-2 h-6 w-6 text-blue-600" />
              5. Limitation of Liability
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-red-50">
                <h3 className="font-semibold mb-2">Maximum Liability Cap</h3>
                <p className="text-sm">
                  <strong>AgriConnect's total liability to you for any claims arising from your use of the platform 
                  shall not exceed KES 50,000 or the amount you paid us in the 12 months preceding the claim, 
                  whichever is lower.</strong>
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Excluded Damages</h3>
                <p className="text-sm mb-2">We are not liable for:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Crop losses or agricultural failures</li>
                    <li>Business losses or lost profits</li>
                    <li>Failed transactions between users</li>
                    <li>Data loss or corruption</li>
                  </ul>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Third-party service failures</li>
                    <li>Consequential or indirect damages</li>
                    <li>User negligence or misuse</li>
                    <li>Force majeure events</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-blue-50">
                <h3 className="font-semibold mb-2">User Indemnification</h3>
                <p className="text-sm">
                  You agree to indemnify and hold AgriConnect harmless from any claims, damages, or expenses 
                  arising from your use of the platform, violation of these terms, or infringement of third-party rights.
                </p>
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property Rights</h2>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">AgriConnect Intellectual Property</h3>
                <p className="text-sm mb-2">All platform content, features, and functionality are owned by AgriConnect, including:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Software code, algorithms, and AI models</li>
                  <li>Trademarks, logos, and brand elements</li>
                  <li>Database structures and aggregated data</li>
                  <li>User interface designs and documentation</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">User Content Rights</h3>
                <p className="text-sm mb-2">You retain ownership of content you submit but grant us a license to:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Display your content on the platform</li>
                  <li>Use aggregated data for agricultural research</li>
                  <li>Moderate and remove inappropriate content</li>
                  <li>Create anonymized analytics and insights</li>
                </ul>
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Payment and Financial Terms</h2>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Platform Fees</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Basic Services:</strong> Free for farmers and basic users</li>
                  <li><strong>Premium Features:</strong> API access, advanced analytics (fees apply)</li>
                  <li><strong>Business Services:</strong> Advertising, premium listings (KES 2,500-15,000/month)</li>
                  <li><strong>Transaction Fees:</strong> May apply to facilitated payments (clearly disclosed)</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg bg-amber-50">
                <h3 className="font-semibold mb-2">Tax Responsibilities</h3>
                <p className="text-sm">
                  <strong>Users are solely responsible for their tax obligations.</strong> This includes:
                  income tax on sales, VAT where applicable, and proper record-keeping for tax authorities.
                  AgriConnect provides transaction records but does not provide tax advice.
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Payment Processing</h3>
                <p className="text-sm">
                  Payments are processed through secure third-party providers (PayPal, M-Pesa). 
                  We do not store payment card information. Refunds are subject to our refund policy 
                  and the terms of the specific service purchased.
                </p>
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Dispute Resolution</h2>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Internal Resolution Process</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li><strong>Direct Communication:</strong> Users should first attempt to resolve disputes directly</li>
                  <li><strong>Platform Mediation:</strong> AgriConnect can facilitate discussions if requested</li>
                  <li><strong>Documentation:</strong> Keep records of all communications and transactions</li>
                  <li><strong>Support Escalation:</strong> Contact support@agriconnect.co.ke for assistance</li>
                </ol>
              </div>

              <div className="p-4 border rounded-lg bg-blue-50">
                <h3 className="font-semibold mb-2">Legal Jurisdiction</h3>
                <p className="text-sm">
                  These terms are governed by Kenyan law. Any legal disputes will be resolved in Kenyan courts, 
                  specifically in Nairobi. Users agree to submit to the jurisdiction of these courts.
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Alternative Dispute Resolution</h3>
                <p className="text-sm">
                  Before initiating legal proceedings, parties agree to attempt resolution through 
                  the Nairobi Centre for International Arbitration or another mutually agreed arbitration service.
                </p>
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">User Termination Rights</h3>
                <p className="text-sm mb-2">You may terminate your account at any time by:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Using the account deletion feature in your profile settings</li>
                  <li>Contacting our support team at support@agriconnect.co.ke</li>
                  <li>Data will be deleted according to our Privacy Policy retention schedule</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg bg-red-50">
                <h3 className="font-semibold mb-2">AgriConnect Termination Rights</h3>
                <p className="text-sm mb-2">We may suspend or terminate accounts for:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Violation of these Terms of Service</li>
                  <li>Fraudulent or illegal activities</li>
                  <li>Abuse of platform features or other users</li>
                  <li>Extended inactivity (12+ months with notice)</li>
                </ul>
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Legal Department</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p><strong>Email:</strong> legal@agriconnect.co.ke</p>
                  <p><strong>Phone:</strong> +254 700 000 001</p>
                  <p><strong>Address:</strong> Nairobi, Kenya</p>
                  <p><strong>Response Time:</strong> 5-7 business days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Customer Support</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p><strong>Email:</strong> support@agriconnect.co.ke</p>
                  <p><strong>Phone:</strong> +254 700 000 002</p>
                  <p><strong>Hours:</strong> 8 AM - 6 PM EAT, Mon-Fri</p>
                  <p><strong>Emergency:</strong> 24/7 for critical issues</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <p className="text-sm font-medium text-blue-900">
              By using AgriConnect, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. 
              These terms constitute the entire agreement between you and AgriConnect regarding the use of our platform.
            </p>
            <p className="text-xs text-blue-700 mt-2">
              For questions about these terms, please contact our legal department at legal@agriconnect.co.ke
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsOfServicePage;
