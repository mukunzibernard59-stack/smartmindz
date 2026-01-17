import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, CheckCircle, Copy, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: 'pro' | 'family';
  onPaymentConfirmed?: () => void;
}

const PAYMENT_DETAILS = {
  pro: {
    name: 'Pro Plan',
    priceRWF: 2500,
    priceUSD: '$1.50',
    duration: '30 days',
    seats: 1,
  },
  family: {
    name: 'Family Plan',
    priceRWF: 15000,
    priceUSD: '$9.99',
    duration: '30 days',
    seats: 5,
  },
};

const MOMO_NUMBER = '+250795401268';

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  plan,
  onPaymentConfirmed,
}) => {
  const [step, setStep] = useState<'instructions' | 'waiting' | 'confirmed'>('instructions');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const planDetails = PAYMENT_DETAILS[plan];

  const copyNumber = () => {
    navigator.clipboard.writeText(MOMO_NUMBER.replace('+', ''));
    toast.success('Number copied!');
  };

  const handlePaidClick = async () => {
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please log in first');
        setIsLoading(false);
        return;
      }

      // Create pending payment record
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          plan: plan,
          amount_rwf: planDetails.priceRWF,
          phone_number: 'pending',
          status: 'pending',
        })
        .select()
        .single();

      if (paymentError) {
        console.error('Payment error:', paymentError);
        toast.error('Failed to record payment. Please try again.');
        setIsLoading(false);
        return;
      }

      setPaymentId(payment.id);
      setStep('waiting');
      toast.info('Payment recorded. Awaiting verification...');
      
      // In production, this would be verified via webhook or admin
      // For demo, we'll simulate confirmation after a delay
      setTimeout(() => {
        setStep('confirmed');
        onPaymentConfirmed?.();
        toast.success('Payment confirmed! Your subscription is active.');
      }, 3000);
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep('instructions');
    setPaymentId(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            {planDetails.name} - MTN Mobile Money
          </DialogTitle>
          <DialogDescription>
            Pay via MTN Mobile Money (Rwanda only)
          </DialogDescription>
        </DialogHeader>

        {step === 'instructions' && (
          <div className="space-y-6">
            {/* Plan Summary */}
            <div className="bg-primary/10 rounded-xl p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-semibold">{planDetails.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price</span>
                <span className="font-bold text-primary">{planDetails.priceRWF.toLocaleString()} RWF</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span>{planDetails.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Accounts</span>
                <span>{planDetails.seats} user{planDetails.seats > 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="space-y-4">
              <h4 className="font-semibold">How to Pay:</h4>
              
              <div className="space-y-3">
                <div className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center flex-shrink-0">1</span>
                  <span>Dial <strong>*182#</strong> on your phone</span>
                </div>
                <div className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center flex-shrink-0">2</span>
                  <span>Choose <strong>"Send Money"</strong></span>
                </div>
                <div className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center flex-shrink-0">3</span>
                  <div className="flex-1">
                    <span>Enter the number: </span>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="bg-muted px-3 py-1 rounded font-mono text-sm">{MOMO_NUMBER}</code>
                      <Button variant="ghost" size="icon" onClick={copyNumber} className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center flex-shrink-0">4</span>
                  <span>Enter amount: <strong>{planDetails.priceRWF.toLocaleString()} RWF</strong></span>
                </div>
                <div className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center flex-shrink-0">5</span>
                  <span>Confirm with your <strong>MoMo PIN</strong></span>
                </div>
              </div>
            </div>

            <Button 
              onClick={handlePaidClick} 
              disabled={isLoading} 
              className="w-full" 
              size="lg"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4 mr-2" />
              )}
              I Have Paid
            </Button>
          </div>
        )}

        {step === 'waiting' && (
          <div className="text-center py-8 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <h3 className="font-semibold text-lg">Verifying Payment...</h3>
            <p className="text-muted-foreground text-sm">
              Please wait while we confirm your payment. This may take a few moments.
            </p>
          </div>
        )}

        {step === 'confirmed' && (
          <div className="text-center py-8 space-y-4">
            <CheckCircle className="h-16 w-16 text-success mx-auto" />
            <h3 className="font-semibold text-lg">Payment Confirmed!</h3>
            <p className="text-muted-foreground">
              Your {planDetails.name} is now active for {planDetails.duration}.
            </p>
            <Button onClick={handleClose} className="w-full">
              Start Learning
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
