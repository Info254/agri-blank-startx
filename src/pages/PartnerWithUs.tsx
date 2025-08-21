import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import PartnerEventsList from '@/components/PartnerEventsList';
import { CheckCircle, ArrowRight, MapPin, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { getMyPartner } from '@/services/partnerService';
import { AuthDivider } from '@/components/partner/AuthDivider';
import { Loader2 } from 'lucide-react';

const PartnerWithUs: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hasPartnerProfile, setHasPartnerProfile] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const checkPartnerProfile = async () => {
      if (user) {
        try {
          const { data: partner, error } = await getMyPartner();
          if (partner && !error) {
            setHasPartnerProfile(true);
          }
        } catch (error) {
          console.error('Error fetching partner data:', error);
        }
      }
      setLoading(false);
    };
    
    checkPartnerProfile();
  }, [user]);

  const handleGetStarted = () => {
    if (user) {
      navigate(hasPartnerProfile ? '/partner/dashboard' : '/partner/onboarding');
    } else {
      navigate('/auth?redirect=/partner/onboarding');
    }
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Partner With Us</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Join our network of agricultural service providers and reach thousands of farmers across Africa
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Why Partner With Us?</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="bg-primary/10 p-2 rounded-full mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Expand Your Reach</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with thousands of farmers and agribusinesses across Africa through our platform.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="bg-primary/10 p-2 rounded-full mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Business Growth</h3>
                <p className="text-sm text-muted-foreground">
                  Access new markets and opportunities to grow your agricultural business.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="bg-primary/10 p-2 rounded-full mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Training & Support</h3>
                <p className="text-sm text-muted-foreground">
                  Get access to exclusive training programs and business support services.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="bg-primary/10 p-2 rounded-full mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Community & Networking</h3>
                <p className="text-sm text-muted-foreground">
                  Join a community of like-minded agricultural professionals and organizations.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>
                {hasPartnerProfile ? 'Welcome Back!' : 'Become a Partner'}
              </CardTitle>
              <CardDescription>
                {user 
                  ? hasPartnerProfile 
                    ? 'Manage your partner account and access exclusive features'
                    : 'Complete your partner profile to get started'
                  : 'Sign in or create an account to join our partner network'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleGetStarted}
                className="w-full"
                size="lg"
              >
                {user 
                  ? hasPartnerProfile 
                    ? 'Go to Dashboard' 
                    : 'Start Partner Application'
                  : 'Sign In to Get Started'}
              </Button>
              
              {!user && <AuthDivider />}
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Why Partner With Us?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Increased Visibility</h3>
                  <p className="text-sm text-muted-foreground">Showcase your services to a targeted audience of farmers and agribusinesses.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Business Growth</h3>
                  <p className="text-sm text-muted-foreground">Access new markets and revenue streams through our platform.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Networking</h3>
                  <p className="text-sm text-muted-foreground">Connect with potential customers, suppliers, and service providers.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Resources & Support</h3>
                  <p className="text-sm text-muted-foreground">Access training, tools, and support to grow your business.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Impact</h3>
                  <p className="text-sm text-muted-foreground">Contribute to sustainable agricultural development and food security.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Flexibility</h3>
                  <p className="text-sm text-muted-foreground">Choose the partnership model that works best for your organization.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Ready to Get Started?</h2>
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-muted-foreground mb-6">
              Join our network of agricultural partners and start creating impact today. The application process is simple and only takes a few minutes.
            </p>
            <Button size="lg" onClick={handleGetStarted}>
              Begin Partner Application <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Upcoming Partner Events</h2>
          <PartnerEventsList limit={3} />
          <div className="text-center mt-6">
            <Button variant="outline" onClick={() => navigate('/events')}>
              View All Events <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-2 text-center">Have Questions?</h2>
          <p className="text-muted-foreground text-center mb-6">
            Our partnership team is here to help. Contact us for more information.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="outline" className="gap-2">
              <MapPin className="h-4 w-4" />
              Visit Us
            </Button>
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Schedule a Call
            </Button>
            <Button variant="outline" className="gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              Email Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerWithUs;
