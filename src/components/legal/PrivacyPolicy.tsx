
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { PRIVACY_CONFIG, CONTENT_RATING } from '@/config/privacy';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Privacy Policy - AgriTender Connect</CardTitle>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          <Badge variant="outline" className="w-fit">Effective Date: January 1, 2024</Badge>
        </CardHeader>
        <CardContent className="space-y-8">
          
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
            <p className="mb-4">
              AgriTender Connect ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you use our agricultural 
              marketplace platform, mobile application, and related services.
            </p>
            <p className="mb-4">
              We operate as a technology platform connecting farmers, buyers, and service providers. We do not 
              manage farming operations or control agricultural transactions - we provide the platform that 
              enables these connections while ensuring data protection and user privacy.
            </p>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium mb-2">Platform Disclaimer</h3>
              <p className="text-sm">
                AgriTender Connect serves as a neutral platform facilitating connections within the agricultural 
                ecosystem. Users are responsible for their own transactions, agreements, and business decisions. 
                We do not assume liability for farming outcomes, crop performance, or business results.
              </p>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Personal Information</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {PRIVACY_CONFIG.dataCollection.personalInfo.purpose}
                </p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {PRIVACY_CONFIG.dataCollection.personalInfo.types.map(type => (
                    <li key={type}>
                      {type === 'email' && 'Email address for account creation and communication'}
                      {type === 'phone' && 'Phone number for SMS notifications and verification'}
                      {type === 'name' && 'Full name for profile identification and communication'}
                      {type === 'location' && 'Location data for market matching and logistics optimization'}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Usage Data</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {PRIVACY_CONFIG.dataCollection.usage.purpose}
                </p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>App interactions and navigation patterns</li>
                  <li>Search queries and filter preferences</li>
                  <li>Transaction completion rates</li>
                  <li>Feature usage statistics</li>
                  <li>Performance metrics and error logs</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Location Data</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {PRIVACY_CONFIG.dataCollection.location.purpose}
                </p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>GPS coordinates for farm mapping and parcel management</li>
                  <li>County and regional data for market price information</li>
                  <li>Proximity data for logistics and delivery services</li>
                  <li>Weather alert locations for timely notifications</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Audio Data (Optional)</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {PRIVACY_CONFIG.dataCollection.audio.purpose}
                </p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Voice recordings for AI assistant interactions</li>
                  <li>Audio files for crop monitoring and reporting</li>
                  <li>Voice commands for hands-free platform navigation</li>
                </ul>
                <Badge variant="secondary" className="mt-2">Audio collection requires explicit consent</Badge>
              </div>

              <div>
                <h3 className="font-medium mb-2">Agricultural Data</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Information related to farming activities and agricultural business
                </p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Crop types, planting schedules, and harvest data</li>
                  <li>Farm size, parcel information, and land use</li>
                  <li>Production volumes and quality metrics</li>
                  <li>Input usage and cost tracking</li>
                  <li>Market transaction history and pricing</li>
                </ul>
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Platform Services</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <li>Facilitate connections between farmers and buyers</li>
                  <li>Provide market price information and forecasts</li>
                  <li>Enable logistics and transportation matching</li>
                  <li>Support quality control and certification tracking</li>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">AI-Powered Features</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <li>Crop recommendations and farming advice</li>
                  <li>Market trend analysis and predictions</li>
                  <li>Pest and disease identification</li>
                  <li>Yield optimization suggestions</li>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Communication</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <li>Send notifications about market opportunities</li>
                  <li>Provide weather alerts and farming tips</li>
                  <li>Customer support and technical assistance</li>
                  <li>Platform updates and new feature announcements</li>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Analytics</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <li>Improve platform performance and user experience</li>
                  <li>Identify market trends and opportunities</li>
                  <li>Enhance matching algorithms</li>
                  <li>Develop new features based on user needs</li>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-4">4. Data Sharing and Disclosure</h2>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium mb-2">We DO NOT sell your personal data</h3>
                <p className="text-sm">
                  AgriTender Connect does not sell, trade, or rent your personal information to third parties 
                  for marketing purposes. Your data is used solely to improve our services and connect you 
                  with relevant agricultural opportunities.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Limited Sharing Scenarios</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li><strong>Service Providers:</strong> Trusted partners who help operate our platform (payment processors, cloud hosting, SMS services)</li>
                  <li><strong>Business Partners:</strong> Aggregated, anonymized data for market research and agricultural development initiatives</li>
                  <li><strong>Legal Requirements:</strong> When required by law, court order, or regulatory authorities</li>
                  <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets (with user notification)</li>
                  <li><strong>Platform Users:</strong> Basic profile information visible to other users for transaction purposes</li>
                </ul>
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-4">5. Security Measures</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Technical Safeguards</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li><strong>Encryption:</strong> {PRIVACY_CONFIG.security.encryption} for sensitive data</li>
                  <li><strong>Transmission:</strong> {PRIVACY_CONFIG.security.transmission} for all communications</li>
                  <li><strong>Storage:</strong> {PRIVACY_CONFIG.security.storage} with regular backups</li>
                  <li><strong>Authentication:</strong> {PRIVACY_CONFIG.security.authentication}</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Operational Security</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Employee access controls and training</li>
                  <li>Incident response and breach notification procedures</li>
                  <li>Compliance with international security standards</li>
                </ul>
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-4">6. Your Rights and Choices</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Data Rights</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
                  <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                  <li><strong>Objection:</strong> Opt-out of certain data processing activities</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Communication Preferences</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Manage notification settings in your account preferences</li>
                  <li>Opt-out of marketing communications via email or SMS</li>
                  <li>Control weather alerts and price notifications</li>
                  <li>Customize AI assistant interaction preferences</li>
                </ul>
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-4">7. Data Retention</h2>
            <p className="mb-4">
              We retain your information only as long as necessary to provide services and comply with legal obligations:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li><strong>Active Accounts:</strong> Data retained while account is active and for 2 years after last activity</li>
              <li><strong>Transaction Records:</strong> Kept for 7 years for tax and legal compliance</li>
              <li><strong>Communication Logs:</strong> Retained for 1 year for customer support purposes</li>
              <li><strong>Analytics Data:</strong> Aggregated data may be retained indefinitely for research</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-4">8. International Data Transfers</h2>
            <p className="mb-4">
              Your data may be processed in countries outside Kenya, including data centers in the European Union 
              and United States. We ensure appropriate safeguards are in place through:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Adequacy decisions by the Kenyan Data Protection Authority</li>
              <li>Standard contractual clauses with data processors</li>
              <li>Certification under international privacy frameworks</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-4">9. Children's Privacy</h2>
            <p className="mb-2">
              AgriTender Connect is not intended for children under 18. We do not knowingly collect personal 
              information from children. If you believe we have collected information from a child, please contact us 
              immediately.
            </p>
            <Badge variant="outline">Age Restriction: 18+ years</Badge>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-4">10. Changes to Privacy Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy periodically. Significant changes will be communicated through:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Email notification to registered users</li>
              <li>In-app notifications</li>
              <li>Prominent notice on our website</li>
              <li>SMS alerts for major policy changes</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-4">11. Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Privacy Officer</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p>Email: privacy@agritender.co.ke</p>
                  <p>Phone: +254 700 000 000</p>
                  <p>Response Time: 48-72 hours</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Data Protection Authority</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p>Office of the Data Protection Commissioner</p>
                  <p>P.O. Box 66156 – 00800, Nairobi</p>
                  <p>Email: info@odpc.go.ke</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <div className="mt-8 p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-center">
              By using AgriTender Connect, you acknowledge that you have read, understood, and agree to this Privacy Policy.
              This policy is governed by Kenyan data protection laws and international best practices.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;
