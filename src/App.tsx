import React, { useEffect } from 'react';
import './styles/map.css';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';

// Mock AppState for web
const AppState = {
  addEventListener: (_event: string, callback: (state: string) => void) => {
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', () => callback('active'));
      window.addEventListener('blur', () => callback('inactive'));
    }
    return {
      remove: () => {
        if (typeof window !== 'undefined') {
          window.removeEventListener('focus', () => {});
          window.removeEventListener('blur', () => {});
        }
      },
    };
  },
};
import ErrorBoundary from './components/ErrorBoundary';
import { resetSessionTimeout, clearSessionTimeout } from './utils/security';
import Index from './pages/Index';
import GroupInputOrders from './pages/GroupInputOrders';
import InputPricingVerification from './pages/InputPricingVerification';
import ReverseBulkAuctions from './pages/ReverseBulkAuctions';
import F2CSubscriptionBoxes from './pages/F2CSubscriptionBoxes';
import Auth from './pages/Auth';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import SearchResultsPage from './pages/SearchResultsPage';
import Logistics from './pages/Logistics';
import ServiceProviders from './pages/ServiceProviders';
import QualityControlDiscussions from './pages/QualityControlDiscussions';
import TrainingEvents from './pages/TrainingEvents';
import MarketLinkages from './pages/MarketLinkages';
import SentimentAnalysis from './pages/SentimentAnalysis';
import SupplyChainProblems from './pages/SupplyChainProblems';
import SupplyChainAnalytics from './pages/SupplyChainAnalytics';
import CooperativeHub from './pages/CooperativeHub';
import RegulatoryAlerts from './pages/RegulatoryAlerts';
import LogisticsIssues from './pages/supplyChainProblems/LogisticsIssues';
import MarketAccess from './pages/supplyChainProblems/MarketAccess';
import PostHarvestLosses from './pages/supplyChainProblems/PostHarvestLosses';
import PriceVolatility from './pages/supplyChainProblems/PriceVolatility';
import QualityControl from './pages/supplyChainProblems/QualityControl';
import LogisticsSolutionsMap from './pages/LogisticsSolutionsMap';
import MarketDemandHotspot from './pages/MarketDemandHotspot';
import CommodityTrading from './pages/CommodityTrading';
import BarterExchange from './pages/commodityTrading/BarterExchange';
import MarketplaceView from './pages/commodityTrading/MarketplaceView';
import PriceTrends from './pages/commodityTrading/PriceTrends';
import MyTrades from './pages/MyTrades';
import CommunityForums from './pages/CommunityForums';
import FarmerPortal from './pages/FarmerPortal';
import ExportMarketOpportunities from './pages/ExportMarketOpportunities';
import CommunityForum from './pages/CommunityForum';

// Dynamically import large pages
const FarmerSuccessStories = React.lazy(() => import('./pages/FarmerSuccessStories'));
const FarmerExporterCollaboration = React.lazy(() => import('./pages/FarmerExporterCollaboration'));
const ExporterProfile = React.lazy(() => import('./pages/ExporterProfile'));
const TermsOfServicePage = React.lazy(() => import('./pages/TermsOfServicePage'));
const PrivacyPolicyPage = React.lazy(() => import('./pages/PrivacyPolicyPage'));
const ApiDocs = React.lazy(() => import('./pages/ApiDocs'));
const SupplyChainAPI = React.lazy(() => import('./pages/SupplyChainAPI'));
const DataManagement = React.lazy(() => import('./pages/DataManagement'));
const CityMarkets = React.lazy(() => import('./pages/CityMarkets'));
const MarketDetails = React.lazy(() => import('./pages/MarketDetails'));
const BusinessMarketing = React.lazy(() => import('./pages/BusinessMarketing'));

