// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { signIn, signUp } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';
import { Tractor, Sprout, Users, TrendingUp, MapPin, Phone, Mail, User, Briefcase } from 'lucide-react';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [signInForm, setSignInForm] = useState({
    email: '',
    password: ''
  });
  
  const [signUpForm, setSignUpForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: '',
    county: '',
    contactNumber: '',
    farmType: '',
    farmSize: '',
    experienceYears: ''
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const counties = [
    'Nairobi', 'Kiambu', 'Nakuru', 'Kisumu', 'Mombasa', 'Eldoret', 'Thika', 'Nyeri', 'Meru',
    'Embu', 'Machakos', 'Makueni', 'Kitui', 'Garissa', 'Mandera', 'Wajir', 'Marsabit', 'Isiolo',
    'Samburu', 'Turkana', 'West Pokot', 'Trans Nzoia', 'Uasin Gishu', 'Elgeyo Marakwet', 'Nandi',
    'Baringo', 'Laikipia', 'Nyandarua', 'Murang\'a', 'Kirinyaga', 'Tharaka-Nithi', 'Mwingi',
    'Kericho', 'Bomet', 'Kakamega', 'Vihiga', 'Bungoma', 'Busia', 'Siaya', 'Kisii', 'Nyamira',
    'Migori', 'Homa Bay', 'Kilifi', 'Taita Taveta', 'Kwale', 'Lamu', 'Tana River'
  ];

  const farmTypes = [
    'Mixed Farming', 'Crop Production', 'Livestock', 'Dairy Farming', 'Poultry',
    'Horticulture', 'Floriculture', 'Aquaculture', 'Agroforestry', 'Organic Farming'
  ];

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signInForm.email || !signInForm.password) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      await signIn(signInForm);
      toast({
        title: 'Welcome back!',
        description: 'You have been signed in successfully.',
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Sign In Failed',
        description: error.message || 'Please check your credentials and try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signUpForm.email || !signUpForm.password || !signUpForm.fullName) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    if (signUpForm.password !== signUpForm.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'Passwords do not match. Please try again.',
        variant: 'destructive'
      });
      return;
    }

    if (signUpForm.password.length < 6) {
      toast({
        title: 'Weak Password',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      await signUp({
        ...signUpForm,
        farmSize: signUpForm.farmSize ? parseFloat(signUpForm.farmSize) : undefined,
        experienceYears: signUpForm.experienceYears ? parseInt(signUpForm.experienceYears) : undefined
      });
      
      toast({
        title: 'Account Created!',
        description: 'Please check your email to verify your account.',
      });
      
      // Clear form
      setSignUpForm({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        role: '',
        county: '',
        contactNumber: '',
        farmType: '',
        farmSize: '',
        experienceYears: ''
      });
      
    } catch (error: any) {
      toast({
        title: 'Registration Failed',
        description: error.message || 'Please try again with different information.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col justify-center py-12 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-primary rounded-full p-2">
              <Sprout className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Soko Connect</h1>
              <p className="text-sm text-gray-600">Agricultural Marketplace Platform</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
            <Tractor className="h-8 w-8 mx-auto text-primary mb-2" />
            <p className="text-xs font-medium">Equipment</p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
            <Users className="h-8 w-8 mx-auto text-green-600 mb-2" />
            <p className="text-xs font-medium">Community</p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
            <TrendingUp className="h-8 w-8 mx-auto text-blue-600 mb-2" />
            <p className="text-xs font-medium">Markets</p>
          </div>
          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
            <MapPin className="h-8 w-8 mx-auto text-orange-600 mb-2" />
            <p className="text-xs font-medium">Transport</p>
          </div>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="signin-email">Email Address *</Label>
                    <div className="relative">
                      <Input
                        id="signin-email"
                        type="email"
                        value={signInForm.email}
                        onChange={(e) => setSignInForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="farmer@example.com"
                        className="pl-10"
                        required
                      />
                      <Mail className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signin-password">Password *</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={signInForm.password}
                      onChange={(e) => setSignInForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-fullname">Full Name *</Label>
                    <div className="relative">
                      <Input
                        id="signup-fullname"
                        type="text"
                        value={signUpForm.fullName}
                        onChange={(e) => setSignUpForm(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="John Kariuki"
                        className="pl-10"
                        required
                      />
                      <User className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-email">Email Address *</Label>
                    <div className="relative">
                      <Input
                        id="signup-email"
                        type="email"
                        value={signUpForm.email}
                        onChange={(e) => setSignUpForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="farmer@example.com"
                        className="pl-10"
                        required
                      />
                      <Mail className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="signup-password">Password *</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={signUpForm.password}
                        onChange={(e) => setSignUpForm(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Min 6 characters"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="signup-confirm">Confirm *</Label>
                      <Input
                        id="signup-confirm"
                        type="password"
                        value={signUpForm.confirmPassword}
                        onChange={(e) => setSignUpForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Repeat password"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-role">Role</Label>
                    <div className="relative">
                      <Select
                        value={signUpForm.role}
                        onValueChange={(value) => setSignUpForm(prev => ({ ...prev, role: value }))}
                      >
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="farmer">Farmer</SelectItem>
                          <SelectItem value="buyer">Buyer</SelectItem>
                          <SelectItem value="transporter">Transporter</SelectItem>
                          <SelectItem value="supplier">Supplier</SelectItem>
                          <SelectItem value="extension_officer">Extension Officer</SelectItem>
                        </SelectContent>
                      </Select>
                      <Briefcase className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-county">County</Label>
                    <Select
                      value={signUpForm.county}
                      onValueChange={(value) => setSignUpForm(prev => ({ ...prev, county: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your county" />
                      </SelectTrigger>
                      <SelectContent>
                        {counties.map(county => (
                          <SelectItem key={county} value={county}>{county}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="signup-phone">Contact Number</Label>
                    <div className="relative">
                      <Input
                        id="signup-phone"
                        type="tel"
                        value={signUpForm.contactNumber}
                        onChange={(e) => setSignUpForm(prev => ({ ...prev, contactNumber: e.target.value }))}
                        placeholder="+254712345678"
                        className="pl-10"
                      />
                      <Phone className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    </div>
                  </div>

                  {signUpForm.role === 'farmer' && (
                    <>
                      <div>
                        <Label htmlFor="signup-farmtype">Farm Type</Label>
                        <Select
                          value={signUpForm.farmType}
                          onValueChange={(value) => setSignUpForm(prev => ({ ...prev, farmType: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select farm type" />
                          </SelectTrigger>
                          <SelectContent>
                            {farmTypes.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="signup-farmsize">Farm Size (acres)</Label>
                          <Input
                            id="signup-farmsize"
                            type="number"
                            value={signUpForm.farmSize}
                            onChange={(e) => setSignUpForm(prev => ({ ...prev, farmSize: e.target.value }))}
                            placeholder="5.0"
                            step="0.1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="signup-experience">Experience (years)</Label>
                          <Input
                            id="signup-experience"
                            type="number"
                            value={signUpForm.experienceYears}
                            onChange={(e) => setSignUpForm(prev => ({ ...prev, experienceYears: e.target.value }))}
                            placeholder="10"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <Badge variant="outline">Market Access</Badge>
            <Badge variant="outline">Price Alerts</Badge>
            <Badge variant="outline">Transport Coordination</Badge>
            <Badge variant="outline">Equipment Sharing</Badge>
          </div>
          <p className="text-xs text-gray-500">
            Join thousands of farmers connecting across Kenya
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;