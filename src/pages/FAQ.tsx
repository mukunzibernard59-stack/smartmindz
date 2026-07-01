import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import ContentAd from '@/components/ContentAd';

const faqs = [
  {
    q: 'Is SmartMind really free?',
    a: 'Yes. Every feature — the TVET Library, Smart Tutor, Writer, Translator, Design Studio, and Homework Helper — is free. We are supported by small ads and community donations, never paywalls.',
  },
  {
    q: 'Do I need an account to use SmartMind?',
    a: 'No. You can use most tools without signing in. Creating a free account only lets you sync chat history and progress across devices.',
  },
  {
    q: 'Does SmartMind work offline?',
    a: 'The Writer Studio, App Planner, and downloaded notes work fully offline. Tools that call external services (Translate, Chat, Design Studio, Homework Helper) need an internet connection.',
  },
  {
    q: 'Which languages are supported?',
    a: 'The interface and Smart Tutor support English, French, Kinyarwanda, and Swahili. The Translator handles over 100 languages including full native Kinyarwanda.',
  },
  {
    q: 'What is the Rwanda TVET Library?',
    a: 'It is a searchable, in-app library of the official Rwanda Polytechnic (RTB) curriculum organized by sector, course, level (L3–L5), and module. Each module contains notes, PDFs, and practice questions.',
  },
  {
    q: 'How accurate are the Smart Tutor answers?',
    a: 'Answers are generated from established curriculum sources and reviewed periodically. For exam preparation always cross-check with your official course notes, and use the Tutor as a study partner rather than a single source of truth.',
  },
  {
    q: 'Can teachers use SmartMind?',
    a: 'Yes. Many teachers use the Smart Tutor to generate practice quizzes, the Writer Studio to prepare lesson notes, and the TVET Library to give students structured revision material.',
  },
  {
    q: 'How is my data protected?',
    a: 'Chat conversations stay on your device by default. If you sign in, data is stored using industry-standard encryption. We never sell personal data. See the Privacy Policy for details.',
  },
  {
    q: 'Can I contribute content?',
    a: 'Absolutely. If you are a teacher, subject expert, or advanced student and would like to contribute notes or translations, email mukunzibernard59@gmail.com.',
  },
  {
    q: 'Is there a mobile app?',
    a: 'SmartMind is a Progressive Web App — you can install it to your phone home screen from any browser. A dedicated Android app is on the roadmap.',
  },
];

const FAQ: React.FC = () => (
  <div className="min-h-screen bg-background">
    <SEO
      title="Frequently Asked Questions — SmartMind"
      description="Answers to common questions about SmartMind — free learning app for Rwanda TVET, homework, translation and AI tutoring."
      path="/faq"
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }}
    />
    <Navbar />
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
      <p className="text-muted-foreground mb-8">
        Everything you might want to know about SmartMind — how it works, what it costs, and how
        we protect your data.
      </p>

      <div className="space-y-6">
        {faqs.slice(0, 5).map((f) => (
          <details key={f.q} className="group rounded-xl border border-border bg-card p-5">
            <summary className="cursor-pointer font-semibold text-lg">{f.q}</summary>
            <p className="mt-3 text-muted-foreground leading-relaxed">{f.a}</p>
          </details>
        ))}

        <ContentAd />

        {faqs.slice(5).map((f) => (
          <details key={f.q} className="group rounded-xl border border-border bg-card p-5">
            <summary className="cursor-pointer font-semibold text-lg">{f.q}</summary>
            <p className="mt-3 text-muted-foreground leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </main>
    <Footer />
  </div>
);

export default FAQ;