const BatchTrackingPage = React.lazy(() => import('./components/BatchTrackingPage').then(module => ({ default: module.BatchTrackingPage })));
const CarbonForumPage = React.lazy(() => import('./components/CarbonForumPage').then(module => ({ default: module.CarbonForumPage })));
const NetworkingPage = React.lazy(() => import('./components/NetworkingPage').then(module => ({ default: module.NetworkingPage })));
import { OfflineBanner } from './components/OfflineBanner';
import TransporterSignUp from './pages/TransporterSignUp';
import ServiceProviderRegistration from './pages/ServiceProviderRegistration';
import KilimoAmsData from './pages/KilimoAmsData';
import DataStatus from './pages/DataStatus';
import DataJobs from './pages/DataJobs';
import SystemStatus from './pages/SystemStatus';
import FAQPage from './pages/FAQPage';
import { AuthProvider } from './hooks/useAuth';
import { Toaster } from 'sonner';
import FarmInputMarketplace from './pages/FarmInputMarketplace';
import EquipmentMarketplace from './pages/EquipmentMarketplace';
import FoodRescueDashboard from './pages/FoodRescueDashboard';
import ImperfectSurplusDashboard from './pages/ImperfectSurplusDashboard';
import BulkOrderDashboard from './pages/BulkOrderDashboard';
import DonationFormPage from './pages/DonationFormPage';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';
import ScrollToTop from './components/ScrollToTop';
import partnerRoutes from './routes/partner.routes';
import farmStatisticsRoutes from './routes/farm-statistics.routes';

