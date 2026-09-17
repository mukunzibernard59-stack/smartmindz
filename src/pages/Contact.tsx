import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Mail, Instagram, MessageCircle, Clock, MapPin, HelpCircle } from 'lucide-react';

const Contact: React.FC = () => (
  <div className="min-h-screen bg-background">
    <SEO
      title="Contact SmartMind — Support, Feedback and Content Contributions"
      description="Reach the SmartMind team by email or Instagram. Report a problem, request a TVET module, contribute notes or translations, or ask about advertising and partnerships."
      path="/contact"
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Contact SmartMind',
        url: 'https://smartmindz.site/contact',
        mainEntity: {
          '@type': 'Organization',
          name: 'SmartMind',
          email: 'mukunzibernard59@gmail.com',
          areaServed: 'RW',
        },
      }}
    />
    <Navbar />
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <article className="prose prose-invert max-w-none">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact SmartMind</h1>
        <p className="text-xl text-muted-foreground mb-8">
          We are a small team of Rwandan students and developers, and we read every message. Whether
          something is broken, a module is missing from the TVET Library, or you want to contribute
          notes, this page tells you exactly where to write and what to expect.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-2"><Mail className="h-6 w-6 text-primary" /> Email us</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Email is the fastest way to reach us. Write to{' '}
            <a href="mailto:mukunzibernard59@gmail.com" className="text-primary hover:underline">mukunzibernard59@gmail.com</a>{' '}
            and, if you can, include the page you were on, the device you used, and a screenshot.
            That single detail usually turns a two-day back-and-forth into a same-day fix.
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li><strong className="text-foreground">Something is broken:</strong> tell us the tool name (Library, Tutor, Writer, Translate) and what you expected to happen.</li>
            <li><strong className="text-foreground">A TVET module is missing:</strong> send the sector, course, level (L3–L5) and module code, and we will add it to the import queue.</li>
            <li><strong className="text-foreground">You want to contribute:</strong> teachers and subject experts can send notes, past papers, or Kinyarwanda and Swahili translations.</li>
            <li><strong className="text-foreground">Advertising and partnerships:</strong> schools, NGOs and publishers can ask about placements and bulk access for students.</li>
            <li><strong className="text-foreground">Privacy and your data:</strong> requests to export or delete your account data are handled by the same address.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-2"><Instagram className="h-6 w-6 text-primary" /> Social</h2>
          <p className="text-muted-foreground leading-relaxed">
            For short questions and product news, message us on Instagram at{' '}
            <a href="https://instagram.com/m.berndev" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@m.berndev</a>.
            We post when new courses land in the library and when new tools go live.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-2"><Clock className="h-6 w-6 text-primary" /> Response times</h2>
          <p className="text-muted-foreground leading-relaxed">
            We usually reply within one to two working days (Central Africa Time, UTC+2). Bug reports
            that stop students from opening notes are treated as urgent and are normally answered the
            same day. During national exam periods our inbox gets busy, so please allow a little
            extra time and avoid sending duplicate messages.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-2"><MapPin className="h-6 w-6 text-primary" /> Where we are</h2>
          <p className="text-muted-foreground leading-relaxed">
            SmartMind is built and maintained in Kigali, Rwanda, and serves learners across Rwanda and
            the wider East African region. We do not operate a walk-in office; all support runs through
            email and Instagram so that a student anywhere with a phone gets the same help.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-2"><HelpCircle className="h-6 w-6 text-primary" /> Before you write</h2>
          <p className="text-muted-foreground leading-relaxed">
            Many questions — pricing, offline use, supported languages, accounts, and data protection —
            are already answered on our <Link to="/faq" className="text-primary hover:underline">FAQ page</Link>,
            and step-by-step instructions for each tool live in the{' '}
            <Link to="/how-to" className="text-primary hover:underline">How-To Guides</Link>. Details on what we
            store and why are in the <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>{' '}
            and <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-2"><MessageCircle className="h-6 w-6 text-primary" /> Feedback shapes the app</h2>
          <p className="text-muted-foreground leading-relaxed">
            The TVET Library, Kinyarwanda voice translation, and downloadable notes all exist because
            learners asked for them. If a feature would make your studying easier, tell us — the smallest
            suggestions are often the ones we ship first.
          </p>
        </section>
      </article>
    </main>
    <Footer />
  </div>
);

export default Contact;
