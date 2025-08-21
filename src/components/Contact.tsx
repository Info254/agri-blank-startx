
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Message Sent",
      description: "We've received your message and will get back to you soon.",
    });
    
    // Reset form
    setName('');
    setEmail('');
    setMessage('');
    setIsSubmitting(false);
  };

  return (
    <section id="contact" className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12 animate-fade-up">
        <div className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-2">
          Get In Touch
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h2>
        <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
          Have questions about agricultural issues, tenders, or supply chain opportunities? 
          We're here to help you find the answers you need.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <Card className="p-8 shadow-sm bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-default-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-white/50 dark:bg-black/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/50 dark:bg-black/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="How can we help you?"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="resize-none bg-white/50 dark:bg-black/50"
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </Card>
        
        <div className="space-y-8 animate-fade-up">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold mb-2">Why contact us?</h3>
            <div className="space-y-4 text-foreground/80">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center text-sage-800 flex-shrink-0">
                  <span className="font-medium">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-lg mb-1">Agricultural Expertise</h4>
                  <p>Get answers to your specific agricultural questions from our team of experts.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-soil-100 flex items-center justify-center text-soil-800 flex-shrink-0">
                  <span className="font-medium">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-lg mb-1">Tender Assistance</h4>
                  <p>Need help understanding a tender process or preparing a bid? We can guide you.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 flex-shrink-0">
                  <span className="font-medium">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-lg mb-1">Career Guidance</h4>
                  <p>Looking for supply chain job opportunities or career advice? Get in touch.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/30 p-6 rounded-lg border border-default-border">
            <h4 className="font-medium text-lg mb-2">Alternative Contact Methods</h4>
            <div className="space-y-2">
              <p className="flex items-center">
                <span className="font-medium mr-2">Email:</span>
                <a href="mailto:info@agritender.co.ke" className="text-primary hover:underline">
                  info@agritender.co.ke
                </a>
              </p>
              <p className="flex items-center">
                <span className="font-medium mr-2">Phone:</span>
                <a href="tel:+254700000000" className="text-primary hover:underline">
                  +254 700 000 000
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
