import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, Eye, Lock, Users, Mail, Calendar } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Privacy Policy</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Last updated: January 2025
              </p>
            </div>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
            <section className="bg-card rounded-xl p-6 border">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Information We Collect
              </h2>
              <p className="text-muted-foreground mb-4">
                Smart Mind collects the following types of information to provide and improve our educational services:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong>Account Information:</strong> Email address and profile data when you create an account.</li>
                <li><strong>Usage Data:</strong> Learning progress, quiz scores, and interaction history to personalize your experience.</li>
                <li><strong>Device Information:</strong> Browser type, device type, and language preferences for optimization.</li>
                <li><strong>Voice Data:</strong> Voice inputs are processed in real-time and not permanently stored.</li>
              </ul>
            </section>

            <section className="bg-card rounded-xl p-6 border">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                How We Use Your Information
              </h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>Provide personalized AI-powered learning assistance</li>
                <li>Generate study notes and quizzes tailored to your curriculum</li>
                <li>Track and display your learning progress and streaks</li>
                <li>Improve our AI models and educational content</li>
                <li>Send important updates about your account and our service</li>
              </ul>
            </section>

            <section className="bg-card rounded-xl p-6 border">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Data Sharing & Third Parties
              </h2>
              <p className="text-muted-foreground mb-4">
                We do not sell your personal information. We may share data with:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong>AI Service Providers:</strong> To process your learning queries (data is anonymized).</li>
                <li><strong>Analytics Services:</strong> To understand usage patterns and improve the platform.</li>
              </ul>
            </section>

            <section className="bg-card rounded-xl p-6 border">
              <h2 className="text-xl font-semibold mb-4">Children's Privacy</h2>
              <p className="text-muted-foreground">
                Smart Mind is designed for educational purposes and may be used by students of all ages. 
                We are committed to protecting children's privacy and comply with applicable child protection laws. 
                We do not knowingly collect personal information from children under 13 without parental consent. 
                Parents or guardians can contact us to review, delete, or manage their child's information.
              </p>
            </section>

            <section className="bg-card rounded-xl p-6 border">
              <h2 className="text-xl font-semibold mb-4">Data Security</h2>
              <p className="text-muted-foreground">
                We implement industry-standard security measures to protect your data, including encryption 
                in transit and at rest, secure authentication, and regular security audits. However, no 
                method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section className="bg-card rounded-xl p-6 border">
              <h2 className="text-xl font-semibold mb-4">Your Rights</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong>Access:</strong> Request a copy of your personal data.</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information.</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data.</li>
                <li><strong>Portability:</strong> Receive your data in a portable format.</li>
              </ul>
            </section>

            <section className="bg-card rounded-xl p-6 border">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Contact Us
              </h2>
              <p className="text-muted-foreground">
                For privacy-related questions or to exercise your rights, contact us at:{' '}
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

export default PrivacyPolicy;
