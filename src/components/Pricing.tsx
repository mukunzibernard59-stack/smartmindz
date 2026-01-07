import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Zap } from 'lucide-react';

const Pricing: React.FC = () => {
  const { t } = useLanguage();

  const plans = [
    {
      name: t('pricing.free'),
      price: '$0',
      period: t('pricing.month'),
      description: 'Perfect for getting started',
      features: [
        '10 questions per day',
        'Basic AI explanations',
        'All subjects covered',
        'Progress tracking',
        'Community support',
      ],
      limitations: [
        'Contains ads',
        'No PDF downloads',
        'No voice mode',
      ],
      cta: 'Start Free',
      variant: 'outline' as const,
      popular: false,
    },
    {
      name: t('pricing.pro'),
      price: '$4.99',
      period: t('pricing.month'),
      description: 'Everything you need to excel',
      features: [
        'Unlimited questions',
        'Advanced AI explanations',
        'All subjects covered',
        'Voice mode included',
        'PDF downloads',
        'Exam preparation packs',
        'Smart study plans',
        'Priority support',
        'No ads',
      ],
      limitations: [],
      cta: 'Get Pro',
      variant: 'hero' as const,
      popular: true,
    },
    {
      name: 'Family',
      price: '$9.99',
      period: t('pricing.month'),
      description: 'For up to 5 family members',
      features: [
        'Everything in Pro',
        'Up to 5 accounts',
        'Parent dashboard',
        'Progress reports',
        'Shared library',
        'Family support',
      ],
      limitations: [],
      cta: 'Get Family',
      variant: 'outline' as const,
      popular: false,
    },
  ];

  return (
    <section className="py-20 bg-background" id="pricing">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t('pricing.title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose the plan that works best for you. Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-card rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 ${
                plan.popular
                  ? 'border-primary shadow-primary scale-105 md:scale-110'
                  : 'border-border hover:shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-muted-foreground text-sm mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-success" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
                {plan.limitations.map((limitation) => (
                  <li key={limitation} className="flex items-start gap-3 opacity-50">
                    <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs">✕</span>
                    </div>
                    <span className="text-sm">{limitation}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.variant}
                className="w-full"
                size="lg"
              >
                {plan.popular && <Zap className="h-4 w-4 mr-2" />}
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground text-sm">
            💳 Secure payments via PayPal, Credit Card, or Mobile Money
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