const AppContent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        resetSessionTimeout(handleSessionTimeout);
      } else if (nextAppState === 'background') {
        clearSessionTimeout();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    resetSessionTimeout(handleSessionTimeout);

    return () => {
      subscription.remove();
      clearSessionTimeout();
    };
  }, [navigate]);

  const handleSessionTimeout = () => {
    console.log('Session timed out');
    navigate('/auth');
  };

  return (
    <Router>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
         <div className="min-h-screen bg-background font-sans antialiased">
           <OfflineBanner />
           <AuthProvider>
             <React.Suspense fallback={<div>Loading...</div>}>
               <Routes>
                 <Route path="/" element={<Index />} />
                 <Route path="/auth" element={<Auth />} />
                 <Route path="/about" element={<About />} />
                 <Route path="/contact" element={<Contact />} />
                 <Route path="/profile" element={<Profile />} />
                 <Route path="/search" element={<SearchResultsPage />} />
                 <Route path="/logistics" element={<Logistics />} />
                 <Route path="/farm-input-marketplace" element={<FarmInputMarketplace />} />
                 <Route path="/inputs/group-orders" element={<GroupInputOrders />} />
                 <Route path="/inputs/pricing-verification" element={<InputPricingVerification />} />
                 <Route path="/bulk-auctions" element={<ReverseBulkAuctions />} />
                  <Route path="/f2c-subscriptions" element={<F2CSubscriptionBoxes />} />
                  <Route path="/f2c-subscription" element={<F2CSubscriptionBoxes />} />
                  <Route path="/group-input-orders" element={<GroupInputOrders />} />
                  <Route path="/ExportMarketOpportunities" element={<ExportMarketOpportunities />} />
                  <Route path="/inputs" element={<FarmInputMarketplace />} />
                  <Route path="/EquipmentMarketplace" element={<EquipmentMarketplace />} />
                 <Route path="/service-providers" element={<ServiceProviders />} />
                 <Route path="/quality-control-discussions" element={<QualityControlDiscussions />} />
                 <Route path="/training-events" element={<TrainingEvents />} />
                 <Route path="/market-linkages" element={<MarketLinkages />} />
                 <Route path="/sentiment-analysis" element={<SentimentAnalysis />} />
                 <Route path="/supply-chain-problems" element={<SupplyChainProblems />} />
                 <Route path="/supply-chain-analytics" element={<SupplyChainAnalytics />} />
                 <Route path="/cooperative-hub" element={<CooperativeHub />} />
                 <Route path="/regulatory-alerts" element={<RegulatoryAlerts />} />
                 <Route path="/supply-chain-problems/logistics-issues" element={<LogisticsIssues />} />
                 <Route path="/supply-chain-problems/market-access" element={<MarketAccess />} />
                 <Route path="/supply-chain-problems/post-harvest-losses" element={<PostHarvestLosses />} />
                 <Route path="/supply-chain-problems/price-volatility" element={<PriceVolatility />} />
                 <Route path="/supply-chain-problems/quality-control" element={<QualityControl />} />
                 {/* Strategic Features Tabs */}
                 <Route path="/batch-tracking" element={<BatchTrackingPage farmerId="USER_ID_PLACEHOLDER" />} />
                 <Route path="/carbon-forum" element={<CarbonForumPage userId="USER_ID_PLACEHOLDER" />} />
                 <Route path="/networking" element={<NetworkingPage userId="USER_ID_PLACEHOLDER" />} />
                 <Route path="/logistics-solutions-map" element={<LogisticsSolutionsMap />} />
                 <Route path="/market-demand-hotspot" element={<MarketDemandHotspot />} />
                 <Route path="/commodity-trading" element={<CommodityTrading />} />
                 <Route path="/barter-exchange" element={<BarterExchange />} />
                 <Route path="/marketplace" element={<MarketplaceView />} />
                 <Route path="/price-trends" element={<PriceTrends />} />
                 <Route path="/my-trades" element={<MyTrades />} />
                 <Route path="/community-forums" element={<CommunityForums />} />
                 <Route path="/city-markets" element={<CityMarkets />} />
<Route path="/markets/:id" element={<MarketDetails />} />
                 <Route path="/farmer-portal" element={<FarmerPortal />} />
                 <Route path="/equipment-marketplace" element={<EquipmentMarketplace />} />
                 <Route path="/food-rescue-dashboard" element={<FoodRescueDashboard />} />
                 <Route path="/imperfect-surplus-dashboard" element={<ImperfectSurplusDashboard />} />
                 <Route path="/bulk-order-dashboard" element={<BulkOrderDashboard user={{}} />} />
                 <Route path="/donation-form" element={<DonationFormPage />} />
                 {/* <Route path="/donation-list" element={<DonationListPage />} /> */}
                {farmStatisticsRoutes}
                {partnerRoutes.map((route, index) => (
                  <Route key={`partner-${index}`} path={route.path} element={route.element}>
                    {route.children?.map((childRoute, childIndex) => (
                      <Route 
                        key={`partner-child-${childIndex}`} 
                        index={childRoute.index}
                        path={childRoute.path}
                        element={childRoute.element}
                      />
                    ))}
                  </Route>
                ))}
                 <Route path="/farmer-exporter-collaboration" element={<FarmerExporterCollaboration />} />
                 <Route path="/exporter-profile" element={<ExporterProfile />} />
                 <Route path="/farmer-success-stories" element={<FarmerSuccessStories />} />
                 <Route path="/community-forum" element={<CommunityForum />} />
                 <Route path="/transporter-signup" element={<TransporterSignUp />} />
                 <Route path="/service-provider-registration" element={<ServiceProviderRegistration />} />
                 <Route path="/kilimo-ams-data" element={<KilimoAmsData />} />
                 <Route path="/api-docs" element={<ApiDocs />} />
                 <Route path="/supply-chain-api" element={<SupplyChainAPI />} />
                 <Route path="/data-management" element={<DataManagement />} />
                 <Route path="/data-status" element={<DataStatus />} />
                 <Route path="/data-jobs" element={<DataJobs />} />
                 <Route path="/system-status" element={<SystemStatus />} />
                 <Route path="/admin" element={<AdminPanel />} />
                 <Route path="/faq" element={<FAQPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/business-marketing" element={<BusinessMarketing />} />
                 <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                 <Route path="*" element={<NotFound />} />
               </Routes>
             </React.Suspense>
             <Toaster />
             <ScrollToTop />
          </AuthProvider>
        </div>
      </ThemeProvider>
    </Router>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <AppContent />
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
