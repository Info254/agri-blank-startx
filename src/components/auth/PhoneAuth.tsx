// @ts-nocheck
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Phone, MessageSquare } from 'lucide-react';

export const PhoneAuth = ({ onSuccess }) => {
  const { toast } = useToast();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${phone}`,
      });
      setStep('otp');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (otp === '1234') {
        toast({
          title: "Success", 
          description: "Phone verified successfully!",
        });
        onSuccess();
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (step === 'otp') {
    return (
      <form onSubmit={handleVerifyOTP} className="space-y-4">
        <div className="text-center mb-4">
          <MessageSquare className="h-12 w-12 text-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Enter the 4-digit code sent to {phone}
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="otp">Verification Code</Label>
          <Input
            id="otp"
            type="text"
            placeholder="Enter 4-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={4}
            className="text-center text-lg tracking-widest"
            required
          />
          <p className="text-xs text-muted-foreground text-center">
            Demo: Use code "1234"
          </p>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Verifying..." : "Verify Code"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setStep('phone')}
          className="w-full"
        >
          Back to Phone Entry
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSendOTP} className="space-y-4">
      <div className="text-center mb-4">
        <Phone className="h-12 w-12 text-primary mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          We'll send you a verification code
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+254 712 345 678"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Sending..." : "Send Verification Code"}
      </Button>
    </form>
  );
};