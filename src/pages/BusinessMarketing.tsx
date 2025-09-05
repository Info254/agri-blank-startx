// @ts-nocheck
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, Users, Target, Heart, Star, Award, DollarSign } from 'lucide-react';

const BusinessMarketing = () => {
  const marketingServices = [
    {
      title: "Brand Development",
      description: "Build a strong agricultural brand that resonates with your target market",
      icon: <Award className="h-6 w-6" />,
      features: ["Logo Design", "Brand Strategy", "Visual Identity", "Market Positioning"]
    },
    {
      title: "Digital Marketing",
      description: "Reach farmers and agribusiness clients through digital channels",
      icon: <TrendingUp className="h-6 w-6" />,
      features: ["Social Media Marketing", "Content Creation", "SEO Optimization", "Email Campaigns"]
    },
    {
      title: "Market Research",
      description: "Understand your market and customer needs for better targeting",
      icon: <BarChart3 className="h-6 w-6" />,
      features: ["Customer Analysis", "Market Trends", "Competitor Research", "Pricing Strategy"]
    },
    {
      title: "Community Engagement",
      description: "Build trust and relationships within the agricultural community",
      icon: <Users className="h-6 w-6" />,
      features: ["Community Building", "Event Marketing", "Partnership Development", "Customer Retention"]
    }
  ];

  const successStories = [
    {
      company: "KenFert Solutions",
      description: "Increased farmer reach by 300% through targeted digital campaigns",
      impact: "300% growth",
      category: "Fertilizer Supplier"
    },
    {
      company: "AgroTech Kenya",
      description: "Built strong brand presence resulting in 150% sales increase",
      impact: "150% sales boost",
      category: "Equipment Provider"
    },
    {
      company: "GreenHarvest Co.",
      description: "Successful community engagement led to 200% customer retention",
      impact: "200% retention",
      category: "Organic Produce"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "KSh 25,000",
      period: "per month",
      features: [
        "Basic brand consultation",
        "Social media setup",
        "Monthly content calendar",
        "Email support"
      ]
    },
    {
      name: "Professional",
      price: "KSh 50,000",
      period: "per month",
      features: [
        "Complete brand development",
        "Multi-platform marketing",
        "Market research report",
        "Bi-weekly strategy calls",
        "Performance analytics"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "KSh 100,000",
      period: "per month",
      features: [
        "Full marketing strategy",
        "Custom campaigns",
        "Dedicated account manager",
        "Weekly consultations",
        "Priority support",
        "Custom integrations"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Agricultural Business Marketing
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-emerald-100">
              Grow your agribusiness with targeted marketing strategies that connect you with farmers and agricultural professionals
            </p>
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50">
              Get Started Today
            </Button>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Marketing Services</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive marketing solutions designed specifically for agricultural businesses
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {marketingServices.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-emerald-100 rounded-full w-fit">
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        • {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl text-muted-foreground">
              See how we've helped agricultural businesses grow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{story.company}</CardTitle>
                    <Badge variant="secondary">{story.category}</Badge>
                  </div>
                  <CardDescription>{story.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                    <span className="font-bold text-emerald-600">{story.impact}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-xl text-muted-foreground">
              Flexible pricing options to suit businesses of all sizes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-emerald-500 shadow-lg' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald-600">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-emerald-600">
                    {plan.price}
                    <span className="text-base font-normal text-muted-foreground">/{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Grow Your Agricultural Business?
          </h2>
          <p className="text-xl mb-8 text-emerald-100 max-w-2xl mx-auto">
            Join hundreds of successful agribusinesses who have transformed their marketing with our expertise
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50">
              Schedule Consultation
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessMarketing;