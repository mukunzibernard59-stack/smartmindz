import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import ContentAd from '@/components/ContentAd';
import { BookOpen, Sparkles, Users, Globe, Heart, Shield } from 'lucide-react';

const About: React.FC = () => (
  <div className="min-h-screen bg-background">
    <SEO
      title="About SmartMind — Free Learning App for Students in Africa"
      description="SmartMind is a free, offline-friendly learning platform built for students across Rwanda and Africa. Learn our mission, story, and how we help learners succeed."
      path="/about"
    />
    <Navbar />
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <article className="prose prose-invert max-w-none">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About SmartMind</h1>
        <p className="text-xl text-muted-foreground mb-8">
          A free learning platform built by students, for students — starting in Rwanda and
          reaching every corner of Africa.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-2"><Sparkles className="h-6 w-6 text-primary" /> Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            SmartMind exists to make quality learning material accessible to every student, no
            matter their income, location, or school. We believe a curious mind with an internet
            connection — and even sometimes without one — should be able to reach any subject,
            practice it, and master it. That means Rwanda TVET curriculum, primary and secondary
            subjects, coding, languages, and life skills, all in one place, all free.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-2"><BookOpen className="h-6 w-6 text-primary" /> What We Offer</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li><strong className="text-foreground">Rwanda TVET Library:</strong> Official Rwanda Polytechnic curriculum for ICT, Energy, Construction, Agriculture and more — organized by sector, course, level, and module.</li>
            <li><strong className="text-foreground">Smart Tutor:</strong> An always-available study partner that explains any topic step by step, generates practice quizzes from your notes, and works in English, French, Kinyarwanda and Swahili.</li>
            <li><strong className="text-foreground">Writer Studio:</strong> Draft essays, letters, CVs, and reports with editable templates and PDF/DOCX export — works fully offline.</li>
            <li><strong className="text-foreground">Design Studio:</strong> Generate and retouch images for schoolwork, presentations, and social projects.</li>
            <li><strong className="text-foreground">Translate:</strong> Fast translation across major world languages plus full native Kinyarwanda support.</li>
            <li><strong className="text-foreground">Homework Helper:</strong> Step-by-step solutions with explanations you can actually learn from.</li>
          </ul>
        </section>

        <ContentAd />

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-2"><Users className="h-6 w-6 text-primary" /> Who Uses SmartMind</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Our learners are TVET students preparing for national exams, secondary school students
            revising physics and mathematics, university students writing final projects, self-taught
            developers learning to code, and adults picking up a new language. Teachers use us to
            generate practice quizzes and lesson notes. Parents use us to help children with homework
            after school.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We designed SmartMind to work on the phones people actually own — a mid-range Android on
            a spotty 3G connection is a first-class experience. Tools that don't need the internet
            keep working when the network drops.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-2"><Globe className="h-6 w-6 text-primary" /> Why Free</h2>
          <p className="text-muted-foreground leading-relaxed">
            Education should not be a subscription. SmartMind is supported by non-intrusive
            advertising and optional community donations. There are no paywalls, no locked chapters,
            and no "premium" curriculum. Every student sees the same complete library. Ads exist so
            the child of a subsistence farmer gets exactly the same tools as a student in a private
            urban school.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-2"><Shield className="h-6 w-6 text-primary" /> Privacy &amp; Safety</h2>
          <p className="text-muted-foreground leading-relaxed">
            We collect the minimum information needed to run the app. Chat conversations stay on your
            device unless you sign in to sync them. We never sell personal data. Read the full{' '}
            <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link> and{' '}
            <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-2"><Heart className="h-6 w-6 text-primary" /> The Team</h2>
          <p className="text-muted-foreground leading-relaxed">
            SmartMind was started by a small team of Rwandan students and developers who were tired
            of buying expensive foreign study apps that never covered their own curriculum. We are
            grateful to every teacher, tester, and learner who has sent feedback. If you would like
            to contribute — content, translations, or code — please reach out at{' '}
            <a href="mailto:mukunzibernard59@gmail.com" className="text-primary hover:underline">mukunzibernard59@gmail.com</a>.
          </p>
        </section>

        <div className="flex flex-wrap gap-3 mt-10">
          <Link to="/library" className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90">Explore the TVET Library</Link>
          <Link to="/blog" className="px-5 py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:opacity-90">Read the Blog</Link>
          <Link to="/faq" className="px-5 py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:opacity-90">FAQ</Link>
        </div>
      </article>
    </main>
    <Footer />
  </div>
);

export default About;
