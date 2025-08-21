
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Eye, UserCheck, AlertTriangle, Info } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-green-600" />
            <CardTitle className="text-3xl">Privacy Policy - AgriConnect</CardTitle>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Effective: January 1, 2024</Badge>
            <Badge variant="outline">Last Updated: {new Date().toLocaleDateString()}</Badge>
            <Badge variant="outline">Version 2.1</Badge>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-2">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900">Important Notice</h3>
                <p className="text-sm text-blue-800">
                  This Privacy Policy complies with Kenya's Data Protection Act (2019) and international standards. 
                  By using AgriConnect, you agree to these terms and the collection and use of your information as described.
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Eye className="mr-2 h-6 w-6 text-green-600" />
              1. Information We Collect
            </h2>
            
            <div className="space-y-6">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Personal Information</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li><strong>Account Data:</strong> Full name, email address, phone number, location (county/region)</li>
                  <li><strong>Profile Information:</strong> Farm type, farm size, experience years, specialization, bio</li>
                  <li><strong>Contact Details:</strong> Business information for service providers, contact preferences</li>
                  <li><strong>Authentication Data:</strong> Login credentials, session information, authentication tokens</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Agricultural Data</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li><strong>Crop Information:</strong> Types of crops, planting schedules, harvest data, yield records</li>
                  <li><strong>Production Data:</strong> Quantities, quality grades, organic certifications, storage conditions</li>
                  <li><strong>Market Activity:</strong> Pricing information, trade history, market preferences</li>
                  <li><strong>Farm Management:</strong> Task tracking, inventory management, financial records</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Usage and Technical Data</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li><strong>Device Information:</strong> Browser type, operating system, device identifiers</li>
                  <li><strong>Usage Analytics:</strong> Pages visited, features used, time spent, interaction patterns</li>
                  <li><strong>Location Data:</strong> GPS coordinates (with permission), county/regional data for market matching</li>
                  <li><strong>API Usage:</strong> Request logs, response times, error rates for service optimization</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg bg-amber-50">
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-amber-600" />
                  External Data Sources
                </h3>
                <p className="text-sm mb-2">We collect agricultural data from legitimate Kenyan government sources:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Kilimo Statistics API:</strong> County agricultural data, crop statistics</li>
                  <li><strong>Kenya National Bureau of Statistics:</strong> Market prices, production data</li>
                  <li><strong>Weather Services:</strong> Climate data, weather alerts for farming decisions</li>
                </ul>
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <UserCheck className="mr-2 h-6 w-6 text-green-600" />
              2. How We Use Your Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Platform Services</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>• Connect farmers with buyers and service providers</p>
                  <p>• Provide real-time market prices and forecasts</p>
                  <p>• Facilitate transportation and logistics matching</p>
                  <p>• Enable warehouse booking and storage solutions</p>
                  <p>• Support quality control and certification tracking</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">AI-Powered Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>• Provide personalized crop recommendations</p>
                  <p>• Analyze market trends and price predictions</p>
                  <p>• Offer farming advice and best practices</p>
                  <p>• Support pest and disease identification</p>
                  <p>• Optimize supply chain operations</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Communication</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>• Send market opportunity notifications</p>
                  <p>• Provide weather alerts and farming tips</p>
                  <p>• Deliver customer support and assistance</p>
                  <p>• Share platform updates and new features</p>
                  <p>• Facilitate user-to-user communications</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Legal Compliance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>• Comply with Kenyan agricultural regulations</p>
                  <p>• Maintain transaction records as required by law</p>
                  <p>• Support tax reporting and business compliance</p>
                  <p>• Respond to legal requests and court orders</p>
                  <p>• Prevent fraud and ensure platform security</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Lock className="mr-2 h-6 w-6 text-green-600" />
              3. Data Sharing and Disclosure
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-900 mb-2">WE DO NOT SELL YOUR PERSONAL DATA</h3>
                <p className="text-sm text-red-800">
                  AgriConnect never sells, trades, or rents your personal information to third parties for marketing purposes. 
                  Your data is used solely to improve our agricultural platform and connect you with legitimate opportunities.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Limited Sharing Scenarios:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded">
                    <h4 className="font-medium mb-2">Service Providers</h4>
                    <p className="text-sm">Trusted partners who help operate our platform (Supabase for data storage, SMS providers, payment processors)</p>
                  </div>
                  <div className="p-3 border rounded">
                    <h4 className="font-medium mb-2">Platform Users</h4>
                    <p className="text-sm">Basic profile information visible to other users for legitimate agricultural business purposes</p>
                  </div>
                  <div className="p-3 border rounded">
                    <h4 className="font-medium mb-2">Legal Requirements</h4>
                    <p className="text-sm">When required by Kenyan law, court orders, or regulatory authorities (KNBS, Ministry of Agriculture)</p>
                  </div>
                  <div className="p-3 border rounded">
                    <h4 className="font-medium mb-2">Aggregated Data</h4>
                    <p className="text-sm">Anonymous, aggregated agricultural trends shared with research institutions for farming improvements</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Data Security Measures</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Technical Safeguards</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>• <strong>Encryption:</strong> AES-256 for sensitive data at rest</p>
                  <p>• <strong>Transmission:</strong> TLS 1.3 for all communications</p>
                  <p>• <strong>Authentication:</strong> Multi-factor authentication (SMS/Email)</p>
                  <p>• <strong>Access Control:</strong> Role-based permissions and audit logs</p>
                  <p>• <strong>Database Security:</strong> Row-level security and SQL injection protection</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Operational Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>• Regular security audits and vulnerability assessments</p>
                  <p>• Employee access controls and security training</p>
                  <p>• Incident response and breach notification procedures</p>
                  <p>• Compliance with ISO 27001 security standards</p>
                  <p>• Regular backups and disaster recovery procedures</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Your Rights and Choices</h2>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-3">Data Protection Rights (Kenya Data Protection Act 2019)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <h4 className="font-medium">Access Rights</h4>
                    <p className="text-sm">Request a copy of all personal data we hold about you</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Correction Rights</h4>
                    <p className="text-sm">Update or correct any inaccurate information</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Deletion Rights</h4>
                    <p className="text-sm">Request deletion of your account and associated data</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Portability Rights</h4>
                    <p className="text-sm">Export your data in a machine-readable format</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-3">Communication Preferences</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
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
            <h2 className="text-2xl font-semibold mb-4">6. Data Retention Policy</h2>
            
            <div className="space-y-3">
              <div className="p-3 border rounded">
                <h4 className="font-medium">Active Accounts</h4>
                <p className="text-sm">Data retained while account is active and for 2 years after last login</p>
              </div>
              <div className="p-3 border rounded">
                <h4 className="font-medium">Transaction Records</h4>
                <p className="text-sm">Kept for 7 years for tax compliance and agricultural business records</p>
              </div>
              <div className="p-3 border rounded">
                <h4 className="font-medium">Communication Logs</h4>
                <p className="text-sm">Retained for 1 year for customer support and dispute resolution</p>
              </div>
              <div className="p-3 border rounded">
                <h4 className="font-medium">Aggregated Analytics</h4>
                <p className="text-sm">Anonymous data may be retained indefinitely for agricultural research</p>
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Data Protection Officer</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p><strong>Email:</strong> privacy@agriconnect.co.ke</p>
                  <p><strong>Phone:</strong> +254 700 000 000</p>
                  <p><strong>Address:</strong> Nairobi, Kenya</p>
                  <p><strong>Response Time:</strong> 48-72 hours</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Regulatory Authority</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p><strong>Office:</strong> Data Protection Commissioner</p>
                  <p><strong>Address:</strong> P.O. Box 66156 – 00800, Nairobi</p>
                  <p><strong>Email:</strong> info@odpc.go.ke</p>
                  <p><strong>Website:</strong> www.odpc.go.ke</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-sm font-medium text-green-900">
              By using AgriConnect, you acknowledge that you have read, understood, and agree to this Privacy Policy. 
              This policy is governed by Kenyan data protection laws and international best practices.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicyPage;
