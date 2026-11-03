import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import BackButton from '@/components/BackButton';
import { ShieldAlert, BookOpen, Sparkles, ExternalLink, Megaphone, Mail, Calendar } from 'lucide-react';

const Disclaimer: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-background">
    <SEO
      title="Disclaimer — SmartMind"
      description="SmartMind's disclaimer: educational information provided in good faith, limits of AI-generated answers, external links, advertising, and no professional advice."
      path="/disclaimer"
    />
    <Navbar />
    <main className="flex-1 pt-24 py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <ShieldAlert className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Disclaimer</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Last updated: November 2026
            </p>
          </div>
        </div>

        <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
          SmartMind (smartmindz.site) is a free learning platform built for students in Rwanda and
          the wider East African region. This disclaimer explains, in plain language, what you can
          and cannot expect from the information and tools on this site. By using SmartMind you
          accept the points below.
        </p>

        <div className="space-y-8">
          <section className="bg-card rounded-xl p-6 border">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" /> Educational Information Only
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              All content on SmartMind — study guides, blog articles, TVET library notes, quizzes,
              translations, and how-to guides — is provided for general educational purposes. We work
              hard to keep it accurate and up to date, but we make no guarantee that every piece of
              information is complete, current, or error-free. Curricula change, exam formats change,
              and official requirements change.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Always confirm important details — exam dates, registration steps, entry requirements,
              and official results — with the relevant official body, such as your school, the Rwanda
              TVET Board (RTB), or the National Examination and School Inspection Authority (NESA).
            </p>
          </section>

          <section className="bg-card rounded-xl p-6 border">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> AI-Generated Answers
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Some SmartMind tools use artificial intelligence to generate answers, explanations,
              letters, translations, and images. AI can be confidently wrong: it can invent facts,
              misunderstand local context, or produce outdated information. Treat AI output as a
              starting draft, not a final authority.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Before using an AI-generated answer in an exam, assignment, job application, or
              official document, verify it against your official course materials or a qualified
              person. You are responsible for what you submit.
            </p>
          </section>

          <section className="bg-card rounded-xl p-6 border">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary" /> No Professional Advice
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Nothing on SmartMind constitutes legal, medical, financial, or career advice. Articles
              about jobs, internships, business plans, or interviews are general guidance written for
              students, not personalized professional counsel. For decisions with serious
              consequences, consult a qualified professional or the relevant institution.
            </p>
          </section>

          <section className="bg-card rounded-xl p-6 border">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-primary" /> External Links and Third-Party Content
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              SmartMind links to external websites and embeds third-party content such as YouTube
              videos. We do not control and are not responsible for the content, accuracy, or privacy
              practices of external sites. Following a link or watching an embedded video is at your
              own discretion, and the third party's own terms and policies apply.
            </p>
          </section>

          <section className="bg-card rounded-xl p-6 border">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-primary" /> Advertising
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              SmartMind is free for students because it is supported by advertising, including Google
              AdSense. Advertisements are provided by third-party networks and do not represent an
              endorsement by SmartMind of the advertised products or services. Our{' '}
              <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>{' '}
              explains how advertising cookies work and how you can opt out of personalized ads.
            </p>
          </section>

          <section className="bg-card rounded-xl p-6 border">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" /> Questions or Corrections
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              If you spot an error in our learning materials or have a question about this
              disclaimer, please tell us — corrections make the platform better for every student.
              Email <a href="mailto:mukunzibernard59@gmail.com" className="text-primary hover:underline">mukunzibernard59@gmail.com</a> or
              visit our <Link to="/contact" className="text-primary hover:underline">Contact page</Link>.
              Also see our <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and{' '}
              <Link to="/copyright" className="text-primary hover:underline">Copyright Policy</Link>.
            </p>
          </section>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Disclaimer;
