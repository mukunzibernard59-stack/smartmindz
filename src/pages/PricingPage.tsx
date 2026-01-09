import React from 'react';
import Navbar from '@/components/Navbar';
import Pricing from '@/components/Pricing';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Check, HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const PricingPage: React.FC = () => {
  const { t } = useLanguage();

  const faqs = [
    {
      question: "Can I switch between plans?",
      answer: "Yes! You can upgrade or downgrade your plan at any time. If you upgrade, you'll be charged the prorated difference. If you downgrade, the new rate applies at your next billing cycle."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept PayPal, all major credit/debit cards (Visa, Mastercard, Amex), and Mobile Money (M-Pesa, MTN Mobile Money, Airtel Money) for users in Africa."
    },
    {
      question: "Is there a free trial for Pro?",
      answer: "Yes! New users get a 7-day free trial of Pro features. No credit card required to start. You can cancel anytime during the trial."
    },
    {
      question: "Can I get a refund?",
      answer: "We offer a 2-day money-back guarantee. If you're not satisfied with Pro, contact us within 2 days of your purchase for a full refund."
    },
    {
      question: "How does the Family plan work?",
      answer: "The Family plan includes up to 5 individual accounts. Each family member gets their own login, progress tracking, and personalized learning experience. Parents get a dashboard to monitor all accounts."
    },
  ];

  const comparison = [
    { feature: "Daily Questions", free: "10", pro: "Unlimited", family: "Unlimited" },
    { feature: "AI Explanations", free: "Basic", pro: "Advanced", family: "Advanced" },
    { feature: "Voice Mode", free: "✗", pro: "✓", family: "✓" },
    { feature: "PDF Downloads", free: "✗", pro: "✓", family: "✓" },
    { feature: "Exam Prep Packs", free: "✗", pro: "✓", family: "✓" },
    { feature: "Smart Study Plans", free: "✗", pro: "✓", family: "✓" },
    { feature: "Ads", free: "Yes", pro: "No", family: "No" },
    { feature: "Accounts", free: "1", pro: "1", family: "5" },
    { feature: "Parent Dashboard", free: "✗", pro: "✗", family: "✓" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <Pricing />

        {/* Feature Comparison */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
              Compare All Features
            </h2>
            <div className="max-w-4xl mx-auto overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-semibold">Feature</th>
                    <th className="text-center py-4 px-4 font-semibold">Free</th>
                    <th className="text-center py-4 px-4 font-semibold text-primary">Pro</th>
                    <th className="text-center py-4 px-4 font-semibold">Family</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row, index) => (
                    <tr key={row.feature} className={index % 2 === 0 ? 'bg-card' : ''}>
                      <td className="py-4 px-4">{row.feature}</td>
                      <td className="py-4 px-4 text-center">
                        {row.free === '✓' ? (
                          <Check className="h-5 w-5 text-success mx-auto" />
                        ) : row.free === '✗' ? (
                          <span className="text-muted-foreground">—</span>
                        ) : (
                          row.free
                        )}
                      </td>
                      <td className="py-4 px-4 text-center bg-primary/5">
                        {row.pro === '✓' ? (
                          <Check className="h-5 w-5 text-success mx-auto" />
                        ) : row.pro === '✗' ? (
                          <span className="text-muted-foreground">—</span>
                        ) : (
                          <span className="font-medium">{row.pro}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {row.family === '✓' ? (
                          <Check className="h-5 w-5 text-success mx-auto" />
                        ) : row.family === '✗' ? (
                          <span className="text-muted-foreground">—</span>
                        ) : (
                          row.family
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-sm mb-4">
                  <HelpCircle className="h-4 w-4" />
                  FAQ
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold">
                  Frequently Asked Questions
                </h2>
              </div>

              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="bg-card rounded-xl border border-border px-6"
                  >
                    <AccordionTrigger className="text-left font-semibold hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
