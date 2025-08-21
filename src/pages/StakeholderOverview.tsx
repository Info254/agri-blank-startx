
import React from 'react';

/**
 * Agri-Tender Connect: World-Class Stakeholder Overview
 *
 * Why choose Agri-Tender Connect?
 *
 * - Empowerment: Farmers, agents, buyers, schools, CBOs, hospitals, churches, hospices, NGOs, and investors all benefit from a unified, transparent, and innovative digital marketplace.
 * - Engagement: Real-time prices, bulk orders, auctions, donations, reviews, food rescue, carbon forum, push notifications, and offline support.
 * - Impact: Proven results in food security, education, health, climate action, and community development.
 * - Trust: Advanced security, privacy, and verification for every transaction and interaction.
 * - Scalability: Ready for global partners, funders, and multi-stakeholder growth.
 *
 * Key Features & Pages:
 * - Admin Dashboard: Manage platform, analytics, and impact reports.
 * - Agent Dashboard: Product management, input pricing, verification, reviews, donations, analytics.
 * - Bulk Order Form & List: Aggregate demand for better prices and logistics.
 * - Input Pricing List & Verification: Transparent, crowd-sourced, and supplier-verified pricing.
 * - Donation Form & List: Support schools, CBOs, hospitals, churches, hospices with targeted donations and feedback.
 * - Food Rescue Form & List: Reduce waste, support communities, and promote sustainability.
 * - Product Auction Dashboard: Dynamic pricing, fair bidding, and direct sales.
 * - Supplier Review & Verification: Build trust and accountability.
 * - Carbon Forum & Community: Climate-smart agriculture, engagement, and knowledge sharing.
 * - Cooperative Hub: Register cooperatives, form groups, recruit members for collective farming.
 * - Regulatory Alerts: Community-driven safety warnings, pesticide bans, contamination alerts.
 * - Supply Chain Analytics: Proactive churn prediction, optimization opportunities, relationship health.
 * - Behavioral Data Collection: Field agent reporting for predictive analytics and intervention.
 * - Success Stories & Impact Reports: Real-world results and testimonials.
 * - Push Notification Center: Real-time updates for all users and events.
 * - Offline/PWA Support: Seamless access in low-connectivity environments.
 *
 * Buy-In Points for All Users:
 * - Farmers: Maximize profits, reduce waste, and access new markets.
 * - Agents/Suppliers: Streamline operations, build reputation, and grow business.
 * - Buyers: Discover quality products, participate in auctions, and support donations.
 * - Schools/CBOs/Hospitals/Churches/Hospices: Receive targeted support, provide feedback, and engage with the community.
 * - NGOs/Government: Monitor trends, support impact, and access analytics.
 * - General Public: Join food rescue, community forums, and climate action.
 * - Investors: Scalable, secure, and impact-driven platform with global reach and advanced reporting.
 *
 * Engagement & Uptake:
 * - Push notifications for every key event (donations, reviews, auctions, food rescue, etc.)
 * - Gamified achievements, badges, and leaderboards for active users.
 * - Community forums, Q&A, and support channels.
 * - Impact dashboards and transparent reporting.
 * - Seamless onboarding and user education.
 */

const StakeholderOverview: React.FC = () => (
  <div className="max-w-4xl mx-auto p-4 bg-white rounded shadow">
    <h1 className="text-2xl font-bold mb-4 text-green-700">Agri-Tender Connect: Stakeholder Value & Feature Overview</h1>
    <p className="mb-4 text-base text-gray-700">Empowering every stakeholder in agriculture and social impact with a world-class, transparent, and engaging digital marketplace.</p>
    {/* Mobile-friendly feature grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      {[
        { label: 'Admin Dashboard', route: '/admin-panel' },
        { label: 'Agent Dashboard', route: '/agent-dashboard' },
        { label: 'Bulk Order', route: '/bulk-order-dashboard' },
        { label: 'Input Pricing', route: '/input-pricing-dashboard' },
        { label: 'Donations', route: '/donation-form' },
        { label: 'Donation List', route: '/donation-list' },
        { label: 'Food Rescue', route: '/food-rescue-dashboard' },
        { label: 'Product Auctions', route: '/agent-product-auction-dashboard' },
        { label: 'Supplier Reviews', route: '/supplier-review-verification' },
        { label: 'Carbon Forum', route: '/carbon-forum' },
        { label: 'Success Stories', route: '/farmer-success-stories' },
        { label: 'Impact Reports', route: '/stakeholder-overview' },
        { label: 'Push Notifications', route: '/notification-settings' },
        { label: 'Community Forums', route: '/community-forums' },
        { label: 'Marketplace', route: '/farm-input-marketplace' },
        { label: 'City Markets', route: '/city-markets' },
        { label: 'Equipment Marketplace', route: '/equipment-marketplace' },
        { label: 'Analytics', route: '/sentiment-analysis' },
        { label: 'Logistics', route: '/logistics' },
        { label: 'Service Providers', route: '/service-providers' },
        { label: 'Cooperative Hub', route: '/cooperative-hub' },
        { label: 'Regulatory Alerts', route: '/regulatory-alerts' },
        { label: 'Supply Chain Analytics', route: '/supply-chain-analytics' },
        { label: 'Profile', route: '/profile' },
        { label: 'Farmer Portal', route: '/farmer-portal' },
        { label: 'Offline Support', route: '/offline-banner' },
      ].map((feature) => (
        <a
          key={feature.route}
          href={feature.route}
          className="block p-4 rounded-lg shadow hover:bg-green-50 border border-gray-200 text-green-800 font-semibold text-center text-base transition-all"
        >
          {feature.label}
        </a>
      ))}
    </div>
    {/* Engagement & Uptake */}
    <h2 className="text-lg font-semibold mb-2 text-green-700">Engagement & Uptake</h2>
    <ul className="list-disc pl-6 mb-4 text-sm">
      <li>Push notifications for every key event (donations, reviews, auctions, food rescue, etc.)</li>
      <li>Gamified achievements, badges, and leaderboards for active users</li>
      <li>Community forums, Q&A, and support channels</li>
      <li>Impact dashboards and transparent reporting</li>
      <li>Seamless onboarding and user education</li>
    </ul>
    {/* Why Choose Section */}
    <h2 className="text-lg font-semibold mb-2 text-green-700">Why Choose Agri-Tender Connect?</h2>
    <ul className="list-disc pl-6 mb-4 text-sm">
      <li>Empowerment, engagement, and impact for every stakeholder</li>
      <li>World-class security, privacy, and verification</li>
      <li>Scalable, future-proof architecture for global growth</li>
      <li>Ready for integration with partners, funders, and investors</li>
    </ul>
    {/* Offline/blank page handling */}
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 text-yellow-800 rounded">
      <strong>Offline or Blank Page?</strong> If you see a blank page, check your internet connection or try again later. All features are available online and offline (PWA support).
    </div>
    <p className="text-gray-600 text-xs">For more, see README, deployment guide, and impact reports.</p>
  </div>
);

export default StakeholderOverview;
