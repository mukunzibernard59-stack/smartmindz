import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';
import { FileText, AlertCircle, CheckCircle, Ban, Calendar } from 'lucide-react';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-4">
            <BackButton />
          </div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Terms of Service</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Last updated: January 2025
              </p>
            </div>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
            <section className="bg-card rounded-xl p-6 border">
              <h2 className="text-xl font-semibold mb-4">Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing or using Smart Mind, you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our service. We reserve the 
                right to update these terms at any time, and your continued use constitutes acceptance 
                of any changes.
              </p>
            </section>

            <section className="bg-card rounded-xl p-6 border">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Service Description
              </h2>
              <p className="text-muted-foreground mb-4">
                Smart Mind is an AI-powered educational platform that provides:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>AI chat assistance for learning and homework help</li>
                <li>Voice-enabled interactive learning sessions</li>
                <li>AI-generated study notes aligned with official curricula</li>
                <li>Customizable quizzes across various subjects and difficulty levels</li>
                <li>Progress tracking and learning streaks</li>
              </ul>
            </section>

            <section className="bg-card rounded-xl p-6 border">
              <h2 className="text-xl font-semibold mb-4">User Accounts</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>You must provide accurate and complete information when creating an account.</li>
                <li>You are responsible for maintaining the security of your account credentials.</li>
                <li>You must be at least 13 years old to create an account, or have parental consent.</li>
                <li>One person may not maintain multiple free accounts.</li>
              </ul>
            </section>

            <section className="bg-card rounded-xl p-6 border">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Ban className="h-5 w-5 text-destructive" />
                Prohibited Uses
              </h2>
              <p className="text-muted-foreground mb-4">
                You agree not to use Smart Mind to:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>Submit content that is illegal, harmful, or violates others' rights</li>
                <li>Attempt to bypass usage limits or abuse the service</li>
                <li>Use the AI for academic dishonesty or cheating on exams</li>
                <li>Reverse engineer or attempt to extract our AI models</li>
                <li>Harass, bully, or harm other users</li>
                <li>Generate or distribute inappropriate content</li>
              </ul>
            </section>

            <section className="bg-card rounded-xl p-6 border">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Service Access
              </h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>All features are provided free of charge to registered users.</li>
                <li>You may use the service for personal educational purposes.</li>
                <li>We reserve the right to modify features and functionality at any time.</li>
              </ul>
            </section>

            <section className="bg-card rounded-xl p-6 border">
              <h2 className="text-xl font-semibold mb-4">Content & Intellectual Property</h2>
              <p className="text-muted-foreground mb-4">
                All content generated by Smart Mind's AI is provided for educational purposes only.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>AI-generated content should be verified and not treated as definitive.</li>
                <li>You retain ownership of content you create using our service.</li>
                <li>Smart Mind and its logo are trademarks of our company.</li>
                <li>You may not reproduce or distribute our platform without permission.</li>
              </ul>
            </section>

            <section className="bg-card rounded-xl p-6 border">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Disclaimers & Limitations
              </h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>AI responses may not always be accurate; verify important information.</li>
                <li>We do not guarantee exam success or specific learning outcomes.</li>
                <li>Service availability may be interrupted for maintenance or updates.</li>
                <li>We are not liable for decisions made based on AI-generated content.</li>
                <li>Maximum liability is limited to the amount paid for the service.</li>
              </ul>
            </section>

            <section className="bg-card rounded-xl p-6 border">
              <h2 className="text-xl font-semibold mb-4">Termination</h2>
              <p className="text-muted-foreground">
                We may suspend or terminate your account if you violate these terms. Upon termination, 
                your right to use the service ceases immediately. You may request account deletion at 
                any time by contacting us.
              </p>
            </section>

            <section className="bg-card rounded-xl p-6 border">
              <h2 className="text-xl font-semibold mb-4">Contact</h2>
              <p className="text-muted-foreground">
                For questions about these terms, contact us at:{' '}
                <a href="mailto:mukunzibernard59@gmail.com" className="text-primary hover:underline">
                  mukunzibernard59@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
