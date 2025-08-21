
import React from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import AmisKeApiHandler from '@/services/amis-ke/api-handler';

const Footer: React.FC = () => {
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [featureForm, setFeatureForm] = useState({ title: '', description: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleFeatureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await AmisKeApiHandler.post('/api/feature-request', featureForm);
      toast({ title: 'Feature Request Submitted', description: 'Thank you for your feedback!' });
      setShowFeatureModal(false);
      setFeatureForm({ title: '', description: '', email: '' });
    } catch (err: any) {
      toast({ title: 'Submission Failed', description: err.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-background border-t mt-auto">
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">AgriConnect</h3>
            <p className="text-sm text-muted-foreground">
              Connecting farmers, traders, and service providers for a better agricultural ecosystem.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/commodity-trading" className="text-muted-foreground hover:text-foreground">Commodity Trading</Link></li>
              <li><Link to="/logistics" className="text-muted-foreground hover:text-foreground">Logistics</Link></li>
              <li><Link to="/service-providers" className="text-muted-foreground hover:text-foreground">Service Providers</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/faq" className="text-muted-foreground hover:text-foreground">FAQ</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
              <li><Link to="/community-forum" className="text-muted-foreground hover:text-foreground">Community Forum</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 SokoConnect. All rights reserved.</p>
        </div>
      </div>
      <Dialog open={showFeatureModal} onOpenChange={setShowFeatureModal}>
        <DialogTrigger asChild>
          <Button variant="outline" className="mt-6">Submit Feature Request</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit a Feature Request</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFeatureSubmit} className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={featureForm.title} onChange={e => setFeatureForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={featureForm.description} onChange={e => setFeatureForm(f => ({ ...f, description: e.target.value }))} required />
            </div>
            <div>
              <Label>Email (optional)</Label>
              <Input type="email" value={featureForm.email} onChange={e => setFeatureForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowFeatureModal(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </footer>
  );
};

export default Footer;
